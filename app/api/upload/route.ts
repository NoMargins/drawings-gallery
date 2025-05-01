import { type NextRequest, NextResponse } from "next/server"
import { saveImageToServer } from "@/lib/server-utils"

// Максимальний розмір файлу (10 МБ)
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // Перевіряємо, чи це multipart/form-data запит
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("file") as File | null
      const childName = (formData.get("childName") as string) || "unknown"

      if (!file) {
        return NextResponse.json({ success: false, error: "Файл не знайдено" }, { status: 400 })
      }

      // Перевіряємо розмір файлу
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: "Розмір файлу перевищує допустимий ліміт (10 МБ)" },
          { status: 400 },
        )
      }

      // Перевіряємо тип файлу
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ success: false, error: "Дозволені тільки зображення" }, { status: 400 })
      }

      // Конвертуємо файл у base64
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

      // Зберігаємо зображення на сервері
      const photoUrl = await saveImageToServer(base64, childName)

      return NextResponse.json({ success: true, photoUrl })
    } else {
      // Якщо це JSON запит з base64 даними
      const body = await request.json()

      if (!body.base64Image || !body.childName) {
        return NextResponse.json({ success: false, error: "Відсутні обов'язкові поля" }, { status: 400 })
      }

      // Зберігаємо зображення на сервері
      const photoUrl = await saveImageToServer(body.base64Image, body.childName)

      return NextResponse.json({ success: true, photoUrl })
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ success: false, error: "Помилка при завантаженні файлу" }, { status: 500 })
  }
}
