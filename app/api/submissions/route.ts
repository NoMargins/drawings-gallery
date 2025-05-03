// drawings-gallery\app\api\submissions\route.ts
import { type NextRequest, NextResponse } from "next/server"
import {
  getAllSubmissionsFromDb,
  getSubmissionsByCategoryFromDb,
  getPublishedSubmissionsFromDb,
  addSubmissionToDb,
} from "@/lib/db-service"
import type { AgeCategory } from "@/lib/types"
import { IncomingForm } from "formidable"
import path from "path"
import fs from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

// GET /api/submissions - отримати всі заявки (для адмін-панелі)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") as AgeCategory | null
    const publishedOnly = searchParams.get("published") === "true"

    let submissions

    if (category) {
      submissions = await getSubmissionsByCategoryFromDb(category)
    } else if (publishedOnly) {
      submissions = await getPublishedSubmissionsFromDb()
    } else {
      submissions = await getAllSubmissionsFromDb()
    }

    return NextResponse.json({ success: true, data: submissions })
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json({ success: false, error: "Помилка при отриманні заявок" }, { status: 500 })
  }
}

// POST /api/submissions - додати нову заявку
export async function POST(request: NextRequest) {
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "public/uploads"),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filename: (_, file) => `${Date.now()}-${file.originalFilename}`,
  })

  const { fields, files }: any = await new Promise((resolve, reject) => {
    form.parse(request as any, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })

  const image = files?.image?.[0]
  const photoUrl = `/uploads/${path.basename(image?.filepath)}`

  // Валідація
  if (
    !fields.childName ||
    !fields.childAge ||
    !fields.workCity ||
    !fields.officeAddress ||
    !fields.parentName ||
    !fields.contactPhone ||
    !photoUrl
  ) {
    return NextResponse.json({ success: false, error: "Не всі обов'язкові поля заповнені" }, { status: 400 })
  }

  const newSubmission = await addSubmissionToDb({
    childName: fields.childName,
    childAge: fields.childAge,
    workCity: fields.workCity,
    officeAddress: fields.officeAddress,
    parentName: fields.parentName,
    contactPhone: fields.contactPhone,
    photoUrl,
  })

  return NextResponse.json({ success: true, data: newSubmission }, { status: 201 })
}