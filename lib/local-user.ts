export interface LocalUserProfile {
  name: string
  age: number
  sex: string
  weight: number
}

const profileKey = (uid: string) => `koru-profile-${uid}`
const onboardingKey = (uid: string) => `koru-onboarding-done-${uid}`

export function loadLocalProfile(uid: string): LocalUserProfile | null {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(profileKey(uid)) : null
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.name && parsed.age && parsed.sex && parsed.weight) return parsed
    return null
  } catch {
    return null
  }
}

export function saveLocalProfile(uid: string, profile: LocalUserProfile) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(profileKey(uid), JSON.stringify(profile))
  } catch {}
}

export function loadOnboardingDone(uid: string): boolean {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(onboardingKey(uid)) : null
    return !!raw
  } catch {
    return false
  }
}

export function saveOnboardingDone(uid: string) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(onboardingKey(uid), 'true')
  } catch {}
}


