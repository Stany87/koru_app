/**
 * Koru Achievement System - Core Types and Logic
 * Gamification system for mental wellness tracking
 */

// ===== TYPES & INTERFACES =====

export interface UserStats {
  userId: string
  totalPoints: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
  activityCounts: Record<ActivityType, number>
  unlockedBadges: string[] // Array of badge IDs
  createdAt: string
  updatedAt: string
}

export interface PointsHistoryEntry {
  id: string
  userId: string
  activity: ActivityType
  pointsEarned: number
  timestamp: string
  badgesUnlocked: string[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  type: BadgeType
  points: number
  requirements: BadgeRequirement
}

export interface BadgeRequirement {
  type: 'count' | 'streak' | 'points' | 'milestone'
  target: number
  activity?: ActivityType
}

export interface Level {
  level: number
  name: string
  pointsRequired: number
  icon: string
}

export type ActivityType =
  | 'breathing_exercise'
  | 'workout'
  | 'journal_entry'
  | 'mood_check'
  | 'meditation'
  | 'music_session'
  | 'chat_session'
  | 'daily_goal_complete'
  | 'streak_milestone'
  | 'profile_complete'
  | 'onboarding_complete'

export type BadgeCategory = 'wellness' | 'social' | 'growth' | 'consistency' | 'milestone'
export type BadgeType = 'bronze' | 'silver' | 'gold' | 'platinum'

// Points system configuration
export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  breathing_exercise: 25,
  workout: 50,
  journal_entry: 30,
  mood_check: 15,
  meditation: 40,
  music_session: 10,
  chat_session: 5,
  daily_goal_complete: 20,
  streak_milestone: 100,
  profile_complete: 50,
  onboarding_complete: 100,
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Seedling', pointsRequired: 0, icon: '🌱' },
  { level: 2, name: 'Sprout', pointsRequired: 100, icon: '🌿' },
  { level: 3, name: 'Sapling', pointsRequired: 300, icon: '🌵' },
  { level: 4, name: 'Young Tree', pointsRequired: 600, icon: '🌴' },
  { level: 5, name: 'Tree', pointsRequired: 1000, icon: '🌲' },
  { level: 6, name: 'Forest', pointsRequired: 2000, icon: '🌳' },
  { level: 7, name: 'Green Valley', pointsRequired: 4000, icon: '⛰️' },
  { level: 8, name: 'Mountain', pointsRequired: 8000, icon: '🏔️' },
  { level: 9, name: 'Koru Spirit', pointsRequired: 16000, icon: '✨' },
  { level: 10, name: 'Koru Guardian', pointsRequired: 32000, icon: '🔮' },
]

export const STREAK_BONUSES: Record<number, number> = {
  3: 25,   // 3-day streak: 25 bonus points
  7: 75,   // 7-day streak: 75 bonus points
  14: 150, // 14-day streak: 150 bonus points
  30: 300, // 30-day streak: 300 bonus points
  60: 500, // 60-day streak: 500 bonus points
  90: 750, // 90-day streak: 750 bonus points
  180: 1500, // 180-day streak: 1500 bonus points
  365: 3000, // 365-day streak: 3000 bonus points
}

/**
 * Calculate the user's current level based on their total points
 */
export function calculateLevel(totalPoints: number): Level {
  const level = LEVELS.reduce((highest, current) => {
    if (totalPoints >= current.pointsRequired && current.level > highest.level) {
      return current;
    }
    return highest;
  }, LEVELS[0]);
  
  return level;
}

/**
 * Calculate progress to the next level as a percentage
 */
export function calculateLevelProgress(totalPoints: number): number {
  const currentLevel = calculateLevel(totalPoints);
  const currentLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  
  // If at max level, return 100%
  if (currentLevelIndex === LEVELS.length - 1) {
    return 100;
  }
  
  const nextLevel = LEVELS[currentLevelIndex + 1];
  const pointsForCurrentLevel = totalPoints - currentLevel.pointsRequired;
  const pointsNeededForNextLevel = nextLevel.pointsRequired - currentLevel.pointsRequired;
  
  const progress = Math.min(100, Math.floor((pointsForCurrentLevel / pointsNeededForNextLevel) * 100));
  return progress;
}

