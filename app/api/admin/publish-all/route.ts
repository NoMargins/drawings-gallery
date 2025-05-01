import { type NextRequest, NextResponse } from "next/server"
import { publishAllSubmissionsInDb } from "@/lib/db-service"

// POST /api/admin/publish-all - опублікувати всі заявки
export async function POST(request: NextRequest) {
  try {
    const updatedSubmissions = await publishAllSubmissionsInDb()
    return NextResponse.json({
      success: true,
      message: "Всі заявки опубліковано",
      data: updatedSubmissions,
    })
  } catch (error) {
    console.error("Error publishing all submissions:", error)
    return NextResponse.json({ success: false, error: "Помилка при публікації заявок" }, { status: 500 })
  }
}
