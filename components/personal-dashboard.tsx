"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Calendar,
  Target,
  Heart,
  Activity,
  BookOpen,
  Clock,
  Award,
  BarChart3,
  MessageSquare
} from "lucide-react"
import { FernFrond } from "@/components/icons/fern-frond"
import DebugMoodTest from "@/components/debug-mood-test"
import MoodCheckinCard from "@/components/mood-checkin-card"
import { AchievementsMiniWidget } from "@/components/achievements/AchievementsMiniWidget"
import { useActivityTracker } from "@/contexts/AchievementContext"

interface DashboardData {
  journalStreak: number
  moodTrend: { date: string; mood: number }[]
  habitsProgress: {
    water: { current: number; target: number; dailyGoal: number }
    exercise: { current: number; target: number; dailyGoal: number }
    sleep: { current: number; target: number; dailyGoal: number }
  }
  completedExercises: {
    breathing: number
    meditation: number
    journal: number
  }
  weeklyGoals: {
    completed: number
    total: number
  }
  dailyGoals: {
    exerciseGoal: number // Now represents total growth tasks for the day
    exerciseCompleted: number // Now represents completed growth tasks
    date: string
  }
}

interface PersonalDashboardProps {
  userName: string
  onNavigate: (mode: string) => void
  userId?: string
  showMoodCheckin?: boolean
  onMoodCheckin?: () => void
  onMoodCheckinDismiss?: () => void
}

