import { connectToDatabase } from "./db"
import { hash, compare } from "bcrypt"
import { ObjectId } from "mongodb"

// Тип для адміністратора
export type Admin = {
  id: string
  email: string
  name: string
  role: "admin" | "superadmin"
  passwordHash: string
}

// Функція для створення нового адміністратора
export async function createAdmin(
  email: string,
  password: string,
  name: string,
  role: "admin" | "superadmin" = "admin",
): Promise<Admin | null> {
  try {
    const { db } = await connectToDatabase()
    const admins = db.collection("admins")

    // Перевіряємо, чи існує вже адміністратор з таким email
    const existingAdmin = await admins.findOne({ email })
    if (existingAdmin) {
      return null
    }

    // Хешуємо пароль
    const passwordHash = await hash(password, 10)

    // Створюємо нового адміністратора
    const result = await admins.insertOne({
      email,
      name,
      role,
      passwordHash,
      createdAt: new Date().toISOString(),
    })

    return {
      id: result.insertedId.toString(),
      email,
      name,
      role,
      passwordHash,
    }
  } catch (error) {
    console.error("Error creating admin:", error)
    return null
  }
}

// Функція для автентифікації адміністратора
export async function authenticateAdmin(email: string, password: string): Promise<Omit<Admin, "passwordHash"> | null> {
  try {
    const { db } = await connectToDatabase()
    const admins = db.collection("admins")

    // Шукаємо адміністратора за email
    const admin = (await admins.findOne({ email })) as Admin | null

    if (!admin) {
      return null
    }

    // Перевіряємо пароль
    const passwordMatch = await compare(password, admin.passwordHash)

    if (!passwordMatch) {
      return null
    }

    // Повертаємо дані адміністратора без хешу пароля
    const { passwordHash, ...adminData } = admin
    return {
      ...adminData,
      id: admin._id.toString(),
    }
  } catch (error) {
    console.error("Error authenticating admin:", error)
    return null
  }
}

// Функція для отримання адміністратора за ID
export async function getAdminById(id: string): Promise<Omit<Admin, "passwordHash"> | null> {
  try {
    const { db } = await connectToDatabase()
    const admins = db.collection("admins")

    const admin = (await admins.findOne({ _id: new ObjectId(id) })) as Admin | null

    if (!admin) {
      return null
    }

    const { passwordHash, ...adminData } = admin
    return {
      ...adminData,
      id: admin._id.toString(),
    }
  } catch (error) {
    console.error("Error getting admin by ID:", error)
    return null
  }
}
