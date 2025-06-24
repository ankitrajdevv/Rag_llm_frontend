"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ParticlesBackground } from "@/components/particles-background"
import { CursorGlow } from "@/components/cursor-glow"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/chat")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ParticlesBackground />
      <CursorGlow />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    </div>
  )
}
