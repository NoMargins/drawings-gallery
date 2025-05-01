"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, UserPlus, Users, Shield } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminSettings() {
  const { user } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"admin" | "superadmin">("admin")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{ show: boolean; type: "success" | "error"; message: string }>({
    show: false,
    type: "success",
    message: "",
  })

  // Перевіряємо, чи користувач є суперадміністратором
  useEffect(() => {
    if (user && user.role !== "superadmin") {
      router.push("/admin/dashboard")
    }
  }, [user, router])

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !name) {
      setAlert({
        show: true,
        type: "error",
        message: "Будь ласка, заповніть всі поля",
      })
      setTimeout(() => setAlert({ show: false, type: "error", message: "" }), 3000)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, role }),
      })

      const data = await response.json()

      if (data.success) {
        setAlert({
          show: true,
          type: "success",
          message: "Адміністратора успішно створено",
        })
        setEmail("")
        setPassword("")
        setName("")
        setRole("admin")
      } else {
        setAlert({
          show: true,
          type: "error",
          message: data.error || "Помилка при створенні адміністратора",
        })
      }
    } catch (error) {
      console.error("Error creating admin:", error)
      setAlert({
        show: true,
        type: "error",
        message: "Помилка при створенні адміністратора",
      })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setAlert({ show: false, type: "success", message: "" }), 3000)
    }
  }

  const handleBack = () => {
    router.push("/admin/dashboard")
  }

  // Якщо користувач не є суперадміністратором, показуємо повідомлення про відсутність доступу
  if (user && user.role !== "superadmin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 p-4">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={handleBack} className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Повернутися до панелі адміністратора
          </Button>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">
                <Shield className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <p className="text-xl font-bold">Доступ заборонено</p>
                <p className="mt-2">У вас немає прав для доступу до цієї сторінки</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button onClick={handleBack} className="mb-4 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Повернутися до панелі адміністратора
        </Button>

        {alert.show && (
          <Alert
            className={`mb-4 ${alert.type === "success" ? "bg-green-100 border-green-500 text-green-800" : "bg-red-100 border-red-500 text-red-800"}`}
          >
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <Card className="border-2 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700 flex items-center gap-2">
              <Users className="h-6 w-6" /> Налаштування адміністраторів
            </CardTitle>
            <CardDescription>Створення нових облікових записів адміністраторів</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-600">
                  Ім'я адміністратора
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-green-200"
                  placeholder="Введіть ім'я"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-600">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-green-200"
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-600">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-green-200"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-green-600">
                  Роль
                </Label>
                <Select value={role} onValueChange={(value) => setRole(value as "admin" | "superadmin")}>
                  <SelectTrigger id="role" className="border-2 border-green-200">
                    <SelectValue placeholder="Виберіть роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Адміністратор</SelectItem>
                    <SelectItem value="superadmin">Суперадміністратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Створення..." : "Створити адміністратора"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-sm text-green-600 border-t border-green-100 pt-4">
            <p>
              <Shield className="inline-block h-4 w-4 mr-1" />
              Суперадміністратори мають повний доступ до всіх функцій, включаючи створення нових адміністраторів.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
