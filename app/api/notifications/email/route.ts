import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// POST /api/notifications/email - відправити email сповіщення
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.email || !body.subject) {
      return NextResponse.json({ success: false, error: "Не вказано email або тему" }, { status: 400 })
    }

    // Налаштування транспорту для відправки email
    // В реальному додатку тут були б реальні дані SMTP сервера
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.example.com",
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "user@example.com",
        pass: process.env.EMAIL_PASSWORD || "password",
      },
    })

    // Формуємо HTML для листа
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h1 style="color: #4CAF50; text-align: center;">Дякуємо за участь у конкурсі!</h1>
        <p style="font-size: 16px; line-height: 1.5;">
          Шановний(а) ${body.parentName || "учаснику"},
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          Ми отримали малюнок ${body.childName ? `від ${body.childName}` : "вашої дитини"} для конкурсу «Шеврон для мого захисника».
          Дякуємо за вашу участь!
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          Після перевірки модераторами, малюнок буде опубліковано в галереї. Ми повідомимо вас про це окремо.
        </p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 14px; color: #666;">
            Переможці будуть оголошені 1 червня. У кожній віковій категорії буде обрано трьох переможців, які отримають подарунки.
          </p>
        </div>
        <p style="font-size: 16px; line-height: 1.5;">
          З повагою,<br>
          Команда конкурсу «Шеврон для мого захисника»
        </p>
      </div>
    `

    // Відправляємо email
    // В реальному додатку тут був би реальний код відправки
    // Для демо просто імітуємо успішну відправку
    console.log(`Відправка email на адресу ${body.email}: ${body.subject}`)

    // Закоментовано реальну відправку, щоб не відправляти реальні листи в демо
    /*
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Конкурс малюнків" <noreply@example.com>',
      to: body.email,
      subject: body.subject,
      html: htmlContent,
    })
    */

    return NextResponse.json({ success: true, message: "Email відправлено" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ success: false, error: "Помилка при відправці email" }, { status: 500 })
  }
}
