import type { ChildSubmission, Vote, AgeCategory } from "./types"

// Mock data store (in a real app, this would be a database)
let submissions: ChildSubmission[] = []
const votes: Vote[] = []

// Helper to get age category
export function getAgeCategory(age: number): AgeCategory {
  if (age <= 5) return "0-5"
  if (age <= 8) return "6-8"
  if (age <= 12) return "9-12"
  return "13-18"
}

// Get all submissions
export function getAllSubmissions(): ChildSubmission[] {
  // Sort unpublished first, then by votes (descending)
  return [...submissions].sort((a, b) => {
    // First sort by publication status
    if (a.isPublished !== b.isPublished) {
      return a.isPublished ? 1 : -1 // Unpublished first
    }
    // Then sort by votes (highest first)
    return b.votes - a.votes
  })
}

// Get published submissions
export function getPublishedSubmissions(): ChildSubmission[] {
  return submissions.filter((submission) => submission.isPublished)
}

// Get submissions by age category
export function getSubmissionsByCategory(category: AgeCategory): ChildSubmission[] {
  return submissions
    .filter((submission) => submission.isPublished && submission.ageCategory === category)
    .sort((a, b) => a.childName.localeCompare(b.childName, "uk"))
}

// Get winners by category (top 3 by votes)
export function getWinnersByCategory(category: AgeCategory): ChildSubmission[] {
  return submissions
    .filter((submission) => submission.isPublished && submission.ageCategory === category)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3)
}

// Add a new submission
export function addSubmission(
  submission: Omit<ChildSubmission, "id" | "isPublished" | "createdAt" | "ageCategory" | "votes">,
): ChildSubmission {
  const age = Number.parseInt(submission.childAge)
  const newSubmission: ChildSubmission = {
    ...submission,
    id: Date.now().toString(),
    isPublished: false,
    createdAt: new Date().toISOString(),
    ageCategory: getAgeCategory(age),
    votes: 0,
  }

  submissions.push(newSubmission)
  return newSubmission
}

// Update a submission
export function updateSubmission(
  id: string,
  updates: Partial<Omit<ChildSubmission, "id" | "createdAt" | "ageCategory" | "votes">>,
): ChildSubmission | null {
  const index = submissions.findIndex((s) => s.id === id)
  if (index === -1) return null

  const submission = submissions[index]

  // Update fields
  const updatedSubmission = {
    ...submission,
    ...updates,
  }

  // If age was updated, recalculate age category
  if (updates.childAge && updates.childAge !== submission.childAge) {
    const age = Number.parseInt(updates.childAge)
    updatedSubmission.ageCategory = getAgeCategory(age)
  }

  submissions[index] = updatedSubmission
  return updatedSubmission
}

// Get a single submission by ID
export function getSubmissionById(id: string): ChildSubmission | null {
  return submissions.find((s) => s.id === id) || null
}

// Get recent submissions (limited by count)
export function getRecentSubmissions(count: number): ChildSubmission[] {
  return submissions
    .filter((submission) => submission.isPublished)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count)
}

// Publish a submission
export function publishSubmission(id: string): ChildSubmission | null {
  const submission = submissions.find((s) => s.id === id)
  if (submission) {
    submission.isPublished = true
    return submission
  }
  return null
}

// Publish all submissions
export function publishAllSubmissions(): ChildSubmission[] {
  submissions = submissions.map((s) => ({ ...s, isPublished: true }))
  return [...submissions]
}

// Vote for a submission
export function voteForSubmission(submissionId: string, userId: string): boolean {
  // Check if user has already voted for this submission
  const existingVote = votes.find((v) => v.submissionId === submissionId && v.userId === userId)
  if (existingVote) {
    return false
  }

  // Add vote
  const newVote: Vote = {
    id: Date.now().toString(),
    submissionId,
    userId,
    createdAt: new Date().toISOString(),
  }
  votes.push(newVote)

  // Update submission vote count
  const submission = submissions.find((s) => s.id === submissionId)
  if (submission) {
    submission.votes += 1
  }

  return true
}

// Check if user has voted for a submission
export function hasUserVoted(submissionId: string, userId: string): boolean {
  return votes.some((v) => v.submissionId === submissionId && v.userId === userId)
}

// Get user's votes
export function getUserVotes(userId: string): Vote[] {
  return votes.filter((v) => v.userId === userId)
}

// Initialize with some mock data
export function initializeMockData() {
  if (submissions.length === 0) {
    const mockNames = [
      "Іванов Петро",
      "Петренко Марія",
      "Коваленко Олексій",
      "Шевченко Анна",
      "Бондаренко Максим",
      "Мельник Софія",
      "Ткаченко Дмитро",
      "Ковальчук Вікторія",
      "Шевчук Артем",
      "Кравченко Юлія",
      "Поліщук Назар",
      "Бойко Аліна",
      "Савченко Богдан",
      "Руденко Дарина",
      "Мороз Владислав",
      "Лисенко Катерина",
    ]

    const mockCities = ["Київ", "Львів", "Одеса", "Харків", "Дніпро", "Запоріжжя", "Вінниця", "Полтава"]

    mockNames.forEach((name, index) => {
      const age = Math.floor(Math.random() * 18) + 1
      addSubmission({
        childName: name,
        childAge: age.toString(),
        workCity: mockCities[Math.floor(Math.random() * mockCities.length)],
        officeAddress: `Офіс №${Math.floor(Math.random() * 100) + 1}`,
        parentName: `Батько/Мати ${index + 1}`,
        contactPhone: `+38050${Math.floor(Math.random() * 10000000)
          .toString()
          .padStart(7, "0")}`,
        photoUrl: `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(name)}`,
      })
    })

    // Publish some submissions
    submissions.slice(0, 10).forEach((s) => {
      s.isPublished = true
    })

    // Add some random votes
    submissions.forEach((submission) => {
      if (submission.isPublished) {
        const voteCount = Math.floor(Math.random() * 20)
        for (let i = 0; i < voteCount; i++) {
          const userId = `mock_user_${i}_${Math.random()}`
          voteForSubmission(submission.id, userId)
        }
      }
    })
  }
}

// Initialize mock data
initializeMockData()
