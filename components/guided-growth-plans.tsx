"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Calendar, 
  CheckCircle, 
  Circle, 
  Lock, 
  Star, 
  Target,
  Clock,
  Award,
  ArrowRight,
  ArrowLeft
} from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
}

interface Week {
  id: number
  title: string
  description: string
  unlocked: boolean
  tasks: Task[]
  completed: boolean
}

interface GuidedGrowthPlansProps {
  onBack: () => void
}

const initialWeeks: Week[] = [
  {
    id: 1,
    title: "Foundation Week",
    description: "Building healthy daily habits",
    unlocked: true,
    completed: false,
    tasks: [
      {
        id: "w1d1-bed",
        title: "Make your bed",
        description: "Start your day with a small accomplishment",
        duration: "2 min",
        completed: false
      },
      {
        id: "w1d1-read",
        title: "Read for 10 minutes",
        description: "Choose any book or article that interests you",
        duration: "10 min",
        completed: false
      },
      {
        id: "w1d1-breathe",
        title: "5-minute guided breathing",
        description: "Practice deep breathing to center yourself",
        duration: "5 min",
        completed: false
      }
    ]
  },
  {
    id: 2,
    title: "Movement Week",
    description: "Adding physical activity to your routine",
    unlocked: false,
    completed: false,
    tasks: [
      {
        id: "w2d1-bed",
        title: "Make your bed",
        description: "Start your day with a small accomplishment",
        duration: "2 min",
        completed: false
      },
      {
        id: "w2d1-read",
        title: "Read for 10 minutes",
        description: "Choose any book or article that interests you",
        duration: "10 min",
        completed: false
      },
      {
        id: "w2d1-breathe",
        title: "5-minute guided breathing",
        description: "Practice deep breathing to center yourself",
        duration: "5 min",
        completed: false
      },
      {
        id: "w2d1-walk",
        title: "15-minute walk",
        description: "Take a gentle walk outdoors or around your home",
        duration: "15 min",
        completed: false
      }
    ]
  },
  {
    id: 3,
    title: "Mindfulness Week",
    description: "Deepening your mindfulness practice",
    unlocked: false,
    completed: false,
    tasks: [
      {
        id: "w3d1-bed",
        title: "Make your bed",
        description: "Start your day with a small accomplishment",
        duration: "2 min",
        completed: false
      },
      {
        id: "w3d1-read",
        title: "Read for 15 minutes",
        description: "Choose any book or article that interests you",
        duration: "15 min",
        completed: false
      },
      {
        id: "w3d1-breathe",
        title: "10-minute guided breathing",
        description: "Practice deep breathing to center yourself",
        duration: "10 min",
        completed: false
      },
      {
        id: "w3d1-walk",
        title: "20-minute walk",
        description: "Take a gentle walk outdoors or around your home",
        duration: "20 min",
        completed: false
      },
      {
        id: "w3d1-gratitude",
        title: "Write 3 things you're grateful for",
        description: "Reflect on positive aspects of your day",
        duration: "5 min",
        completed: false
      }
    ]
  },
  {
    id: 4,
    title: "Connection Week",
    description: "Building meaningful connections",
    unlocked: false,
    completed: false,
    tasks: [
      {
        id: "w4d1-bed",
        title: "Make your bed",
        description: "Start your day with a small accomplishment",
        duration: "2 min",
        completed: false
      },
      {
        id: "w4d1-read",
        title: "Read for 15 minutes",
        description: "Choose any book or article that interests you",
        duration: "15 min",
        completed: false
      },
      {
        id: "w4d1-breathe",
        title: "10-minute guided breathing",
        description: "Practice deep breathing to center yourself",
        duration: "10 min",
        completed: false
      },
      {
        id: "w4d1-walk",
        title: "20-minute walk",
        description: "Take a gentle walk outdoors or around your home",
        duration: "20 min",
        completed: false
      },
      {
        id: "w4d1-gratitude",
        title: "Write 3 things you're grateful for",
        description: "Reflect on positive aspects of your day",
        duration: "5 min",
        completed: false
      },
      {
        id: "w4d1-connect",
        title: "Reach out to someone you care about",
        description: "Send a message or call a friend or family member",
        duration: "10 min",
        completed: false
      }
    ]
  },
  {
    id: 5,
    title: "Growth Week",
    description: "Challenging yourself with new activities",
    unlocked: false,
    completed: false,
    tasks: [
      {
        id: "w5d1-bed",
        title: "Make your bed",
        description: "Start your day with a small accomplishment",
        duration: "2 min",
        completed: false
      },
      {
        id: "w5d1-read",
        title: "Read for 20 minutes",
        description: "Choose any book or article that interests you",
        duration: "20 min",
        completed: false
      },
      {
        id: "w5d1-breathe",
        title: "15-minute guided breathing",
        description: "Practice deep breathing to center yourself",
        duration: "15 min",
        completed: false
      },
      {
        id: "w5d1-walk",
        title: "25-minute walk",
        description: "Take a gentle walk outdoors or around your home",
        duration: "25 min",
        completed: false
      },
      {
        id: "w5d1-gratitude",
        title: "Write 3 things you're grateful for",
        description: "Reflect on positive aspects of your day",
        duration: "5 min",
        completed: false
      },
      {
        id: "w5d1-connect",
        title: "Reach out to someone you care about",
        description: "Send a message or call a friend or family member",
        duration: "10 min",
        completed: false
      },
      {
        id: "w5d1-learn",
        title: "Learn something new",
        description: "Watch a tutorial, read an article, or try a new skill",
        duration: "30 min",
        completed: false
      }
    ]
  }
]

