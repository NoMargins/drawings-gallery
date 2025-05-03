"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Calendar, MapPin, Trophy, Medal, Star, Heart, Flag, Shield, FileText } from "lucide-react"
import { getWinnersByCategory } from "@/lib/data"
import type { ChildSubmission, AgeCategory } from "@/lib/types"
// Додайте імпорт компонента ImageModal на початку файлу
import { ImageModal } from "@/components/image-modal"

export default function Winners() {
  const [activeTab, setActiveTab] = useState<AgeCategory>("0-5")
  const [winners, setWinners] = useState<Record<AgeCategory, ChildSubmission[]>>({
    "0-5": [],
    "6-8": [],
    "9-12": [],
    "13-18": [],
  })

  useEffect(() => {
    // Load winners by category
    const categories: AgeCategory[] = ["0-5", "6-8", "9-12", "13-18"]
    const winnersByCategory: Record<AgeCategory, ChildSubmission[]> = {
      "0-5": [],
      "6-8": [],
      "9-12": [],
      "13-18": [],
    }

    categories.forEach((category) => {
      winnersByCategory[category] = getWinnersByCategory(category)
    })

    setWinners(winnersByCategory)
  }, [])

  // Medal colors for positions
  const medalColors = ["gold", "silver", "#CD7F32"] // Gold, Silver, Bronze

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 relative z-10">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -top-1 -left-1 w-10 h-10 bg-yellow-300 rounded-full animate-pulse"></div>
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Логотип компанії"
                width={40}
                height={40}
                className="rounded-full relative z-10 border-2 border-white"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-green-600">Ваша Компанія</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/">
              <Button variant="outline" className="border-green-200 text-green-700">
                <Home className="mr-2 h-5 w-5" />
                На головну
              </Button>
            </Link>
            <Link href="/gallery">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                <Heart className="mr-2 h-5 w-5" />
                Галерея малюнків
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-6 relative z-10">
      <div className="text-center mb-10">
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-2 text-sm font-medium text-white shadow-md mb-4">
            <Trophy className="mr-2 h-5 w-5" />
            <span>Вітаємо переможців!</span>
          </div>
          <h1 className="text-3xl sm:text-base md:text-4xl font-bold text-green-700 mb-4">
            Переможці конкурсу «Шеврон для мого захисника»
          </h1>
          <p className="text-lg sm:text-base text-green-600 max-w-3xl mx-auto">
            Вітаємо переможців нашого конкурсу! Дякуємо всім учасникам за чудові малюнки та підтримку наших
            захисників.
          </p>
        </div>

        <Tabs
          defaultValue="0-5"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AgeCategory)}
          className="mb-8"
        >
          <div className="flex justify-center mb-6 overflow-x-auto">
            <TabsList className="bg-white border-2 border-green-200 p-1">
              <TabsTrigger value="0-5" className="px-3 py-2 text-sm sm:text-base data-[state=active]:bg-green-500 data-[state=active]:text-white">
                0-5 років
              </TabsTrigger>
              <TabsTrigger value="6-8" className="px-3 py-2 text-sm sm:text-base data-[state=active]:bg-green-500 data-[state=active]:text-white">
                6-8 років
              </TabsTrigger>
              <TabsTrigger value="9-12" className="px-3 py-2 text-sm sm:text-base data-[state=active]:bg-green-500 data-[state=active]:text-white"              >
                9-12 років
              </TabsTrigger>
              <TabsTrigger value="13-18" className="px-3 py-2 text-sm sm:text-base data-[state=active]:bg-green-500 data-[state=active]:text-white"              >
                13-18 років
              </TabsTrigger>
            </TabsList>
          </div>

          {(["0-5", "6-8", "9-12", "13-18"] as AgeCategory[]).map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              {winners[category].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {winners[category].map((winner, index) => (
                    <div key={winner.id} className="flex flex-col items-center h-full">
                      <div className="relative mb-6 w-full">
                        <div
                          className="absolute -top-6 -right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-10"
                          style={{ backgroundColor: medalColors[index] }}
                        >
                          <div className="text-white font-bold text-xl sm:text-2xl">{index + 1}</div>
                        </div>
                        <Card
                          className="overflow-hidden border-4 w-full h-full"
                          style={{ borderColor: medalColors[index] }}
                        >
                          <div className="relative h-60 sm:h-72 md:h-80 w-full"                          >
                            <ImageModal src={winner.photoUrl || "/placeholder.svg"} alt={winner.childName}>
                              <Image
                                src={winner.photoUrl || "/placeholder.svg"}
                                alt={winner.childName}
                                fill
                                className="object-contain"
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                            </ImageModal>
                          </div>
                          <CardContent className="pt-4 pb-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl sm:text-2xl font-bold text-green-700">{winner.childName}</h3>
                              <Badge className="bg-blue-500 ml-2">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                {winner.votes}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-green-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{winner.childAge} років</span>
                              </div>
                              <div className="flex items-center text-green-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{winner.workCity}</span>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center">
                              <Medal
                                className="h-5 w-5 mr-2"
                                style={{ color: medalColors[index] }}
                                fill="currentColor"
                              />
                              <span className="font-medium" style={{ color: medalColors[index] }}>
                                {index === 0 ? "Перше місце" : index === 1 ? "Друге місце" : "Третє місце"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-700">Переможці ще не визначені</h3>
                  <p className="text-green-600 mt-2">
                    Голосування триває до 30 травня. Переможці будуть оголошені 1 червня.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
          <Footer />
    </div>
  )
}
