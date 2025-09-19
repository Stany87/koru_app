"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Bed, Utensils, Activity, Sun, Shield, Droplets } from "lucide-react"
import { useEffect, useState } from "react"

interface LifestyleProps {
  onBack: () => void
}

export default function Lifestyle({ onBack }: LifestyleProps) {
  const [waterGlasses, setWaterGlasses] = useState<number>(0)
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(0)
  const [sleepBedtime, setSleepBedtime] = useState<string>("22:30")
  const [sleepWake, setSleepWake] = useState<string>("06:30")
  const [avoidChecklist, setAvoidChecklist] = useState<{ alcohol: boolean; drugs: boolean }>({ alcohol: false, drugs: false })

  useEffect(() => {
    const saved = localStorage.getItem("koru-lifestyle")
    if (saved) {
      const data = JSON.parse(saved)
      if (typeof data.waterGlasses === "number") setWaterGlasses(data.waterGlasses)
      if (typeof data.exerciseMinutes === "number") setExerciseMinutes(data.exerciseMinutes)
      if (typeof data.sleepBedtime === "string") setSleepBedtime(data.sleepBedtime)
      if (typeof data.sleepWake === "string") setSleepWake(data.sleepWake)
      if (data.avoidChecklist) setAvoidChecklist(data.avoidChecklist)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "koru-lifestyle",
      JSON.stringify({ waterGlasses, exerciseMinutes, sleepBedtime, sleepWake, avoidChecklist }),
    )
  }, [waterGlasses, exerciseMinutes, sleepBedtime, sleepWake, avoidChecklist])


  // Friendly Lifestyle Chatbot
  type ChatMsg = { id: string; content: string; sender: "user" | "ai"; timestamp: Date }
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      content:
        "Hey! I'm Buddy. How was your day? How are you feeling right now? I can help with tiny ideas for today or tomorrow—sleep, food, movement, or just unwinding.",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  const sendLifestyleChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg: ChatMsg = { id: Date.now().toString(), content: chatInput, sender: "user", timestamp: new Date() }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput("")
    setChatLoading(true)
    try {
      const personaPrefix =
        "Act like a warm, supportive friend named Buddy. Ask caring follow-ups and suggest small, practical next steps about exercise, healthy meals, sleep routine, and avoiding alcohol/drugs. Keep it friendly, brief, and encouraging."
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${personaPrefix}\n\nUser: ${userMsg.content}`,
          conversationHistory: chatMessages.slice(-5),
        }),
      })
      const data = await response.json()
      const aiMsg: ChatMsg = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiMsg])
    } catch (e) {
      const err: ChatMsg = {
        id: (Date.now() + 2).toString(),
        content: "Sorry—I'm having trouble replying right now. Could we try again in a moment?",
        sender: "ai",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, err])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/10 p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="glass-strong" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Sun className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Lifestyle</h1>
              <p className="text-sm text-muted-foreground">Habits that support your mental health</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Buddy – Lifestyle Friend Chat (Hero) */}
        <Card className="glass-strong p-0 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-emerald-500/15 via-lime-500/10 to-sky-500/10 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full glass-strong flex items-center justify-center text-xl">🫶</div>
              <div>
                <h3 className="text-2xl font-bold leading-tight text-emerald-400">Buddy – Your Wellness Coach</h3>
                <p className="text-sm text-muted-foreground">Personal guidance for healthy habits and lifestyle</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["I slept poorly", "Need motivation", "Healthy meal ideas", "Exercise tips", "Feeling stressed"].map((chip) => (
                <button
                  key={chip}
                  className="px-3 py-2 rounded-full text-xs glass hover:glass-strong transition-all hover:scale-105"
                  onClick={() => {
                    setChatInput(chip)
                    setTimeout(() => sendLifestyleChat(), 0)
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3 max-h-80 overflow-y-auto hide-scrollbar bg-gradient-to-br from-white/0 to-white/5 rounded-lg p-4 border border-white/10">
              {chatMessages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-2 max-w-[85%]`}>
                    {m.sender === "ai" && <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-lg">🤗</div>}
                    <div
                      className={`p-3 rounded-2xl text-sm shadow-sm ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-emerald-500/25 to-lime-500/25 border border-emerald-400/20"
                          : "glass border-white/10"
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 text-right opacity-70">
                        {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    {m.sender === "user" && <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-lg">🙂</div>}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="glass p-3 rounded-2xl border border-white/10">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Buddy about nutrition, exercise, sleep, or wellness..."
                className="glass bg-transparent border-emerald-400/30 focus:border-emerald-400/50 h-12 rounded-xl text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendLifestyleChat()
                  }
                }}
              />
              <Button 
                onClick={sendLifestyleChat} 
                disabled={!chatInput.trim() || chatLoading} 
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 font-medium"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>

        {/* Wellness Essentials - Clean Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quick Trackers */}
          <Card className="glass-strong p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-3">
              <Droplets className="h-6 w-6 text-cyan-400" />
            </div>
            <h4 className="font-semibold mb-2">Water</h4>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Button size="sm" variant="outline" className="glass w-8 h-8 p-0" onClick={() => setWaterGlasses((n) => Math.max(0, n - 1))}>-</Button>
              <span className="text-xl font-mono w-8 text-center">{waterGlasses}</span>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 w-8 h-8 p-0" onClick={() => setWaterGlasses((n) => Math.min(20, n + 1))}>+</Button>
            </div>
            <p className="text-xs text-muted-foreground">glasses today</p>
          </Card>

          <Card className="glass-strong p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 flex items-center justify-center mb-3">
              <Activity className="h-6 w-6 text-pink-400" />
            </div>
            <h4 className="font-semibold mb-2">Exercise</h4>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Button size="sm" variant="outline" className="glass w-8 h-8 p-0" onClick={() => setExerciseMinutes((m) => Math.max(0, m - 5))}>-</Button>
              <span className="text-xl font-mono w-12 text-center">{exerciseMinutes}</span>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700 w-8 h-8 p-0" onClick={() => setExerciseMinutes((m) => Math.min(240, m + 5))}>+</Button>
            </div>
            <p className="text-xs text-muted-foreground">minutes today</p>
          </Card>

          <Card className="glass-strong p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 flex items-center justify-center mb-3">
              <Bed className="h-6 w-6 text-blue-400" />
            </div>
            <h4 className="font-semibold mb-2">Sleep</h4>
            <div className="space-y-1">
              <input
                type="time"
                value={sleepBedtime}
                onChange={(e) => setSleepBedtime(e.target.value)}
                className="w-full glass bg-transparent border border-white/20 rounded px-2 py-1 text-xs"
              />
              <p className="text-xs text-muted-foreground">{calcDuration(sleepBedtime, sleepWake)} planned</p>
            </div>
          </Card>

          <Card className="glass-strong p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 flex items-center justify-center mb-3">
              <Sun className="h-6 w-6 text-emerald-400" />
            </div>
            <h4 className="font-semibold mb-2">Wellness</h4>
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs justify-center">
                <input
                  type="checkbox"
                  checked={avoidChecklist.alcohol}
                  onChange={(e) => setAvoidChecklist((s) => ({ ...s, alcohol: e.target.checked }))}
                  className="scale-75"
                />
                No alcohol
              </label>
              <label className="flex items-center gap-1 text-xs justify-center">
                <input
                  type="checkbox"
                  checked={avoidChecklist.drugs}
                  onChange={(e) => setAvoidChecklist((s) => ({ ...s, drugs: e.target.checked }))}
                  className="scale-75"
                />
                No drugs
              </label>
            </div>
          </Card>
        </div>

        {/* Wellness Tips */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Essential Wellness Habits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-cyan-400" />
                <h4 className="font-semibold">Stay Hydrated</h4>
              </div>
              <p className="text-sm text-muted-foreground">Aim for 8 glasses of water daily. Keep a water bottle nearby and drink regularly throughout the day.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-pink-400" />
                <h4 className="font-semibold">Move Daily</h4>
              </div>
              <p className="text-sm text-muted-foreground">Even 20-30 minutes of walking can boost mood. Start small and build consistency.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-blue-400" />
                <h4 className="font-semibold">Sleep Schedule</h4>
              </div>
              <p className="text-sm text-muted-foreground">Consistent sleep and wake times help regulate your mood and energy levels.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-amber-400" />
                <h4 className="font-semibold">Nourish Well</h4>
              </div>
              <p className="text-sm text-muted-foreground">Regular meals with protein, fiber, and vegetables support stable mood and energy.</p>
            </div>
          </div>
        </Card>

        {/* Buddy section moved to hero above */}
      </div>
    </div>
  )
}

function calcDuration(bed: string, wake: string): string {
  // bed and wake as HH:MM, returns duration HH:MM across midnight as needed
  const [bh, bm] = bed.split(":").map((n) => Number.parseInt(n))
  const [wh, wm] = wake.split(":").map((n) => Number.parseInt(n))
  if ([bh, bm, wh, wm].some((n) => Number.isNaN(n))) return "--:--"
  const bedMin = bh * 60 + bm
  const wakeMin = wh * 60 + wm
  const minutes = (wakeMin - bedMin + 24 * 60) % (24 * 60)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}



