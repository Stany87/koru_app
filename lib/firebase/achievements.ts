import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db, isFirebaseEnabled, dataPersistenceDisabled } from '../firebase'
import { 
  UserStats, 
  PointsHistoryEntry, 
  ActivityType,
  createDefaultUserStats,
  updateActivityCount,
  updateStreak,
  getNewlyUnlockedBadges,
  calculateTotalPoints
} from '../achievements'

/**
 * Get user statistics from Firestore
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    if (!isFirebaseEnabled || !db || dataPersistenceDisabled) {
      // Return default stats if Firebase is not available
      return createDefaultUserStats(userId)
    }
    
    const userStatsRef = doc(db, 'userStats', userId)
    const userStatsSnap = await getDoc(userStatsRef)
    
    if (userStatsSnap.exists()) {
      const data = userStatsSnap.data()
      return {
        ...data,
        userId,
        // Ensure all required fields exist with defaults
        activityCounts: data.activityCounts || {},
        unlockedBadges: data.unlockedBadges || [],
        totalPoints: data.totalPoints || 0,
        currentStreak: data.currentStreak || 0,
        longestStreak: data.longestStreak || 0,
        lastActivityDate: data.lastActivityDate || '',
        createdAt: data.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: data.updatedAt || new Date().toISOString().split('T')[0]
      } as UserStats
    } else {
      // Create new user stats
      const defaultStats = createDefaultUserStats(userId)
      await setDoc(userStatsRef, defaultStats)
      return defaultStats
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    // Return default stats on error
    return createDefaultUserStats(userId)
  }
}

/**
 * Update user statistics in Firestore
 */
