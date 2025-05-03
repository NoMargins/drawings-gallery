// components/Footer.tsx
"use client"

import Link from "next/link"
import { Gift, Trophy, Heart, FileText } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-6 sm:py-8 mt-8 sm:mt-12 rounded-t-3xl relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center">
              <Gift className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Про конкурс
            </h3>
            <p className="text-white text-sm sm:text-base">
              Конкурс малюнків «Шеврон для мого захисника» присвячений Дню захисту дітей. Малюнки будуть
              використані для створення особливого проєкту до Дня захисту дітей та Дня захисників та захисниць України.
            </p>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center">
              <Trophy className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Нагородження
            </h3>
            <p className="text-white text-sm sm:text-base">
              Переможці будуть оголошені 30 травня. У кожній віковій категорії буде обрано трьох переможців, які
              отримають подаруночки!
            </p>
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center">
              <Heart className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Конфіденційність
            </h3>
            <p className="text-white text-sm sm:text-base">
              Вся надана інформація буде використовуватися виключно для конкурсу «Шеврон для мого захисника» і
              буде оброблятися відповідно до нашої політики конфіденційності.
            </p>
            <Link
              href="/privacy-policy"
              className="flex items-center mt-2 text-white hover:text-yellow-200 underline text-sm sm:text-base"
            >
              <FileText className="h-4 w-4 mr-1" /> Політика конфіденційності
            </Link>
          </div>
        </div>
        <div className="border-t border-white/30 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-white">
          <p className="text-sm sm:text-base">© {new Date().getFullYear()} Fozzy Group. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  )
}
