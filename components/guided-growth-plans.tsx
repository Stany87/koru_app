"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Target,
  CheckCircle,
  Calendar,
  Lock,
  Clock,
  Award,
  Star,
} from "lucide-react"
import EnhancedNavigation from "@/components/enhanced-navigation"

interface DailyTask {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
  category: 'foundation' | 'wellness' | 'growth'
}

interface DayProgress {
  date: string
  dayNumber: number
  weekNumber: number
  tasks: DailyTask[]
  completed: boolean
  tasksCompletedCount: number
}

interface WeekTheme {
  week: number
  title: string
  description: string
  color: string
}

interface GuidedGrowthPlansProps {
  onBack: () => void
  onHome?: () => void
}

const weekThemes: WeekTheme[] = [
  { week: 1, title: "Foundation Week", description: "Building basic daily habits", color: "from-blue-500/20 to-cyan-500/20" },
  { week: 2, title: "Movement Week", description: "Adding physical activity", color: "from-green-500/20 to-emerald-500/20" },
  { week: 3, title: "Mindfulness Week", description: "Deepening awareness", color: "from-purple-500/20 to-pink-500/20" },
  { week: 4, title: "Connection Week", description: "Building relationships", color: "from-orange-500/20 to-red-500/20" },
]

// Generate daily tasks based on day number
const generateDailyTasks = (dayNumber: number): DailyTask[] => {
  const weekNumber = Math.ceil(dayNumber / 7)
  const dayInWeek = ((dayNumber - 1) % 7) + 1
  
  const baseTasks: DailyTask[] = [
    {
      id: `day${dayNumber}-bed`,
      title: "Make your bed",
      description: "Start your day with a small accomplishment",
      duration: "2 min",
      completed: false,
      category: 'foundation'
    }
  ]
  
  // Add reading task (duration increases over time)
  if (dayNumber >= 1) {
    const readingMinutes = Math.min(5 + Math.floor(dayNumber / 7) * 5, 20)
    baseTasks.push({
      id: `day${dayNumber}-read`,
      title: `Read for ${readingMinutes} minutes`,
      description: "Choose any book or article that interests you",
      duration: `${readingMinutes} min`,
      completed: false,
      category: 'growth'
    })
  }
  
  // Add breathing exercise (duration increases)
  if (dayNumber >= 1) {
    const breathingMinutes = Math.min(5 + Math.floor((dayNumber - 1) / 10) * 5, 15)
    baseTasks.push({
      id: `day${dayNumber}-breathe`,
      title: `${breathingMinutes}-minute breathing`,
      description: "Practice deep breathing to center yourself",
      duration: `${breathingMinutes} min`,
      completed: false,
      category: 'wellness'
    })
  }
  
  // Add movement task (starts from day 8)
  if (dayNumber >= 8) {
    const walkMinutes = Math.min(10 + Math.floor((dayNumber - 8) / 7) * 5, 30)
    baseTasks.push({
      id: `day${dayNumber}-walk`,
      title: `${walkMinutes}-minute walk`,
      description: "Take a gentle walk outdoors or around your home",
      duration: `${walkMinutes} min`,
      completed: false,
      category: 'wellness'
    })
  }
  
  // Add gratitude practice (starts from day 15)
  if (dayNumber >= 15) {
    baseTasks.push({
      id: `day${dayNumber}-gratitude`,
      title: "Write 3 things you're grateful for",
      description: "Reflect on positive aspects of your day",
      duration: "5 min",
      completed: false,
      category: 'growth'
    })
  }
  
  // Add connection task (starts from day 22)
  if (dayNumber >= 22) {
    baseTasks.push({
      id: `day${dayNumber}-connect`,
      title: "Reach out to someone you care about",
      description: "Send a message or call a friend or family member",
      duration: "10 min",
      completed: false,
      category: 'growth'
    })
  }
  
  return baseTasks
}

