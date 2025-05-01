"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  LogOut,
  CheckCircle,
  Eye,
  Upload,
  UploadCloud,
  Filter,
  Search,
  User,
  MapPin,
  Phone,
  Building,
  Calendar,
  Award,
  Download,
  Edit,
  BarChart2,
  Share2,
} from "lucide-react"
import { getAllSubmissions, publishSubmission } from "@/lib/data"
import type { ChildSubmission, AgeCategory } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SocialShareModal } from "@/components/social-share-modal"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<ChildSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ChildSubmission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [ageFilter, setAgeFilter] = useState<AgeCategory | "all">("all")
  const [publishStatus, setPublishStatus] = useState<"all" | "published" | "unpublished">("all")
  const [alert, setAlert] = useState<{ show: boolean; message: string }>({ show: false, message: "" })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load submissions
    fetchSubmissions()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...submissions]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.workCity.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by age category
    if (ageFilter !== "all") {
      filtered = filtered.filter((s) => s.ageCategory === ageFilter)
    }

    // Filter by publish status
    if (publishStatus === "published") {
      filtered = filtered.filter((s) => s.isPublished)
    } else if (publishStatus === "unpublished") {
      filtered = filtered.filter((s) => !s.isPublished)
    }

    setFilteredSubmissions(filtered)
  }, [searchTerm, ageFilter, publishStatus, submissions])

  const fetchSubmissions = async () => {
    try {
      // В реальному додатку тут був би API запит
      // Для демо використовуємо локальні дані
      const allSubmissions = getAllSubmissions()
      setSubmissions(allSubmissions)
      setFilteredSubmissions(allSubmissions)
    } catch (error) {
      console.error("Error fetching submissions:", error)
      showAlert("Помилка при завантаженні заявок")
    }
  }

  const handleEditSubmission = (id: string) => {
    router.push(`/admin/edit-submission/${id}`)
  }

  const handleExportAllData = async () => {
    try {
      // В реальному додатку тут був би API запит
      // Для демо створюємо CSV локально
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "ID,Ім'я дитини,Вік,Місто,Офіс,Ім'я батьків,Телефон,Опубліковано,Голоси\n" +
        submissions
          .map(
            (s) =>
              `${s.id},"${s.childName}",${s.childAge},"${s.workCity}","${s.officeAddress}","${s.parentName}","${s.contactPhone}",${s.isPublished},${s.votes}`,
          )
          .join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `submissions_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting data:", error)
      showAlert("Помилка при експорті даних")
    }
  }

  const handleExportAllImages = () => {
    // В реальному додатку тут був би API запит для створення ZIP-архіву
    showAlert("В реальному додатку ця функція створила б ZIP-архів з усіма малюнками, підписаними як 'ПІБ_вік.jpg'")
  }

  const handlePublish = async (id: string) => {
    try {
      setIsLoading(true)
      // В реальному додатку тут був би API запит
      // Для демо використовуємо локальну функцію
      const updatedSubmission = publishSubmission(id)

      if (updatedSubmission) {
        setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, isPublished: true } : s)))
        showAlert("Малюнок успішно опубліковано!")
      } else {
        showAlert("Помилка при публікації малюнка")
      }
    } catch (error) {
      console.error("Error publishing submission:", error)
      showAlert("Помилка при публікації малюнка")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublishAll = async () => {
    try {
      setIsLoading(true)
      // В реальному додатку тут був би API запит
      const response = await fetch("/api/admin/publish-all", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.data)
        showAlert("Всі малюнки успішно опубліковано!")
      } else {
        showAlert("Помилка при публікації малюнків")
      }
    } catch (error) {
      console.error("Error publishing all submissions:", error)
      showAlert("Помилка при публікації малюнків")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewGallery = () => {
    router.push("/gallery")
  }

  const handleViewWinners = () => {
    router.push("/winners")
  }

  const handleViewAnalytics = () => {
    router.push("/admin/analytics")
  }

  const showAlert = (message: string) => {
    setAlert({ show: true, message })
    setTimeout(() => setAlert({ show: false, message: "" }), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100">
      {alert.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="bg-green-100 border-green-500 text-green-800">
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-xl font-bold text-green-700">Адмін-панель конкурсу "Малюнок для мого Сміливовершника"</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-green-600">
              Вітаємо, <span className="font-medium">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="border-green-200 text-green-700">
              <LogOut className="h-4 w-4 mr-2" />
              Вийти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-green-700">Управління малюнками</h2>
            <p className="text-green-600">Перегляд та публікація малюнків на конкурс</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleViewGallery} className="border-green-200 text-green-700">
              <Eye className="h-4 w-4 mr-2" />
              Переглянути галерею
            </Button>
            <Button variant="outline" onClick={handleViewWinners} className="border-green-200 text-green-700">
              <Award className="h-4 w-4 mr-2" />
              Переможці
            </Button>
            <Button variant="outline" onClick={handleViewAnalytics} className="border-green-200 text-green-700">
              <BarChart2 className="h-4 w-4 mr-2" />
              Аналітика
            </Button>
            <SocialShareModal
              title="Конкурс малюнків 'Малюнок для мого Сміливовершника'"
              description="Запрошуємо взяти участь у конкурсі малюнків до Дня захисту дітей!"
              url={typeof window !== "undefined" ? window.location.origin : "https://example.com"}
              hashtags={["ДеньЗахистуДітей", "Сміливовершник", "Конкурс"]}
            >
              <Button variant="outline" className="border-green-200 text-green-700">
                <Share2 className="h-4 w-4 mr-2" />
                Поширити
              </Button>
            </SocialShareModal>
            <Button variant="outline" onClick={handleExportAllData} className="border-green-200 text-green-700">
              <Download className="h-4 w-4 mr-2" />
              Експорт даних
            </Button>
            <Button variant="outline" onClick={handleExportAllImages} className="border-green-200 text-green-700">
              <Download className="h-4 w-4 mr-2" />
              Експорт малюнків
            </Button>
            <Button
              onClick={handlePublishAll}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              disabled={isLoading}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              {isLoading ? "Публікація..." : "Опублікувати всі"}
            </Button>
          </div>
        </div>

        <Card className="mb-6 border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                <Input
                  placeholder="Пошук за ім'ям або містом"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-green-200"
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="w-48">
                  <Select value={ageFilter} onValueChange={(value) => setAgeFilter(value as AgeCategory | "all")}>
                    <SelectTrigger className="border-green-200">
                      <Filter className="h-4 w-4 mr-2 text-green-500" />
                      <SelectValue placeholder="Вікова категорія" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Всі категорії</SelectItem>
                      <SelectItem value="0-5">0-5 років</SelectItem>
                      <SelectItem value="6-8">6-8 років</SelectItem>
                      <SelectItem value="9-12">9-12 років</SelectItem>
                      <SelectItem value="13-18">13-18 років</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-48">
                  <Select
                    value={publishStatus}
                    onValueChange={(value) => setPublishStatus(value as "all" | "published" | "unpublished")}
                  >
                    <SelectTrigger className="border-green-200">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <SelectValue placeholder="Статус публікації" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Всі малюнки</SelectItem>
                      <SelectItem value="published">Опубліковані</SelectItem>
                      <SelectItem value="unpublished">Неопубліковані</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="text-sm text-green-600 mb-2">Знайдено малюнків: {filteredSubmissions.length}</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden border-2 border-green-200">
              <div className="relative h-48 w-full">
                <Image
                  src={submission.photoUrl || "/placeholder.svg"}
                  alt={submission.childName}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={submission.isPublished ? "bg-green-500" : "bg-yellow-500"}>
                    {submission.isPublished ? "Опубліковано" : "Очікує публікації"}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-blue-500">
                    {submission.ageCategory === "0-5"
                      ? "0-5 років"
                      : submission.ageCategory === "6-8"
                        ? "6-8 років"
                        : submission.ageCategory === "9-12"
                          ? "9-12 років"
                          : "13-18 років"}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-lg font-bold text-green-700">{submission.childName}</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center text-green-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Вік: {submission.childAge} років</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Місто: {submission.workCity}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>Офіс: {submission.officeAddress}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center text-green-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>Контакт: {submission.parentName}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{submission.contactPhone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="text-sm text-green-600">
                  Голосів: <span className="font-bold">{submission.votes}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditSubmission(submission.id)}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!submission.isPublished && (
                    <Button
                      onClick={() => handlePublish(submission.id)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isLoading ? "..." : "Опублікувати"}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Search className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Малюнків не знайдено</h3>
            <p className="text-green-600 mt-2">Спробуйте змінити параметри фільтрації або пошуку</p>
          </div>
        )}
      </main>
    </div>
  )
}
