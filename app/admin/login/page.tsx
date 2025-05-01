"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Будь ласка, введіть електронну пошту та пароль")
      return
    }

    const success = await login(email, password)
    if (success) {
      router.push("/admin/dashboard")
    } else {
      setError("Невірна електронна пошта або пароль")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-green-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-700">Адмін-панель</CardTitle>
          <CardDescription className="text-center text-green-600">
            Увійдіть, щоб отримати доступ до адміністративної панелі
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-700">
                Електронна пошта
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-2 border-green-200 focus:border-green-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-700">
                Пароль
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-2 border-green-200 focus:border-green-400"
                />
              </div>
              <p className="text-xs text-green-600 mt-1">Для демо: email: admin@example.com, пароль: password</p>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {isLoading ? "Вхід..." : "Увійти"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-green-600">Адміністративний доступ тільки для авторизованого персоналу</p>
        </CardFooter>
      </Card>
    </div>
  )
}