/**
 * Check if a user has earned a streak bonus
 */
export function checkStreakBonus(currentStreak: number): number {
  // Find the highest streak milestone achieved
  const streakMilestones = Object.keys(STREAK_BONUSES).map(Number).sort((a, b) => b - a);
  
  for (const milestone of streakMilestones) {
    if (currentStreak >= milestone) {
      return STREAK_BONUSES[milestone];
    }
  }
  
  return 0; // No bonus
}

/**
 * Calculate the daily points target for a healthy streak
 * This can be used to show users how many points they should aim for each day
 */
export function getDailyPointsTarget(): number {
  // A good daily target would include basic wellness activities
  return ACTIVITY_POINTS.mood_check + 
         ACTIVITY_POINTS.breathing_exercise + 
         ACTIVITY_POINTS.daily_goal_complete;
}

export const BADGE_DEFINITIONS: Badge[] = [
  // Wellness Category - Bronze
  {
    id: 'mood-tracker-bronze',
    name: 'Mood Tracker',
    description: 'Log your mood for 3 consecutive days',
    icon: '😊',
    category: 'wellness',
    type: 'bronze',
    points: 50,
    requirements: { type: 'streak', target: 3, activity: 'mood_check' }
  },
  {
    id: 'mindful-moments-bronze',
    name: 'Mindful Moments',
    description: 'Complete 5 mindfulness exercises',
    icon: '🧘‍♂️',
    category: 'wellness',
    type: 'bronze',
    points: 75,
    requirements: { type: 'count', target: 5, activity: 'breathing_exercise' }
  },
  
  // Wellness Category - Silver
  {
    id: 'mood-master-silver',
    name: 'Mood Master',
    description: 'Maintain a 7-day mood logging streak',
    icon: '🌟',
    category: 'wellness',
    type: 'silver',
    points: 150,
    requirements: { type: 'streak', target: 7, activity: 'mood_check' }
  },
  {
    id: 'exercise-enthusiast-silver',
    name: 'Exercise Enthusiast',
    description: 'Complete 20 mindfulness exercises',
    icon: '💪',
    category: 'wellness',
    type: 'silver',
    points: 200,
    requirements: { type: 'count', target: 20, activity: 'breathing_exercise' }
  },

  // Wellness Category - Gold
  {
    id: 'wellness-guru-gold',
    name: 'Wellness Guru',
    description: 'Achieve a 30-day mood tracking streak',
    icon: '🏆',
    category: 'wellness',
    type: 'gold',
    points: 500,
    requirements: { type: 'streak', target: 30, activity: 'mood_check' }
  },

  // Social Category - Bronze
  {
    id: 'chat-starter-bronze',
    name: 'Chat Starter',
    description: 'Send 10 messages to your AI companion',
    icon: '💬',
    category: 'social',
    type: 'bronze',
    points: 30,
    requirements: { type: 'count', target: 10, activity: 'chat_session' }
  },
  {
    id: 'journal-writer-bronze',
    name: 'Journal Writer',
    description: 'Write 3 journal entries',
    icon: '📝',
    category: 'social',
    type: 'bronze',
    points: 60,
    requirements: { type: 'count', target: 3, activity: 'journal_entry' }
  },

  // Social Category - Silver
  {
    id: 'conversation-master-silver',
    name: 'Conversation Master',
    description: 'Have meaningful chats for 5 consecutive days',
    icon: '🗣️',
    category: 'social',
    type: 'silver',
    points: 100,
    requirements: { type: 'streak', target: 5, activity: 'chat_session' }
  },
  {
    id: 'storyteller-silver',
    name: 'Storyteller',
    description: 'Write 10 journal entries',
    icon: '📖',
    category: 'social',
    type: 'silver',
    points: 180,
    requirements: { type: 'count', target: 10, activity: 'journal_entry' }
  },

  // Growth Category - Bronze
  {
    id: 'first-steps-bronze',
    name: 'First Steps',
    description: 'Complete your profile setup',
    icon: '👤',
    category: 'growth',
    type: 'bronze',
    points: 100,
    requirements: { type: 'milestone', target: 1 }
  },

  // Growth Category - Silver  
  {
    id: 'point-collector-silver',
    name: 'Point Collector',
    description: 'Earn 500 total points',
    icon: '💎',
    category: 'growth',
    type: 'silver',
    points: 100,
    requirements: { type: 'points', target: 500 }
  },

  // Growth Category - Gold
  {
    id: 'level-achiever-gold',
    name: 'Level Achiever',
    description: 'Reach Level 5 (Tree)',
    icon: '🌲',
    category: 'growth',
    type: 'gold',
    points: 300,
    requirements: { type: 'points', target: 1000 }
  },

  // Consistency Category - Bronze
  {
    id: 'daily-visitor-bronze',
    name: 'Daily Visitor',
    description: 'Be active for 3 consecutive days',
    icon: '📅',
    category: 'consistency',
    type: 'bronze',
    points: 40,
    requirements: { type: 'streak', target: 3, activity: 'mood_check' }
  },

  // Consistency Category - Silver
  {
    id: 'week-warrior-silver',
    name: 'Week Warrior',
    description: 'Stay active for 7 consecutive days',
    icon: '⭐',
    category: 'consistency',
    type: 'silver',
    points: 200,
    requirements: { type: 'streak', target: 7 }
  },

  // Consistency Category - Gold
  {
    id: 'month-master-gold',
    name: 'Month Master',
    description: 'Maintain 30-day overall activity streak',
    icon: '👑',
    category: 'consistency',
    type: 'gold',
    points: 750,
    requirements: { type: 'streak', target: 30 }
  },

  // Milestone Category - Platinum
  {
    id: 'koru-champion-platinum',
    name: 'Koru Champion',
    description: 'Reach maximum level (Koru Guardian)',
    icon: '🏅',
    category: 'milestone',
    type: 'platinum',
    points: 1000,
    requirements: { type: 'points', target: 32000 }
  }
]

