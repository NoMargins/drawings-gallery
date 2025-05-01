import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import sharp from "sharp"

// Шлях до директорії для зберігання малюнків
export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")
export const UPLOADS_URL_PATH = "/uploads"

// Створюємо директорію, якщо вона не існує
export function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  }
}

// Функція для збереження малюнка на сервері
export async function saveImageToServer(base64Image: string, childName: string): Promise<string> {
  ensureUploadsDir()

  // Видаляємо префікс data:image/jpeg;base64, якщо він є
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")
  const buffer = Buffer.from(base64Data, "base64")

  // Генеруємо унікальне ім'я файлу
  const fileName = `${uuidv4()}-${childName.replace(/\s+/g, "-").toLowerCase()}.jpg`
  const filePath = path.join(UPLOADS_DIR, fileName)

  // Оптимізуємо зображення перед збереженням
  await sharp(buffer)
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(filePath)

  // Повертаємо URL-шлях до файлу
  return `${UPLOADS_URL_PATH}/${fileName}`
}

// Функція для видалення малюнка з сервера
export function deleteImageFromServer(imageUrl: string): boolean {
  try {
    // Отримуємо ім'я файлу з URL
    const fileName = path.basename(imageUrl)
    const filePath = path.join(UPLOADS_DIR, fileName)

    // Перевіряємо, чи існує файл
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}
