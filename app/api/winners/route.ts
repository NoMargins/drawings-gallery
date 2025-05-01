import { type NextRequest, NextResponse } from "next/server"
import { getWinnersByCategoryFromDb } from "@/lib/db-service"
import type { AgeCategory } from "@/lib/types"

// GET /api/winners - отримати переможців
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") as AgeCategory | null

    if (category) {
      const winners = await getWinnersByCategoryFromDb(category)
      return NextResponse.json({ success: true, data: winners })
    } else {
      // Якщо категорія не вказана, повертаємо переможців у всіх категоріях
      const categories: AgeCategory[] = ["0-5", "6-8", "9-12", "13-18"]
      const allWinners = {} as Record<AgeCategory, any[]>

      for (const cat of categories) {
        allWinners[cat] = await getWinnersByCategoryFromDb(cat)
      }

      return NextResponse.json({ success: true, data: allWinners })
    }
  } catch (error) {
    console.error("Error fetching winners:", error)
    return NextResponse.json({ success: false, error: "Помилка при отриманні переможців" }, { status: 500 })
  }
}
