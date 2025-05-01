import { type NextRequest, NextResponse } from "next/server"
import {
  getAllSubmissionsFromDb,
  getSubmissionsByCategoryFromDb,
  getPublishedSubmissionsFromDb,
  addSubmissionToDb,
} from "@/lib/db-service"
import type { AgeCategory } from "@/lib/types"

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
  try {
    const body = await request.json()

    // Валідація даних
    if (
      !body.childName ||
      !body.childAge ||
      !body.workCity ||
      !body.officeAddress ||
      !body.parentName ||
      !body.contactPhone ||
      !body.photoUrl
    ) {
      return NextResponse.json({ success: false, error: "Не всі обов'язкові поля заповнені" }, { status: 400 })
    }

    const newSubmission = await addSubmissionToDb({
      childName: body.childName,
      childAge: body.childAge,
      workCity: body.workCity,
      officeAddress: body.officeAddress,
      parentName: body.parentName,
      contactPhone: body.contactPhone,
      photoUrl: body.photoUrl,
    })

    return NextResponse.json({ success: true, data: newSubmission }, { status: 201 })
  } catch (error) {
    console.error("Error adding submission:", error)
    return NextResponse.json({ success: false, error: "Помилка при додаванні заявки" }, { status: 500 })
  }
}
