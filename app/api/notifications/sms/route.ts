import { type NextRequest, NextResponse } from "next/server"

// POST /api/notifications/sms - відправити SMS сповіщення
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.phone || !body.message) {
      return NextResponse.json({ success: false, error: "Не вказано телефон або повідомлення" }, { status: 400 })
    }

    // В реальному додатку тут був би код для відправки SMS через API провайдера
    // Наприклад, Twilio, Vonage (Nexmo), MessageBird тощо

    // Для демо просто імітуємо успішну відправку
    console.log(`Відправка SMS на номер ${body.phone}: ${body.message}`)

    return NextResponse.json({ success: true, message: "SMS відправлено" })
  } catch (error) {
    console.error("Error sending SMS:", error)
    return NextResponse.json({ success: false, error: "Помилка при відправці SMS" }, { status: 500 })
  }
}