export default function GuidedGrowthPlans({ onBack }: GuidedGrowthPlansProps) {
  const [weeks, setWeeks] = useState<Week[]>(initialWeeks)
  const [currentWeek, setCurrentWeek] = useState<number>(1)
  const [activeDays, setActiveDays] = useState<string[]>([])

  const isoYmd = (d: Date) => d.toISOString().split('T')[0]

  const unlockByActiveDays = (daysCount: number, baseWeeks: Week[]): Week[] => {
    // Week 1: immediate, Week2: >=7, Week3: >=14, Week4: >=21, Week5: >=28
    return baseWeeks.map((w) => {
      if (w.id === 1) return { ...w, unlocked: true }
      if (w.id === 2) return { ...w, unlocked: daysCount >= 7 }
      if (w.id === 3) return { ...w, unlocked: daysCount >= 14 }
      if (w.id === 4) return { ...w, unlocked: daysCount >= 21 }
      if (w.id === 5) return { ...w, unlocked: daysCount >= 28 }
      return w
    })
  }

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem("koru-growth-plans")
    const savedActive = localStorage.getItem("koru-active-days")
    const today = isoYmd(new Date())

    let days: string[] = []
    if (savedActive) {
      try { days = Array.from(new Set(JSON.parse(savedActive))) } catch { days = [] }
    }
    if (!days.includes(today)) {
      days = [...days, today]
    }
    setActiveDays(days)
    localStorage.setItem("koru-active-days", JSON.stringify(days))

    if (savedProgress) {
      try {
        const parsed: Week[] = JSON.parse(savedProgress)
        setWeeks(unlockByActiveDays(days.length, parsed))
      } catch {
        setWeeks(unlockByActiveDays(days.length, initialWeeks))
      }
    } else {
      setWeeks(unlockByActiveDays(days.length, initialWeeks))
    }
  }, [])

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem("koru-growth-plans", JSON.stringify(weeks))
  }, [weeks])

  // Whenever activeDays change, re-evaluate unlocks
  useEffect(() => {
    setWeeks(prev => unlockByActiveDays(activeDays.length, prev))
  }, [activeDays])

  const toggleTask = (weekId: number, taskId: string) => {
    setWeeks(prevWeeks => 
      prevWeeks.map(week => 
        week.id === weekId 
          ? {
              ...week,
              tasks: week.tasks.map(task => 
                task.id === taskId 
                  ? { ...task, completed: !task.completed }
                  : task
              )
            }
          : week
      )
    )
  }

  const getWeekProgress = (week: Week) => {
    const completedTasks = week.tasks.filter(task => task.completed).length
    return (completedTasks / week.tasks.length) * 100
  }

  const getOverallProgress = () => {
    const totalTasks = weeks.reduce((acc, week) => acc + week.tasks.length, 0)
    const completedTasks = weeks.reduce((acc, week) => 
      acc + week.tasks.filter(task => task.completed).length, 0
    )
    return (completedTasks / totalTasks) * 100
  }

  const unlockNextWeek = (weekId: number) => {
    if (weekId < weeks.length) {
      setWeeks(prevWeeks => 
        prevWeeks.map(week => 
          week.id === weekId + 1 
            ? { ...week, unlocked: true }
            : week
        )
      )
    }
  }

  const checkWeekCompletion = (week: Week) => {
    const allTasksCompleted = week.tasks.every(task => task.completed)
    if (allTasksCompleted && !week.completed) {
      setWeeks(prevWeeks => 
        prevWeeks.map(w => 
          w.id === week.id 
            ? { ...w, completed: true }
            : w
        )
      )
      unlockNextWeek(week.id)
    }
  }

  useEffect(() => {
    weeks.forEach(week => checkWeekCompletion(week))
  }, [weeks])

  const currentWeekData = weeks.find(w => w.id === currentWeek)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass border-b border-white/10 p-4 mb-6">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="glass-strong" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Guided Growth Plans</h1>
              <p className="text-sm text-muted-foreground">Structured wellness journey</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Overall Progress */}
        <Card className="glass-strong p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{Math.round(getOverallProgress())}%</p>
              <p className="text-sm text-muted-foreground">Overall completion</p>
            </div>
          </div>
          <Progress value={getOverallProgress()} className="h-3" />
        </Card>

        {/* Week Navigation */}
        <Card className="glass-strong p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weeks.map((week) => (
              <Card
                key={week.id}
                className={`glass p-4 cursor-pointer transition-all duration-200 ${
                  currentWeek === week.id 
                    ? "border-primary/50 bg-primary/10" 
                    : week.unlocked 
                    ? "hover:glass-strong" 
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => week.unlocked && setCurrentWeek(week.id)}
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full glass flex items-center justify-center">
                    {week.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : week.unlocked ? (
                      <Calendar className="h-6 w-6 text-primary" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm">{week.title}</h4>
                  <p className="text-xs text-muted-foreground">{week.description}</p>
                  <div className="text-xs">
                    <Progress value={getWeekProgress(week)} className="h-1 mb-1" />
                    <span>{Math.round(getWeekProgress(week))}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Current Week Details */}
        {currentWeekData && (
          <Card className="glass-strong p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">{currentWeekData.title}</h3>
                <p className="text-muted-foreground">{currentWeekData.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(getWeekProgress(currentWeekData))}%
                </p>
                <p className="text-sm text-muted-foreground">Week progress</p>
              </div>
            </div>

            <Progress value={getWeekProgress(currentWeekData)} className="h-3 mb-6" />

            <div className="space-y-4">
              <h4 className="font-semibold">Daily Tasks</h4>
              {currentWeekData.tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`glass p-4 transition-all duration-200 ${
                    task.completed ? "bg-green-500/10 border-green-500/30" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(currentWeekData.id, task.id)}
                      className="flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h5>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {task.duration}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    {task.completed && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {currentWeekData.completed && (
              <div className="mt-6 p-4 glass rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-green-700">Week Completed! 🎉</h4>
                    <p className="text-sm text-green-600">
                      Great job! You've unlocked the next week. Keep up the amazing work!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Tips */}
        <Card className="glass-strong p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Tips for Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Start Small</h4>
              <p className="text-sm text-muted-foreground">
                Begin with just one task per day. It's better to complete one task consistently than to overwhelm yourself.
              </p>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Be Consistent</h4>
              <p className="text-sm text-muted-foreground">
                Try to do your tasks at the same time each day. This helps build a routine and makes it easier to stick with.
              </p>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Celebrate Progress</h4>
              <p className="text-sm text-muted-foreground">
                Acknowledge your achievements, no matter how small. Every completed task is a step forward.
              </p>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Be Kind to Yourself</h4>
              <p className="text-sm text-muted-foreground">
                If you miss a day, don't give up. Just pick up where you left off and continue your journey.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

