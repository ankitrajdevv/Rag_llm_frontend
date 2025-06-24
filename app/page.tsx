"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ParticlesBackground } from "@/components/particles-background"
import { CursorGlow } from "@/components/cursor-glow"

export default function HomePage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Add a small delay to prevent flash
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")

      if (token && user) {
        router.replace("/chat")
      } else {
        router.replace("/login")
      }
      setIsChecking(false)
    }

    // Small delay to ensure localStorage is available
    setTimeout(checkAuth, 100)
  }, [router])

  if (isChecking) {
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

  return null
}
