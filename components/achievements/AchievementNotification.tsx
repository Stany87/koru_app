'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAchievements } from '@/contexts/AchievementContext'
import { BADGE_DEFINITIONS } from '@/lib/achievements'

export function AchievementNotifications() {
  const { newBadgeNotifications, clearBadgeNotification } = useAchievements()
  const [currentNotification, setCurrentNotification] = useState<string | null>(null)

  // Show notifications one at a time
  useEffect(() => {
    if (newBadgeNotifications.length > 0 && !currentNotification) {
      const nextNotification = newBadgeNotifications[0]
      setCurrentNotification(nextNotification)
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss(nextNotification)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [newBadgeNotifications, currentNotification])

  const handleDismiss = (badgeId: string) => {
    setCurrentNotification(null)
    clearBadgeNotification(badgeId)
  }

  const currentBadge = currentNotification 
    ? BADGE_DEFINITIONS.find(badge => badge.id === currentNotification)
    : null

  return (
    <AnimatePresence>
      {currentBadge && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: -50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="glass-strong bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl shadow-2xl p-6 max-w-sm border-2 border-primary/30">
            {/* Celebration Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl opacity-20"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  className="text-4xl"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  🎉
                </motion.div>
                <div>
                  <h3 className="text-primary font-bold text-lg">Achievement Unlocked!</h3>
                  <p className="text-muted-foreground text-sm">You've earned a new badge</p>
                </div>
              </div>

              {/* Badge Info */}
              <div className="flex items-center space-x-4 mb-4">
                <motion.div
                  className="text-5xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {currentBadge.icon}
                </motion.div>
                <div>
                  <h4 className="text-primary font-bold text-xl">{currentBadge.name}</h4>
                  <p className="text-muted-foreground text-sm mb-2">{currentBadge.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentBadge.type === 'platinum' ? 'bg-primary/20 text-primary' :
                      currentBadge.type === 'gold' ? 'bg-secondary/20 text-secondary' :
                      currentBadge.type === 'silver' ? 'bg-accent/20 text-accent' :
                      'bg-muted/20 text-muted-foreground'
                    }`}>
                      {currentBadge.type.toUpperCase()}
                    </span>
                    <span className="text-primary font-semibold text-sm">+{currentBadge.points} pts</span>
                  </div>
                </div>
              </div>

              {/* Dismiss Button */}
              <motion.button
                onClick={() => handleDismiss(currentBadge.id)}
                className="w-full glass bg-primary/20 hover:bg-primary/30 text-primary font-medium py-2 px-4 rounded-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Awesome! 🎊
              </motion.button>
            </div>

            {/* Floating Particles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 3) * 30}%`,
                }}
                animate={{
                  y: [-20, -40, -20],
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Points notification component for smaller activity rewards
export function PointsNotification({ 
  points, 
  activity, 
  onDismiss 
}: { 
  points: number
  activity: string
  onDismiss: () => void 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed top-8 right-8 z-40"
    >
      <div className="glass-strong bg-primary/20 text-primary rounded-lg shadow-lg px-4 py-3 flex items-center space-x-3 border border-primary/30">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-xl"
        >
          ⭐
        </motion.div>
        <div>
          <p className="font-medium">+{points} points</p>
          <p className="text-sm text-muted-foreground capitalize">{activity.replace('_', ' ')}</p>
        </div>
      </div>
    </motion.div>
  )
}