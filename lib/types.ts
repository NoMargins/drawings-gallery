// lib\types.ts
export type AgeCategory = "0-5" | "6-8" | "9-12" | "13-18"

export type ChildSubmission = {
  id: string
  childName: string
  childAge: string
  workCity: string
  officeAddress: string
  parentName: string
  contactPhone: string
  photoUrl: string
  isPublished: boolean
  createdAt: string
  ageCategory: AgeCategory
  votes: number
}

export type Vote = {
  id: string
  submissionId: string
  userId: string
  createdAt: string
}
