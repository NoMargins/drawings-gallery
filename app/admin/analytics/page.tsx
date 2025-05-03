"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart2, Users, Award, MapPin, Calendar, TrendingUp, Download } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Pie, Line } from "react-chartjs-2"

// Реєструємо компоненти ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

export default function AdminAnalytics() {
  const { user } = useAuth()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/analytics")

        if (!response.ok) {
          throw new Error("Помилка при отриманні аналітичних даних")
        }

        const data = await response.json()
        setAnalyticsData(data.data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setError("Не вдалося завантажити аналітичні дані")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const handleBack = () => {
    router.push("/admin/dashboard")
  }

  const handleExportAnalytics = () => {
    if (!analyticsData) return

    // Створюємо CSV з аналітичними даними
    const csvContent = [
      "Тип даних,Значення",
      `Всього заявок,${analyticsData.totalSubmissions}`,
      `Опубліковано заявок,${analyticsData.publishedSubmissions}`,
      `Всього голосів,${analyticsData.totalVotes}`,
      "\nРозподіл за віковими категоріями",
      "Категорія,Кількість",
      ...(analyticsData.submissionsByCategory || []).map((item: any) => `${item._id},${item.count}`),
      "\nРозподіл за містами",
      "Місто,Кількість",
      ...(analyticsData.submissionsByCity || []).map((item: any) => `${item._id},${item.count}`),
      "\nТоп заявок за голосами",
      "Ім'я,Вік,Місто,Голоси",
      ...(analyticsData.topVotedSubmissions || []).map(
        (item: any) => `${item.childName},${item.childAge},${item.workCity},${item.votes}`,
      ),
      "\nРозподіл за датами",
      "Дата,Кількість",
      ...(analyticsData.submissionsByDate || []).map((item: any) => `${item._id},${item.count}`),
    ].join("\n")

    // Створюємо Blob і посилання для завантаження
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `analytics_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Підготовка даних для графіків
  const categoryChartData = {
    labels:
      analyticsData?.submissionsByCategory?.map((item: any) =>
        item._id === "0-5"
          ? "0-5 років"
          : item._id === "6-8"
            ? "6-8 років"
            : item._id === "9-12"
              ? "9-12 років"
              : "13-18 років",
      ) || [],
    datasets: [
      {
        label: "Кількість заявок",
        data: analyticsData?.submissionsByCategory?.map((item: any) => item.count) || [],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
        borderWidth: 1,
      },
    ],
  }

  const cityChartData = {
    labels: analyticsData?.submissionsByCity?.map((item: any) => item._id) || [],
    datasets: [
      {
        label: "Кількість заявок",
        data: analyticsData?.submissionsByCity?.map((item: any) => item.count) || [],
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FFC107",
          "#F44336",
          "#9C27B0",
          "#3F51B5",
          "#009688",
          "#FF5722",
          "#795548",
          "#607D8B",
        ],
        borderWidth: 1,
      },
    ],
  }

  const timelineChartData = {
    labels: analyticsData?.submissionsByDate?.map((item: any) => item._id) || [],
    datasets: [
      {
        label: "Кількість заявок",
        data: analyticsData?.submissionsByDate?.map((item: any) => item.count) || [],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-green-700">Завантаження аналітичних даних...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 p-4">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={handleBack} className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Повернутися до панелі адміністратора
          </Button>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">
                <p className="text-xl font-bold">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Спробувати знову
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 p-4">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 bg-white text-green-700 border border-green-200 hover:bg-green-50"
          >
            <ArrowLeft className="h-4 w-4" /> Повернутися до панелі адміністратора
          </Button>

          <Button
            onClick={handleExportAnalytics}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4" /> Експорт аналітики
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-700">Аналітика конкурсу</h1>
          <p className="text-green-600">Детальна статистика та аналіз конкурсу «Шеврон для мого захисника»</p>
        </div>

        {/* Загальна статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всього заявок</p>
                  <p className="text-3xl font-bold text-green-700">{analyticsData?.totalSubmissions || 0}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Опубліковано</p>
                  <p className="text-3xl font-bold text-blue-700">{analyticsData?.publishedSubmissions || 0}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <BarChart2 className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всього голосів</p>
                  <p className="text-3xl font-bold text-amber-700">{analyticsData?.totalVotes || 0}</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <Award className="h-6 w-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Міст</p>
                  <p className="text-3xl font-bold text-purple-700">{analyticsData?.submissionsByCity?.length || 0}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <MapPin className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Графіки */}
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList className="bg-white border-2 border-green-200">
            <TabsTrigger value="categories" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Вікові категорії
            </TabsTrigger>
            <TabsTrigger value="cities" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Міста
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Часова шкала
            </TabsTrigger>
            <TabsTrigger value="top" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Топ заявок
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Розподіл заявок за віковими категоріями</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <Pie
                      data={categoryChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: true,
                            text: "Розподіл за віковими категоріями",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cities">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Розподіл заявок за містами</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar
                    data={cityChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: true,
                          text: "Топ-10 міст за кількістю заявок",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Динаміка подання заявок</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line
                    data={timelineChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: true,
                          text: "Кількість заявок за датами",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Топ-10 заявок за кількістю голосів</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-green-100">
                        <th className="p-2 text-left border border-green-200">Ім'я дитини</th>
                        <th className="p-2 text-left border border-green-200">Вік</th>
                        <th className="p-2 text-left border border-green-200">Місто</th>
                        <th className="p-2 text-left border border-green-200">Голоси</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData?.topVotedSubmissions?.map((item: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-green-50"}>
                          <td className="p-2 border border-green-200">{item.childName}</td>
                          <td className="p-2 border border-green-200">{item.childAge}</td>
                          <td className="p-2 border border-green-200">{item.workCity}</td>
                          <td className="p-2 border border-green-200 font-bold">{item.votes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Додаткова статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Конверсія
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Відсоток опублікованих заявок</p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{
                          width: `${
                            analyticsData?.totalSubmissions
                              ? ((analyticsData.publishedSubmissions / analyticsData.totalSubmissions) * 100).toFixed(0)
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 font-bold">
                      {analyticsData?.totalSubmissions
                        ? ((analyticsData.publishedSubmissions / analyticsData.totalSubmissions) * 100).toFixed(0)
                        : 0}
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Середня кількість голосів на заявку</p>
                  <p className="text-2xl font-bold text-green-700">
                    {analyticsData?.publishedSubmissions
                      ? (analyticsData.totalVotes / analyticsData.publishedSubmissions).toFixed(1)
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Активність
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Найактивніший день</p>
                  <p className="text-xl font-bold text-green-700">
                    {analyticsData?.submissionsByDate?.sort((a: any, b: any) => b.count - a.count)[0]?._id ||
                      "Немає даних"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analyticsData?.submissionsByDate?.sort((a: any, b: any) => b.count - a.count)[0]?.count || 0}{" "}
                    заявок
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Найпопулярніша вікова категорія</p>
                  <p className="text-xl font-bold text-green-700">
                    {analyticsData?.submissionsByCategory?.sort((a: any, b: any) => b.count - a.count)[0]?._id === "0-5"
                      ? "0-5 років"
                      : analyticsData?.submissionsByCategory?.sort((a: any, b: any) => b.count - a.count)[0]?._id ===
                          "6-8"
                        ? "6-8 років"
                        : analyticsData?.submissionsByCategory?.sort((a: any, b: any) => b.count - a.count)[0]?._id ===
                            "9-12"
                          ? "9-12 років"
                          : "13-18 років" || "Немає даних"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analyticsData?.submissionsByCategory?.sort((a: any, b: any) => b.count - a.count)[0]?.count || 0}{" "}
                    заявок
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
