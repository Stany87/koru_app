"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
    color: "from-purple-500/20 to-blue-500/20",
  },
  {
    id: "chat",
    title: "Chat Mode",
    description: "Talk with your AI companion",
    icon: MessageCircle,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "growth",
    title: "Growth Plans",
    description: "Structured wellness journey",
    icon: Target,
    color: "from-indigo-500/20 to-purple-500/20",
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    description: "Sleep, nutrition, and daily habits",
    icon: Heart,
    color: "from-emerald-500/20 to-lime-500/20",
  },
  {
    id: "music",
    title: "Mood Music",
    description: "Curated playlists for your emotions",
    icon: Music,
    color: "from-green-500/20 to-teal-500/20",
  },
  {
    id: "journal",
    title: "Reflection Journal",
    description: "Express your thoughts safely",
    icon: Book,
    color: "from-yellow-500/20 to-orange-500/20",
  },
  {
    id: "community",
    title: "Community",
    description: "Connect with others on similar journeys",
    icon: Users,
    color: "from-pink-500/20 to-rose-500/20",
  },
]

export default function KoruApp() {
  const router = useRouter()
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
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Determine if profile already exists (Firestore if enabled, otherwise localStorage)
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return
      try {
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
        // Fallback: localStorage per-user
        const local = loadLocalProfile(user.uid)
        if (local) {
          setUserProfile(local)
          setProfileSetupDone(true)
          return
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
  }, [user])

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
  if (!onboardingDone) {
    if (!onboardingChecked) {
      return <SplashLoader onFinish={() => setShowSplash(false)} durationMs={800} />
    }
    const saved = user ? loadOnboardingDone(user.uid) : false
    if (!saved) return <OnboardingFlow onComplete={async () => { if (user) saveOnboardingDone(user.uid); setOnboardingDone(true); try { if (user && isFirebaseEnabled && !dataPersistenceDisabled) { await setOnboardingDoneDb(user.uid) } } catch { /* ignore */ } }} />
    setOnboardingDone(true)
  }

  if (!profileSetupDone) {
    if (!profileChecked) {
      return <SplashLoader onFinish={() => setShowSplash(false)} durationMs={800} />
    }
    return <UserProfileSetup onComplete={async (profile) => { setUserProfile(profile); setProfileSetupDone(true); setShowAssessment(true); try { if (user) saveLocalProfile(user.uid, profile) } catch { /* ignore */ } try { if (user && isFirebaseEnabled && !dataPersistenceDisabled) { await ensureUserDocument(user.uid, profile as any); await saveProfile(user.uid, profile as any, true) } } catch { /* ignore */ } }} />
  }

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId)
  }

  const handleBackToModes = () => {
    setSelectedMode(null)
  }

  const handleAssessmentComplete = (answers: string[]) => {
    setShowAssessment(false)
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
        setSelectedMode(null)
        break
    }
  }

  if (selectedMode === "chat") {
    return <EnhancedChatInterface onBack={handleBackToModes} />
  }

  if (selectedMode === "emergency") {
    return <EmergencyHelpline onBack={handleBackToModes} />
  }

  if (selectedMode === "zen") {
    return <ZenZone onBack={handleBackToModes} />
  }

  if (selectedMode === "growth") {
    return <GuidedGrowthPlans onBack={handleBackToModes} />
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
            <PersonalDashboard userName={userProfile?.name || "User"} onNavigate={handleModeSelect} />
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {modes.map((mode) => {
            const IconComponent = mode.icon
            return (
              <Card
                key={mode.id}
                className={`glass-strong rounded-xl p-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:glass border-2 border-transparent hover:border-primary/20 bg-gradient-to-br ${mode.color} group`}
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
        <PersonalDashboard userName={userProfile?.name || "User"} onNavigate={handleModeSelect} />
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
      />
    </div>
  )
}
