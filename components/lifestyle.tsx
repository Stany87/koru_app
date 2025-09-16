"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Bed, Utensils, Activity, Sun, Moon, Shield, Droplets, Timer, Footprints, Play, Pause, RotateCcw, ExternalLink } from "lucide-react"
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
  const [exercisePlan, setExercisePlan] = useState<{ type: string; minutes: number; stepTarget?: number }>({ type: "Walk", minutes: 15, stepTarget: 2000 })
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState<number>(exercisePlan.minutes * 60)
  const [exerciseRunning, setExerciseRunning] = useState<boolean>(false)
  const [stepsToday, setStepsToday] = useState<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem("koru-lifestyle")
    if (saved) {
      const data = JSON.parse(saved)
      if (typeof data.waterGlasses === "number") setWaterGlasses(data.waterGlasses)
      if (typeof data.exerciseMinutes === "number") setExerciseMinutes(data.exerciseMinutes)
      if (typeof data.sleepBedtime === "string") setSleepBedtime(data.sleepBedtime)
      if (typeof data.sleepWake === "string") setSleepWake(data.sleepWake)
      if (data.avoidChecklist) setAvoidChecklist(data.avoidChecklist)
      if (data.exercisePlan) setExercisePlan(data.exercisePlan)
      if (typeof data.stepsToday === "number") setStepsToday(data.stepsToday)
      if (typeof data.exerciseMinutes === "number") setExerciseMinutes(data.exerciseMinutes)
      if (typeof data.exerciseTimeLeft === "number") setExerciseTimeLeft(data.exerciseTimeLeft)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "koru-lifestyle",
      JSON.stringify({ waterGlasses, exerciseMinutes, sleepBedtime, sleepWake, avoidChecklist, exercisePlan, stepsToday, exerciseTimeLeft }),
    )
  }, [waterGlasses, exerciseMinutes, sleepBedtime, sleepWake, avoidChecklist, exercisePlan, stepsToday, exerciseTimeLeft])

  // Exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (exerciseRunning && exerciseTimeLeft > 0) {
      interval = setInterval(() => {
        setExerciseTimeLeft((t) => (t > 0 ? t - 1 : 0))
      }, 1000)
    }
    if (exerciseTimeLeft === 0) setExerciseRunning(false)
    return () => clearInterval(interval)
  }, [exerciseRunning, exerciseTimeLeft])

  const formatHMS = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

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
              <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-lg">🫶</div>
              <div>
                <h3 className="text-xl font-semibold leading-tight">Buddy – Your Lifestyle Friend</h3>
                <p className="text-sm text-muted-foreground">Quick, kind suggestions for today and tomorrow</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["I slept poorly", "Feeling low", "Need a routine", "No time to cook"].map((chip) => (
                <button
                  key={chip}
                  className="px-3 py-1 rounded-full text-xs glass hover:glass-strong transition"
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
            <div className="space-y-3 max-h-96 overflow-y-auto hide-scrollbar bg-gradient-to-br from-white/0 to-white/5 rounded-lg p-3 border border-white/10">
              {chatMessages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-2 max-w-[80%]`}>
                    {m.sender === "ai" && <div className="w-7 h-7 rounded-full glass flex items-center justify-center">🤗</div>}
                    <div
                      className={`p-3 rounded-2xl text-sm shadow-sm ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-emerald-500/25 to-lime-500/25 border border-emerald-400/20"
                          : "glass border-white/10"
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 text-right">
                        {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    {m.sender === "user" && <div className="w-7 h-7 rounded-full glass flex items-center justify-center">🙂</div>}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="glass p-2 rounded-2xl border border-white/10">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tell Buddy about your day..."
                className="glass bg-transparent border-white/20 h-11 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendLifestyleChat()
                  }
                }}
              />
              <Button onClick={sendLifestyleChat} disabled={!chatInput.trim() || chatLoading} className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500">
                Send
              </Button>
            </div>
          </div>
        </Card>

        {/* Interactive Daily Trackers */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4">Daily Check-ins</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Water Intake */}
            <Card className="glass p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-5 w-5 text-cyan-400" />
                <h4 className="font-semibold">Water Intake</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Glasses today</p>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="glass" onClick={() => setWaterGlasses((n) => Math.max(0, n - 1))}>-</Button>
                <div className="text-2xl font-mono w-10 text-center">{waterGlasses}</div>
                <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setWaterGlasses((n) => Math.min(20, n + 1))}>+</Button>
              </div>
            </Card>

            {/* Exercise Minutes */}
            <Card className="glass p-4">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="h-5 w-5 text-pink-400" />
                <h4 className="font-semibold">Exercise Minutes</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Target: 20–30 min</p>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="glass" onClick={() => setExerciseMinutes((m) => Math.max(0, m - 5))}>-5</Button>
                <div className="text-2xl font-mono w-16 text-center">{exerciseMinutes}</div>
                <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => setExerciseMinutes((m) => Math.min(240, m + 5))}>+5</Button>
              </div>
            </Card>

            {/* Steps (manual) */}
            <Card className="glass p-4">
              <div className="flex items-center gap-2 mb-2">
                <Footprints className="h-5 w-5 text-emerald-400" />
                <h4 className="font-semibold">Steps Goal</h4>
              </div>
              <p className="text-sm text-muted-foreground">Aim: 6k–8k steps</p>
              <p className="text-xs text-muted-foreground">Track with your phone/watch and check in here.</p>
            </Card>
          </div>
        </Card>

        {/* Daily Exercise Planner with Timer & Steps */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-pink-400" />
            Today's Exercise
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Type</label>
              <select
                value={exercisePlan.type}
                onChange={(e) => {
                  const type = e.target.value
                  const preset =
                    type === "Walk" ? { minutes: 20, stepTarget: 3000 } :
                    type === "Jog" ? { minutes: 20, stepTarget: 4000 } :
                    type === "Yoga" ? { minutes: 15, stepTarget: undefined } :
                    type === "Cycling" ? { minutes: 25, stepTarget: undefined } : { minutes: 15, stepTarget: undefined }
                  const next = { type, minutes: preset.minutes, stepTarget: preset.stepTarget }
                  setExercisePlan(next)
                  setExerciseTimeLeft(preset.minutes * 60)
                }}
                className="w-full mt-1 glass bg-transparent border border-white/20 rounded px-2 py-2 text-sm"
              >
                <option>Walk</option>
                <option>Jog</option>
                <option>Yoga</option>
                <option>Cycling</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Duration (min)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={exercisePlan.minutes}
                onChange={(e) => {
                  const minutes = Math.max(5, Math.min(120, Number.parseInt(e.target.value || "0")))
                  setExercisePlan((p) => ({ ...p, minutes }))
                  setExerciseTimeLeft(minutes * 60)
                }}
                className="w-full mt-1 glass bg-transparent border border-white/20 rounded px-2 py-1"
              />
            </div>
            <div className="self-end">
              <div className="text-sm">Timer: <span className="font-mono">{formatHMS(exerciseTimeLeft)}</span></div>
              <div className="mt-2 flex gap-2">
                <Button onClick={() => setExerciseRunning(true)} disabled={exerciseRunning || exerciseTimeLeft === 0} className="bg-pink-600 hover:bg-pink-700 h-9 px-3">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setExerciseRunning(false)} className="glass h-9 px-3">
                  <Pause className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => { setExerciseRunning(false); setExerciseTimeLeft(exercisePlan.minutes * 60) }} className="glass h-9 px-3">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Steps Today</label>
              <div className="mt-2 flex items-center gap-3">
                <Button variant="outline" className="glass" onClick={() => setStepsToday((s) => Math.max(0, s - 100))}>-100</Button>
                <div className="text-2xl font-mono w-24 text-center">{stepsToday}</div>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setStepsToday((s) => s + 100)}>+100</Button>
              </div>
              {exercisePlan.stepTarget && (
                <p className="text-xs text-muted-foreground mt-1">Target: {exercisePlan.stepTarget.toLocaleString()} steps</p>
              )}
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-muted-foreground mb-1">Tip</div>
              <div className="p-3 glass rounded">
                {exercisePlan.type === "Yoga"
                  ? "Try gentle flows: cat-cow, child’s pose, low lunge, seated twist. Focus on slow breathing."
                  : exercisePlan.type === "Jog"
                    ? "Use intervals: 2 min easy jog, 1 min walk. Keep a pace where you can speak a sentence."
                    : exercisePlan.type === "Cycling"
                      ? "Ride easy for 5 min, then 3 x (2 min moderate + 1 min easy). Keep shoulders relaxed."
                      : "Walk outdoors if possible; swing arms lightly and keep a comfortable pace."}
              </div>
            </div>
          </div>
        </Card>
        {/* EXERCISE */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-pink-400" />
            Exercise
          </h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Start small: 10–20 minutes of brisk walking, 5 days/week</li>
            <li>Mix cardio with light strength (bodyweight squats, pushups)</li>
            <li>Use music or a friend for motivation and accountability</li>
          </ul>
        </Card>

        {/* a HEALTHY diet */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-amber-400" />
            Healthy Diet
          </h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Regular meals; include protein, fiber, fruits/vegetables</li>
            <li>Stay hydrated; keep a water bottle nearby</li>
            <li>Limit ultra-processed snacks and high-sugar drinks</li>
          </ul>

          {/* Healthy & Tasty Recipe Ideas (AI Daily) */}
          <DailyRecipes />
        </Card>

        {/* a consistent SLEEP SCHEDULE */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bed className="h-5 w-5 text-blue-400" />
            Consistent Sleep Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Bedtime</label>
              <input
                type="time"
                value={sleepBedtime}
                onChange={(e) => setSleepBedtime(e.target.value)}
                className="w-full mt-1 glass bg-transparent border border-white/20 rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Wake Time</label>
              <input
                type="time"
                value={sleepWake}
                onChange={(e) => setSleepWake(e.target.value)}
                className="w-full mt-1 glass bg-transparent border border-white/20 rounded px-2 py-1"
              />
            </div>
            <div className="self-end">
              <div className="text-sm">Planned Sleep: <span className="font-mono">{calcDuration(sleepBedtime, sleepWake)}</span></div>
            </div>
          </div>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-4">
            <li>Go to bed and wake up at the same times daily</li>
            <li>Limit screens 60 minutes before bed; use a wind-down routine</li>
            <li>Keep your room dark, cool, and quiet</li>
          </ul>
        </Card>

        {/* avoiding alcohol and recreational drugs */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            Avoid Alcohol & Recreational Drugs
          </h3>
          <div className="space-y-2 mb-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={avoidChecklist.alcohol}
                onChange={(e) => setAvoidChecklist((s) => ({ ...s, alcohol: e.target.checked }))}
              />
              No alcohol today
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={avoidChecklist.drugs}
                onChange={(e) => setAvoidChecklist((s) => ({ ...s, drugs: e.target.checked }))}
              />
              No recreational drugs today
            </label>
          </div>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Alcohol and drugs can worsen mood and sleep quality</li>
            <li>Choose alternative coping tools: breathing, journaling, a walk</li>
            <li>If cutting back is hard, reach out for support (e.g., 14416)</li>
          </ul>
        </Card>

        {/* Optional: Sunlight & Routine */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-400" />
            Sunlight & Routine
          </h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Get morning daylight exposure for 10–20 minutes</li>
            <li>Anchor your day with simple routines (wake, meal, wind-down)</li>
            <li>Use soft light in the evening to cue sleep</li>
          </ul>
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

function DailyRecipes() {
  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState<{ title: string; tags: string[]; desc: string; link: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const cacheKey = `koru-recipes-${today}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        setRecipes(JSON.parse(cached))
        setLoading(false)
        return
      } catch {}
    }
    const fetchRecipes = async () => {
      try {
        const resp = await fetch(`/api/recipes?date=${today}`)
        if (!resp.ok) throw new Error("Failed to fetch")
        const data = await resp.json()
        setRecipes(data.recipes || [])
        localStorage.setItem(cacheKey, JSON.stringify(data.recipes || []))
      } catch (e) {
        setError("Could not load recipes right now.")
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  if (loading) {
    return (
      <div className="mt-4 p-4 glass rounded-lg flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
        Loading today's recipes...
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-4 p-4 glass rounded-lg text-sm text-red-300 border border-red-400/30">
        {error}
      </div>
    )
  }

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {recipes.map((r, i) => (
        <Card key={i} className="glass p-4">
          <h4 className="font-semibold mb-1">{r.title}</h4>
          <div className="flex flex-wrap gap-1 mb-2">
            {(r.tags || []).map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                {t}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{r.desc}</p>
          {r.link && (
            <Button size="sm" variant="outline" className="glass border-amber-400/40 bg-transparent" onClick={() => window.open(r.link, "_blank")}>
              <ExternalLink className="h-3 w-3 mr-2" />
              View recipe
            </Button>
          )}
        </Card>
      ))}
    </div>
  )
}