export default function PersonalDashboard({ userName, onNavigate, userId, showMoodCheckin, onMoodCheckin, onMoodCheckinDismiss }: PersonalDashboardProps) {
  // Add instance tracking to prevent duplicate dashboard conflicts
  const instanceId = useMemo(() => Math.random().toString(36).substr(2, 9), [])
  const { trackActivity } = useActivityTracker()
  
  console.log(`🏠 PersonalDashboard instance ${instanceId} initialized`)

  // Check and reset daily progress every day at midnight
  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toISOString().split('T')[0] // Get YYYY-MM-DD format
      const lastResetKey = 'koru-last-daily-reset'
      const lastReset = localStorage.getItem(lastResetKey)
      
      // If no last reset recorded, set today and return
      if (!lastReset) {
        localStorage.setItem(lastResetKey, today)
        return
      }
      
      // If it's a new day, reset all daily progress
      if (lastReset !== today) {
        console.log('🔄 Resetting daily progress for new day:', today)
        setDashboardData(prev => {
          const newData = {
            ...prev,
            // Reset daily habit progress
            habitsProgress: {
              water: { current: 0, target: prev.habitsProgress.water.target, dailyGoal: prev.habitsProgress.water.dailyGoal },
              exercise: { current: 0, target: prev.habitsProgress.exercise.target, dailyGoal: prev.habitsProgress.exercise.dailyGoal },
              sleep: { current: 0, target: prev.habitsProgress.sleep.target, dailyGoal: prev.habitsProgress.sleep.dailyGoal }
            },
            // Reset exercise log
            completedExercises: {
              breathing: 0,
              meditation: 0,
              journal: 0
            },
            // Reset daily goals (will be updated when growth plans loads)
            dailyGoals: {
              exerciseGoal: 0, // Will be set by growth plans based on daily tasks
              exerciseCompleted: 0,
              date: today
            },
            // Reset weekly goals to daily goals (keep completed count but rename concept)
            weeklyGoals: {
              completed: 0,
              total: 1 // Change from weekly (7) to daily (1) target
            }
          }
          localStorage.setItem("koru-dashboard", JSON.stringify(newData))
          return newData
        })
        localStorage.setItem(lastResetKey, today)
      }
    }
    
    checkDailyReset()
    
    // Set up interval to check for day change every minute
    const checkInterval = setInterval(checkDailyReset, 60000) // Check every minute
    
    return () => clearInterval(checkInterval)
  }, [])
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    journalStreak: 0,
    moodTrend: [],
    habitsProgress: {
      water: { current: 0, target: 8, dailyGoal: 8 },
      exercise: { current: 0, target: 30, dailyGoal: 30 },
      sleep: { current: 0, target: 8, dailyGoal: 8 }
    },
    completedExercises: {
      breathing: 0,
      meditation: 0,
      journal: 0
    },
    weeklyGoals: {
      completed: 0,
      total: 1 // Changed from weekly (7) to daily (1) target
    },
    dailyGoals: {
      exerciseGoal: 0, // Will be updated by growth plans
      exerciseCompleted: 0,
      date: new Date().toISOString().split('T')[0]
    }
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Load dashboard data from localStorage
    const loadDashboardData = () => {
      const today = new Date().toISOString().split('T')[0]
      const savedData = localStorage.getItem("koru-dashboard")
      
      if (savedData) {
        const data = JSON.parse(savedData)
        
        // Check if data is from previous day and reset if needed
        if (!data.dailyGoals || data.dailyGoals.date !== today) {
          console.log('🔄 Dashboard data is from previous day, resetting daily progress')
          
          // Reset daily progress while preserving mood data and structure
          data.habitsProgress = {
            water: { current: 0, target: data.habitsProgress?.water?.target || 8, dailyGoal: data.habitsProgress?.water?.dailyGoal || 8 },
            exercise: { current: 0, target: data.habitsProgress?.exercise?.target || 30, dailyGoal: data.habitsProgress?.exercise?.dailyGoal || 30 },
            sleep: { current: 0, target: data.habitsProgress?.sleep?.target || 8, dailyGoal: data.habitsProgress?.sleep?.dailyGoal || 8 }
          }
          
          data.completedExercises = {
            breathing: 0,
            meditation: 0,
            journal: 0
          }
          
          data.dailyGoals = {
            exerciseGoal: 0, // Will be set by growth plans
            exerciseCompleted: 0,
            date: today
          }
          
          data.weeklyGoals = {
            completed: 0,
            total: 1 // Daily target instead of weekly
          }
          
          // Save the reset data
          localStorage.setItem("koru-dashboard", JSON.stringify(data))
          localStorage.setItem('koru-last-daily-reset', today)
        }
        
        // Ensure all required properties exist
        if (!data.dailyGoals) {
          data.dailyGoals = {
            exerciseGoal: 0, // Will be updated by growth plans
            exerciseCompleted: 0,
            date: today
          }
        }
        
        // Ensure habitsProgress has dailyGoal properties
        if (data.habitsProgress) {
          if (!data.habitsProgress.water.dailyGoal) data.habitsProgress.water.dailyGoal = 8
          if (!data.habitsProgress.exercise.dailyGoal) data.habitsProgress.exercise.dailyGoal = 30
          if (!data.habitsProgress.sleep.dailyGoal) data.habitsProgress.sleep.dailyGoal = 8
        }
        
        // Ensure weeklyGoals is set for daily targets
        if (!data.weeklyGoals || data.weeklyGoals.total === 7) {
          data.weeklyGoals = {
            completed: data.weeklyGoals?.completed || 0,
            total: 1 // Change to daily target
          }
        }
        
        setDashboardData(data)
      }
    }
    
    loadDashboardData()

    // Listen for storage changes to refresh data when updated elsewhere
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "koru-dashboard" && e.newValue) {
        setDashboardData(JSON.parse(e.newValue))
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events from the same tab
    const handleCustomUpdate = () => {
      // console.log(`📢 PersonalDashboard[${instanceId}]: Received koru-dashboard-updated event`)
      loadDashboardData()
    }
    
    window.addEventListener('koru-dashboard-updated', handleCustomUpdate)

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    
    return () => {
      clearInterval(timer)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('koru-dashboard-updated', handleCustomUpdate)
    }
  }, [])

  // REMOVED: Automatic localStorage save to prevent overwriting mood data
  // Dashboard data is now only saved when explicitly updated by user actions
  // Mood data is saved by the main app after mood assessments

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getMoodTrendData = () => {
    // Get past 7 days starting from today (left) to 6 days ago (right)
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      // Use timezone-aware date formatting to match mood data storage
      const dateString = date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' + 
        String(date.getDate()).padStart(2, '0')
      
      // Find existing mood data for this date
      const existingMood = dashboardData.moodTrend.find(day => day.date === dateString)
      
      days.push({
        date: dateString,
        mood: existingMood ? existingMood.mood : null, // null if no data logged
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0
      })
    }
    return days
  }

  const moodTrend = getMoodTrendData()

  const getMoodEmoji = (mood: number | null) => {
    if (mood === null) return "—"; // No data
    if (mood <= 1) return "😔"; // Red
    if (mood === 2) return "😕"; // Orange
    if (mood === 3) return "😐"; // Yellow
    if (mood === 4) return "🙂"; // Blue
    if (mood >= 5) return "😊"; // Green
    return "😐"; // Default
  };

  const getMoodColor = (mood: number | null) => {
    if (mood === null) return "text-gray-400"; // No data
    if (mood <= 1) return "text-red-500"; // Red
    if (mood === 2) return "text-orange-500"; // Orange
    if (mood === 3) return "text-yellow-500"; // Yellow
    if (mood === 4) return "text-blue-500"; // Blue
    if (mood >= 5) return "text-green-500"; // Green
    return "text-gray-400"; // Default
  };

  const getMoodBarColor = (mood: number | null) => {
    if (mood === null) return "bg-gray-300"; // No data
    if (mood <= 1) return "bg-red-500"; // Very poor
    if (mood === 2) return "bg-orange-500"; // Poor
    if (mood === 3) return "bg-yellow-500"; // Okay
    if (mood === 4) return "bg-blue-500"; // Good
    if (mood >= 5) return "bg-green-500"; // Excellent
    return "bg-gray-400"; // Default
  };

  // Calculate day streak based on consecutive days with mood entries
  const calculateDayStreak = () => {
    let streak = 0
    // Create a copy to avoid mutating the original array
    const sortedMoodData = [...dashboardData.moodTrend].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const checkDate = new Date()
      checkDate.setDate(checkDate.getDate() - i)
      const checkDateString = checkDate.getFullYear() + '-' + 
        String(checkDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(checkDate.getDate()).padStart(2, '0')
      
      const hasEntry = sortedMoodData.some(entry => entry.date === checkDateString)
      if (hasEntry) {
        streak++
      } else {
        break // Streak broken
      }
    }
    return streak
  }

  const dayStreak = calculateDayStreak()
  
  // Debug logging for Today's Mood display (reduced for cleaner output)
  if (moodTrend[0]?.mood) {
    console.log(`🙂 PersonalDashboard[${instanceId}]: Today's mood found - ${getMoodEmoji(moodTrend[0].mood)} (${moodTrend[0].mood}/5)`)
  } else {
    console.log(`❓ PersonalDashboard[${instanceId}]: No mood data for today`)
  }

  // Mood assessment handlers removed - now handled in main app

  const updateHabitProgress = (habit: keyof DashboardData['habitsProgress'], value: number) => {
    setDashboardData(prev => {
      const newData = {
        ...prev,
        habitsProgress: {
          ...prev.habitsProgress,
          [habit]: { ...prev.habitsProgress[habit], current: Math.max(0, value) }
        }
      }
      // Manually save to localStorage for habit updates only
      localStorage.setItem("koru-dashboard", JSON.stringify(newData))
      return newData
    });
  };

  const updateExerciseCount = async (exercise: keyof DashboardData['completedExercises']) => {
    // Track achievement first
    if (exercise === 'breathing') {
      await trackActivity('breathing_exercise')
    } else if (exercise === 'meditation') {
      await trackActivity('meditation')
    } else if (exercise === 'journal') {
      await trackActivity('journal_entry')
    }

    setDashboardData(prev => {
      const newData = {
        ...prev,
        completedExercises: {
          ...prev.completedExercises,
          [exercise]: prev.completedExercises[exercise] + 1
        }
      }
      
      // Manually save to localStorage for exercise updates only
      // Note: Daily goals are now managed by Growth Plans, not by these exercise buttons
      localStorage.setItem("koru-dashboard", JSON.stringify(newData))
      return newData
    });
  };

  return (
    <div className="space-y-6">
      {/* Debug component temporarily hidden */}
      {/* <DebugMoodTest userId={userId || null} /> */}
      
      {/* Mood Check-in Card */}
      {showMoodCheckin && onMoodCheckin && onMoodCheckinDismiss && (
        <MoodCheckinCard 
          onMoodCheck={onMoodCheckin}
          onDismiss={onMoodCheckinDismiss}
        />
      )}
      {/* Mood assessment popup removed - now only triggered from profile or main app */}
      {/* Welcome Section */}
      <Card className="glass-strong p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              {getGreeting()}, {userName}! 👋
            </h2>
            <p className="text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono text-primary">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <p className="text-sm text-muted-foreground">Current time</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Today's Streak Counter */}
        <Card className="glass p-4 text-center flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-3">
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-3xl font-bold text-primary mb-1">{dayStreak}</h3>
          <p className="text-sm text-muted-foreground">Today's Streak</p>
        </Card>
        
        {/* Achievements Panel */}
        <AchievementsMiniWidget className="col-span-1 md:col-span-2 lg:col-span-1" />

        <Card className="glass p-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-primary">
            {dashboardData.dailyGoals?.exerciseCompleted || 0}/{dashboardData.dailyGoals?.exerciseGoal || 0}
          </h3>
          <p className="text-sm text-muted-foreground">Daily Goals</p>
          {(dashboardData.dailyGoals?.exerciseCompleted || 0) >= (dashboardData.dailyGoals?.exerciseGoal || 0) && (dashboardData.dailyGoals?.exerciseGoal || 0) > 0 ? (
            <p className="text-xs text-green-500 mt-1 font-semibold">✓ All tasks completed!</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">Complete growth tasks</p>
          )}
        </Card>

        <Card className="glass p-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-2">
            <Activity className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-primary">
            {Object.values(dashboardData.completedExercises).reduce((a, b) => a + b, 0)}
          </h3>
          <p className="text-sm text-muted-foreground">Exercises Done</p>
          <p className="text-xs text-blue-500 mt-1">
            Growth Tasks: {dashboardData.dailyGoals?.exerciseCompleted || 0}/{dashboardData.dailyGoals?.exerciseGoal || 0}
          </p>
          <div className="flex gap-2 mt-3 justify-center">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => updateExerciseCount('breathing')}
              className="glass px-3 py-2 h-10 hover:bg-green-500/10 hover:scale-110 transition-all duration-200 border-green-500/30 hover:border-green-500/50 group"
              title="Breathing Exercise"
            >
              <span className="text-xl group-hover:animate-pulse">🫁</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => updateExerciseCount('meditation')}
              className="glass px-3 py-2 h-10 hover:bg-purple-500/10 hover:scale-110 transition-all duration-200 border-purple-500/30 hover:border-purple-500/50 group"
              title="Meditation"
            >
              <span className="text-xl group-hover:animate-pulse">🧘</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => updateExerciseCount('journal')}
              className="glass px-3 py-2 h-10 hover:bg-blue-500/10 hover:scale-110 transition-all duration-200 border-blue-500/30 hover:border-blue-500/50 group"
              title="Journaling"
            >
              <span className="text-xl group-hover:animate-pulse">📝</span>
            </Button>
          </div>
        </Card>

        <Card className="glass p-4 text-center flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-3">
            <Heart className="h-6 w-6 text-purple-500" />
          </div>
          <div className="text-4xl mb-2">
            {moodTrend.length > 0 ? getMoodEmoji(moodTrend[0].mood) : "😐"}
          </div>
          <p className="text-sm text-muted-foreground">Today's Mood</p>
        </Card>
      </div>

      {/* Mood Trends Chart */}
      <Card className="glass-strong p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Mood Trends (7 Days)
          </h3>
        </div>
        
        <div className="space-y-4">
          
          {/* Analytical Health Bars */}
          <div className="space-y-3">
            {moodTrend.map((day, index) => (
              <div key={day.date} className="flex items-center gap-3">
                {/* Day Label */}
                <div className="flex items-center gap-2 w-20">
                  <span className={`text-sm font-medium ${
                    day.isToday ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {day.isToday ? "Today" : day.dayName}
                  </span>
                </div>
                
                {/* Health Bar */}
                <div className="flex-1 relative">
                  <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        getMoodBarColor(day.mood)
                      } ${day.mood === null ? "opacity-30" : "opacity-90"}`}
                      style={{ 
                        width: day.mood ? `${(day.mood / 5) * 100}%` : "100%"
                      }}
                    />
                  </div>
                  {/* Mood Score Label */}
                  <div className="absolute right-2 top-0 h-6 flex items-center">
                    <span className={`text-xs font-medium ${
                      day.mood === null ? "text-gray-500" : "text-white"
                    } drop-shadow-sm`}>
                      {day.mood ? `${day.mood}/5` : "No data"}
                    </span>
                  </div>
                </div>
                
                {/* Mood Emoji */}
                <div className="w-8 text-center">
                  <span className={`text-lg ${getMoodColor(day.mood)}`}>
                    {getMoodEmoji(day.mood)}
                  </span>
                </div>
                
                {/* Date */}
                <div className="w-20 text-right">
                  <span className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Very Poor</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Poor</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Okay</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Excellent</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Habits Progress */}
      <Card className="glass-strong p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Daily Habits Progress
        </h3>
        
        <div className="space-y-4">
          {/* Water Intake */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Water Intake</span>
              <span className="text-sm text-muted-foreground">
                {dashboardData.habitsProgress.water.current}/{dashboardData.habitsProgress.water.target} glasses
              </span>
            </div>
            <Progress 
              value={(dashboardData.habitsProgress.water.current / dashboardData.habitsProgress.water.target) * 100} 
              className="h-2"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => updateHabitProgress('water', dashboardData.habitsProgress.water.current - 1)}
                className="glass"
              >
                -1
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => updateHabitProgress('water', dashboardData.habitsProgress.water.current + 1)}
                className="glass"
              >
                +1
              </Button>
            </div>
          </div>

          {/* Exercise */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Exercise</span>
              <span className="text-sm text-muted-foreground">
                {dashboardData.habitsProgress.exercise.current}/{dashboardData.habitsProgress.exercise.target} minutes
              </span>
            </div>
            <Progress 
              value={(dashboardData.habitsProgress.exercise.current / dashboardData.habitsProgress.exercise.target) * 100} 
              className="h-2"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => updateHabitProgress('exercise', dashboardData.habitsProgress.exercise.current - 5)}
                className="glass"
              >
                -5min
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => updateHabitProgress('exercise', dashboardData.habitsProgress.exercise.current + 5)}
                className="glass"
              >
                +5min
              </Button>
            </div>
          </div>

          {/* Sleep */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sleep</span>
              <span className="text-sm text-muted-foreground">
                {dashboardData.habitsProgress.sleep.current}/{dashboardData.habitsProgress.sleep.target} hours
              </span>
            </div>
            <Progress 
              value={(dashboardData.habitsProgress.sleep.current / dashboardData.habitsProgress.sleep.target) * 100} 
              className="h-2"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => updateHabitProgress('sleep', dashboardData.habitsProgress.sleep.current - 0.5)}
                className="glass"
              >
                -30min
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => updateHabitProgress('sleep', dashboardData.habitsProgress.sleep.current + 0.5)}
                className="glass"
              >
                +30min
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Exercise Log */}
      <Card className="glass-strong p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Today's Exercise Log
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-3 relative">
              <Heart className="h-6 w-6 text-blue-500" />
              <span className="absolute text-2xl">🫁</span>
            </div>
            <h4 className="font-semibold">Breathing</h4>
            <p className="text-2xl font-bold text-primary mb-2">{dashboardData.completedExercises.breathing}</p>
            <Button 
              size="sm" 
              onClick={() => updateExerciseCount('breathing')}
              className="w-full"
            >
              +1 Session
            </Button>
          </div>

          <div className="glass p-4 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-3 relative">
              <Clock className="h-6 w-6 text-purple-500" />
              <span className="absolute text-2xl">🧘</span>
            </div>
            <h4 className="font-semibold">Meditation</h4>
            <p className="text-2xl font-bold text-primary mb-2">{dashboardData.completedExercises.meditation}</p>
            <Button 
              size="sm" 
              onClick={() => updateExerciseCount('meditation')}
              className="w-full"
            >
              +1 Session
            </Button>
          </div>

          <div className="glass p-4 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-3 relative">
              <BookOpen className="h-6 w-6 text-green-500" />
              <span className="absolute text-2xl">📝</span>
            </div>
            <h4 className="font-semibold">Journal</h4>
            <p className="text-2xl font-bold text-primary mb-2">{dashboardData.completedExercises.journal}</p>
            <Button 
              size="sm" 
              onClick={() => updateExerciseCount('journal')}
              className="w-full"
            >
              +1 Entry
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-strong p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="glass h-16 flex-col"
            onClick={() => onNavigate('zen')}
          >
            <Heart className="h-6 w-6 mb-1" />
            <span className="text-sm">Zen Zone</span>
          </Button>
          <Button 
            variant="outline" 
            className="glass h-16 flex-col"
            onClick={() => onNavigate('chat')}
          >
            <MessageSquare className="h-6 w-6 mb-1" />
            <span className="text-sm">Chat with AI</span>
          </Button>
          <Button 
            variant="outline" 
            className="glass h-16 flex-col"
            onClick={() => onNavigate('journal')}
          >
            <BookOpen className="h-6 w-6 mb-1" />
            <span className="text-sm">Journal</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}

