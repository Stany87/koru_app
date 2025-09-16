"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Shield, FileText, ArrowRight, ArrowLeft } from "lucide-react"
import { FernFrond } from "@/components/icons/fern-frond"

interface UserProfile {
  name: string
  age: number
  sex: string
  weight: number
  privacyAccepted: boolean
  termsAccepted: boolean
}

interface UserProfileSetupProps {
  onComplete: (profile: UserProfile) => void
}

export default function UserProfileSetup({ onComplete }: UserProfileSetupProps) {
  const [step, setStep] = useState<"profile" | "privacy" | "terms">("profile")
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: 0,
    sex: "",
    weight: 0,
    privacyAccepted: false,
    termsAccepted: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateProfile = () => {
    const newErrors: Record<string, string> = {}
    
    if (!profile.name.trim()) newErrors.name = "Name is required"
    if (profile.age < 13 || profile.age > 100) newErrors.age = "Please enter a valid age (13-100)"
    if (!profile.sex) newErrors.sex = "Please select your sex"
    if (profile.weight < 30 || profile.weight > 200) newErrors.weight = "Please enter a valid weight (30-200 kg)"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === "profile") {
      if (validateProfile()) {
        setStep("privacy")
      }
    } else if (step === "privacy") {
      setStep("terms")
    }
  }

  const handleBack = () => {
    if (step === "privacy") {
      setStep("profile")
    } else if (step === "terms") {
      setStep("privacy")
    }
  }

  const handleComplete = () => {
    if (profile.privacyAccepted && profile.termsAccepted) {
      onComplete(profile)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl glass-strong rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl glass flex items-center justify-center mb-4 bg-gradient-to-br from-primary/10 to-secondary/10">
            <FernFrond className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {step === "profile" ? "Welcome to Koru" : step === "privacy" ? "Privacy Policy" : "Terms of Use"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {step === "profile" 
              ? `${getGreeting()}! Let's set up your personal wellness journey`
              : step === "privacy"
              ? "Your privacy and data protection are our top priorities"
              : "Please review and accept our terms to continue"
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${step === "profile" ? "bg-primary" : "bg-primary/30"}`} />
            <div className={`w-8 h-1 rounded-full ${step === "privacy" ? "bg-primary" : "bg-primary/30"}`} />
            <div className={`w-3 h-3 rounded-full ${step === "terms" ? "bg-primary" : "bg-primary/30"}`} />
          </div>
        </div>

        {step === "profile" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="pl-9 glass bg-transparent border-white/20 focus:border-white/40"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Age *</label>
                <Input
                  type="number"
                  value={profile.age || ""}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  className="glass bg-transparent border-white/20 focus:border-white/40"
                  placeholder="Enter your age"
                  min="13"
                  max="100"
                />
                {errors.age && <p className="text-sm text-red-400 mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sex *</label>
                <Select value={profile.sex} onValueChange={(value) => setProfile({ ...profile, sex: value })}>
                  <SelectTrigger className="glass bg-transparent border-white/20 focus:border-white/40">
                    <SelectValue placeholder="Select your sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && <p className="text-sm text-red-400 mt-1">{errors.sex}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg) *</label>
                <Input
                  type="number"
                  value={profile.weight || ""}
                  onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) || 0 })}
                  className="glass bg-transparent border-white/20 focus:border-white/40"
                  placeholder="Enter your weight"
                  min="30"
                  max="200"
                />
                {errors.weight && <p className="text-sm text-red-400 mt-1">{errors.weight}</p>}
              </div>
            </div>

            <div className="p-4 glass rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <p className="text-sm text-muted-foreground">
                <strong>Why we collect this information:</strong> This helps us personalize your wellness journey, 
                provide age-appropriate content, and track your progress more effectively. Your data is stored 
                locally on your device and is never shared without your explicit consent.
              </p>
            </div>
          </div>
        )}

        {step === "privacy" && (
          <div className="space-y-6">
            <Card className="glass p-6 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy Policy
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Data Collection</h4>
                  <p>We collect only the information necessary to provide you with personalized mental wellness support. This includes your profile information, journal entries, mood assessments, and app usage data.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Data Storage</h4>
                  <p>Your personal data is stored locally on your device using secure browser storage. We do not store your personal information on our servers unless you explicitly choose to sync your data.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Data Usage</h4>
                  <p>We use your data to personalize your experience, provide relevant content, track your progress, and improve our services. We never sell or share your personal information with third parties.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Your Rights</h4>
                  <p>You have the right to access, modify, or delete your data at any time. You can export your data or request its deletion through the app settings.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Crisis Situations</h4>
                  <p>In emergency situations where your safety is at risk, we may share relevant information with emergency services or mental health professionals to ensure your wellbeing.</p>
                </div>
              </div>
            </Card>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy-accept"
                checked={profile.privacyAccepted}
                onCheckedChange={(checked) => setProfile({ ...profile, privacyAccepted: checked as boolean })}
              />
              <label htmlFor="privacy-accept" className="text-sm">
                I have read and understand the Privacy Policy
              </label>
            </div>
          </div>
        )}

        {step === "terms" && (
          <div className="space-y-6">
            <Card className="glass p-6 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Terms of Use
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Service Description</h4>
                  <p>Koru is a mental wellness application designed to provide support, guidance, and resources for mental health. It is not a substitute for professional medical or psychological treatment.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">User Responsibilities</h4>
                  <p>You are responsible for your use of the app and any decisions made based on the information provided. Always consult with qualified healthcare professionals for serious mental health concerns.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Limitations</h4>
                  <p>Koru cannot diagnose, treat, or cure mental health conditions. The app is designed to complement, not replace, professional mental health care.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Emergency Situations</h4>
                  <p>If you are experiencing a mental health emergency, please contact emergency services immediately. Koru is not equipped to handle crisis situations.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Changes to Terms</h4>
                  <p>We may update these terms from time to time. Continued use of the app constitutes acceptance of any changes.</p>
                </div>
              </div>
            </Card>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms-accept"
                checked={profile.termsAccepted}
                onCheckedChange={(checked) => setProfile({ ...profile, termsAccepted: checked as boolean })}
              />
              <label htmlFor="terms-accept" className="text-sm">
                I have read and agree to the Terms of Use
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            className="glass bg-transparent"
            onClick={handleBack}
            disabled={step === "profile"}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {step === "profile" ? "1" : step === "privacy" ? "2" : "3"} of 3
          </div>

          {step === "terms" ? (
            <Button
              onClick={handleComplete}
              disabled={!profile.privacyAccepted || !profile.termsAccepted}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Complete Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

