"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { markDailyMoodCheckCompleted, shouldShowDailyMoodCheck } from "@/lib/mood-assessment"

interface DebugMoodTestProps {
  userId: string | null
}

export default function DebugMoodTest({ userId }: DebugMoodTestProps) {
  const handleClearMoodData = () => {
    console.log("🗑️ Clearing all mood-related localStorage data")
    
    // Clear dashboard data
    localStorage.removeItem("koru-dashboard")
    
    // Clear mood assessment data
    localStorage.removeItem("koru-mood-assessment")
    
    // Clear daily mood check status
    if (userId) {
      localStorage.removeItem(`koru-last-mood-check-${userId}`)
    }
    
    // Clear all koru keys
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.includes('koru')) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => {
      console.log(`Removing key: ${key}`)
      localStorage.removeItem(key)
    })
    
    console.log("✅ Cleared all mood data - refresh page to trigger mood assessment")
    alert("Cleared all mood data! Refresh the page to trigger the mood assessment.")
  }

  const handleTestMoodCheck = () => {
    if (!userId) {
      console.log("❌ No user ID available")
      return
    }
    
    console.log("🧪 Testing mood check logic for user:", userId)
    const shouldShow = shouldShowDailyMoodCheck(userId)
    console.log("Should show mood check:", shouldShow)
    
    // Log current localStorage values
    const lastCheckKey = `koru-last-mood-check-${userId}`
    const lastCheck = localStorage.getItem(lastCheckKey)
    console.log("Current last check value:", lastCheck)
    
    if (lastCheck) {
      const lastCheckDate = new Date(lastCheck)
      const today = new Date()
      
      lastCheckDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      
      console.log("Last check date (normalized):", lastCheckDate.toISOString())
      console.log("Today (normalized):", today.toISOString())
      console.log("Are they equal?", lastCheckDate.getTime() === today.getTime())
    }
    
    alert(`Should show mood check: ${shouldShow}`)
  }

  const handleForceMoodData = () => {
    console.log("🔧 Force adding test mood data")
    
    const today = new Date()
    // Use same date format as mood assessment
    const todayDateString = today.getFullYear() + '-' + 
      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
      String(today.getDate()).padStart(2, '0')
      
    console.log('📅 Using date string:', todayDateString)
    
    const testDashboardData = {
      journalStreak: 1,
      moodTrend: [
        { date: todayDateString, mood: 4 },
      ],
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
    }
    
    localStorage.setItem("koru-dashboard", JSON.stringify(testDashboardData))
    
    // Dispatch event to refresh dashboard
    window.dispatchEvent(new CustomEvent('koru-dashboard-updated'))
    
    console.log("✅ Added test mood data:", testDashboardData)
    alert("Added test mood data! Check the dashboard.")
  }

  if (!userId) {
    return (
      <Card className="p-4 bg-red-500/10 border-red-500/20">
        <p>Debug component: No user ID available</p>
      </Card>
    )
  }

  return (
    <Card className="p-4 bg-orange-500/10 border-orange-500/20">
      <h3 className="font-semibold mb-4 text-orange-600">🐛 Mood Debug Tools</h3>
      <div className="space-y-2">
        <Button 
          onClick={handleClearMoodData}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          Clear All Mood Data
        </Button>
        <Button 
          onClick={handleTestMoodCheck}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          Test Mood Check Logic
        </Button>
        <Button 
          onClick={handleForceMoodData}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          Force Add Test Mood Data
        </Button>
      </div>
      <p className="text-xs text-orange-600 mt-2">User ID: {userId}</p>
    </Card>
  )
}