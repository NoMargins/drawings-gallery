import { type NextRequest, NextResponse } from "next/server"
import { getAllSubmissionsFromDb } from "@/lib/db-service"

// GET /api/admin/export - експорт даних заявок у форматі CSV
export async function GET(request: NextRequest) {
  try {
    const submissions = await getAllSubmissionsFromDb()

    // Формуємо CSV
    const csvHeader = "ID,Ім'я дитини,Вік,Місто,Офіс,Ім'я батьків,Телефон,Опубліковано,Голоси,Категорія,Дата створення"
    const csvRows = submissions.map(
      (s) =>
        `${s.id},"${s.childName}",${s.childAge},"${s.workCity}","${s.officeAddress}","${s.parentName}","${s.contactPhone}",${s.isPublished},${s.votes},"${s.ageCategory}","${s.createdAt}"`,
    )
    const csvContent = [csvHeader, ...csvRows].join("\n")

    // Встановлюємо заголовки для завантаження файлу
    const headers = {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=submissions_${new Date().toISOString().split("T")[0]}.csv`,
    }

    return new NextResponse(csvContent, { headers })
  } catch (error) {
    console.error("Error exporting submissions:", error)
    return NextResponse.json({ success: false, error: "Помилка при експорті даних" }, { status: 500 })
  }
}
