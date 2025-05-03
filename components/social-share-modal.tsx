"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareButtons } from "@/components/share-buttons"
import { Copy, Check } from "lucide-react"

interface SocialShareModalProps {
  title: string
  description: string
  url: string
  imageUrl?: string
  hashtags?: string[]
  children: React.ReactNode
}

export function SocialShareModal({
  title,
  description,
  url,
  imageUrl,
  hashtags = [],
  children,
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const embedCode = `<iframe src="${url}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Поділитися</DialogTitle>
          <DialogDescription>
            Поділіться конкурсом «Шеврон для мого захисника» з друзями та колегами
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="social" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Соцмережі</TabsTrigger>
            <TabsTrigger value="link">Посилання</TabsTrigger>
            <TabsTrigger value="embed">Вбудувати</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="mt-4">
            <div className="space-y-4">
              {imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <img src={imageUrl || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
                </div>
              )}

              <div className="text-center">
                <h3 className="font-medium text-sm mb-2">Поділіться в соціальних мережах</h3>
                <ShareButtons url={url} title={title} hashtags={hashtags} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="grid flex-1">
                  <Label htmlFor="link" className="sr-only">
                    Посилання
                  </Label>
                  <Input id="link" defaultValue={url} readOnly className="h-9" />
                </div>
                <Button size="sm" onClick={handleCopyLink} className="px-3">
                  <span className="sr-only">Копіювати</span>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Скопіюйте посилання вище, щоб поділитися конкурсом через месенджери або електронну пошту
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="grid flex-1">
                  <Label htmlFor="embed" className="sr-only">
                    Код для вбудовування
                  </Label>
                  <Input id="embed" defaultValue={embedCode} readOnly className="h-9 font-mono text-xs" />
                </div>
                <Button size="sm" onClick={handleCopyEmbed} className="px-3">
                  <span className="sr-only">Копіювати</span>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Скопіюйте код вище, щоб вбудувати конкурс на свій веб-сайт або блог
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
