"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Home, Calendar, Gift, Trophy, Star, MapPin, Info, AlertCircle, FileText } from "lucide-react"
import { getPublishedSubmissions, getSubmissionsByCategory, voteForSubmission, hasUserVoted } from "@/lib/data"
import type { ChildSubmission, AgeCategory } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<AgeCategory>("0-5")
  const [submissions, setSubmissions] = useState<Record<AgeCategory, ChildSubmission[]>>({
    "0-5": [],
    "6-8": [],
    "9-12": [],
    "13-18": [],
  })
  const [userId, setUserId] = useState<string>("")
  const [votedSubmissions, setVotedSubmissions] = useState<Record<string, boolean>>({})
  const [voteAlert, setVoteAlert] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: false,
    message: "",
  })

  useEffect(() => {
    // Generate a random user ID if not exists (in a real app, this would be a proper user authentication)
    const storedUserId = localStorage.getItem("galleryUserId")
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      const newUserId = `user_${Date.now()}`
      localStorage.setItem("galleryUserId", newUserId)
      setUserId(newUserId)
    }

    // Load submissions by category
    const categories: AgeCategory[] = ["0-5", "6-8", "9-12", "13-18"]
    const submissionsByCategory: Record<AgeCategory, ChildSubmission[]> = {
      "0-5": [],
      "6-8": [],
      "9-12": [],
      "13-18": [],
    }

    categories.forEach((category) => {
      submissionsByCategory[category] = getSubmissionsByCategory(category)
    })

    setSubmissions(submissionsByCategory)
  }, [])

  useEffect(() => {
    // Check which submissions the user has voted for
    if (userId) {
      const voted: Record<string, boolean> = {}
      const allSubmissions = getPublishedSubmissions()

      allSubmissions.forEach((submission) => {
        voted[submission.id] = hasUserVoted(submission.id, userId)
      })

      setVotedSubmissions(voted)
    }
  }, [userId])

  const handleVote = (submissionId: string) => {
    if (votedSubmissions[submissionId]) {
      setVoteAlert({
        show: true,
        success: false,
        message: "Ви вже проголосували за цю роботу!",
      })
      setTimeout(() => setVoteAlert({ show: false, success: false, message: "" }), 3000)
      return
    }

    const success = voteForSubmission(submissionId, userId)

    if (success) {
      // Update local state
      setVotedSubmissions((prev) => ({ ...prev, [submissionId]: true }))

      // Update submission vote count
      setSubmissions((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((category) => {
          updated[category as AgeCategory] = updated[category as AgeCategory].map((s) =>
            s.id === submissionId ? { ...s, votes: s.votes + 1 } : s,
          )
        })
        return updated
      })

      setVoteAlert({
        show: true,
        success: true,
        message: "Ваш голос зараховано! Дякуємо за участь!",
      })
    } else {
      setVoteAlert({
        show: true,
        success: false,
        message: "Помилка при голосуванні. Спробуйте пізніше.",
      })
    }

    setTimeout(() => setVoteAlert({ show: false, success: false, message: "" }), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100">
      {/* Alert for vote status */}
      {voteAlert.show && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert variant={voteAlert.success ? "default" : "destructive"} className="border-2 border-green-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{voteAlert.success ? "Успіх!" : "Увага!"}</AlertTitle>
            <AlertDescription>{voteAlert.message}</AlertDescription>
          </Alert>
        </div>
      )}

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
            <span className="text-xl font-bold text-green-600">Ваша Компанія</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/">
              <Button variant="outline" className="border-green-200 text-green-700">
                <Home className="mr-2 h-5 w-5" />
                На головну
              </Button>
            </Link>
            <Link href="/winners">
              <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white">
                <Trophy className="mr-2 h-5 w-5" />
                Переможці
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                  <Info className="mr-2 h-5 w-5" />
                  Умови конкурсу
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gradient-to-br from-sky-50 to-green-50 border-2 border-green-200 rounded-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl text-center text-green-600 font-bold">
                    Умови конкурсу "Малюнок для мого Сміливовершника"
                  </DialogTitle>
                  <DialogDescription className="text-center text-green-500">
                    Ознайомтеся з правилами та умовами участі
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  <div className="bg-white p-4 rounded-xl shadow-inner">
                    <h3 className="font-bold text-green-700 flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-green-500" />
                      Терміни проведення
                    </h3>
                    <p className="text-green-600 mt-1">
                      Приймаємо малюнки до 18 травня. Голосування триватиме до 30 травня. Оголошення переможців
                      відбудеться 1 червня.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-inner">
                    <h3 className="font-bold text-green-700 flex items-center">
                      <Trophy className="mr-2 h-5 w-5 text-green-500" />
                      Вікові категорії та призи
                    </h3>
                    <p className="text-green-600 mt-1">
                      Конкурс проводиться у 4 вікових категоріях: до 5, 6–8, 9–12 та 13–18 років. У кожній категорії —
                      три переможці з подарунками!
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-inner">
                    <h3 className="font-bold text-green-700 flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-green-500" />
                      Правила голосування
                    </h3>
                    <p className="text-green-600 mt-1">
                      Кожен користувач може проголосувати лише один раз за кожну роботу. Переможці визначаються за
                      кількістю голосів у кожній віковій категорії.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-inner">
                    <h3 className="font-bold text-green-700 flex items-center">
                      <Gift className="mr-2 h-5 w-5 text-green-500" />
                      Особлива ініціатива
                    </h3>
                    <p className="text-green-600 mt-1">
                      Малюнки будуть використані для створення патріотичного контенту до Дня Захисника та Захисниці (1
                      жовтня).
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
            Галерея малюнків "Малюнок для мого Сміливовершника"
          </h1>
          <p className="text-lg text-green-600 max-w-3xl mx-auto">
            Перегляньте малюнки наших маленьких учасників та проголосуйте за найкращі! Ваші голоси допоможуть визначити
            переможців конкурсу.
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
              <TabsTrigger value="0-5" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                0-5 років
              </TabsTrigger>
              <TabsTrigger value="6-8" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                6-8 років
              </TabsTrigger>
              <TabsTrigger value="9-12" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                9-12 років
              </TabsTrigger>
              <TabsTrigger value="13-18" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                13-18 років
              </TabsTrigger>
            </TabsList>
          </div>

          {(["0-5", "6-8", "9-12", "13-18"] as AgeCategory[]).map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {submissions[category].length > 0 ? (
                  submissions[category].map((submission) => (
                    <Card
                      key={submission.id}
                      className="overflow-hidden border-2 border-green-200 hover:shadow-lg transition-shadow h-full"
                    >
                      <div className="relative aspect-square w-full">
                        <Image
                          src={submission.photoUrl || "/placeholder.svg"}
                          alt={submission.childName}
                          fill
                          className="object-contain"
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {submission.votes > 0 && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-blue-500">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              {submission.votes}{" "}
                              {submission.votes === 1 ? "голос" : submission.votes < 5 ? "голоси" : "голосів"}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="text-lg font-bold text-green-700">{submission.childName}</h3>
                        <div className="flex items-center text-green-600 mt-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{submission.childAge} років</span>
                        </div>
                        <div className="flex items-center text-green-600 mt-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{submission.workCity}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleVote(submission.id)}
                          disabled={votedSubmissions[submission.id]}
                          className={`w-full ${
                            votedSubmissions[submission.id]
                              ? "bg-green-200 text-green-700 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                          }`}
                        >
                          <Heart
                            className={`mr-2 h-5 w-5 ${votedSubmissions[submission.id] ? "fill-green-700" : ""}`}
                          />
                          {votedSubmissions[submission.id] ? "Ви проголосували" : "Проголосувати"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <AlertCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-green-700">Немає малюнків у цій категорії</h3>
                    <p className="text-green-600 mt-2">У цій віковій категорії поки що немає опублікованих малюнків</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-8 mt-12 rounded-t-3xl relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Gift className="mr-2 h-5 w-5" />
                Про конкурс
              </h3>
              <p className="text-white">
                Конкурс малюнків "Малюнок для мого Сміливовершника" присвячений Дню захисту дітей. Малюнки будуть
                використані для створення особливого проекту до Дня захисту дітей та Дня Захисника України.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Нагородження
              </h3>
              <p className="text-white">
                Переможці будуть оголошені 1 червня. У кожній віковій категорії буде обрано трьох переможців, які
                отримають подарунки.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Конфіденційність
              </h3>
              <p className="text-white">
                Вся надана інформація буде використовуватися виключно для конкурсу "Малюнок для мого Сміливовершника" і
                буде оброблятися відповідно до нашої політики конфіденційності.
              </p>
              <Link
                href="/privacy-policy"
                className="flex items-center mt-2 text-white hover:text-yellow-200 underline"
              >
                <FileText className="h-4 w-4 mr-1" /> Політика конфіденційності
              </Link>
            </div>
          </div>
          <div className="border-t border-white/30 mt-8 pt-6 text-center text-white">
            <p>© {new Date().getFullYear()} Ваша Компанія. Всі права захищені.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
