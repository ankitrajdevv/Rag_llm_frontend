import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

// Simulated chat storage for preview
const chatHistory: {
  [key: string]: Array<{ question: string; answer: string; timestamp: Date; filename?: string }>
} = {}

// Simulated AI responses
const aiResponses = [
  "Based on the document analysis, this information relates to the strategic planning section where the company outlines its growth objectives and market positioning strategies for the upcoming fiscal year.",
  "According to the document, this data point is referenced in the financial projections section, specifically highlighting the expected ROI and budget allocations for various departments.",
  "The document indicates that this topic is covered extensively in the operational efficiency chapter, detailing process improvements and resource optimization strategies.",
  "This question pertains to the risk assessment section of the document, where potential challenges and mitigation strategies are thoroughly analyzed.",
  "The document addresses this in the market analysis section, providing insights into competitive landscape and customer behavior patterns.",
  "Based on the PDF content, this relates to the executive summary where key performance indicators and strategic milestones are outlined for stakeholder review.",
]

const uri = process.env.MONGODB_URI || ""
const dbName = process.env.MONGODB_DB

export async function POST(request: NextRequest) {
  try {
    const { filename, query, username } = await request.json()

    if (!query || !username) {
      return NextResponse.json({ error: "Missing query or username" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate AI response
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
    const contextualResponse = filename
      ? `📄 **Based on "${filename}":**\n\n${randomResponse}\n\n*Note: This is a simulated response. In production, this would analyze your actual PDF content using AI.*`
      : `🤖 **AI Response:**\n\n${randomResponse}\n\n*💡 Tip: Upload a PDF document for more specific answers based on your content.*`

    // Store in chat history
    if (!chatHistory[username]) {
      chatHistory[username] = []
    }

    chatHistory[username].push({
      question: query,
      answer: contextualResponse,
      timestamp: new Date(),
      filename,
    })

    // Save to chat history in MongoDB
    const client = new MongoClient(uri)

    try {
      await client.connect()

      const db = client.db(dbName)
      const chats = db.collection("chats")

      const chatDoc = {
        username, // This ensures each user's chat is saved separately
        filename: filename || "No document",
        question: query,
        answer: contextualResponse,
        timestamp: new Date(),
      }

      await chats.insertOne(chatDoc)
    } finally {
      await client.close()
    }

    return NextResponse.json({
      answer: contextualResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
