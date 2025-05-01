import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

// GET /api/analytics - отримати аналітичні дані
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const submissions = db.collection("submissions")
    const votes = db.collection("votes")

    // Загальна кількість заявок
    const totalSubmissions = await submissions.countDocuments()

    // Кількість опублікованих заявок
    const publishedSubmissions = await submissions.countDocuments({ isPublished: true })

    // Кількість заявок за віковими категоріями
    const submissionsByCategory = await submissions
      .aggregate([{ $group: { _id: "$ageCategory", count: { $sum: 1 } } }])
      .toArray()

    // Кількість заявок за містами
    const submissionsByCity = await submissions
      .aggregate([{ $group: { _id: "$workCity", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }])
      .toArray()

    // Загальна кількість голосів
    const totalVotes = await votes.countDocuments()

    // Топ-10 заявок за кількістю голосів
    const topVotedSubmissions = await submissions
      .find()
      .sort({ votes: -1 })
      .limit(10)
      .project({ childName: 1, childAge: 1, workCity: 1, votes: 1 })
      .toArray()

    // Статистика за часом
    const submissionsByDate = await submissions
      .aggregate([
        {
          $group: {
            _id: { $substr: ["$createdAt", 0, 10] }, // Групуємо за датою (перші 10 символів ISO дати)
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray()

    return NextResponse.json({
      success: true,
      data: {
        totalSubmissions,
        publishedSubmissions,
        submissionsByCategory,
        submissionsByCity,
        totalVotes,
        topVotedSubmissions,
        submissionsByDate,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Помилка при отриманні аналітичних даних" }, { status: 500 })
  }
}
