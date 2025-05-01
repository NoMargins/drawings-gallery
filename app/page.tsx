"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Heart,
  Calendar,
  Send,
  CheckCircle,
  Smile,
  Star,
  Gift,
  Camera,
  RefreshCw,
  Flower,
  Cloud,
  Sun,
  Moon,
  Sparkles,
  ImageIcon,
  Trophy,
  Shield,
  FileText,
  Share2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Mail, Phone, User } from "lucide-react"
import { getRecentSubmissions } from "@/lib/data"
import { ShareButtons } from "@/components/share-buttons"
import { SocialShareModal } from "@/components/social-share-modal"
// Додайте імпорт нового компонента
import { ImageUpload } from "@/components/image-upload"

const formSchema = z.object({
  childName: z.string().min(2, {
    message: "Будь ласка, введіть повне ім'я дитини.",
  }),
  childAge: z.string().min(1, {
    message: "Будь ласка, введіть вік дитини.",
  }),
  workCity: z.string().min(2, {
    message: "Будь ласка, введіть місто, де ви працюєте.",
  }),
  officeAddress: z.string().min(2, {
    message: "Будь ласка, введіть адресу магазину або назву офісу.",
  }),
  parentName: z.string().min(2, {
    message: "Будь ласка, введіть ваше ім'я.",
  }),
  contactPhone: z.string().min(10, {
    message: "Будь ласка, введіть дійсний номер телефону.",
  }),
  consent: z.boolean().refine((value) => value === true, {
    message: "Ви повинні погодитися з умовами, щоб подати заявку.",
  }),
})

// Знайдіть функцію BackgroundElements і замініть її на наступну:

function BackgroundElements() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Stars */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            opacity: 0.3,
          }}
        >
          <Star
            size={10 + Math.floor(Math.random() * 14)}
            className={`text-${["yellow", "amber", "orange"][Math.floor(Math.random() * 3)]}-${
              ["300", "400", "500"][Math.floor(Math.random() * 3)]
            } transform rotate-${Math.floor(Math.random() * 45)}`}
            fill="currentColor"
          />
        </div>
      ))}

      {/* Flowers */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`flower-${i}`}
          className="absolute animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 7}s`,
            opacity: 0.3,
          }}
        >
          <Flower
            size={16 + Math.floor(Math.random() * 16)}
            className={`text-${["green", "emerald", "lime", "teal"][Math.floor(Math.random() * 4)]}-${
              ["300", "400", "500"][Math.floor(Math.random() * 3)]
            } transform rotate-${Math.floor(Math.random() * 45)}`}
          />
        </div>
      ))}

      {/* Sparkles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: 0.3,
          }}
        >
          <Sparkles
            size={12 + Math.floor(Math.random() * 10)}
            className={`text-${["blue", "cyan", "sky", "indigo"][Math.floor(Math.random() * 4)]}-${
              ["300", "400"][Math.floor(Math.random() * 2)]
            }`}
          />
        </div>
      ))}

      {/* Clouds */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute animate-float-slow"
          style={{
            top: `${10 + Math.random() * 30}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${30 + Math.random() * 40}s`,
            opacity: 0.2,
          }}
        >
          <Cloud size={30 + Math.floor(Math.random() * 40)} className="text-white" fill="currentColor" />
        </div>
      ))}

      {/* Sun and Moon */}
      <div className="absolute top-[15%] right-[10%] animate-pulse" style={{ animationDuration: "8s", opacity: 0.3 }}>
        <Sun size={40} className="text-yellow-300" fill="currentColor" />
      </div>
      <div
        className="absolute bottom-[20%] left-[8%] animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "2s", opacity: 0.3 }}
      >
        <Moon size={32} className="text-blue-200" fill="currentColor" />
      </div>

      {/* Toy blocks */}
      <div
        className="absolute top-[40%] left-[5%] w-10 h-10 bg-yellow-400 rounded-lg rotate-12 opacity-20 animate-float"
        style={{ animationDuration: "12s" }}
      ></div>
      <div
        className="absolute top-[60%] right-[7%] w-8 h-8 bg-green-400 rounded-lg -rotate-6 opacity-20 animate-float"
        style={{ animationDuration: "15s", animationDelay: "3s" }}
      ></div>
      <div
        className="absolute bottom-[30%] left-[20%] w-12 h-12 bg-blue-400 rounded-lg rotate-45 opacity-20 animate-float"
        style={{ animationDuration: "18s", animationDelay: "5s" }}
      ></div>

      {/* Teddy bear silhouettes */}
      <div className="absolute top-[70%] right-[15%] opacity-20">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-amber-700"
        >
          <path
            d="M12 2C9.79 2 8 3.79 8 6C8 7.2 8.5 8.3 9.4 9C7.4 9.7 6 11.7 6 14C6 16.8 8.2 19 11 19C11.9 19 12.7 18.8 13.4 18.4C14.1 18.8 14.9 19 15.7 19C18.5 19 20.7 16.8 20.7 14C20.7 11.7 19.3 9.7 17.3 9C18.2 8.3 18.7 7.2 18.7 6C18.7 3.79 16.91 2 14.7 2C13.5 2 12.4 2.5 11.7 3.4C11 2.5 9.9 2 8.7 2H12Z"
            fill="currentColor"
          />
          <circle cx="9" cy="6" r="1" fill="white" />
          <circle cx="15" cy="6" r="1" fill="white" />
        </svg>
      </div>
      <div className="absolute top-[25%] left-[25%] opacity-20 animate-float" style={{ animationDuration: "20s" }}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-amber-600"
        >
          <path
            d="M12 2C9.79 2 8 3.79 8 6C8 7.2 8.5 8.3 9.4 9C7.4 9.7 6 11.7 6 14C6 16.8 8.2 19 11 19C11.9 19 12.7 18.8 13.4 18.4C14.1 18.8 14.9 19 15.7 19C18.5 19 20.7 16.8 20.7 14C20.7 11.7 19.3 9.7 17.3 9C18.2 8.3 18.7 7.2 18.7 6C18.7 3.79 16.91 2 14.7 2C13.5 2 12.4 2.5 11.7 3.4C11 2.5 9.9 2 8.7 2H12Z"
            fill="currentColor"
          />
          <circle cx="9" cy="6" r="1" fill="white" />
          <circle cx="15" cy="6" r="1" fill="white" />
        </svg>
      </div>
    </div>
  )
}

