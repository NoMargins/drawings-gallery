import { ObjectId } from "mongodb"
import { connectToDatabase } from "./db"
import type { ChildSubmission, Vote, AgeCategory } from "./types"

// Функція для отримання всіх заявок
export async function getAllSubmissionsFromDb(): Promise<ChildSubmission[]> {
  const { submissions } = await connectToDatabase()
  return (await submissions.find({}).sort({ isPublished: 1, votes: -1 }).toArray()) as unknown as ChildSubmission[]
}

// Функція для отримання опублікованих заявок
export async function getPublishedSubmissionsFromDb(): Promise<ChildSubmission[]> {
  const { submissions } = await connectToDatabase()
  return (await submissions.find({ isPublished: true }).toArray()) as unknown as ChildSubmission[]
}

// Функція для отримання заявок за категорією
export async function getSubmissionsByCategoryFromDb(category: AgeCategory): Promise<ChildSubmission[]> {
  const { submissions } = await connectToDatabase()
  return (await submissions
    .find({ isPublished: true, ageCategory: category })
    .sort({ childName: 1 })
    .toArray()) as unknown as ChildSubmission[]
}

// Функція для отримання переможців за категорією
export async function getWinnersByCategoryFromDb(category: AgeCategory): Promise<ChildSubmission[]> {
  const { submissions } = await connectToDatabase()
  return (await submissions
    .find({ isPublished: true, ageCategory: category })
    .sort({ votes: -1 })
    .limit(3)
    .toArray()) as unknown as ChildSubmission[]
}

// Функція для додавання нової заявки
export async function addSubmissionToDb(
  submission: Omit<ChildSubmission, "id" | "isPublished" | "createdAt" | "ageCategory" | "votes">,
): Promise<ChildSubmission> {
  const { submissions } = await connectToDatabase()

  const age = Number.parseInt(submission.childAge)
  const ageCategory = getAgeCategory(age)

  const newSubmission: Omit<ChildSubmission, "id"> = {
    ...submission,
    isPublished: false,
    createdAt: new Date().toISOString(),
    ageCategory,
    votes: 0,
  }

  const result = await submissions.insertOne(newSubmission as any)

  return {
    ...newSubmission,
    id: result.insertedId.toString(),
  } as ChildSubmission
}

// Функція для оновлення заявки
export async function updateSubmissionInDb(
  id: string,
  updates: Partial<Omit<ChildSubmission, "id" | "createdAt" | "ageCategory" | "votes">>,
): Promise<ChildSubmission | null> {
  const { submissions } = await connectToDatabase()

  // Отримуємо поточну заявку
  const currentSubmission = await submissions.findOne({ _id: new ObjectId(id) })
  if (!currentSubmission) return null

  // Якщо оновлюється вік, перераховуємо вікову категорію
  let ageCategory = currentSubmission.ageCategory
  if (updates.childAge && updates.childAge !== currentSubmission.childAge) {
    const age = Number.parseInt(updates.childAge)
    ageCategory = getAgeCategory(age)
  }

  // Оновлюємо заявку
  const result = await submissions.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, ageCategory } },
    { returnDocument: "after" },
  )

  if (!result) return null

  return {
    ...result,
    id: result._id.toString(),
  } as unknown as ChildSubmission
}

// Функція для отримання заявки за ID
export async function getSubmissionByIdFromDb(id: string): Promise<ChildSubmission | null> {
  const { submissions } = await connectToDatabase()

  try {
    const submission = await submissions.findOne({ _id: new ObjectId(id) })
    if (!submission) return null

    return {
      ...submission,
      id: submission._id.toString(),
    } as unknown as ChildSubmission
  } catch (error) {
    console.error("Error getting submission by ID:", error)
    return null
  }
}

// Функція для отримання останніх заявок
export async function getRecentSubmissionsFromDb(count: number): Promise<ChildSubmission[]> {
  const { submissions } = await connectToDatabase()

  return (await submissions
    .find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(count)
    .toArray()) as unknown as ChildSubmission[]
}

// Функція для публікації заявки
export async function publishSubmissionInDb(id: string): Promise<ChildSubmission | null> {
  const { submissions } = await connectToDatabase()

  const result = await submissions.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { isPublished: true } },
    { returnDocument: "after" },
  )

  if (!result) return null

  return {
    ...result,
    id: result._id.toString(),
  } as unknown as ChildSubmission
}

// Функція для публікації всіх заявок
export async function publishAllSubmissionsInDb(): Promise<ChildSubmission[]> {
  const { submissions } = await connectToDatabase()

  await submissions.updateMany({ isPublished: false }, { $set: { isPublished: true } })

  return await getAllSubmissionsFromDb()
}

// Функція для голосування за заявку
export async function voteForSubmissionInDb(submissionId: string, userId: string): Promise<boolean> {
  const { votes, submissions } = await connectToDatabase()

  // Перевіряємо, чи користувач вже голосував за цю заявку
  const existingVote = await votes.findOne({ submissionId, userId })
  if (existingVote) {
    return false
  }

  // Додаємо голос
  const newVote: Vote = {
    id: new ObjectId().toString(),
    submissionId,
    userId,
    createdAt: new Date().toISOString(),
  }

  await votes.insertOne(newVote as any)

  // Оновлюємо кількість голосів у заявці
  await submissions.updateOne({ _id: new ObjectId(submissionId) }, { $inc: { votes: 1 } })

  return true
}

// Функція для перевірки, чи користувач голосував за заявку
export async function hasUserVotedInDb(submissionId: string, userId: string): Promise<boolean> {
  const { votes } = await connectToDatabase()

  const vote = await votes.findOne({ submissionId, userId })
  return !!vote
}

// Функція для отримання голосів користувача
export async function getUserVotesFromDb(userId: string): Promise<Vote[]> {
  const { votes } = await connectToDatabase()

  return (await votes.find({ userId }).toArray()) as unknown as Vote[]
}

// Допоміжна функція для визначення вікової категорії
function getAgeCategory(age: number): AgeCategory {
  if (age <= 5) return "0-5"
  if (age <= 8) return "6-8"
  if (age <= 12) return "9-12"
  return "13-18"
}
