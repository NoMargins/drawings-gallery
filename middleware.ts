import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Маршрути, які потребують автентифікації
const PROTECTED_ROUTES = ["/api/admin", "/api/submissions", "/api/upload"]

// Маршрути, які доступні без автентифікації
const PUBLIC_ROUTES = [
  "/api/submissions/GET", // Дозволяємо GET запити до /api/submissions
]

export function middleware(request: NextRequest) {
  const { pathname, method } = request.nextUrl

  // Перевіряємо, чи маршрут потребує захисту
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  // Перевіряємо, чи маршрут є публічним
  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    const [path, allowedMethod] = route.split("/")
    return pathname.startsWith(path) && (allowedMethod ? method === allowedMethod : true)
  })

  // Якщо маршрут не потребує захисту або є публічним, пропускаємо запит
  if (!isProtectedRoute || isPublicRoute) {
    return NextResponse.next()
  }

  // Отримуємо токен автентифікації з заголовка
  const authHeader = request.headers.get("authorization")

  // Перевіряємо токен (в реальному додатку тут була б перевірка JWT)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Необхідна автентифікація" }, { status: 401 })
  }

  // Пропускаємо запит, якщо автентифікація успішна
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
