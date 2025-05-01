import { type NextRequest, NextResponse } from "next/server"
import { createAdmin } from "@/lib/admin-service"

// POST /api/admin/create - створити нового адміністратора
// Цей маршрут повинен бути захищений і доступний тільки для суперадміністраторів
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Перевірка наявності всіх необхідних полів
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json({ success: false, error: "Не всі обов'язкові поля заповнені" }, { status: 400 })
    }

    // Створення нового адміністратора
    const newAdmin = await createAdmin(body.email, body.password, body.name, body.role || "admin")

    if (!newAdmin) {
      return NextResponse.json({ success: false, error: "Адміністратор з таким email вже існує" }, { status: 400 })
    }

    // Повертаємо дані нового адміністратора без хешу пароля
    const { passwordHash, ...adminData } = newAdmin
    return NextResponse.json({ success: true, data: adminData }, { status: 201 })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ success: false, error: "Помилка при створенні адміністратора" }, { status: 500 })
  }
}