export async function updateUserStats(userStats: UserStats): Promise<void> {
  try {
    if (!isFirebaseEnabled || !db || dataPersistenceDisabled) {
      // Skip Firebase update if not available
      return
    }
    
    const userStatsRef = doc(db, 'userStats', userStats.userId)
    const updatedStats = {
      ...userStats,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    await setDoc(userStatsRef, updatedStats, { merge: true })
  } catch (error) {
    console.error('Error updating user stats:', error)
    throw error
  }
}

/**
 * Record an activity and update user stats
 */
export async function recordActivity(
  userId: string, 
  activity: ActivityType, 
  pointsEarned?: number
): Promise<{ newBadges: string[], totalPoints: number }> {
  try {
    if (!isFirebaseEnabled || !db || dataPersistenceDisabled) {
      // Return mock response if Firebase is not available
      return { newBadges: [], totalPoints: 0 }
    }
    
    // Get current user stats
    const currentStats = await getUserStats(userId)
    
    // Update activity count
    const updatedStats = updateActivityCount(currentStats, activity)
    
    // Update streak if it's a daily activity
    const dailyActivities: ActivityType[] = ['mood_check', 'breathing_exercise', 'daily_goal_complete']
    if (dailyActivities.includes(activity)) {
      updatedStats.currentStreak = updateStreak(updatedStats, true).currentStreak
      updatedStats.longestStreak = Math.max(updatedStats.longestStreak, updatedStats.currentStreak)
    }
    
    // Check for newly unlocked badges
    const newlyUnlockedBadges = getNewlyUnlockedBadges(updatedStats)
    const newBadgeIds = newlyUnlockedBadges.map(badge => badge.id)
    
    // Add new badges to user stats
    if (newBadgeIds.length > 0) {
      updatedStats.unlockedBadges = [...updatedStats.unlockedBadges, ...newBadgeIds]
    }
    
    // Recalculate total points with new badges
    updatedStats.totalPoints = calculateTotalPoints(updatedStats)
    
    // Update stats in Firestore
    await updateUserStats(updatedStats)
    
    // Record points history entry
    await addPointsHistoryEntry(userId, activity, pointsEarned || 0, newBadgeIds)
    
    return {
      newBadges: newBadgeIds,
      totalPoints: updatedStats.totalPoints
    }
  } catch (error) {
    console.error('Error recording activity:', error)
    throw error
  }
}

/**
 * Add entry to points history
 */
export async function addPointsHistoryEntry(
  userId: string,
  activity: ActivityType,
  pointsEarned: number,
  badgesUnlocked: string[] = []
): Promise<void> {
  try {
    if (!isFirebaseEnabled || !db || dataPersistenceDisabled) {
      return
    }
    
    const pointsHistoryRef = collection(db, 'pointsHistory')
    const entry: Omit<PointsHistoryEntry, 'id'> = {
      userId,
      activity,
      pointsEarned,
      timestamp: new Date().toISOString(),
      badgesUnlocked
    }
    
    await addDoc(pointsHistoryRef, entry)
  } catch (error) {
    console.error('Error adding points history entry:', error)
    throw error
  }
}

/**
 * Get user's points history
 */
export async function getPointsHistory(
  userId: string, 
  limitCount: number = 50
): Promise<PointsHistoryEntry[]> {
  try {
    if (!isFirebaseEnabled || !db || dataPersistenceDisabled) {
      return []
    }
    
    const pointsHistoryRef = collection(db, 'pointsHistory')
    const q = query(
      pointsHistoryRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const history: PointsHistoryEntry[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      history.push({
        id: doc.id,
        ...data
      } as PointsHistoryEntry)
    })
    
    return history
  } catch (error) {
    console.error('Error getting points history:', error)
    return []
  }
}

/**
 * Get recent activity for streak calculation
 */
export async function getRecentActivity(
  userId: string, 
  days: number = 7
): Promise<PointsHistoryEntry[]> {
  try {
    if (!isFirebaseEnabled || !db || dataPersistenceDisabled) {
      return []
    }
    
    const pointsHistoryRef = collection(db, 'pointsHistory')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const q = query(
      pointsHistoryRef,
      where('userId', '==', userId),
      where('timestamp', '>=', startDate.toISOString()),
      orderBy('timestamp', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const activities: PointsHistoryEntry[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      activities.push({
        id: doc.id,
        ...data
      } as PointsHistoryEntry)
    })
    
    return activities
  } catch (error) {
    console.error('Error getting recent activity:', error)
    return []
  }
}

/**
 * Award badge to user (manual badge assignment)
 */
export async function awardBadge(userId: string, badgeId: string): Promise<void> {
  try {
    const currentStats = await getUserStats(userId)
    
    // Check if user already has this badge
    if (currentStats.unlockedBadges.includes(badgeId)) {
      console.log(`User ${userId} already has badge ${badgeId}`)
      return
    }
    
    // Add badge to user stats
    const updatedStats = {
      ...currentStats,
      unlockedBadges: [...currentStats.unlockedBadges, badgeId]
    }
    
    // Recalculate total points with new badge
    updatedStats.totalPoints = calculateTotalPoints(updatedStats)
    
    // Update stats in Firestore
    await updateUserStats(updatedStats)
    
    // Record in points history
    await addPointsHistoryEntry(userId, 'streak_milestone', 0, [badgeId])
  } catch (error) {
    console.error('Error awarding badge:', error)
    throw error
  }
}

/**
 * Update user's streak manually (useful for streak corrections)
 */
export async function updateUserStreak(
  userId: string, 
  currentStreak: number, 
  longestStreak?: number
): Promise<void> {
  try {
    const currentStats = await getUserStats(userId)
    
    const updatedStats = {
      ...currentStats,
      currentStreak,
      longestStreak: longestStreak || Math.max(currentStats.longestStreak, currentStreak),
      lastActivityDate: new Date().toISOString().split('T')[0]
    }
    
    // Recalculate total points with new streak bonus
    updatedStats.totalPoints = calculateTotalPoints(updatedStats)
    
    await updateUserStats(updatedStats)
  } catch (error) {
    console.error('Error updating user streak:', error)
    throw error
  }
}

/**
 * Get leaderboard data (top users by points)
 */
export async function getLeaderboard(limitCount: number = 10): Promise<UserStats[]> {
  try {
    if (!isFirebaseEnabled || !db || dataPersistenceDisabled) {
      return []
    }
    
    const userStatsRef = collection(db, 'userStats')
    const q = query(
      userStatsRef,
      orderBy('totalPoints', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const leaderboard: UserStats[] = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      leaderboard.push({
        ...data,
        userId: doc.id
      } as UserStats)
    })
    
    return leaderboard
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return []
  }
}

/**
 * Reset user stats (useful for testing or user request)
 */
export async function resetUserStats(userId: string): Promise<void> {
  try {
    if (!isFirebaseEnabled || !db || dataPersistenceDisabled) {
      return
    }
    
    const defaultStats = createDefaultUserStats(userId)
    await setDoc(doc(db, 'userStats', userId), defaultStats)
  } catch (error) {
    console.error('Error resetting user stats:', error)
    throw error
  }
}