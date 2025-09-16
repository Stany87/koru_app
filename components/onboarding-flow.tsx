"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Heart, HandHeart, HelpCircle, Sparkles, ArrowRight, ArrowLeft } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: () => void
}

const steps = [
  {
    title: "Your conversations stay private",
    description:
      "What you share here stays between you and Koru. Your entries and chats are stored locally unless you choose otherwise.",
    icon: Shield,
    color: "from-primary/10 to-secondary/10",
  },
  {
    title: "No judgment zone",
    description:
      "This is a safe, compassionate space. We listen, validate, and support—never judge.",
    icon: Heart,
    color: "from-pink-500/10 to-purple-500/10",
  },
  {
    title: "We're here to help",
    description:
      "Get coping strategies, calming tools, and resources. If you're in crisis, we'll guide you to immediate help.",
    icon: HandHeart,
    color: "from-green-500/10 to-teal-500/10",
  },
  {
    title: "How Koru works",
    description:
      "Choose a mode that fits your moment: chat, zen, music, journal, or support resources—always at your pace.",
    icon: HelpCircle,
    color: "from-blue-500/10 to-cyan-500/10",
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





