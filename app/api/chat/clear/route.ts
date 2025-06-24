import { type NextRequest, NextResponse } from "next/server"

// Simulated chat storage for preview
const chatHistory: {
  [key: string]: Array<{ question: string; answer: string; timestamp: Date; filename?: string }>
} = {}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 })
    }

    // Clear user's chat history
    chatHistory[username] = []

    return NextResponse.json({
      message: "Chat history cleared successfully",
    })
  } catch (error) {
    console.error("Clear chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
