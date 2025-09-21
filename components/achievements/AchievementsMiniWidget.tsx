'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Trophy } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useAchievements } from '@/contexts/AchievementContext'

interface AchievementsMiniWidgetProps {
  className?: string
}

export function AchievementsMiniWidget({ className = '' }: AchievementsMiniWidgetProps) {
  const router = useRouter()
  const { 
    userStats, 
    currentLevel, 
    levelProgress, 
    unlockedBadges, 
    isLoading 
  } = useAchievements()

  const handleClick = () => {
    router.push('/achievements')
  }

  if (isLoading || !userStats) {
    return (
      <Card className={`glass p-4 text-center ${className}`}>
        <div className="animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-full bg-gray-300 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card 
      className={`glass p-4 text-center cursor-pointer hover:bg-primary/5 transition-all duration-200 ${className}`}
      onClick={handleClick}
    >
      <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-3">
        <Trophy className="h-6 w-6 text-yellow-500" />
      </div>
      <h3 className="text-2xl font-bold text-primary mb-1">
        {currentLevel.level}
      </h3>
      <p className="text-sm text-muted-foreground mb-2">{currentLevel.name}</p>
      
      {/* Compact Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
        <motion.div
          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${levelProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      {/* Compact Stats */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div>{userStats.totalPoints} pts • {userStats.currentStreak} streak</div>
        <div>{unlockedBadges.length} badges earned</div>
      </div>
    </Card>
  )
}
