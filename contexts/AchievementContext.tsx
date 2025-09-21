'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { useAuthContext } from './AuthContext'
import { 
  UserStats, 
  Badge, 
  Level,
  ActivityType,
  createDefaultUserStats,
  calculateLevel,
  calculateLevelProgress,
  BADGE_DEFINITIONS,
  LEVELS
} from '../lib/achievements'
import { 
  getUserStats, 
  recordActivity, 
  updateUserStats 
} from '../lib/firebase/achievements'

// Achievement Context State
interface AchievementState {
  userStats: UserStats | null
  currentLevel: Level
  levelProgress: number
  unlockedBadges: Badge[]
  availableBadges: Badge[]
  isLoading: boolean
  error: string | null
  newBadgeNotifications: string[] // Badge IDs to show notifications for
}

// Achievement Actions
type AchievementAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER_STATS'; payload: UserStats }
  | { type: 'ADD_ACTIVITY'; payload: { activity: ActivityType; pointsEarned: number; newBadges: string[] } }
  | { type: 'SHOW_BADGE_NOTIFICATION'; payload: string[] }
  | { type: 'CLEAR_BADGE_NOTIFICATION'; payload: string }
  | { type: 'RESET_STATS' }

// Initial state
const initialState: AchievementState = {
  userStats: null,
  currentLevel: LEVELS[0],
  levelProgress: 0,
  unlockedBadges: [],
  availableBadges: BADGE_DEFINITIONS,
  isLoading: false,
  error: null,
  newBadgeNotifications: []
}

// Achievement Reducer
function achievementReducer(state: AchievementState, action: AchievementAction): AchievementState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case 'SET_USER_STATS':
      const userStats = action.payload
      const currentLevel = calculateLevel(userStats.totalPoints)
      const levelProgress = calculateLevelProgress(userStats.totalPoints)
      const unlockedBadges = BADGE_DEFINITIONS.filter(badge => 
        userStats.unlockedBadges.includes(badge.id)
      )

      return {
        ...state,
        userStats,
        currentLevel,
        levelProgress,
        unlockedBadges,
        isLoading: false,
        error: null
      }

    case 'ADD_ACTIVITY':
      if (!state.userStats) return state

      const { activity, pointsEarned, newBadges } = action.payload
      const updatedStats = {
        ...state.userStats,
        totalPoints: state.userStats.totalPoints + pointsEarned,
        unlockedBadges: [...state.userStats.unlockedBadges, ...newBadges],
        activityCounts: {
          ...state.userStats.activityCounts,
          [activity]: (state.userStats.activityCounts[activity] || 0) + 1
        }
      }

      const newLevel = calculateLevel(updatedStats.totalPoints)
      const newLevelProgress = calculateLevelProgress(updatedStats.totalPoints)
      const newUnlockedBadges = BADGE_DEFINITIONS.filter(badge => 
        updatedStats.unlockedBadges.includes(badge.id)
      )

      return {
        ...state,
        userStats: updatedStats,
        currentLevel: newLevel,
        levelProgress: newLevelProgress,
        unlockedBadges: newUnlockedBadges,
        newBadgeNotifications: [...state.newBadgeNotifications, ...newBadges]
      }

    case 'SHOW_BADGE_NOTIFICATION':
      return {
        ...state,
        newBadgeNotifications: [...state.newBadgeNotifications, ...action.payload]
      }

    case 'CLEAR_BADGE_NOTIFICATION':
      return {
        ...state,
        newBadgeNotifications: state.newBadgeNotifications.filter(id => id !== action.payload)
      }

    case 'RESET_STATS':
      return {
        ...initialState,
        userStats: state.userStats ? createDefaultUserStats(state.userStats.userId) : null
      }

    default:
      return state
  }
}

// Achievement Context
interface AchievementContextType extends AchievementState {
  // Actions
  recordUserActivity: (activity: ActivityType, pointsEarned?: number) => Promise<void>
  refreshUserStats: () => Promise<void>
  clearBadgeNotification: (badgeId: string) => void
  resetUserStats: () => Promise<void>
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined)

// Achievement Provider Component
interface AchievementProviderProps {
  children: ReactNode
}

export function AchievementProvider({ children }: AchievementProviderProps) {
  const [state, dispatch] = useReducer(achievementReducer, initialState)
  const { user } = useAuthContext()

  // Load user stats when user changes
  useEffect(() => {
    if (user?.uid) {
      loadUserStats(user.uid)
    } else {
      // Clear stats when user logs out
      dispatch({ type: 'SET_USER_STATS', payload: createDefaultUserStats('') })
    }
  }, [user?.uid])

  // Load user statistics from Firebase
  const loadUserStats = async (userId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const userStats = await getUserStats(userId)
      dispatch({ type: 'SET_USER_STATS', payload: userStats })
    } catch (error) {
      console.error('Error loading user stats:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load achievement data' })
    }
  }

  // Record a user activity and update achievements
  const recordUserActivity = async (activity: ActivityType, pointsEarned?: number) => {
    if (!user?.uid) {
      console.warn('Cannot record activity: user not logged in')
      return
    }

    try {
      const result = await recordActivity(user.uid, activity, pointsEarned)
      
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          activity,
          pointsEarned: result.totalPoints - (state.userStats?.totalPoints || 0),
          newBadges: result.newBadges
        }
      })

      // Show notifications for new badges
      if (result.newBadges.length > 0) {
        dispatch({ type: 'SHOW_BADGE_NOTIFICATION', payload: result.newBadges })
      }
    } catch (error) {
      console.error('Error recording activity:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to record activity' })
    }
  }

  // Refresh user stats from Firebase
  const refreshUserStats = async () => {
    if (!user?.uid) return
    await loadUserStats(user.uid)
  }

  // Clear badge notification
  const clearBadgeNotification = (badgeId: string) => {
    dispatch({ type: 'CLEAR_BADGE_NOTIFICATION', payload: badgeId })
  }

  // Reset user statistics
  const resetUserStats = async () => {
    if (!user?.uid) return

    try {
      const defaultStats = createDefaultUserStats(user.uid)
      await updateUserStats(defaultStats)
      dispatch({ type: 'SET_USER_STATS', payload: defaultStats })
    } catch (error) {
      console.error('Error resetting user stats:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reset stats' })
    }
  }

  const contextValue: AchievementContextType = {
    ...state,
    recordUserActivity,
    refreshUserStats,
    clearBadgeNotification,
    resetUserStats
  }

  return (
    <AchievementContext.Provider value={contextValue}>
      {children}
    </AchievementContext.Provider>
  )
}

// Custom hook to use Achievement context
export function useAchievements() {
  const context = useContext(AchievementContext)
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider')
  }
  return context
}

// Hook for easy activity tracking
export function useActivityTracker() {
  const { recordUserActivity } = useAchievements()

  const trackActivity = async (activity: ActivityType) => {
    await recordUserActivity(activity)
  }

  return { trackActivity }
}
