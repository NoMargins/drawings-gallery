import { type NextRequest, NextResponse } from "next/server"
import { voteForSubmissionInDb, hasUserVotedInDb, getUserVotesFromDb } from "@/lib/db-service"

// GET /api/votes - отримати голоси користувача
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "Не вказано ID користувача" }, { status: 400 })
    }

    const votes = await getUserVotesFromDb(userId)
    return NextResponse.json({ success: true, data: votes })
  } catch (error) {
    console.error("Error fetching votes:", error)
    return NextResponse.json({ success: false, error: "Помилка при отриманні голосів" }, { status: 500 })
  }
}

// POST /api/votes - проголосувати за заявку
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.submissionId || !body.userId) {
      return NextResponse.json({ success: false, error: "Не вказано ID заявки або користувача" }, { status: 400 })
    }

    // Перевірка, чи користувач вже голосував за цю заявку
    const hasVoted = await hasUserVotedInDb(body.submissionId, body.userId)
    if (hasVoted) {
      return NextResponse.json({ success: false, error: "Ви вже проголосували за цю роботу" }, { status: 400 })
    }

    const success = await voteForSubmissionInDb(body.submissionId, body.userId)

    if (success) {
      return NextResponse.json({ success: true, message: "Голос зараховано" })
    } else {
      return NextResponse.json({ success: false, error: "Помилка при голосуванні" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error voting:", error)
    return NextResponse.json({ success: false, error: "Помилка при голосуванні" }, { status: 500 })
  }
}
