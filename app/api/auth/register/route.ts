import { type NextRequest, NextResponse } from "next/server"

// Simulated user storage for preview (use MongoDB in production)
const users: { [key: string]: { username: string; email: string; password: string } } = {
  demo: { username: "demo", email: "demo@example.com", password: "password" },
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    if (users[username] || Object.values(users).some((u) => u.email === email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Store user (in production, hash the password)
    users[username] = { username, email, password }

    // Generate simple token (use JWT in production)
    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: { username, email },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
