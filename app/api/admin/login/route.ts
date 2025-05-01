import { type NextRequest, NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/admin-service"

// POST /api/admin/login - автентифікація адміністратора
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Перевірка наявності всіх необхідних полів
    if (!body.email || !body.password) {
      return NextResponse.json({ success: false, error: "Не вказано email або пароль" }, { status: 400 })
    }

    // Автентифікація адміністратора
    const admin = await authenticateAdmin(body.email, body.password)

    if (!admin) {
      return NextResponse.json({ success: false, error: "Невірний email або пароль" }, { status: 401 })
    }

    // Повертаємо дані адміністратора
    return NextResponse.json({ success: true, data: admin })
  } catch (error) {
    console.error("Error authenticating admin:", error)
    return NextResponse.json({ success: false, error: "Помилка при автентифікації" }, { status: 500 })
  }
}
