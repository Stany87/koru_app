"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Bed, Utensils, Activity, Sun, Shield, Droplets, Play, CheckCircle, Clock, Zap, Heart, Timer, ExternalLink, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

interface LifestyleProps {
  onBack: () => void
}

// Recipe Section Component
function RecipeSection() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRecipes = async () => {
    setLoading(true)
    setError(null)
    try {
      const today = new Date().toISOString().slice(0, 10)
      const response = await fetch(`/api/recipes?date=${today}`)
      if (!response.ok) throw new Error('Failed to load recipes')
      const data = await response.json()
      setRecipes(data.recipes || [])
    } catch (err) {
      setError('Could not load recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 mx-auto animate-spin text-orange-400 mb-4" />
        <p className="text-muted-foreground">Loading delicious recipes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadRecipes} variant="outline" className="glass">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Personalized healthy meal suggestions</p>
        <Button onClick={loadRecipes} size="sm" variant="ghost" className="glass">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe, idx) => (
          <Card key={idx} className="glass p-4 hover:glass-strong transition-all">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-lg mb-2">{recipe.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{recipe.desc}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {recipe.tags?.map((tag: string, tagIdx: number) => (
                  <span 
                    key={tagIdx}
                    className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {recipe.link && (
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500"
                  onClick={() => window.open(recipe.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Recipe
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Lifestyle({ onBack }: LifestyleProps) {
  const [waterGlasses, setWaterGlasses] = useState<number>(0)
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(0)
  const [sleepBedtime, setSleepBedtime] = useState<string>("22:30")
  const [sleepWake, setSleepWake] = useState<string>("06:30")
  const [avoidChecklist, setAvoidChecklist] = useState<{ alcohol: boolean; drugs: boolean }>({ alcohol: false, drugs: false })
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([])
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null)
  const [workoutTimer, setWorkoutTimer] = useState<number>(0)
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [workoutInterval, setWorkoutInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load from dashboard data first (primary source)
    const dashboardData = localStorage.getItem("koru-dashboard")
    if (dashboardData) {
      const data = JSON.parse(dashboardData)
      if (data.habitsProgress) {
        setWaterGlasses(data.habitsProgress.water?.current || 0)
        setExerciseMinutes(data.habitsProgress.exercise?.current || 0)
        const sleepHours = data.habitsProgress.sleep?.current || 8
        // Calculate sleep times based on hours (default 8 hours sleep)
        if (sleepHours > 0) {
          setSleepBedtime("22:30")
          const wakeHour = Math.floor(22.5 + sleepHours) % 24
          const wakeMin = ((22.5 + sleepHours) % 1) * 60
          setSleepWake(`${wakeHour.toString().padStart(2, '0')}:${Math.round(wakeMin).toString().padStart(2, '0')}`)
        }
      }
    }
    
    // Then load lifestyle-specific data (avoid checklist, custom sleep times)
    const saved = localStorage.getItem("koru-lifestyle")
    if (saved) {
      const data = JSON.parse(saved)
      if (typeof data.sleepBedtime === "string") setSleepBedtime(data.sleepBedtime)
      if (typeof data.sleepWake === "string") setSleepWake(data.sleepWake)
      if (data.avoidChecklist) setAvoidChecklist(data.avoidChecklist)
    }
  }, [])

  // Update both lifestyle data and dashboard data when counters change
  const updateWaterGlasses = (newValue: number) => {
    setWaterGlasses(newValue)
    updateDashboardHabits('water', newValue)
  }
  
  const updateExerciseMinutes = (newValue: number) => {
    setExerciseMinutes(newValue)
    updateDashboardHabits('exercise', newValue)
  }
  
  const updateDashboardHabits = (habit: 'water' | 'exercise' | 'sleep', value: number) => {
    const dashboardData = localStorage.getItem("koru-dashboard")
    if (dashboardData) {
      const data = JSON.parse(dashboardData)
      if (data.habitsProgress && data.habitsProgress[habit]) {
        data.habitsProgress[habit].current = value
        localStorage.setItem("koru-dashboard", JSON.stringify(data))
        // Notify dashboard of update
        window.dispatchEvent(new Event('koru-dashboard-updated'))
      }
    }
  }

  useEffect(() => {
    // Save lifestyle-specific data (sleep times, avoid checklist)
    localStorage.setItem(
      "koru-lifestyle",
      JSON.stringify({ sleepBedtime, sleepWake, avoidChecklist }),
    )
    
    // Update sleep hours in dashboard based on sleep schedule
    const bedtime = sleepBedtime.split(':').map(n => parseInt(n))
    const waketime = sleepWake.split(':').map(n => parseInt(n))
    if (bedtime.length === 2 && waketime.length === 2) {
      const bedMinutes = bedtime[0] * 60 + bedtime[1]
      const wakeMinutes = waketime[0] * 60 + waketime[1]
      const sleepDuration = ((wakeMinutes - bedMinutes + 24 * 60) % (24 * 60)) / 60
      updateDashboardHabits('sleep', Math.round(sleepDuration * 10) / 10) // Round to 1 decimal
    }
  }, [sleepBedtime, sleepWake, avoidChecklist])


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
  
  // Load chat messages from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem("koru-lifestyle-chat")
    if (savedChat) {
      try {
        const messages = JSON.parse(savedChat)
        // Convert timestamp strings back to Date objects
        const parsedMessages = messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setChatMessages(parsedMessages)
      } catch (error) {
        console.error('Failed to load chat messages:', error)
      }
    }
  }, [])
  
  // Save chat messages to localStorage whenever they change
  useEffect(() => {
    if (chatMessages.length > 1) { // Don't save if only welcome message
      localStorage.setItem("koru-lifestyle-chat", JSON.stringify(chatMessages))
    }
  }, [chatMessages])

  // Load completed workouts from localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const savedWorkouts = localStorage.getItem(`koru-workouts-${today}`)
    if (savedWorkouts) {
      try {
        setCompletedWorkouts(JSON.parse(savedWorkouts))
      } catch (error) {
        console.error('Failed to load workouts:', error)
      }
    }
  }, [])

  // Daily workout exercises (rotate daily)
  const getDailyWorkouts = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const workoutSets = [
      // Day 1 - Upper Body Focus
      [
        {
          id: "pushups",
          title: "Push-ups",
          emoji: "💪",
          duration: 10,
          difficulty: "Beginner",
          category: "Upper Body",
          description: "Classic chest and arm strengthening exercise",
          instructions: [
            "Start in plank position with hands shoulder-width apart",
            "Lower your chest to the floor keeping body straight",
            "Push back up to starting position",
            "Repeat for 30 seconds, rest 30 seconds, 3 sets"
          ]
        },
        {
          id: "arm-circles",
          title: "Arm Circles",
          emoji: "🔄",
          duration: 8,
          difficulty: "Easy",
          category: "Upper Body",
          description: "Shoulder mobility and warm-up exercise",
          instructions: [
            "Extend arms straight out to sides",
            "Make small circles forward for 30 seconds",
            "Reverse direction for 30 seconds",
            "Gradually increase circle size"
          ]
        },
        {
          id: "wall-sit",
          title: "Wall Sit",
          emoji: "🪑",
          duration: 12,
          difficulty: "Intermediate",
          category: "Lower Body",
          description: "Isometric leg strengthening against wall",
          instructions: [
            "Slide down wall until thighs parallel to floor",
            "Keep back flat against wall",
            "Hold position for 30-60 seconds",
            "Rest and repeat 3 times"
          ]
        }
      ],
      // Day 2 - Lower Body Focus
      [
        {
          id: "squats",
          title: "Squats",
          emoji: "🦵",
          duration: 12,
          difficulty: "Beginner",
          category: "Lower Body",
          description: "Complete lower body strengthening exercise",
          instructions: [
            "Stand with feet shoulder-width apart",
            "Lower hips back and down as if sitting in chair",
            "Keep chest up and knees behind toes",
            "Return to standing, repeat for 3 sets of 15"
          ]
        },
        {
          id: "lunges",
          title: "Lunges",
          emoji: "🚶",
          duration: 10,
          difficulty: "Intermediate",
          category: "Lower Body",
          description: "Single-leg strengthening and balance exercise",
          instructions: [
            "Step forward with one leg",
            "Lower hips until both knees at 90 degrees",
            "Push back to starting position",
            "Alternate legs for 2 sets of 10 each"
          ]
        },
        {
          id: "calf-raises",
          title: "Calf Raises",
          emoji: "⬆️",
          duration: 8,
          difficulty: "Easy",
          category: "Lower Body",
          description: "Calf muscle strengthening exercise",
          instructions: [
            "Stand with feet hip-width apart",
            "Rise up on toes as high as possible",
            "Hold for 2 seconds, lower slowly",
            "Repeat for 3 sets of 20"
          ]
        }
      ],
      // Day 3 - Core Focus
      [
        {
          id: "plank",
          title: "Plank",
          emoji: "🏃‍♀️",
          duration: 10,
          difficulty: "Intermediate",
          category: "Core",
          description: "Core stability and full-body strengthening",
          instructions: [
            "Start in push-up position on forearms",
            "Keep body in straight line from head to feet",
            "Hold for 30-60 seconds",
            "Rest 30 seconds, repeat 3 times"
          ]
        },
        {
          id: "bicycle-crunches",
          title: "Bicycle Crunches",
          emoji: "🚴",
          duration: 12,
          difficulty: "Intermediate",
          category: "Core",
          description: "Dynamic ab exercise targeting obliques",
          instructions: [
            "Lie on back, hands behind head",
            "Bring knee to opposite elbow in cycling motion",
            "Alternate sides in controlled movement",
            "Continue for 45 seconds, 3 sets"
          ]
        },
        {
          id: "mountain-climbers",
          title: "Mountain Climbers",
          emoji: "⛰️",
          duration: 8,
          difficulty: "Advanced",
          category: "Cardio",
          description: "High-intensity cardio and core exercise",
          instructions: [
            "Start in plank position",
            "Alternate bringing knees to chest quickly",
            "Keep core engaged and hips level",
            "Continue for 30 seconds, rest, repeat"
          ]
        }
      ],
      // Day 4 - Flexibility & Mobility
      [
        {
          id: "cat-cow",
          title: "Cat-Cow Stretch",
          emoji: "🐱",
          duration: 8,
          difficulty: "Easy",
          category: "Flexibility",
          description: "Spinal mobility and back tension relief",
          instructions: [
            "Start on hands and knees",
            "Arch back (cow), then round spine (cat)",
            "Move slowly and controlled",
            "Repeat for 10-15 cycles"
          ]
        },
        {
          id: "child-pose",
          title: "Child's Pose",
          emoji: "🧘",
          duration: 5,
          difficulty: "Easy",
          category: "Flexibility",
          description: "Relaxing hip and back stretch",
          instructions: [
            "Kneel on floor, sit back on heels",
            "Reach arms forward, lower forehead to floor",
            "Breathe deeply and hold",
            "Hold for 1-2 minutes"
          ]
        },
        {
          id: "neck-rolls",
          title: "Neck Rolls",
          emoji: "🔄",
          duration: 7,
          difficulty: "Easy",
          category: "Flexibility",
          description: "Neck tension relief and mobility",
          instructions: [
            "Sit or stand with shoulders relaxed",
            "Slowly roll head in gentle circles",
            "5 circles each direction",
            "Move slowly, avoid forcing movement"
          ]
        }
      ],
      // Day 5 - Cardio Blast
      [
        {
          id: "jumping-jacks",
          title: "Jumping Jacks",
          emoji: "🤸",
          duration: 10,
          difficulty: "Beginner",
          category: "Cardio",
          description: "Full-body cardiovascular exercise",
          instructions: [
            "Start with feet together, arms at sides",
            "Jump feet apart while raising arms overhead",
            "Jump back to starting position",
            "Continue for 45 seconds, rest, repeat"
          ]
        },
        {
          id: "high-knees",
          title: "High Knees",
          emoji: "🏃‍♀️",
          duration: 8,
          difficulty: "Intermediate",
          category: "Cardio",
          description: "Running in place with high knee lifts",
          instructions: [
            "Run in place lifting knees high",
            "Pump arms naturally",
            "Keep core engaged",
            "Continue for 30 seconds, 3 sets"
          ]
        },
        {
          id: "burpees",
          title: "Burpees",
          emoji: "💥",
          duration: 15,
          difficulty: "Advanced",
          category: "Cardio",
          description: "Full-body explosive cardio exercise",
          instructions: [
            "Start standing, drop to squat",
            "Jump back to plank, do push-up",
            "Jump feet back to squat, jump up",
            "Repeat for 30 seconds, rest 30, repeat"
          ]
        }
      ]
    ]
    
    return workoutSets[dayOfYear % workoutSets.length]
  }

  // Save completed workouts
  const saveCompletedWorkouts = (workouts: string[]) => {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(`koru-workouts-${today}`, JSON.stringify(workouts))
    setCompletedWorkouts(workouts)
  }

  // Workout timer functions
  const startWorkout = (workout: any) => {
    setActiveWorkout(workout.id)
    setWorkoutTimer(workout.duration * 60) // Convert minutes to seconds
    setIsWorkoutActive(true)
    
    const interval = setInterval(() => {
      setWorkoutTimer(prev => {
        if (prev <= 1) {
          setIsWorkoutActive(false)
          setActiveWorkout(null)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    setWorkoutInterval(interval)
  }

  const stopWorkout = () => {
    if (workoutInterval) {
      clearInterval(workoutInterval)
      setWorkoutInterval(null)
    }
    setIsWorkoutActive(false)
    setActiveWorkout(null)
    setWorkoutTimer(0)
  }

  const finishWorkout = (workout: any) => {
    // Stop timer
    if (workoutInterval) {
      clearInterval(workoutInterval)
      setWorkoutInterval(null)
    }
    setIsWorkoutActive(false)
    setActiveWorkout(null)
    setWorkoutTimer(0)
    
    // Mark as completed
    if (!completedWorkouts.includes(workout.id)) {
      const newCompleted = [...completedWorkouts, workout.id]
      saveCompletedWorkouts(newCompleted)
      
      // Update dashboard counters
      updateDashboardExerciseCount('breathing') // Generic exercise increment
      
      // Add exercise minutes
      updateExerciseMinutes(exerciseMinutes + workout.duration)
    }
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (workoutInterval) {
        clearInterval(workoutInterval)
      }
    }
  }, [workoutInterval])

  // Update dashboard exercise counter
  const updateDashboardExerciseCount = (exerciseType: 'breathing' | 'meditation' | 'journal') => {
    const dashboardData = localStorage.getItem("koru-dashboard")
    if (dashboardData) {
      try {
        const data = JSON.parse(dashboardData)
        const today = new Date().toISOString().split('T')[0]
        
        // Initialize dailyGoals if needed
        if (!data.dailyGoals || data.dailyGoals.date !== today) {
          data.dailyGoals = {
            exerciseGoal: 3,
            exerciseCompleted: 0,
            date: today
          }
        }
        
        // Increment exercise count
        if (data.completedExercises && data.completedExercises[exerciseType] !== undefined) {
          data.completedExercises[exerciseType]++
          data.dailyGoals.exerciseCompleted++
          
          // Update weekly goals if daily goal reached
          if (data.dailyGoals.exerciseCompleted >= data.dailyGoals.exerciseGoal && 
              data.weeklyGoals && data.weeklyGoals.completed < data.weeklyGoals.total) {
            data.weeklyGoals.completed++
          }
          
          localStorage.setItem("koru-dashboard", JSON.stringify(data))
          window.dispatchEvent(new Event('koru-dashboard-updated'))
        }
      } catch (error) {
        console.error('Failed to update dashboard:', error)
      }
    }
  }

  // Complete workout function
  const completeWorkout = (workoutId: string, exerciseType: 'breathing' | 'meditation' | 'journal') => {
    if (!completedWorkouts.includes(workoutId)) {
      const newCompleted = [...completedWorkouts, workoutId]
      saveCompletedWorkouts(newCompleted)
      updateDashboardExerciseCount(exerciseType)
      
      // Add exercise minutes based on workout type
      const workoutMinutes = getWorkoutDuration(workoutId)
      updateExerciseMinutes(exerciseMinutes + workoutMinutes)
    }
  }

  const getWorkoutDuration = (workoutId: string): number => {
    const workout = getDailyWorkouts().find(w => w.id === workoutId)
    return workout ? workout.duration : 10
  }

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
              <Button size="sm" variant="outline" className="glass w-8 h-8 p-0" onClick={() => updateWaterGlasses(Math.max(0, waterGlasses - 1))}>-</Button>
              <span className="text-xl font-mono w-8 text-center">{waterGlasses}</span>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 w-8 h-8 p-0" onClick={() => updateWaterGlasses(Math.min(20, waterGlasses + 1))}>+</Button>
            </div>
            <p className="text-xs text-muted-foreground">glasses today</p>
          </Card>

          <Card className="glass-strong p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 flex items-center justify-center mb-3">
              <Activity className="h-6 w-6 text-pink-400" />
            </div>
            <h4 className="font-semibold mb-2">Exercise</h4>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Button size="sm" variant="outline" className="glass w-8 h-8 p-0" onClick={() => updateExerciseMinutes(Math.max(0, exerciseMinutes - 5))}>-</Button>
              <span className="text-xl font-mono w-12 text-center">{exerciseMinutes}</span>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700 w-8 h-8 p-0" onClick={() => updateExerciseMinutes(Math.min(240, exerciseMinutes + 5))}>+</Button>
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

        {/* Daily Home Workouts */}
        <Card className="glass-strong p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Zap className="h-6 w-6 text-orange-400" />
                Today's Home Workouts
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Complete exercises to boost your mood and energy</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {completedWorkouts.length}/{getDailyWorkouts().length}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>

          {/* Active Workout Timer */}
          {activeWorkout && isWorkoutActive && (
            <Card className="glass p-4 mb-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Timer className="h-5 w-5 text-orange-400" />
                  <h4 className="text-lg font-semibold text-orange-400">
                    {getDailyWorkouts().find(w => w.id === activeWorkout)?.title} in Progress
                  </h4>
                </div>
                <div className="text-4xl font-mono text-orange-400 mb-4">
                  {Math.floor(workoutTimer / 60)}:{(workoutTimer % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => finishWorkout(getDailyWorkouts().find(w => w.id === activeWorkout)!)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finish Workout
                  </Button>
                  <Button
                    onClick={stopWorkout}
                    variant="outline"
                    className="glass"
                  >
                    Stop
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Workout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getDailyWorkouts().map((workout) => {
              const isCompleted = completedWorkouts.includes(workout.id)
              const isActive = activeWorkout === workout.id
              
              return (
                <Card
                  key={workout.id}
                  className={`glass p-4 transition-all duration-200 ${
                    isCompleted ? 'bg-green-500/10 border-green-500/30' : 
                    isActive ? 'bg-orange-500/10 border-orange-500/30' :
                    'hover:glass-strong hover:scale-105'
                  }`}
                >
                  <div className="text-center space-y-3">
                    {/* Workout Emoji & Status */}
                    <div className="relative">
                      <div className="text-4xl mb-2">{workout.emoji}</div>
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1">
                          <CheckCircle className="h-6 w-6 text-green-500 bg-background rounded-full" />
                        </div>
                      )}
                    </div>
                    
                    {/* Workout Info */}
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{workout.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{workout.description}</p>
                      
                      {/* Meta Info */}
                      <div className="flex justify-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {workout.duration} min
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          workout.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          workout.difficulty === 'Beginner' ? 'bg-blue-500/20 text-blue-400' :
                          workout.difficulty === 'Intermediate' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {workout.difficulty}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-3">
                        <span className="px-2 py-1 glass rounded-full">{workout.category}</span>
                      </div>
                    </div>
                    
                    {/* Instructions Preview */}
                    <div className="text-xs text-muted-foreground text-left space-y-1">
                      {workout.instructions.slice(0, 2).map((instruction, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          <span>{instruction}</span>
                        </div>
                      ))}
                      {workout.instructions.length > 2 && (
                        <div className="text-center text-muted-foreground/70">...</div>
                      )}
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-2">
                      {isCompleted ? (
                        <Button
                          disabled
                          className="w-full bg-green-500/20 text-green-400 cursor-not-allowed"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed!
                        </Button>
                      ) : isActive && isWorkoutActive ? (
                        <Button
                          onClick={() => finishWorkout(workout)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Finish
                        </Button>
                      ) : (
                        <Button
                          onClick={() => startWorkout(workout)}
                          disabled={isWorkoutActive}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Workout
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
          
          {/* Progress Summary */}
          <div className="mt-6 p-4 glass rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-500">{completedWorkouts.length}</div>
                <div className="text-xs text-muted-foreground">Completed Today</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">
                  {getDailyWorkouts().reduce((sum, w) => completedWorkouts.includes(w.id) ? sum + w.duration : sum, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Minutes Exercised</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  {new Set(getDailyWorkouts().filter(w => completedWorkouts.includes(w.id)).map(w => w.category)).size}
                </div>
                <div className="text-xs text-muted-foreground">Categories Done</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">
                  {Math.round((completedWorkouts.length / getDailyWorkouts().length) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Daily Progress</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Healthy Recipe Suggestions */}
        <Card className="glass-strong p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
              <Utensils className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Today's Healthy Recipe Ideas</h3>
              <p className="text-sm text-muted-foreground">Nutritious meals that support your mental wellness</p>
            </div>
          </div>
          
          <RecipeSection />
        </Card>

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



