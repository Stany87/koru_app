"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  History, 
  Sparkles, 
  Heart, 
  MessageCircle,
  Clock,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  X
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  reactions: {
    thumbsUp: boolean
    thumbsDown: boolean
  }
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  lastMessage: Date
}

interface EnhancedChatInterfaceProps {
  onBack: () => void
}

export default function EnhancedChatInterface({ onBack }: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your Koru AI companion. I'm here to listen, support, and help you navigate whatever you're feeling today. What's on your mind?",
      sender: "ai",
      timestamp: new Date(),
      reactions: { thumbsUp: false, thumbsDown: false }
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('koru-chat-sessions')
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        lastMessage: new Date(session.lastMessage),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setChatSessions(sessions)
    }
  }, [])

  // Save chat sessions to localStorage
  const saveChatSessions = (sessions: ChatSession[]) => {
    localStorage.setItem('koru-chat-sessions', JSON.stringify(sessions))
    setChatSessions(sessions)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateSessionTitle = (firstMessage: string) => {
    const words = firstMessage.split(' ').slice(0, 4)
    return words.join(' ') + (firstMessage.split(' ').length > 4 ? '...' : '')
  }

  const startNewSession = () => {
    setCurrentSessionId(null)
    setMessages([
      {
        id: "welcome",
        content: "Hi there! I'm your Koru AI companion. I'm here to listen, support, and help you navigate whatever you're feeling today. What's on your mind?",
        sender: "ai",
        timestamp: new Date(),
        reactions: { thumbsUp: false, thumbsDown: false }
      },
    ])
    setShowHistory(false)
  }

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id)
    setMessages(session.messages)
    setShowHistory(false)
  }

  const deleteSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId)
    saveChatSessions(updatedSessions)
    if (currentSessionId === sessionId) {
      startNewSession()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const toggleReaction = (messageId: string, reaction: 'thumbsUp' | 'thumbsDown') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? {
            ...msg,
            reactions: {
              ...msg.reactions,
              [reaction]: !msg.reactions[reaction]
            }
          }
        : msg
    ))
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      reactions: { thumbsUp: false, thumbsDown: false }
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputMessage("")
    setIsLoading(true)

    // Create new session if this is the first user message
    if (!currentSessionId && messages.length === 1) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: generateSessionTitle(inputMessage),
        messages: newMessages,
        createdAt: new Date(),
        lastMessage: new Date()
      }
      setCurrentSessionId(newSession.id)
      saveChatSessions([newSession, ...chatSessions])
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages.slice(-5),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        reactions: { thumbsUp: false, thumbsDown: false }
      }

      const finalMessages = [...newMessages, aiMessage]
      setMessages(finalMessages)

      // Update session with new messages
      if (currentSessionId) {
        const updatedSessions = chatSessions.map(session => 
          session.id === currentSessionId 
            ? {
                ...session,
                messages: finalMessages,
                lastMessage: new Date()
              }
            : session
        )
        saveChatSessions(updatedSessions)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please reach out to a trusted adult or emergency services.",
        sender: "ai",
        timestamp: new Date(),
        reactions: { thumbsUp: false, thumbsDown: false }
      }
      const finalMessages = [...newMessages, errorMessage]
      setMessages(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen flex">
      {/* Chat History Sidebar */}
      {showHistory && (
        <div className="w-80 glass border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="h-5 w-5" />
                Chat History
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={startNewSession}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {chatSessions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No chat history yet</p>
                  <p className="text-sm">Start a conversation to see it here</p>
                </div>
              ) : (
                chatSessions.map((session) => (
                  <Card
                    key={session.id}
                    className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                      currentSessionId === session.id 
                        ? "glass-strong border-primary/50" 
                        : "glass hover:glass-strong"
                    }`}
                    onClick={() => loadSession(session)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate mb-1">
                            {session.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(session.lastMessage)}</span>
                            <Badge variant="secondary" className="text-xs">
                              {session.messages.length} messages
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteSession(session.id)
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="glass border-b border-white/10 p-4">
          <div className="flex items-center gap-4 max-w-4xl mx-auto">
            <Button variant="ghost" size="icon" className="glass-strong" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center relative">
                <Bot className="h-5 w-5 text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Koru AI</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Heart className="h-3 w-3 text-red-400" />
                  Your compassionate companion
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="glass-strong"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {message.sender === "ai" && (
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center flex-shrink-0 mt-1 relative">
                    <Bot className="h-5 w-5 text-blue-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
                
                <div className={`max-w-[75%] ${message.sender === "user" ? "order-first" : ""}`}>
                  <Card
                    className={`p-4 transition-all duration-200 hover:scale-[1.02] ${
                      message.sender === "user"
                        ? "glass-strong bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30"
                        : "glass border-white/10 hover:border-white/20"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </p>
                      {message.sender === "ai" && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-green-500/20"
                            onClick={() => toggleReaction(message.id, 'thumbsUp')}
                          >
                            <ThumbsUp className={`h-3 w-3 ${message.reactions.thumbsUp ? 'text-green-400' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-red-500/20"
                            onClick={() => toggleReaction(message.id, 'thumbsDown')}
                          >
                            <ThumbsDown className={`h-3 w-3 ${message.reactions.thumbsDown ? 'text-red-400' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyMessage(message.content)}
                          >
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {message.sender === "user" && (
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-5 w-5 text-purple-400" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center flex-shrink-0 mt-1 relative">
                  <Bot className="h-5 w-5 text-blue-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <Card className="glass border-white/10 p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Koru is thinking...</span>
                  </div>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="glass border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind... I'm here to listen 💙"
                  className="glass bg-transparent border-white/20 focus:border-white/40 pr-12 transition-all duration-200"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 disabled:scale-100"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">
                Press Enter to send • Shift+Enter for new line
              </p>
              <p className="text-xs text-muted-foreground">
                💙 Remember: If you're in crisis, please contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
