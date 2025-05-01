import { MongoClient, type Db, type Collection } from "mongodb"
import type { ChildSubmission, Vote } from "./types"

// Змінні для підключення до MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB = process.env.MONGODB_DB || "drawing_contest"

// Кешування підключення для кращої продуктивності
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

// Функція для підключення до бази даних
export async function connectToDatabase(): Promise<{
  client: MongoClient
  db: Db
  submissions: Collection<ChildSubmission>
  votes: Collection<Vote>
}> {
  // Якщо у нас вже є підключення, використовуємо його
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
      submissions: cachedDb.collection("submissions"),
      votes: cachedDb.collection("votes"),
    }
  }

  // Створюємо нове підключення
  const client = new MongoClient(MONGODB_URI)
  await client.connect()

  const db = client.db(MONGODB_DB)

  // Кешуємо підключення
  cachedClient = client
  cachedDb = db

  return {
    client,
    db,
    submissions: db.collection("submissions"),
    votes: db.collection("votes"),
  }
}

// Функція для закриття підключення (використовується при тестуванні)
export async function closeDbConnection() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
}
