"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  X,
  Menu,
  Heart,
  MessageCircle,
  AlertTriangle,
  Phone,
  Sparkles,
  Music,
  Book,
  Settings,
  Shield,
  HelpCircle,
  Home,
  Target,
  Users,
  User,
} from "lucide-react"
// App logo image
import EnhancedChatInterface from "@/components/enhanced-chat-interface"
// Removed CrisisSupport
import EmergencyHelpline from "@/components/emergency-helpline"
import ZenZone from "@/components/zen-zone"
import MoodMusic from "@/components/mood-music"
import ReflectionJournal from "@/components/reflection-journal"
import Lifestyle from "@/components/lifestyle"
import CommunityMode from "@/components/community-mode"
import InstallButton from "@/components/install-button"
import SettingsDialog from "@/components/settings-dialog"
import ResourcesDialog from "@/components/resources-dialog"
import AboutDialog from "@/components/about-dialog"
import PrivacyDialog from "@/components/privacy-dialog"
import SplashLoader from "@/components/splash-loader"
import { useAuth } from "@/hooks/useAuth"
import { ensureUserDocument, saveProfile, getUserSettings, setOnboardingDone as setOnboardingDoneDb } from "@/lib/db"
import { db, isFirebaseEnabled, dataPersistenceDisabled } from "@/lib/firebase"
import { loadLocalProfile, saveLocalProfile, loadOnboardingDone, saveOnboardingDone } from "@/lib/local-user"
import { doc, getDoc } from "firebase/firestore"
import AuthSignup from "@/components/auth-signup"
import AuthLogin from "@/components/auth-login"
import OnboardingFlow from "@/components/onboarding-flow"
import UserProfileSetup from "@/components/user-profile-setup"
import PersonalDashboard from "@/components/personal-dashboard"
import MoodAssessmentPopup from "@/components/mood-assessment-popup"
import GuidedGrowthPlans from "@/components/guided-growth-plans"
import ProfileDialog from "@/components/profile-dialog"
import { shouldShowDailyMoodCheck, markDailyMoodCheckCompleted, shouldShowVisitMoodCheck, markVisitMoodCheckCompleted } from "@/lib/mood-assessment"
import MoodCheckinCard from "@/components/mood-checkin-card"

interface MoodAssessment {
  question: string
  options: string[]
}

const moodQuestions: MoodAssessment[] = [
  {
    question: "How are you feeling right now?",
    options: ["Great", "Good", "Okay", "Not so good", "Struggling"],
  },
  {
    question: "What's your energy level today?",
    options: ["High energy", "Moderate", "Low", "Exhausted", "Drained"],
  },
  {
    question: "How connected do you feel to others?",
    options: ["Very connected", "Somewhat connected", "Neutral", "Isolated", "Very alone"],
  },
]

const motivationalQuotes = [
  "You are braver than you believe, stronger than you seem, and smarter than you think. - A.A. Milne",
  "The only way out is through. - Robert Frost",
  "You have been assigned this mountain to show others it can be moved. - Mel Robbins",
  "Your current situation is not your final destination. - Unknown",
  "Healing isn't about erasing your past, it's about creating a better future. - Unknown",
]

const modes = [
  {
    id: "zen",
    title: "Zen Zone",
    description: "Find peace and calm your mind",
    icon: Sparkles,
    bgGradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
  },
  {
    id: "chat",
    title: "Chat Mode",
    description: "Talk with your AI companion",
    icon: MessageCircle,
    bgGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%)",
  },
  {
    id: "growth",
    title: "Growth Plans",
    description: "Structured wellness journey",
    icon: Target,
    bgGradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    description: "Sleep, nutrition, and daily habits",
    icon: Heart,
    bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(132, 204, 22, 0.2) 100%)",
  },
  {
    id: "music",
    title: "Mood Music",
    description: "Curated playlists for your emotions",
    icon: Music,
    bgGradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%)",
  },
  {
    id: "journal",
    title: "Reflection Journal",
    description: "Express your thoughts safely",
    icon: Book,
    bgGradient: "linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)",
  },
  {
    id: "community",
    title: "Community",
    description: "Connect with others on similar journeys",
    icon: Users,
    bgGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(244, 63, 94, 0.2) 100%)",
  },
  {
    id: "emergency",
    title: "Crisis Support",
    description: "24/7 emergency helplines and resources",
    icon: Phone,
    bgGradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(249, 115, 22, 0.3) 100%)",
  },
]