/**
 * Check if a user has unlocked a specific badge
 */
export function checkBadgeUnlocked(badgeId: string, userStats: UserStats): boolean {
  const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId)
  if (!badge) return false

  const { requirements } = badge

  switch (requirements.type) {
    case 'count':
      if (!requirements.activity) return false
      const currentCount = userStats.activityCounts[requirements.activity] || 0
      return currentCount >= requirements.target

    case 'streak':
      if (requirements.activity) {
        // Activity-specific streak (e.g., mood logging streak)
        return userStats.currentStreak >= requirements.target
      } else {
        // General activity streak
        return userStats.currentStreak >= requirements.target
      }

    case 'points':
      return userStats.totalPoints >= requirements.target

    case 'milestone':
      // For milestones like profile completion, we'd check specific flags
      // This would need to be expanded based on specific milestone types
      return true // Placeholder

    default:
      return false
  }
}

/**
 * Get all badges that the user has newly unlocked (not yet awarded)
 */
export function getNewlyUnlockedBadges(userStats: UserStats): Badge[] {
  return BADGE_DEFINITIONS.filter(badge => {
    const isAlreadyUnlocked = userStats.unlockedBadges.includes(badge.id)
    const isNowUnlocked = checkBadgeUnlocked(badge.id, userStats)
    return !isAlreadyUnlocked && isNowUnlocked
  })
}

/**
 * Calculate total points from activities and bonuses
 */
export function calculateTotalPoints(userStats: UserStats): number {
  let totalPoints = 0

  // Add points from activities
  Object.entries(userStats.activityCounts).forEach(([activity, count]) => {
    const activityType = activity as ActivityType
    if (ACTIVITY_POINTS[activityType]) {
      totalPoints += ACTIVITY_POINTS[activityType] * count
    }
  })

  // Add streak bonuses
  totalPoints += checkStreakBonus(userStats.currentStreak)

  // Add badge points
  userStats.unlockedBadges.forEach(badgeId => {
    const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId)
    if (badge) {
      totalPoints += badge.points
    }
  })

  return totalPoints
}

