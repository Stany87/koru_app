"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Heart, HandHeart, MessageCircle, Sparkles, ArrowRight, ArrowLeft, AlertTriangle, Stethoscope } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: () => void
}

const steps = [
  {
    title: "Your privacy is protected",
    description:
      "What you share with Koru stays between you and the app. Your conversations, journal entries, and personal data are stored locally on your device and encrypted for your security.",
    icon: Shield,
    color: "from-blue-500/10 to-cyan-500/10",
  },
  {
    title: "Not a replacement for professional help",
    description:
      "Koru provides support and coping strategies, but it's not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for serious concerns.",
    icon: Stethoscope,
    color: "from-orange-500/10 to-red-500/10",
  },
  {
    title: "Crisis support available",
    description:
      "If you're experiencing a mental health emergency, Koru can immediately connect you with crisis hotlines and professional resources. Your safety is our priority.",
    icon: AlertTriangle,
    color: "from-red-500/10 to-pink-500/10",
  },
  {
    title: "Your AI wellness companion",
    description:
      "Koru's AI provides 24/7 emotional support, mood tracking, guided activities, and personalized wellness plans. It's trained to understand mental health and provide helpful coping strategies.",
    icon: MessageCircle,
    color: "from-green-500/10 to-teal-500/10",
  },
]

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [index, setIndex] = useState(0)

  const next = () => {
    if (index < steps.length - 1) setIndex(index + 1)
    else onComplete()
  }

  const back = () => {
    if (index > 0) setIndex(index - 1)
  }

  const StepIcon = steps[index].icon

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-xl glass-strong rounded-2xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl glass flex items-center justify-center mb-4 bg-gradient-to-br from-primary/10 to-secondary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-6">Welcome to Koru</p>
        </div>

        <Card className={`glass p-6 bg-gradient-to-br ${steps[index].color} border border-white/10`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl glass flex items-center justify-center flex-shrink-0">
              <StepIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{steps[index].title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{steps[index].description}</p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" className="glass bg-transparent" onClick={back} disabled={index === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="text-sm text-muted-foreground">{index + 1} / {steps.length}</div>
          <Button onClick={next} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            {index === steps.length - 1 ? "Finish" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="mt-4 text-center">
          <button
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            onClick={onComplete}
          >
            Skip for now
          </button>
        </div>
      </Card>
    </div>
  )
}