export default function KoruAppContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showSplash, setShowSplash] = useState(true)
  const { user, ready } = useAuth()
  const [authView, setAuthView] = useState<"login" | "signup">("login")
  const [onboardingDone, setOnboardingDone] = useState(false)
  const [onboardingChecked, setOnboardingChecked] = useState(false)
  const [profileSetupDone, setProfileSetupDone] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileChecked, setProfileChecked] = useState(false)
  const [showAssessment, setShowAssessment] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  // Get current mode from URL search params
  const selectedMode = searchParams.get('mode')
  const [showSettings, setShowSettings] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showMoodCheckin, setShowMoodCheckin] = useState(false)

  // Determine if profile already exists (Firestore if enabled, otherwise localStorage)
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return
      try {
        // First, check localStorage for the user profile
        const local = loadLocalProfile(user.uid)
        if (local) {
          setUserProfile(local)
          setProfileSetupDone(true)
          setProfileChecked(true)
          return
        }

        // Firestore path: users/{uid} with field 'profile'
        if (isFirebaseEnabled && !dataPersistenceDisabled && db) {
          const ref = doc(db, "users", user.uid)
          const snap = await getDoc(ref)
          const profile = snap.exists() ? (snap.data() as any)?.profile : null
          if (profile && profile.name && profile.age && profile.sex) {
            setUserProfile(profile)
            setProfileSetupDone(true)
            // keep a local backup for faster boot and offline use
            try { localStorage.setItem(`koru-profile-${user.uid}`, JSON.stringify(profile)) } catch {}
            return
          }
        }
        
        setProfileSetupDone(false)
      } catch {
        setProfileSetupDone(false)
      }
      finally {
        setProfileChecked(true)
      }
    }
    checkProfile()
  }, [user])

  // Check onboarding from Firestore (persisted) or localStorage as fallback
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return
      // Don't skip onboarding just because profile is done - onboarding should happen AFTER profile setup

      try {
        if (isFirebaseEnabled && !dataPersistenceDisabled) {
          const settings = await getUserSettings(user.uid)
          if (settings?.onboardingDone) {
            setOnboardingDone(true)
            saveOnboardingDone(user.uid)
            setOnboardingChecked(true)
            return
          }
        }
        setOnboardingDone(loadOnboardingDone(user.uid))
        setOnboardingChecked(true)
      } catch {
        setOnboardingDone(loadOnboardingDone(user?.uid || "anon"))
        setOnboardingChecked(true)
      }
    }
    checkOnboarding()
  }, [user, profileSetupDone])

  // Check if user should do visit-based mood assessment or show mood check-in card
  useEffect(() => {
    if (!user || !onboardingDone || !profileSetupDone || !onboardingChecked || !profileChecked) return
    
    console.log('🔍 Checking if mood assessment should show for user:', user.uid)
    console.log('⚙️ Conditions - onboardingDone:', onboardingDone, 'profileSetupDone:', profileSetupDone)
    
    // Check if user should do visit-based mood assessment
    if (shouldShowVisitMoodCheck(user.uid)) {
      console.log('✅ Should show mood assessment - setting showAssessment to true')
      setShowAssessment(true)
    } else {
      console.log('❌ Should NOT show mood assessment this visit')
      // Show the mood check-in card instead for easy access
      setShowMoodCheckin(true)
    }
  }, [user, onboardingDone, profileSetupDone, onboardingChecked, profileChecked])

  // Show branded loading screen first
  if (showSplash) {
    return <SplashLoader onFinish={() => setShowSplash(false)} durationMs={800} />
  }

  // Gate on Firebase auth state
  if (!ready || !user) {
    return authView === "login" ? (
      <AuthLogin onSwitchToSignup={() => setAuthView("signup")} />
    ) : (
      <AuthSignup onComplete={() => {}} onSwitchToLogin={() => setAuthView("login")} />
    )
  }

  // If profile setup is not done, show UserProfileSetup
  if (!profileSetupDone) {
    if (!profileChecked) {
      return <SplashLoader onFinish={() => setShowSplash(false)} durationMs={800} />
    }
    return <UserProfileSetup onComplete={async (profile) => { 
      setUserProfile(profile); 
      setProfileSetupDone(true); 
      // Daily mood check will be handled by the useEffect above
      try { if (user) saveLocalProfile(user.uid, profile) } catch { /* ignore */ } 
      try { if (user && isFirebaseEnabled && !dataPersistenceDisabled) { await ensureUserDocument(user.uid, profile as any); await saveProfile(user.uid, profile as any, true) } } catch { /* ignore */ } 
    }} />
  }

  // If onboarding is not done (and profile setup is), show OnboardingFlow
  if (!onboardingDone) {
    if (!onboardingChecked) {
      return <SplashLoader onFinish={() => setShowSplash(false)} durationMs={800} />
    }
    const saved = user ? loadOnboardingDone(user.uid) : false
    if (!saved) return <OnboardingFlow onComplete={async () => { if (user) saveOnboardingDone(user.uid); setOnboardingDone(true); try { if (user && isFirebaseEnabled && !dataPersistenceDisabled) { await setOnboardingDoneDb(user.uid) } } catch { /* ignore */ } }} />
    setOnboardingDone(true)
  }

  const handleModeSelect = (modeId: string) => {
    // Update URL with mode parameter to enable browser back/forward
    const params = new URLSearchParams(searchParams.toString())
    params.set('mode', modeId)
    router.push(`/?${params.toString()}`)
  }

  const handleBackToModes = () => {
    // Remove mode parameter from URL to go back to main dashboard
    const params = new URLSearchParams(searchParams.toString())
    params.delete('mode')
    const newUrl = params.toString() ? `/?${params.toString()}` : '/'
    router.push(newUrl)
  }

  const handleMoodCheckin = () => {
    console.log('📱 Mood check-in card clicked')
    setShowMoodCheckin(false)
    setShowAssessment(true)
  }

  const handleMoodCheckinDismiss = () => {
    console.log('❌ Mood check-in card dismissed')
    setShowMoodCheckin(false)
    // Mark as completed to prevent showing again this session
    if (user) {
      markVisitMoodCheckCompleted(user.uid)
    }
  }

  const handleAssessmentComplete = (answers: string[]) => {
    console.log('🧠 Mood assessment completed with answers:', answers)
    setShowAssessment(false)
    setShowMoodCheckin(false) // Hide mood checkin card after completing assessment
    // Mark visit mood check as completed for this session
    if (user) {
      console.log('📝 Marking visit mood check completed for user:', user.uid)
      markVisitMoodCheckCompleted(user.uid)
    }
    
    // Calculate mood score and update dashboard data
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
    
    console.log('📊 Mood score calculation:', {
      rawScore: moodScore,
      mappedMood: mappedMood,
      answersBreakdown: answers.map((answer, index) => {
        const questionOptions = [
          ["Great", "Good", "Okay", "Not so good", "Struggling"],
          ["High energy", "Moderate", "Low", "Exhausted", "Drained"],
          ["Very connected", "Somewhat connected", "Neutral", "Isolated", "Very alone"],
        ];
        const answerIndex = questionOptions[index].indexOf(answer);
        return { answer, points: 4 - answerIndex };
      })
    })

    // Update dashboard mood data
    const savedDashboard = localStorage.getItem("koru-dashboard")
    let dashboardData = savedDashboard ? JSON.parse(savedDashboard) : {
      journalStreak: 0,
      moodTrend: [],
      habitsProgress: {
        water: { current: 0, target: 8, dailyGoal: 8 },
        exercise: { current: 0, target: 30, dailyGoal: 30 },
        sleep: { current: 0, target: 8, dailyGoal: 8 }
      },
      completedExercises: {
        breathing: 0,
        meditation: 0,
        journal: 0
      },
      weeklyGoals: {
        completed: 0,
        total: 7
      },
      dailyGoals: {
        exerciseGoal: 3,
        exerciseCompleted: 0,
        date: new Date().toISOString().split('T')[0]
      }
    }
    
    // Ensure dailyGoals exists in loaded data
    if (!dashboardData.dailyGoals) {
      dashboardData.dailyGoals = {
        exerciseGoal: 3,
        exerciseCompleted: 0,
        date: new Date().toISOString().split('T')[0]
      }
    }

    // Use current date in user's timezone for proper date matching
    const today = new Date();
    const todayDateString = today.getFullYear() + '-' + 
      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
      String(today.getDate()).padStart(2, '0');
    
    console.log('📅 Processing mood data for today:', todayDateString)
    console.log('🕰️ Current time and timezone:', {
      currentTime: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localeDateString: new Date().toLocaleDateString(),
      isoString: new Date().toISOString()
    })
    console.log('📊 Current dashboard data before update:', dashboardData)

    const existingMoodIndex = dashboardData.moodTrend.findIndex((day: any) => day.date === todayDateString);
    let newMoodTrend;
    
    console.log('🔎 Existing mood index for today:', existingMoodIndex)

    if (existingMoodIndex !== -1) {
      console.log('🔄 Updating existing mood entry for today')
      // Update existing mood for today
      newMoodTrend = dashboardData.moodTrend.map((day: any) => 
        day.date === todayDateString ? { ...day, mood: mappedMood } : day
      );
    } else {
      console.log('➕ Adding new mood entry for today')
      // Add new mood for today, ensuring it's the first entry for the current day
      const newDay = { date: todayDateString, mood: mappedMood };
      newMoodTrend = [newDay, ...dashboardData.moodTrend.slice(0, 6)]; // Keep only last 7 days
    }
    
    console.log('🎯 New mood trend array:', newMoodTrend)

    dashboardData.moodTrend = newMoodTrend;
    console.log('💾 Saving updated dashboard data to localStorage:', dashboardData)
    localStorage.setItem("koru-dashboard", JSON.stringify(dashboardData))
    
    // Dispatch event to notify dashboard to refresh
    console.log('📢 Dispatching koru-dashboard-updated event')
    window.dispatchEvent(new CustomEvent('koru-dashboard-updated'))
    
    // Store mood assessment data
    localStorage.setItem("koru-mood-assessment", JSON.stringify({
      date: new Date().toISOString(),
      answers: answers
    }))
  }

  const handleMenuItemClick = (item: string) => {
    setShowMenu(false)
    switch (item) {
      case "settings":
        setShowSettings(true)
        break
      case "resources":
        setShowResources(true)
        break
      case "about":
        setShowAbout(true)
        break
      case "privacy":
        setShowPrivacy(true)
        break
      case "home":
        // Navigate back to home using URL
        const params = new URLSearchParams(searchParams.toString())
        params.delete('mode')
        const newUrl = params.toString() ? `/?${params.toString()}` : '/'
        router.push(newUrl)
        break
    }
  }

  if (selectedMode === "chat") {
    return <EnhancedChatInterface onBack={handleBackToModes} />
  }

  if (selectedMode === "emergency") {
    return <EmergencyHelpline onBack={handleBackToModes} onHome={handleBackToModes} />
  }

  if (selectedMode === "zen") {
    return <ZenZone onBack={handleBackToModes} />
  }

  if (selectedMode === "growth") {
    return <GuidedGrowthPlans onBack={handleBackToModes} onHome={handleBackToModes} />
  }

  if (selectedMode === "music") {
    return <MoodMusic onBack={handleBackToModes} />
  }

  if (selectedMode === "journal") {
    return <ReflectionJournal onBack={handleBackToModes} />
  }

  if (selectedMode === "lifestyle") {
    return <Lifestyle onBack={handleBackToModes} />
  }

  if (selectedMode === "community") {
    return <CommunityMode onBack={handleBackToModes} />
  }

  // Show mood assessment popup
  if (showAssessment) {
    return (
      <>
        <MoodAssessmentPopup 
          open={showAssessment} 
          onComplete={handleAssessmentComplete}
          onClose={() => setShowAssessment(false)}
        />
        {/* Show dashboard behind the popup */}
        <div className="min-h-screen">
          <header className="glass border-b border-border p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center overflow-hidden" style={{ width: '3rem', height: '3rem' }}>
                  <img src="/koru_logo.png" alt="Koru logo" className="h-10 w-10 object-contain" />
                </div>
                <h1 className="text-2xl font-bold text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text [background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [&:not(:has(*))]:text-primary">
                  Koru
                </h1>
              </div>
            </div>
          </header>
          <main className="p-4 max-w-4xl mx-auto">
            <PersonalDashboard 
              userName={userProfile?.name || "User"} 
              onNavigate={handleModeSelect} 
              userId={user?.uid}
              showMoodCheckin={showMoodCheckin}
              onMoodCheckin={handleMoodCheckin}
              onMoodCheckinDismiss={handleMoodCheckinDismiss}
            />
          </main>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="glass border-b border-border p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center overflow-hidden" style={{ width: '3.5rem', height: '3.5rem' }}>
              <img src="/koru_logo.png" alt="Koru logo" className="h-12 w-12 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text [background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [&:not(:has(*))]:text-primary">
              Koru
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <InstallButton />
            <Button
              variant="ghost"
              size="sm"
              className="glass-strong bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300"
              onClick={() => handleModeSelect("emergency")}
            >
              <Phone className="h-4 w-4 mr-2" />
              Crisis Support
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="glass-strong"
              onClick={() => setShowProfile(true)}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="icon" className="glass-strong" onClick={() => setShowMenu(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Wellness Modes Section */}
      <section className="p-4 max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Choose Your Wellness Mode</h2>
          <p className="text-muted-foreground">Select the support that feels right for you today</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-8">
          {modes.map((mode) => {
            const IconComponent = mode.icon
            return (
              <Card
                key={mode.id}
                className={`glass-strong rounded-xl p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:glass border-2 border-transparent hover:border-primary/20 backdrop-blur-sm group ${
                  mode.id === "emergency" ? "ring-2 ring-red-500/30 hover:ring-red-500/50" : ""
                }`}
                style={{ background: mode.bgGradient }}
                onClick={() => handleModeSelect(mode.id)}
              >
                <div className="text-center space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs mb-1">{mode.title}</h3>
                    <p className="text-xs text-muted-foreground leading-tight line-clamp-2">{mode.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Main Content - Dashboard */}
      <main className="p-4 max-w-6xl mx-auto">
        <PersonalDashboard 
          userName={userProfile?.name || "User"} 
          onNavigate={handleModeSelect} 
          userId={user?.uid}
          showMoodCheckin={showMoodCheckin}
          onMoodCheckin={handleMoodCheckin}
          onMoodCheckinDismiss={handleMoodCheckinDismiss}
        />
      </main>


      {/* Enhanced Menu Dialog */}
      <Dialog open={showMenu} onOpenChange={setShowMenu}>
        <DialogContent className="glass-strong border-border">
          <DialogHeader>
            <DialogTitle>Menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto hide-scrollbar">
            <Button
              variant="outline"
              className="w-full glass justify-start bg-transparent"
              onClick={() => handleMenuItemClick("home")}
            >
              <Home className="h-4 w-4 mr-3" />
              Home
            </Button>
            <Button
              variant="outline"
              className="w-full glass justify-start bg-transparent"
              onClick={() => handleMenuItemClick("settings")}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
            <Button
              variant="outline"
              className="w-full glass justify-start bg-transparent"
              onClick={() => handleMenuItemClick("resources")}
            >
              <Book className="h-4 w-4 mr-3" />
              Mental Health Resources
            </Button>
            <Button
              variant="outline"
              className="w-full glass justify-start border-primary/50 bg-transparent"
              onClick={() => handleMenuItemClick("privacy")}
            >
              <Shield className="h-4 w-4 mr-3" />
              Privacy & Safety
            </Button>
            <Button
              variant="outline"
              className="w-full glass justify-start bg-transparent"
              onClick={() => handleMenuItemClick("about")}
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              About Koru
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Dialog Components */}
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      <ResourcesDialog open={showResources} onOpenChange={setShowResources} />
      <AboutDialog open={showAbout} onOpenChange={setShowAbout} />
      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
      <ProfileDialog 
        open={showProfile} 
        onOpenChange={setShowProfile} 
        userProfile={userProfile}
        onSave={(profile) => setUserProfile(profile)}
        onMoodCheck={() => {
          setShowProfile(false)
          setShowAssessment(true)
        }}
        userId={user?.uid}
      />
    </div>
  )
}