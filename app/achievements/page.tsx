'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from '@/contexts/AuthContext'
import { AchievementProvider, useAchievements } from '@/contexts/AchievementContext'

// Disable static generation for this page
export const dynamic = 'force-dynamic'
import { 
  Badge as BadgeType, 
  Level, 
  calculateLevel, 
  calculateLevelProgress,
  getBadgesByCategory,
  getBadgeProgress,
  LEVELS,
  BADGE_DEFINITIONS 
} from '@/lib/achievements'

// Tab types
type TabType = 'overview' | 'badges' | 'progress' | 'leaderboard'

// Badge category filters
type BadgeFilter = 'all' | 'wellness' | 'social' | 'growth' | 'consistency' | 'milestone'

function AchievementsPageContent() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>('all')
  
  const {
    userStats,
    currentLevel,
    levelProgress,
    unlockedBadges,
    availableBadges,
    isLoading,
    error
  } = useAchievements()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading achievements</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'badges', label: 'Badges', icon: '🏆' },
    { id: 'progress', label: 'Progress', icon: '📈' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏅' }
  ] as const

  const badgeFilters = [
    { id: 'all', label: 'All', icon: '🎯' },
    { id: 'wellness', label: 'Wellness', icon: '🧘' },
    { id: 'social', label: 'Social', icon: '💬' },
    { id: 'growth', label: 'Growth', icon: '🌱' },
    { id: 'consistency', label: 'Consistency', icon: '🔥' },
    { id: 'milestone', label: 'Milestones', icon: '🎉' }
  ] as const

  const filteredBadges = badgeFilter === 'all' 
    ? availableBadges 
    : getBadgesByCategory(badgeFilter)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Achievements</h1>
          <p className="text-lg text-muted-foreground">Track your wellness journey and unlock rewards</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-strong rounded-2xl p-2 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted-foreground hover:bg-primary/10'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <OverviewTab 
                userStats={userStats}
                currentLevel={currentLevel}
                levelProgress={levelProgress}
                unlockedBadges={unlockedBadges}
              />
            )}
            
            {activeTab === 'badges' && (
              <BadgesTab
                badges={filteredBadges}
                unlockedBadges={unlockedBadges}
                userStats={userStats}
                filter={badgeFilter}
                setFilter={setBadgeFilter}
                filters={badgeFilters}
              />
            )}
            
            {activeTab === 'progress' && (
              <ProgressTab userStats={userStats} currentLevel={currentLevel} />
            )}
            
            {activeTab === 'leaderboard' && (
              <LeaderboardTab />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ 
  userStats, 
  currentLevel, 
  levelProgress, 
  unlockedBadges 
}: {
  userStats: any
  currentLevel: Level
  levelProgress: number
  unlockedBadges: BadgeType[]
}) {
  const nextLevel = LEVELS.find(level => level.level === currentLevel.level + 1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Level Progress Card */}
      <motion.div 
        className="glass-strong rounded-2xl p-6 col-span-full lg:col-span-2"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-4xl">{currentLevel.icon}</div>
          <div>
            <h3 className="text-2xl font-bold text-primary">{currentLevel.name}</h3>
            <p className="text-muted-foreground">Level {currentLevel.level}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress to {nextLevel?.name || 'Max Level'}</span>
            <span>{levelProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex justify-between text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{userStats?.totalPoints || 0}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">{userStats?.currentStreak || 0}</p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{unlockedBadges.length}</p>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Card */}
      <motion.div 
        className="glass-strong rounded-2xl p-6"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h3 className="text-lg font-semibold text-primary mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Longest Streak</span>
            <span className="font-semibold text-primary">{userStats?.longestStreak || 0} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Activities</span>
            <span className="font-semibold text-primary">
              {Object.values(userStats?.activityCounts || {}).reduce((a: number, b) => a + (b as number), 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Age</span>
            <span className="font-semibold text-primary">
              {userStats?.createdAt ? 
                Math.ceil((Date.now() - new Date(userStats.createdAt).getTime()) / (1000 * 60 * 60 * 24)) 
                : 0} days
            </span>
          </div>
        </div>
      </motion.div>

      {/* Recent Badges */}
      <motion.div 
        className="glass-strong rounded-2xl p-6 col-span-full"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h3 className="text-lg font-semibold text-primary mb-4">Recent Achievements</h3>
        {unlockedBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {unlockedBadges.slice(-6).map((badge, index) => (
              <motion.div
                key={badge.id}
                className="text-center p-3 glass rounded-xl hover:bg-primary/5 transition-colors"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="text-xs font-medium text-primary">{badge.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{badge.type}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No achievements yet. Start your wellness journey to unlock your first badge!
          </p>
        )}
      </motion.div>
    </div>
  )
}

// Badges Tab Component (placeholder)
function BadgesTab({ 
  badges, 
  unlockedBadges, 
  userStats, 
  filter, 
  setFilter, 
  filters 
}: {
  badges: BadgeType[]
  unlockedBadges: BadgeType[]
  userStats: any
  filter: BadgeFilter
  setFilter: (filter: BadgeFilter) => void
  filters: readonly { id: BadgeFilter; label: string; icon: string }[]
}) {
  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((filterOption) => (
          <button
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all glass ${
              filter === filterOption.id
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-primary/10'
            }`}
          >
            <span>{filterOption.icon}</span>
            <span className="text-sm font-medium">{filterOption.label}</span>
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.some(ub => ub.id === badge.id)
          const progress = getBadgeProgress(badge.id, userStats)
          
          return (
            <motion.div
              key={badge.id}
              className={`p-6 rounded-2xl transition-all ${
                isUnlocked
                  ? 'glass-strong bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30'
                  : 'glass hover:glass-strong'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-center">
                <div className={`text-4xl mb-3 ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>
                  {badge.icon}
                </div>
                <h4 className="font-bold text-primary mb-2">{badge.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                
                {!isUnlocked && (
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{progress}% complete</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    badge.type === 'platinum' ? 'bg-primary/20 text-primary' :
                    badge.type === 'gold' ? 'bg-secondary/20 text-secondary' :
                    badge.type === 'silver' ? 'bg-accent/20 text-accent' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {badge.type}
                  </span>
                  <span className="font-semibold text-primary">{badge.points} pts</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Progress Tab Component (placeholder)
function ProgressTab({ userStats, currentLevel }: { userStats: any, currentLevel: Level }) {
  return (
    <div className="glass-strong rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-primary mb-6">Your Progress</h3>
      <p className="text-muted-foreground">Detailed progress tracking coming soon...</p>
    </div>
  )
}

// Leaderboard Tab Component (placeholder)
function LeaderboardTab() {
  return (
    <div className="glass-strong rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-primary mb-6">Leaderboard</h3>
      <p className="text-muted-foreground">Leaderboard coming soon...</p>
    </div>
  )
}

// Default export with providers
export default function AchievementsPage() {
  return (
    <AuthProvider>
      <AchievementProvider>
        <AchievementsPageContent />
      </AchievementProvider>
    </AuthProvider>
  )
}
