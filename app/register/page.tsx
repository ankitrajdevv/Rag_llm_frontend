"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Bot } from "lucide-react"
import Link from "next/link"
import { ParticlesBackground } from "@/components/particles-background"
import { ThemeToggle } from "@/components/theme-toggle"
import { CursorGlow } from "@/components/cursor-glow"
import { toast } from "sonner"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user data
        localStorage.setItem("user", data.user.username)
        localStorage.setItem("token", data.token)

        // Show success message
        toast.success("Registration successful!")

        // Small delay to ensure localStorage is set, then redirect
        setTimeout(() => {
          router.push("/chat")
        }, 100)
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <ParticlesBackground />
      <CursorGlow />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 h-screen flex items-center justify-center p-4">
        <div className="auth-container group">
          <Card
            className="w-full backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-2xl transition-all duration-300 hover:bg-white/15 dark:hover:bg-gray-900/15 hover:border-white/30 dark:hover:border-gray-600/30"
            style={{ width: "360px" }}
          >
            <CardHeader className="space-y-3 text-center pb-4 pt-6">
              <div className="mx-auto w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 mt-1 font-medium text-sm">
                  Sign up for your RAG LLM account
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-gray-700 dark:text-gray-200 font-medium text-sm">
                    Username
                  </Label>
                  <div className="input-glow-container">
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Choose a username"
                      className="enhanced-input h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium text-sm">
                    Email
                  </Label>
                  <div className="input-glow-container">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Enter your email"
                      className="enhanced-input h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium text-sm">
                    Password
                  </Label>
                  <div className="input-glow-container">
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Create a password"
                      className="enhanced-input h-10"
                    />
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 backdrop-blur-sm py-2">
                    <AlertDescription className="text-red-600 dark:text-red-400 font-medium text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 font-medium py-2 h-10 mt-5"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">Already have an account? </span>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </div>

              {/* Demo Instructions */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                  <strong>Demo:</strong> Create any username and password to get started
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