export default function ChildrenProtectionDay() {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<z.infer<typeof formSchema> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentAge, setCurrentAge] = useState<number | null>(null)
  const [isUnder14, setIsUnder14] = useState<boolean>(true)
  const [recentSubmissions, setRecentSubmissions] = useState<Array<{ id: string; photoUrl: string }>>([])
  const [participantCount, setParticipantCount] = useState<number>(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childName: "",
      childAge: "",
      workCity: "",
      officeAddress: "",
      parentName: "",
      contactPhone: "",
      consent: false,
    },
  })

  // Load recent submissions and participant count
  useEffect(() => {
    const fetchData = async () => {
      try {
        // В реальному додатку тут був би API запит
        const recent = getRecentSubmissions(4)
        setRecentSubmissions(recent.map((s) => ({ id: s.id, photoUrl: s.photoUrl })))
        setParticipantCount(recent.length > 4 ? recent.length : recent.length + 50) // Add some fake participants for demo
      } catch (error) {
        console.error("Error fetching recent submissions:", error)
      }
    }

    fetchData()
  }, [])

  // Watch for changes in the childAge field
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "childAge" && value.childAge) {
        const age = Number.parseInt(value.childAge as string, 10)
        setCurrentAge(age)
        setIsUnder14(age < 14)
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!previewUrl) {
      alert("Будь ласка, завантажте малюнок вашої дитини")
      return
    }

    setIsSubmitting(true)

    try {
      // Додаємо заявку через API
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          photoUrl: previewUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Помилка при додаванні заявки")
      }

      // Відправляємо сповіщення на email
      await fetch("/api/notifications/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: values.parentName,
          email: "user@example.com", // В реальному додатку тут був би email користувача
          subject: 'Дякуємо за участь у конкурсі "Малюнок для мого Сміливовершника"',
          childName: values.childName,
        }),
      })

      setIsSubmitting(false)
      setUploadStatus("success")
      setSubmittedData(values)

      // Оновлюємо кількість учасників
      setParticipantCount((prev) => prev + 1)
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
      setUploadStatus("error")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create a preview URL
      const fileReader = new FileReader()
      fileReader.onload = () => {
        if (typeof fileReader.result === "string") {
          setPreviewUrl(fileReader.result)
        }
      }
      fileReader.readAsDataURL(file)
    }
  }

  const resetForm = () => {
    form.reset()
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadStatus("idle")
    setSubmittedData(null)
    setCurrentAge(null)
    setIsUnder14(true)
  }

  // Get consent text based on age
  const getConsentText = () => {
    if (isUnder14) {
      return "Так, я є батьком/матір'ю дитини до 14 років і даю згоду на використання малюнка моєї дитини в рамках конкурсу, я розумію та погоджуюся з усіма умовами конкурсу."
    } else {
      return "Так, мені 14+ років, я даю згоду на використання мого малюнка в рамках конкурсу, я розумію та погоджуюся з усіма умовами конкурсу."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 overflow-hidden">
      {/* Decorative background elements */}
      <BackgroundElements />

      {/* Header */}
      <header className="container mx-auto py-4 sm:py-6 px-4 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
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
          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
            <Link href="/gallery">
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-none hover:from-green-600 hover:to-blue-600 rounded-full px-3 sm:px-6 shadow-md text-xs sm:text-sm"
              >
                <ImageIcon className="mr-1 sm:mr-2 h-4 w-4" /> Галерея
              </Button>
            </Link>
            <Link href="/winners">
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none hover:from-yellow-600 hover:to-amber-600 rounded-full px-3 sm:px-6 shadow-md text-xs sm:text-sm"
              >
                <Trophy className="mr-1 sm:mr-2 h-4 w-4" /> Переможці
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-none hover:from-green-600 hover:to-blue-600 rounded-full px-3 sm:px-6 shadow-md text-xs sm:text-sm"
                >
                  <Smile className="mr-1 sm:mr-2 h-4 w-4" /> Контакти
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gradient-to-br from-sky-50 to-green-50 border-2 border-green-200 rounded-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl text-center text-green-600 font-bold">
                    Познайомтеся з нашим менеджером проекту!
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    З будь-яких питань щодо конкурсу "Малюнок для мого Сміливовершника", будь ласка, зв'яжіться:
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4 space-y-4">
                  <div className="flex flex-col items-center gap-3 bg-white p-4 rounded-2xl shadow-inner">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-xl text-green-600">Марта Глушко</h3>
                      <p className="text-sm text-green-400">Менеджер конкурсу "Малюнок для мого Сміливовершника"</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded-2xl shadow-inner">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-green-50">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="font-medium">+38 (050) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-blue-50">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-500" />
                      </div>
                      <span className="font-medium">marta.glushko@yourcompany.com</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-2xl text-sm border-2 border-dashed border-yellow-200">
                    <p className="text-center font-medium text-yellow-700">
                      <Gift className="inline h-4 w-4 mr-1" />
                      Доступна з понеділка по п'ятницю, з 9:00 до 17:00
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <DialogClose asChild>
                    <Button className="rounded-full bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 border-none text-white px-8">
                      Закрити
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
            <SocialShareModal
              title="Конкурс малюнків 'Малюнок для мого Сміливовершника'"
              description="Запрошуємо взяти участь у конкурсі малюнків до Дня захисту дітей!"
              url={typeof window !== "undefined" ? window.location.origin : "https://example.com"}
              hashtags={["ДеньЗахистуДітей", "Сміливовершник", "Конкурс"]}
            >
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 rounded-full px-3 sm:px-6 shadow-md text-xs sm:text-sm"
              >
                <Share2 className="mr-1 sm:mr-2 h-4 w-4" /> Поширити
              </Button>
            </SocialShareModal>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Left Column - Image Preview or Hero Content */}
          <div className="space-y-4 sm:space-y-6">
            {uploadStatus === "success" ? (
              /* Show uploaded image after successful submission */
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-green-400 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-md">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>Успішно завантажено!</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
                  Дякуємо за надісланий малюнок <span className="text-blue-500">{submittedData?.childName}</span>!
                </h2>
                <p className="text-base sm:text-lg text-green-600">
                  Малюнок вашої дитини буде включено до галереї конкурсу "Малюнок для мого Сміливовершника".
                </p>

                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-yellow-300 rounded-2xl transform rotate-2"></div>
                  <div className="absolute -top-2 -left-2 w-full h-full bg-sky-300 rounded-2xl transform -rotate-1"></div>
                  <div className="relative z-10 border-4 border-white rounded-2xl shadow-xl overflow-hidden aspect-[4/3] w-full max-w-lg mx-auto">
                    {previewUrl && (
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Малюнок вашої дитини"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">
                  <Button
                    onClick={resetForm}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-full px-6 py-2 text-white font-medium shadow-md"
                  >
                    <Camera className="mr-2 h-5 w-5" /> Надіслати ще один малюнок
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-white rounded-xl shadow-md">
                  <h3 className="text-lg font-bold text-green-700 mb-2 flex items-center">
                    <Share2 className="mr-2 h-5 w-5 text-green-500" /> Поділіться своєю участю
                  </h3>
                  <p className="text-sm text-green-600 mb-3">
                    Розкажіть друзям про конкурс та запросіть їх взяти участь!
                  </p>
                  <ShareButtons
                    url={`${window.location.origin}`}
                    title="Я взяв участь у конкурсі малюнків 'Малюнок для мого Сміливовершника'!"
                    hashtags={["ДеньЗахистуДітей", "Сміливовершник", "Конкурс"]}
                  />
                </div>
              </div>
            ) : (
              /* Show default content before submission */
              <>
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-green-400 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-md">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>1 червня - День захисту дітей</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-700 leading-tight">
                  Конкурс малюнків <span className="text-blue-500">"Малюнок для мого Сміливовершника"</span>
                </h1>
                <p className="text-base sm:text-lg text-green-600">
                  Запрошуємо наших маленьких митців намалювати малюнок для українського Сміливовершника — так, як його
                  уявляє дитина: сміливий, добрий, наповнений любов'ю до Батьківщини!
                </p>

                <div className="bg-white p-3 sm:p-4 rounded-xl border-2 border-yellow-200 shadow-md">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Shield className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500" />
                    <div>
                      <h3 className="font-bold text-green-700 text-sm sm:text-base">Особлива ініціатива</h3>
                      <p className="text-green-600 text-xs sm:text-sm">
                        Ваші малюнки стануть частиною особливого проекту до Дня захисту дітей та Дня Захисника України!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex -space-x-4">
                    {recentSubmissions.length > 0
                      ? recentSubmissions.map((submission, i) => (
                          <div
                            key={submission.id}
                            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-white overflow-hidden shadow-md"
                          >
                            <Image
                              src={submission.photoUrl || `/placeholder.svg?height=48&width=48&text=${i + 1}`}
                              alt={`Учасник ${i + 1}`}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))
                      : [...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-white overflow-hidden shadow-md"
                          >
                            <Image
                              src={`/placeholder.svg?height=48&width=48&text=${i + 1}`}
                              alt={`Учасник ${i + 1}`}
                              width={48}
                              height={48}
                            />
                          </div>
                        ))}
                  </div>
                  <p className="text-xs sm:text-sm bg-white px-3 sm:px-4 py-2 rounded-full shadow-md text-green-600 font-medium">
                    <span className="font-bold text-blue-500">{participantCount}+ учасників</span> вже приєдналися до
                    конкурсу!
                  </p>
                </div>

                {/* Image Preview Area */}
                {previewUrl && (
                  <div className="relative mt-4 sm:mt-6">
                    <div className="absolute -top-4 -left-4 w-full h-full bg-yellow-300 rounded-2xl transform rotate-2"></div>
                    <div className="absolute -top-2 -left-2 w-full h-full bg-sky-300 rounded-2xl transform -rotate-1"></div>
                    <div className="relative z-10 border-4 border-white rounded-2xl shadow-xl overflow-hidden aspect-[4/3] w-full max-w-lg mx-auto">
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Попередній перегляд"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Form or Status */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl border-4 border-green-200 relative">
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
              <Star className="h-8 w-8 text-yellow-600" fill="currentColor" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-sky-300 rounded-full flex items-center justify-center shadow-lg transform -rotate-12">
              <Star className="h-8 w-8 text-sky-600" fill="currentColor" />
            </div>

            {uploadStatus === "idle" && (
              <>
                <div className="mb-4 sm:mb-6 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-center text-green-600 flex items-center justify-center">
                    <Heart className="mr-2 h-5 sm:h-6 w-5 sm:w-6 text-blue-500" fill="currentColor" />
                    Форма реєстрації
                    <Heart className="ml-2 h-5 sm:h-6 w-5 sm:w-6 text-blue-500" fill="currentColor" />
                  </h2>
                  <p className="text-center text-green-500 text-sm sm:text-base">
                    Будь ласка, заповніть цю форму, щоб взяти участь у конкурсі малюнків "Малюнок для мого
                    Сміливовершника"!
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <FormField
                      control={form.control}
                      name="childName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-600 font-medium">Повне ім'я дитини</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Прізвище, Ім'я"
                              {...field}
                              className="rounded-xl border-2 border-green-200 focus:border-green-400 focus:ring-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="childAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-600 font-medium">Вік дитини</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Вік"
                              {...field}
                              className="rounded-xl border-2 border-green-200 focus:border-green-400 focus:ring-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                          {currentAge !== null && (
                            <div className="text-xs text-green-500 mt-1">
                              {isUnder14
                                ? "Потрібна згода батьків для дітей до 14 років"
                                : "Дозволена власна згода для віку 14 і старше"}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="workCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-600 font-medium">Місто (де ви працюєте)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Місто"
                                {...field}
                                className="rounded-xl border-2 border-green-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="officeAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-600 font-medium">Назва магазину/офісу</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Назва магазину або офісу"
                                {...field}
                                className="rounded-xl border-2 border-green-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="parentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-600 font-medium">
                              {isUnder14 ? "Ім'я батька/матері" : "Ваше ім'я"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={isUnder14 ? "Ім'я батька/матері" : "Ваше ім'я"}
                                {...field}
                                className="rounded-xl border-2 border-green-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-600 font-medium">Контактний телефон</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ваш номер телефону"
                                {...field}
                                className="rounded-xl border-2 border-green-200 focus:border-green-400 focus:ring-green-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <ImageUpload
                        onImageSelected={(url) => setPreviewUrl(url)}
                        previewUrl={previewUrl}
                        childName={form.getValues("childName") || "unknown"}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border-2 border-green-200 p-3 sm:p-4 bg-green-50">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-2 border-green-300 text-green-600 focus:ring-green-500"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-green-700 text-sm sm:text-base">{getConsentText()}</FormLabel>
                            <FormDescription className="text-green-500 text-xs sm:text-sm">
                              Ваші дані будуть оброблені відповідно до нашої політики конфіденційності та будуть
                              використані лише для цього конкурсу.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl py-4 sm:py-6 text-base sm:text-lg font-bold shadow-lg border-none"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Завантаження...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" /> Надіслати малюнок
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            )}

            {uploadStatus === "success" && (
              <div className="text-center py-4 sm:py-6 space-y-4 sm:space-y-6">
                <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-green-600">Реєстрація завершена!</h2>
                <p className="text-green-500 text-sm sm:text-base">
                  Дякуємо за надісланий малюнок! Ваша заявка прийнята та буде розглянута модераторами.
                </p>
                <div className="bg-green-50 p-3 sm:p-4 rounded-xl border-2 border-green-100">
                  <p className="text-green-700 font-medium text-sm sm:text-base">
                    Ваша заявка підтверджена з наступними деталями:
                  </p>
                  <ul className="text-left mt-3 space-y-1 text-green-600 text-xs sm:text-sm">
                    <li>
                      <span className="font-medium">Дитина:</span> {submittedData?.childName}, Вік:{" "}
                      {submittedData?.childAge}
                    </li>
                    <li>
                      <span className="font-medium">Місцезнаходження:</span> {submittedData?.workCity},{" "}
                      {submittedData?.officeAddress}
                    </li>
                    <li>
                      <span className="font-medium">Контакт:</span> {submittedData?.parentName},{" "}
                      {submittedData?.contactPhone}
                    </li>
                  </ul>
                </div>
                <div className="relative mt-4 sm:mt-6">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-yellow-300 rounded-2xl transform rotate-2"></div>
                  <div className="absolute -top-2 -left-2 w-full h-full bg-sky-300 rounded-2xl transform -rotate-1"></div>
                  <div className="relative z-10 border-4 border-white rounded-2xl shadow-xl overflow-hidden aspect-[4/3] w-full max-w-lg mx-auto">
                    {previewUrl && (
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Малюнок вашої дитини"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-center mt-4 sm:mt-6">
                  <Button
                    onClick={resetForm}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl py-3 sm:py-4 px-4 sm:px-6 text-white font-bold shadow-lg border-none"
                  >
                    Надіслати ще один малюнок
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-green-600 mt-2 sm:mt-4">
                  Після перевірки модераторами, малюнок буде опубліковано в галереї. Ми повідомимо вас про це окремо.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-6 sm:py-8 mt-8 sm:mt-12 rounded-t-3xl relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center">
                <Gift className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                Про конкурс
              </h3>
              <p className="text-white text-sm sm:text-base">
                Конкурс малюнків "Малюнок для мого Сміливовершника" присвячений Дню захисту дітей. Малюнки будуть
                використані для створення особливого проекту до Дня захисту дітей та Дня Захисника України.
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center">
                <Trophy className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                Нагородження
              </h3>
              <p className="text-white text-sm sm:text-base">
                Переможці будуть оголошені 1 червня. У кожній віковій категорії буде обрано трьох переможців, які
                отримають подарунки.
              </p>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center">
                <Heart className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                Конфіденційність
              </h3>
              <p className="text-white text-sm sm:text-base">
                Вся надана інформація буде використовуватися виключно для конкурсу "Малюнок для мого Сміливовершника" і
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
            <p className="text-sm sm:text-base">© {new Date().getFullYear()} Ваша Компанія. Всі права захищені.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
