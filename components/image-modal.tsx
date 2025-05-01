"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface ImageModalProps {
  children: React.ReactNode
  src: string
  alt: string
}

export function ImageModal({ children, src, alt }: ImageModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer transition-transform hover:scale-105">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full max-h-[80vh] flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={800}
              height={600}
              className="object-contain max-h-[80vh]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
