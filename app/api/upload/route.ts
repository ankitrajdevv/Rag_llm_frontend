import { type NextRequest, NextResponse } from "next/server"

// Simulated file storage for preview
const uploadedFiles: { [key: string]: { filename: string; content: string; uploadedAt: Date } } = {}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const username = formData.get("username") as string

    if (!file || !username) {
      return NextResponse.json({ error: "Missing file or username" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    // Simulate file processing
    const fileKey = `${username}_${file.name}`
    uploadedFiles[fileKey] = {
      filename: file.name,
      content: "Simulated PDF content extraction for demo purposes...",
      uploadedAt: new Date(),
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      filename: file.name,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
