"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  email: string
  name: string
  role: "admin" | "superadmin"
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Protect admin routes
  useEffect(() => {
    if (!isLoading && pathname?.startsWith("/admin") && !user && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isLoading, user, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // В реальному додатку тут буде API запит до сервера
      // Для демо можемо використовувати тестові дані
      if (process.env.NODE_ENV === "development" && email === "admin@example.com" && password === "password") {
        const user = {
          id: "1",
          email,
          name: "Адміністратор",
          role: "admin" as const,
        }
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        setIsLoading(false)
        return true
      }

      // Запит до API для автентифікації
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.data)
          localStorage.setItem("user", JSON.stringify(data.data))
          setIsLoading(false)
          return true
        }
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/admin/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
