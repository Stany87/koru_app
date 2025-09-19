/**
 * Utility functions for managing mood assessment state
 */

// Check if user has completed their initial mood assessment
export function hasCompletedInitialMoodAssessment(userId: string): boolean {
  try {
    const key = `koru-initial-mood-assessment-${userId}`
    const completed = localStorage.getItem(key)
    return completed === 'true'
  } catch {
    return false
  }
}

// Mark initial mood assessment as completed
export function markInitialMoodAssessmentCompleted(userId: string): void {
  try {
    const key = `koru-initial-mood-assessment-${userId}`
    localStorage.setItem(key, 'true')
  } catch {
    // Ignore localStorage errors
  }
}

// Reset mood assessment status (for testing or user preference)
export function resetMoodAssessmentStatus(userId: string): void {
  try {
    const key = `koru-initial-mood-assessment-${userId}`
    localStorage.removeItem(key)
  } catch {
    // Ignore localStorage errors
  }
}

// Check if we should show mood assessment on this visit
export function shouldShowVisitMoodCheck(userId: string): boolean {
  try {
    const key = `koru-visit-mood-check-${userId}`
    const lastCheck = localStorage.getItem(key)
    
    // Always show on first visit or if no previous check
    if (!lastCheck) return true
    
    // Check if this is a new session/visit (more than 30 minutes since last check)
    const lastCheckTime = new Date(lastCheck)
    const now = new Date()
    const timeDiffMinutes = (now.getTime() - lastCheckTime.getTime()) / (1000 * 60)
    
    // Show mood check if more than 30 minutes have passed
    return timeDiffMinutes > 30
  } catch {
    return true
  }
}

// Mark visit mood check as completed for this session
export function markVisitMoodCheckCompleted(userId: string): void {
  try {
    const key = `koru-visit-mood-check-${userId}`
    const now = new Date().toISOString()
    localStorage.setItem(key, now)
  } catch {
    // Ignore localStorage errors
  }
}

// Legacy functions for backward compatibility
export const shouldShowDailyMoodCheck = shouldShowVisitMoodCheck
export const markDailyMoodCheckCompleted = markVisitMoodCheckCompleted