export default function GuidedGrowthPlans({ onBack, onHome }: GuidedGrowthPlansProps) {
  const [todayProgress, setTodayProgress] = useState<DayProgress | null>(null)
  const [totalDaysCompleted, setTotalDaysCompleted] = useState<number>(0)
  const [currentStreak, setCurrentStreak] = useState<number>(0)

  // Get today's date
  const today = new Date().toISOString().split('T')[0]
  
  // Calculate which day number this is in the user's journey
  const calculateDayNumber = (startDate: string, currentDate: string): number => {
    const start = new Date(startDate)
    const current = new Date(currentDate)
    const diffTime = Math.abs(current.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }
  
  // Initialize today's progress
  const initializeTodayProgress = (): DayProgress => {
    const savedData = localStorage.getItem('koru-growth-progress')
    let startDate = today
    let dayNumber = 1
    
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        startDate = data.startDate || today
        dayNumber = calculateDayNumber(startDate, today)
      } catch {
        localStorage.setItem('koru-growth-progress', JSON.stringify({ startDate: today, completedDays: [] }))
      }
    } else {
      localStorage.setItem('koru-growth-progress', JSON.stringify({ startDate: today, completedDays: [] }))
    }
    
    const weekNumber = Math.ceil(dayNumber / 7)
    const tasks = generateDailyTasks(dayNumber)
    
    // Try to load today's progress if it exists
    const todayKey = `day-${today}`
    const savedTodayProgress = localStorage.getItem(todayKey)
    let todayTasks = tasks
    
    if (savedTodayProgress) {
      try {
        const saved = JSON.parse(savedTodayProgress)
        todayTasks = saved.tasks || tasks
      } catch {
        // Use default tasks if parse fails
      }
    }
    
    const completedCount = todayTasks.filter(t => t.completed).length
    const isCompleted = completedCount === todayTasks.length && todayTasks.length > 0
    
    return {
      date: today,
      dayNumber,
      weekNumber,
      tasks: todayTasks,
      completed: isCompleted,
      tasksCompletedCount: completedCount
    }
  }

  useEffect(() => {
    // Initialize today's progress and load stats
    const progress = initializeTodayProgress()
    setTodayProgress(progress)
    
    // Load total stats
    const savedStats = localStorage.getItem('koru-growth-stats')
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats)
        setTotalDaysCompleted(stats.totalDaysCompleted || 0)
        setCurrentStreak(stats.currentStreak || 0)
      } catch {
        // Use defaults if parse fails
      }
    }
    
    // Sync initial progress with dashboard
    if (progress) {
      updateDashboardGrowthProgress(progress.tasksCompletedCount, progress.tasks.length)
    }
  }, [])

  // Save today's progress when it changes
  useEffect(() => {
    if (todayProgress) {
      const todayKey = `day-${today}`
      localStorage.setItem(todayKey, JSON.stringify(todayProgress))
      
      // Update stats if day is completed
      if (todayProgress.completed) {
        const savedStats = localStorage.getItem('koru-growth-stats')
        let stats = { totalDaysCompleted: 0, currentStreak: 0 }
        if (savedStats) {
          try {
            stats = JSON.parse(savedStats)
          } catch {}
        }
        
        // Check if today wasn't already counted
        const completedDays = localStorage.getItem('koru-completed-days')
        let days: string[] = []
        if (completedDays) {
          try {
            days = JSON.parse(completedDays)
          } catch {}
        }
        
        if (!days.includes(today)) {
          days.push(today)
          stats.totalDaysCompleted += 1
          stats.currentStreak += 1 // Simplified streak calculation
          
          localStorage.setItem('koru-completed-days', JSON.stringify(days))
          localStorage.setItem('koru-growth-stats', JSON.stringify(stats))
          
          setTotalDaysCompleted(stats.totalDaysCompleted)
          setCurrentStreak(stats.currentStreak)
        }
      }
    }
  }, [todayProgress])

  const toggleTask = (taskId: string) => {
    if (!todayProgress) return
    
    const updatedTasks = todayProgress.tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    
    const completedCount = updatedTasks.filter(t => t.completed).length
    const isCompleted = completedCount === updatedTasks.length && updatedTasks.length > 0
    
    setTodayProgress({
      ...todayProgress,
      tasks: updatedTasks,
      tasksCompletedCount: completedCount,
      completed: isCompleted
    })
    
    // Update dashboard daily goals when task completion changes
    updateDashboardGrowthProgress(completedCount, updatedTasks.length)
  }
  
  // Function to update dashboard with growth plan progress
  const updateDashboardGrowthProgress = (completedTasks: number, totalTasks: number) => {
    const dashboardData = localStorage.getItem("koru-dashboard")
    if (dashboardData) {
      try {
        const data = JSON.parse(dashboardData)
        const today = new Date().toISOString().split('T')[0]
        
        // Update daily goals to reflect growth plan progress
        data.dailyGoals = {
          ...data.dailyGoals,
          exerciseGoal: totalTasks, // Total number of growth tasks for today
          exerciseCompleted: completedTasks, // Number of completed growth tasks
          date: today
        }
        
        // Update weekly goals (now daily goals) - mark as complete when all tasks done
        data.weeklyGoals = {
          completed: completedTasks >= totalTasks ? 1 : 0,
          total: 1
        }
        
        localStorage.setItem("koru-dashboard", JSON.stringify(data))
        window.dispatchEvent(new Event('koru-dashboard-updated'))
      } catch (error) {
        console.error('Failed to update dashboard:', error)
      }
    }
  }

  const getTodayProgress = () => {
    if (!todayProgress || todayProgress.tasks.length === 0) return 0
    return (todayProgress.tasksCompletedCount / todayProgress.tasks.length) * 100
  }

  const getCurrentWeekTheme = () => {
    if (!todayProgress) return weekThemes[0]
    const themeIndex = (todayProgress.weekNumber - 1) % weekThemes.length
    return weekThemes[themeIndex]
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <EnhancedNavigation
        title="Guided Growth Plans"
        subtitle="Structured wellness journey"
        icon={Target}
        iconColor="text-primary"
        onBack={onBack}
        showHomeButton={true}
        onHome={onHome}
        breadcrumbs={[
          { label: "Wellness", icon: Star }
        ]}
      />

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Journey Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-strong p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">{todayProgress?.dayNumber || 1}</h3>
              <p className="text-sm text-muted-foreground">Current Day</p>
            </div>
          </Card>
          <Card className="glass-strong p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-500">{totalDaysCompleted}</h3>
              <p className="text-sm text-muted-foreground">Days Completed</p>
            </div>
          </Card>
          <Card className="glass-strong p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-500">{currentStreak}</h3>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </Card>
        </div>

        {/* Today's Progress */}
        <Card className="glass-strong p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Progress</h2>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{Math.round(getTodayProgress())}%</p>
              <p className="text-sm text-muted-foreground">Day {todayProgress?.dayNumber || 1} • {getCurrentWeekTheme().title}</p>
            </div>
          </div>
          <Progress value={getTodayProgress()} className="h-3" />
        </Card>

        {/* Today's Tasks */}
        {todayProgress && (
          <Card className="glass-strong p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Today's Tasks</h3>
                <p className="text-muted-foreground">{getCurrentWeekTheme().description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {todayProgress.tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`glass p-4 transition-all duration-200 ${
                    task.completed ? "bg-green-500/10 border-green-500/30" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
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
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.category === 'foundation' ? 'bg-blue-500/20 text-blue-400' :
                          task.category === 'wellness' ? 'bg-green-500/20 text-green-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {task.category}
                        </span>
                      </div>
                    </div>
                    {task.completed && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {todayProgress.completed && (
              <div className="mt-6 p-4 glass rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-green-700">Day Completed! 🎉</h4>
                    <p className="text-sm text-green-600">
                      Excellent work! You've completed all tasks for today. Come back tomorrow for new challenges!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Weekly Progress Overview */}
        <Card className="glass-strong p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Journey</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weekThemes.map((theme) => {
              const isCurrentWeek = todayProgress && todayProgress.weekNumber === theme.week
              const isPastWeek = todayProgress && todayProgress.weekNumber > theme.week
              return (
                <Card
                  key={theme.week}
                  className={`glass p-4 text-center transition-all duration-200 ${
                    isCurrentWeek ? "border-primary/50 bg-primary/10" : 
                    isPastWeek ? "bg-green-500/10 border-green-500/30" : 
                    "opacity-50"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full glass flex items-center justify-center">
                    {isPastWeek ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : isCurrentWeek ? (
                      <Calendar className="h-6 w-6 text-primary" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{theme.title}</h4>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                  <p className="text-xs text-primary mt-1">Week {theme.week}</p>
                </Card>
              )
            })}
          </div>
        </Card>

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

