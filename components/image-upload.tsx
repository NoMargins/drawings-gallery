"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, RefreshCw, X } from "lucide-react"

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void
  previewUrl: string | null
  childName?: string
}

export function ImageUpload({ onImageSelected, previewUrl, childName = "unknown" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Перевірка розміру файлу (максимум 10 МБ)
      if (file.size > 10 * 1024 * 1024) {
        setError("Розмір файлу перевищує допустимий ліміт (10 МБ)")
        return
      }

      // Перевірка типу файлу
      if (!file.type.startsWith("image/")) {
        setError("Дозволені тільки зображення")
        return
      }

      setIsUploading(true)
      setError(null)

      try {
        // Створюємо FormData для завантаження файлу
        const formData = new FormData()
        formData.append("file", file)
        formData.append("childName", childName)

        // Відправляємо файл на сервер
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (data.success) {
          onImageSelected(data.photoUrl)
        } else {
          setError(data.error || "Помилка при завантаженні файлу")
        }
      } catch (error) {
        console.error("Error uploading file:", error)
        setError("Помилка при завантаженні файлу")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleRemoveImage = () => {
    onImageSelected("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="picture" className="block text-green-600 font-medium">
        Завантажте малюнок вашої дитини
      </Label>

      {previewUrl ? (
        <div className="relative">
          <div className="relative aspect-[4/3] w-full border-2 border-green-200 rounded-md overflow-hidden">
            <Image src={previewUrl || "/placeholder.svg"} alt="Попередній перегляд" fill className="object-contain" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-xl border-2 border-green-200 focus:border-green-400 focus:ring-green-400"
            disabled={isUploading}
            ref={fileInputRef}
          />
          {isUploading && <RefreshCw className="h-5 w-5 animate-spin text-green-500" />}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!previewUrl && !isUploading && (
        <div className="w-full h-48 border-2 border-dashed border-green-200 rounded-xl flex flex-col items-center justify-center bg-green-50">
          <Camera className="h-12 w-12 text-green-300 mb-2" />
          <p className="text-green-500 text-sm">Завантажте малюнок або перетягніть файл сюди</p>
          <p className="text-green-400 text-xs mt-1">Максимальний розмір файлу: 10 МБ</p>
        </div>
      )}
    </div>
  )
}
