import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 })
    }

    // Get user's chat history from MongoDB
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const chats = db.collection("chats")

    const history = await chats
      .find({ username })
      .sort({ timestamp: 1 }) // Oldest first for proper chat order
      .limit(100) // Limit to last 100 messages
      .toArray()

    const formattedHistory = history.map((chat) => ({
      question: chat.question,
      answer: chat.answer,
      filename: chat.filename,
      timestamp: chat.timestamp,
    }))

    return NextResponse.json({
      history: formattedHistory,
    })
  } catch (error) {
    console.error("History error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
