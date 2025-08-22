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
import { Upload, Send, Copy, Volume2, VolumeX, LogOut, FileText, Bot, Home, Info, Mic, MicOff } from "lucide-react"
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
  const [pdfList, setPdfList] = useState<string[]>([])
  const [selectedPDFs, setSelectedPDFs] = useState<string[]>([])
  const [listening, setListening] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUser(storedUser)
    fetchHistory(storedUser)
    fetchPDFList(storedUser)
  }, [router])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatHistory])

  const fetchHistory = async (username: string) => {
    try {
  const response = await fetch(`https://rag-llm-backend.onrender.com/history/?username=${username}`)
      if (response.ok) {
        const data = await response.json()
        setChatHistory(data.history.reverse())
      }
    } catch (err) {
      console.error("Failed to fetch history:", err)
    }
  }

  const fetchPDFList = async (username: string) => {
    try {
  const response = await fetch(`https://rag-llm-backend.onrender.com/list_pdfs/?username=${username}`)
      if (response.ok) {
        const data = await response.json()
        setPdfList(data.pdfs)
        // Auto-select all PDFs after fetching
        setSelectedPDFs(data.pdfs)
      }
    } catch (err) {
      console.error("Failed to fetch PDF list:", err)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setIsPdfUploaded(false)

      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("username", user)

      try {
  const response = await fetch("https://rag-llm-backend.onrender.com/upload/", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setFilename(data.filename)
          setIsPdfUploaded(true)
          toast.success("PDF uploaded successfully!")
          fetchPDFList(user)
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

  const handleDeletePDF = async (pdf: string) => {
    const formData = new FormData();
    formData.append("filename", pdf);
    formData.append("username", user);
    try {
  const response = await fetch("https://rag-llm-backend.onrender.com/delete_pdf/", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        toast.success("PDF deleted successfully!");
        fetchPDFList(user);
      } else {
        toast.error("Failed to delete PDF");
      }
    } catch (err) {
      toast.error("Failed to delete PDF");
    }
  }

  const handlePDFSelect = (pdf: string) => {
    setSelectedPDFs((prev) =>
      prev.includes(pdf) ? prev.filter((f) => f !== pdf) : [...prev, pdf]
    )
  }

  const askQuestion = async () => {
    if (!query.trim() || selectedPDFs.length === 0) return;

    setLoading(true);
    const currentIndex = chatHistory.length;
    setChatHistory((prev) => [...prev, { question: query, answer: null }]);
    const currentQuery = query;
    setQuery("");

    const formData = new FormData();
    formData.append("filenames", JSON.stringify(selectedPDFs)); // send as JSON string for backend
    formData.append("query", currentQuery);
    formData.append("username", user);

    try {
  const response = await fetch("https://rag-llm-backend.onrender.com/ask/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[currentIndex] = {
            question: currentQuery,
            answer: data.answer,
          };
          return updated;
        });
      } else {
        throw new Error("Failed to get answer");
      }
    } catch (error) {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[currentIndex] = {
          question: currentQuery,
          answer: "Error fetching answer.",
        };
        return updated;
      });
      toast.error("Failed to get answer");
    } finally {
      setLoading(false);
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
            Upload your documents and ask questions. Get instant answers powered by AI.
          </p>
        </div>

        {/* Uploaded PDFs Preview Box with delete button */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400 text-base">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                {pdfList.map((pdf) => (
                  <li
                    key={pdf}
                    className="flex items-center justify-between text-sm text-gray-200"
                  >
                    <span
                      className="cursor-pointer truncate max-w-[220px] font-medium text-gray-200"
                      onClick={() => handlePDFSelect(pdf)}
                      title={pdf}
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {pdf}
                    </span>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePDF(pdf)}
                      title="Delete PDF"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V5a3 3 0 013-3v0a3 3 0 013 3v2m-7 0h8m-8 0v12a2 2 0 002 2h4a2 2 0 002-2V7m-8 0h8" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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
              <ScrollArea className="flex-1 pr-4 overflow-y-auto max-h-[400px]" ref={scrollAreaRef}>
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
                <div className="flex space-x-2 items-center">
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
                    disabled={!query.trim() || loading || selectedPDFs.length === 0}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={listening ? stopSpeech : () => setListening(true)}
                    disabled={loading}
                    size="icon"
                    variant={listening ? "destructive" : "outline"}
                    className={listening ? "animate-pulse border-red-500" : ""}
                    aria-label={listening ? "Stop voice input" : "Start voice input"}
                  >
                    {listening ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  {listening && (
                    <span className="ml-2 flex items-center text-red-600 animate-pulse font-semibold">
                      <Mic className="w-4 h-4 mr-1" /> Listening...
                    </span>
                  )}
                </div>

                {pdfList.length === 0 && (
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
              <ScrollArea className="flex-1 pr-4 overflow-y-auto max-h-[480px]">
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
      </main>
    </div>
  )
}