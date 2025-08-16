"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Upload, Send, Copy, Volume2, VolumeX, LogOut, FileText, Bot, Home, Info } from "lucide-react"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"

interface ChatMessage {
  question: string
  answer: string | null
  filename?: string
  timestamp?: string
}

export default function ChatPage() {
  const [user, setUser] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [filename, setFilename] = useState("")
  const [query, setQuery] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [isPdfUploaded, setIsPdfUploaded] = useState(false)
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(storedUser)
    fetchHistory(storedUser)
  }, [router])


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatHistory])

  const fetchHistory = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:8000/history/?username=${username}`)
      if (response.ok) {
        const data = await response.json()
        setChatHistory(data.history.reverse())
      }
    } catch (err) {
      console.error("Failed to fetch history:", err)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setIsPdfUploaded(false)

      const formData = new FormData()
      formData.append("file", selectedFile)

      try {
        const response = await fetch("http://localhost:8000/upload/", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setFilename(data.filename)
          setIsPdfUploaded(true)
          toast.success("PDF uploaded successfully!")
        } else {
          toast.error("Failed to upload PDF")
        }
      } catch (error) {
        toast.error("Failed to upload PDF")
      }
    } else {
      toast.error("Please upload a valid PDF file")
    }
  }

  const askQuestion = async () => {
    if (!query.trim()) return

    setLoading(true)
    const currentIndex = chatHistory.length
    setChatHistory((prev) => [...prev, { question: query, answer: null }])
    const currentQuery = query
    setQuery("")

    const formData = new FormData()
    formData.append("filename", filename)
    formData.append("query", currentQuery)
    formData.append("username", user)

    try {
      const response = await fetch("http://localhost:8000/ask/", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setChatHistory((prev) => {
          const updated = [...prev]
          updated[currentIndex] = {
            question: currentQuery,
            answer: data.answer,
          }
          return updated
        })
      } else {
        throw new Error("Failed to get answer")
      }
    } catch (error) {
      setChatHistory((prev) => {
        const updated = [...prev]
        updated[currentIndex] = {
          question: currentQuery,
          answer: "Error fetching answer.",
        }
        return updated
      })
      toast.error("Failed to get answer")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const speakText = (text: string, index: number) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1
      utterance.onend = () => setSpeakingIndex(null)
      setSpeakingIndex(index)
      window.speechSynthesis.speak(utterance)
    } else {
      toast.error("Speech synthesis not supported in your browser")
    }
  }

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setSpeakingIndex(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      askQuestion()
    }
  }

  const clearChat = () => {
    setChatHistory([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">RAG LLM</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>

              <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">{user}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">Business Document Intelligence</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Upload your documents and ask questions. Get instant answers powered by AI with accurate source references.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Your Questions Column */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400 flex items-center justify-between">
                Your Questions
                {chatHistory.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearChat}>
                    Clear
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4 overflow-y-auto" ref={scrollAreaRef}>
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions asked yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Start by asking a question about your documents below
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-900 dark:text-white">{item.question}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask a question about your documents..."
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    onClick={askQuestion}
                    disabled={!query.trim() || loading}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {!isPdfUploaded && (
                  <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    No documents available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Answers Column */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">AI Answers</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-start space-y-4 py-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">AI Assistant</p>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Hi there! I'm your document assistant. Upload documents and ask me questions about them.
                            I'll provide answers with references to your source material.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {chatHistory.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">AI Assistant</p>
                          {item.answer === null ? (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                <div
                                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                />
                                <div
                                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-3">
                                {item.answer}
                              </p>
                              <Separator className="my-2" />
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(item.answer!)}
                                  className="h-8 px-2 text-xs"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </Button>
                                {speakingIndex === index ? (
                                  <Button variant="ghost" size="sm" onClick={stopSpeech} className="h-8 px-2 text-xs">
                                    <VolumeX className="w-3 h-3 mr-1" />
                                    Stop
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => speakText(item.answer!, index)}
                                    className="h-8 px-2 text-xs"
                                  >
                                    <Volume2 className="w-3 h-3 mr-1" />
                                    Speak
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Powerful Document Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Upload Documents</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Easily upload PDF documents for analysis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get intelligent answers from your documents</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Source References</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Answers include accurate source citations</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
