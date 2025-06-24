import { type NextRequest, NextResponse } from "next/server"

// Simulated user storage for preview (use MongoDB in production)
const users: { [key: string]: { username: string; email: string; password: string } } = {
  demo: { username: "demo", email: "demo@example.com", password: "password" },
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 })
    }

    // Find user by username or email
    const user = users[username] || Object.values(users).find((u) => u.email === username)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate simple token (use JWT in production)
    const token = Buffer.from(`${user.username}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
