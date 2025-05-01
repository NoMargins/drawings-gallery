import { type NextRequest, NextResponse } from "next/server"
import { getSubmissionByIdFromDb, updateSubmissionInDb, publishSubmissionInDb } from "@/lib/db-service"

// GET /api/submissions/[id] - отримати конкретну заявку
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const submission = await getSubmissionByIdFromDb(id)

    if (!submission) {
      return NextResponse.json({ success: false, error: "Заявку не знайдено" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: submission })
  } catch (error) {
    console.error("Error fetching submission:", error)
    return NextResponse.json({ success: false, error: "Помилка при отриманні заявки" }, { status: 500 })
  }
}

// PATCH /api/submissions/[id] - оновити заявку
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const updatedSubmission = await updateSubmissionInDb(id, body)

    if (!updatedSubmission) {
      return NextResponse.json({ success: false, error: "Заявку не знайдено" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedSubmission })
  } catch (error) {
    console.error("Error updating submission:", error)
    return NextResponse.json({ success: false, error: "Помилка при оновленні заявки" }, { status: 500 })
  }
}

// POST /api/submissions/[id]/publish - опублікувати заявку
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "publish") {
      const publishedSubmission = await publishSubmissionInDb(id)

      if (!publishedSubmission) {
        return NextResponse.json({ success: false, error: "Заявку не знайдено" }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: publishedSubmission })
    }

    return NextResponse.json({ success: false, error: "Невідома дія" }, { status: 400 })
  } catch (error) {
    console.error("Error publishing submission:", error)
    return NextResponse.json({ success: false, error: "Помилка при публікації заявки" }, { status: 500 })
  }
}