/**
 * Get progress towards a specific badge as a percentage
 */
export function getBadgeProgress(badgeId: string, userStats: UserStats): number {
  const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId)
  if (!badge) return 0

  const { requirements } = badge

  switch (requirements.type) {
    case 'count':
      if (!requirements.activity) return 0
      const currentCount = userStats.activityCounts[requirements.activity] || 0
      return Math.min(100, Math.floor((currentCount / requirements.target) * 100))

    case 'streak':
      const currentStreak = userStats.currentStreak
      return Math.min(100, Math.floor((currentStreak / requirements.target) * 100))

    case 'points':
      return Math.min(100, Math.floor((userStats.totalPoints / requirements.target) * 100))

    case 'milestone':
      // Milestones are typically binary (0% or 100%)
      return checkBadgeUnlocked(badgeId, userStats) ? 100 : 0

    default:
      return 0
  }
}

/**
 * Get badges filtered by category
 */
export function getBadgesByCategory(category: BadgeCategory): Badge[] {
  return BADGE_DEFINITIONS.filter(badge => badge.category === category)
}

/**
 * Get badges filtered by type (rarity)
 */
export function getBadgesByType(type: BadgeType): Badge[] {
  return BADGE_DEFINITIONS.filter(badge => badge.type === type)
}

/**
 * Get all available badge categories
 */
export function getBadgeCategories(): BadgeCategory[] {
  return ['wellness', 'social', 'growth', 'consistency', 'milestone']
}

/**
 * Get all badge types (rarities)
 */
export function getBadgeTypes(): BadgeType[] {
  return ['bronze', 'silver', 'gold', 'platinum']
}

/**
 * Update user's activity count and return new stats
 */
export function updateActivityCount(
  userStats: UserStats,
  activity: ActivityType,
  increment: number = 1
): UserStats {
  const newStats = { ...userStats }
  newStats.activityCounts = {
    ...newStats.activityCounts,
    [activity]: (newStats.activityCounts[activity] || 0) + increment
  }
  
  // Recalculate total points
  newStats.totalPoints = calculateTotalPoints(newStats)
  
  return newStats
}

/**
 * Update user's streak and return new stats
 */
export function updateStreak(
  userStats: UserStats,
  isActiveToday: boolean
): UserStats {
  const newStats = { ...userStats }
  const today = new Date().toISOString().split('T')[0]
  
  if (isActiveToday) {
    if (userStats.lastActivityDate === today) {
      // Already active today, no change
      return userStats
    } else if (userStats.lastActivityDate === getPreviousDay(today)) {
      // Continuing streak
      newStats.currentStreak += 1
    } else {
      // Starting new streak
      newStats.currentStreak = 1
    }
    
    newStats.lastActivityDate = today
    newStats.longestStreak = Math.max(newStats.longestStreak, newStats.currentStreak)
  } else {
    // Streak broken
    newStats.currentStreak = 0
  }
  
  // Recalculate total points with new streak bonus
  newStats.totalPoints = calculateTotalPoints(newStats)
  
  return newStats
}

/**
 * Helper function to get previous day string
 */
function getPreviousDay(dateString: string): string {
  const date = new Date(dateString)
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

/**
 * Initialize default user stats
 */
export function createDefaultUserStats(userId: string): UserStats {
  const today = new Date().toISOString().split('T')[0]
  
  return {
    userId,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    activityCounts: {
      breathing_exercise: 0,
      workout: 0,
      journal_entry: 0,
      mood_check: 0,
      meditation: 0,
      music_session: 0,
      chat_session: 0,
      daily_goal_complete: 0,
      streak_milestone: 0,
      profile_complete: 0,
      onboarding_complete: 0,
    },
    unlockedBadges: [],
    createdAt: today,
    updatedAt: today
  }
}
