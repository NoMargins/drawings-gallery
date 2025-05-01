"use client"

import { Facebook, Twitter, Linkedin, Mail, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareButtonsProps {
  url: string
  title: string
  hashtags?: string[]
}

export function ShareButtons({ url, title, hashtags = [] }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedHashtags = hashtags.join(",")

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank")
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
      "_blank",
    )
  }

  const shareOnLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank")
  }

  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: title,
          url: url,
        })
      } catch (error) {
        console.error("Помилка при спробі поділитися:", error)
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        onClick={shareOnFacebook}
        size="sm"
        variant="outline"
        className="rounded-full bg-blue-600 text-white hover:bg-blue-700 border-none"
      >
        <Facebook className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>

      <Button
        onClick={shareOnTwitter}
        size="sm"
        variant="outline"
        className="rounded-full bg-sky-500 text-white hover:bg-sky-600 border-none"
      >
        <Twitter className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>

      <Button
        onClick={shareOnLinkedin}
        size="sm"
        variant="outline"
        className="rounded-full bg-blue-700 text-white hover:bg-blue-800 border-none"
      >
        <Linkedin className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>

      <Button
        onClick={shareByEmail}
        size="sm"
        variant="outline"
        className="rounded-full bg-green-600 text-white hover:bg-green-700 border-none"
      >
        <Mail className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Email</span>
      </Button>

      {navigator.share && (
        <Button
          onClick={shareNative}
          size="sm"
          variant="outline"
          className="rounded-full bg-purple-600 text-white hover:bg-purple-700 border-none"
        >
          <Share2 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Поділитися</span>
        </Button>
      )}
    </div>
  )
}
