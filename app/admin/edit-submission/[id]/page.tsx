"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, AlertCircle, X } from "lucide-react"
import { getSubmissionById } from "@/lib/data"
import type { ChildSubmission } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"

export default function EditSubmission() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [submission, setSubmission] = useState<ChildSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Form fields
  const [childName, setChildName] = useState("")
  const [childAge, setChildAge] = useState("")
  const [workCity, setWorkCity] = useState("")
  const [officeAddress, setOfficeAddress] = useState("")
  const [parentName, setParentName] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  useEffect(() => {
    // Load submission data
    const foundSubmission = getSubmissionById(id)

    if (foundSubmission) {
      setSubmission(foundSubmission)
      setChildName(foundSubmission.childName)
      setChildAge(foundSubmission.childAge)
      setWorkCity(foundSubmission.workCity)
      setOfficeAddress(foundSubmission.officeAddress)
      setParentName(foundSubmission.parentName)
      setContactPhone(foundSubmission.contactPhone)
      setPreviewUrl(foundSubmission.photoUrl)
    } else {
      setError("Заявку не знайдено")
    }

    setLoading(false)
  }, [id])

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

  const handleSave = async () => {
    if (!submission) return

    try {
      // В реальному додатку тут був би API запит для оновлення заявки
      const response = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childName,
          childAge,
          workCity,
          officeAddress,
          parentName,
          contactPhone,
          photoUrl: previewUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Помилка при оновленні заявки")
      }

      const data = await response.json()

      if (data.success) {
        setSubmission(data.data)
        setSuccess("Зміни успішно збережено")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Помилка при збереженні змін")
        setTimeout(() => setError(""), 3000)
      }
    } catch (error) {
      console.error("Error updating submission:", error)
      setError("Помилка при збереженні змін")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleDownloadImage = () => {
    if (!submission?.photoUrl) return

    // Create a temporary link to download the image
    const link = document.createElement("a")
    link.href = submission.photoUrl
    link.download = `${submission.childName}_${submission.childAge}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClose = () => {
    router.push("/admin/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-green-700">Завантаження...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 p-4">
        <div className="container mx-auto max-w-4xl">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={handleClose} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Повернутися до панелі адміністратора
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          onClick={handleClose}
          className="mb-4 flex items-center gap-2 bg-white text-green-700 border border-green-200 hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" /> Повернутися до панелі адміністратора
        </Button>

        {success && (
          <Alert className="mb-4 bg-green-100 border-green-500 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card className="border-2 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">Редагування заявки</CardTitle>
            <CardDescription>Редагуйте інформацію про учасника та його малюнок</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="childName" className="text-green-600">
                    Повне ім'я дитини
                  </Label>
                  <Input
                    id="childName"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="border-2 border-green-200"
                  />
                </div>

                <div>
                  <Label htmlFor="childAge" className="text-green-600">
                    Вік дитини
                  </Label>
                  <Input
                    id="childAge"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="border-2 border-green-200"
                  />
                </div>

                <div>
                  <Label htmlFor="workCity" className="text-green-600">
                    Місто
                  </Label>
                  <Input
                    id="workCity"
                    value={workCity}
                    onChange={(e) => setWorkCity(e.target.value)}
                    className="border-2 border-green-200"
                  />
                </div>

                <div>
                  <Label htmlFor="officeAddress" className="text-green-600">
                    Офіс/Магазин
                  </Label>
                  <Input
                    id="officeAddress"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    className="border-2 border-green-200"
                  />
                </div>

                <div>
                  <Label htmlFor="parentName" className="text-green-600">
                    Ім'я батька/матері
                  </Label>
                  <Input
                    id="parentName"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="border-2 border-green-200"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone" className="text-green-600">
                    Контактний телефон
                  </Label>
                  <Input
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="border-2 border-green-200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-green-600">Малюнок</Label>
                <ImageUpload
                  onImageSelected={(url) => setPreviewUrl(url)}
                  previewUrl={previewUrl}
                  childName={childName}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 flex items-center gap-2"
            >
              <X className="h-4 w-4" /> Закрити
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-105 transition-transform active:scale-95"
            >
              <Save className="h-4 w-4 mr-2" /> Зберегти зміни
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
