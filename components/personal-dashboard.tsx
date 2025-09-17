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
import MoodAssessmentPopup from "@/components/mood-assessment-popup"

interface DashboardData {
  journalStreak: number
  moodTrend: { date: string; mood: number }[]
  habitsProgress: {
    water: { current: number; target: number }
    exercise: { current: number; target: number }
    sleep: { current: number; target: number }
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
}

interface PersonalDashboardProps {
  userName: string
  onNavigate: (mode: string) => void
}

export default function PersonalDashboard({ userName, onNavigate }: PersonalDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    journalStreak: 0,
    moodTrend: [],
    habitsProgress: {
      water: { current: 0, target: 8 },
      exercise: { current: 0, target: 30 },
      sleep: { current: 0, target: 8 }
    },
    completedExercises: {
      breathing: 0,
      meditation: 0,
      journal: 0
    },
    weeklyGoals: {
      completed: 0,
      total: 7
    }
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [showMoodAssessment, setShowMoodAssessment] = useState(false)

  useEffect(() => {
    // Load dashboard data from localStorage
    const savedData = localStorage.getItem("koru-dashboard")
    if (savedData) {
      setDashboardData(JSON.parse(savedData))
    }

    // Show mood assessment on initial load (simulating login)
    setShowMoodAssessment(true)

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Save dashboard data to localStorage
    localStorage.setItem("koru-dashboard", JSON.stringify(dashboardData))
  }, [dashboardData])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getMoodTrendData = () => {
    // Generate sample mood trend data for the last 7 days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toISOString().split('T')[0],
        mood: Math.floor(Math.random() * 5) + 1 // 1-5 mood scale
      })
    }
    return days
  }

  const moodTrend = dashboardData.moodTrend.length > 0 ? dashboardData.moodTrend : getMoodTrendData()

  const getMoodEmoji = (mood: number) => {
    if (mood <= 1) return "😔"; // Red
    if (mood === 2) return "😕"; // Orange
    if (mood === 3) return "😐"; // Yellow
    if (mood === 4) return "🙂"; // Blue
    if (mood >= 5) return "😊"; // Green
    return "😐"; // Default
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 1) return "text-red-500"; // Red
    if (mood === 2) return "text-orange-500"; // Orange
    if (mood === 3) return "text-yellow-500"; // Yellow
    if (mood === 4) return "text-blue-500"; // Blue
    if (mood >= 5) return "text-green-500"; // Green
    return "text-gray-400"; // Default
  };

  const handleMoodAssessmentComplete = (answers: string[]) => {
    setShowMoodAssessment(false);
    const moodScore = answers.reduce((score, answer, index) => {
      const questionOptions = [
        ["Great", "Good", "Okay", "Not so good", "Struggling"],
        ["High energy", "Moderate", "Low", "Exhausted", "Drained"],
        ["Very connected", "Somewhat connected", "Neutral", "Isolated", "Very alone"],
      ];
      const answerIndex = questionOptions[index].indexOf(answer);
      return score + (4 - answerIndex);
    }, 0);

    // Map moodScore (0-12) to a 1-5 scale
    let mappedMood = 3; // Default to neutral
    if (moodScore >= 10) mappedMood = 5; // Very good
    else if (moodScore >= 7) mappedMood = 4; // Good
    else if (moodScore >= 4) mappedMood = 3; // Okay
    else if (moodScore >= 1) mappedMood = 2; // Not so good
    else mappedMood = 1; // Struggling

    setDashboardData(prev => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDateString = today.toISOString().split('T')[0];

      const existingMoodIndex = prev.moodTrend.findIndex(day => day.date === todayDateString);
      let newMoodTrend;

      if (existingMoodIndex !== -1) {
        // Update existing mood for today
        newMoodTrend = prev.moodTrend.map((day, index) => 
          day.date === todayDateString ? { ...day, mood: mappedMood } : day
        );
      } else {
        // Add new mood for today, ensuring it's the first entry for the current day
        const newDay = { date: todayDateString, mood: mappedMood };
        newMoodTrend = [newDay, ...prev.moodTrend.slice(0, 6)]; // Keep only last 7 days
      }

      return { ...prev, moodTrend: newMoodTrend };
    });
  };

  const handleMoodAssessmentClose = () => {
    setShowMoodAssessment(false);
  };

  const updateHabitProgress = (habit: keyof DashboardData['habitsProgress'], value: number) => {
    setDashboardData(prev => ({
      ...prev,
      habitsProgress: {
        ...prev.habitsProgress,
        [habit]: { ...prev.habitsProgress[habit], current: Math.max(0, value) }
      }
    }));
  };

  const updateExerciseCount = (exercise: keyof DashboardData['completedExercises']) => {
    setDashboardData(prev => ({
      ...prev,
      completedExercises: {
        ...prev.completedExercises,
        [exercise]: prev.completedExercises[exercise] + 1
      }
    }));
  };

  return (
    <div className="space-y-6">
      <MoodAssessmentPopup
        open={showMoodAssessment}
        onComplete={handleMoodAssessmentComplete}
        onClose={handleMoodAssessmentClose}
      />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass p-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-2">
            <Award className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-primary">{dashboardData.journalStreak}</h3>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </Card>

        <Card className="glass p-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-primary">
            {dashboardData.weeklyGoals.completed}/{dashboardData.weeklyGoals.total}
          </h3>
          <p className="text-sm text-muted-foreground">Weekly Goals</p>
        </Card>

        <Card className="glass p-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-2">
            <FernFrond className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-primary">
            {Object.values(dashboardData.completedExercises).reduce((a, b) => a + b, 0)}
          </h3>
          <p className="text-sm text-muted-foreground">Exercises Done</p>
        </Card>

        <Card className="glass p-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-primary">
            {moodTrend.length > 0 ? getMoodEmoji(moodTrend[moodTrend.length - 1].mood) : "😐"}
          </h3>
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
          <Button 
            variant="outline" 
            size="sm" 
            className="glass"
            onClick={() => onNavigate('journal')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-end justify-between h-32">
            {moodTrend.map((day, index) => (
              <div key={day.date} className="flex flex-col items-center space-y-2">
                <div 
                  className="w-8 bg-gradient-to-t from-primary/20 to-primary/60 rounded-t"
                  style={{ height: `${(day.mood / 5) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`text-lg ${getMoodColor(day.mood)}`}>
                  {getMoodEmoji(day.mood)}
                </span>
              </div>
            ))}
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
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-2">
              <Heart className="h-6 w-6 text-blue-500" />
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
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-purple-500" />
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
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-green-500" />
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

