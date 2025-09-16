"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Heart, Phone, MessageSquare, Headphones, Users, Clock, Shield } from "lucide-react"

interface CrisisSupportProps {
  onBack: () => void
}

const copingStrategies = [
  {
    title: "5-4-3-2-1 Grounding",
    description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
    icon: Shield,
  },
  {
    title: "Box Breathing",
    description: "Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat.",
    icon: Heart,
  },
  {
    title: "Safe Person",
    description: "Call or text someone you trust - a friend, family member, or counselor",
    icon: Users,
  },
  {
    title: "Kiran Helpline (India)",
    description: "Call 14416 for 24/7 mental health support",
    icon: Headphones,
  },
]

const immediateActions = [
  "Take slow, deep breaths",
  "Find a safe, comfortable space",
  "Remind yourself: 'This feeling will pass'",
  "Reach out to someone you trust",
  "Use a coping strategy that has helped before",
  "Consider calling a crisis helpline",
]

export default function CrisisSupport({ onBack }: CrisisSupportProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/10 p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="glass-strong" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Crisis Support</h1>
              <p className="text-sm text-muted-foreground">You're not alone - help is here</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Emergency Notice */}
        <Card className="glass-strong border-red-500/30 bg-gradient-to-r from-red-500/10 to-orange-500/10 p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full glass flex items-center justify-center">
              <Phone className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-400">If you're in immediate danger</h2>
            <p className="text-lg">Call emergency services: 112 (India) or your local emergency number</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => window.open("tel:112")}>
                <Phone className="h-4 w-4 mr-2" />
                Call 112
              </Button>
              <Button
                variant="outline"
                className="glass border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                onClick={() => window.open("tel:14416")}
              >
                <Headphones className="h-4 w-4 mr-2" />
                Call Kiran (14416)
              </Button>
            </div>
          </div>
        </Card>

        {/* Immediate Actions */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Right Now, You Can:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {immediateActions.map((action, index) => (
              <div key={index} className="flex items-center gap-3 p-3 glass rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                <p className="text-sm">{action}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Coping Strategies */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-400" />
            Coping Strategies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {copingStrategies.map((strategy, index) => {
              const IconComponent = strategy.icon
              return (
                <Card
                  key={index}
                  className={`glass cursor-pointer transition-all duration-200 p-4 ${
                    selectedStrategy === index ? "border-purple-500/50 bg-purple-500/10" : "hover:glass-strong"
                  }`}
                  onClick={() => setSelectedStrategy(selectedStrategy === index ? null : index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{strategy.title}</h4>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Card>

        {/* Professional Resources */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Headphones className="h-5 w-5 text-green-400" />
            Professional Support
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div>
                <h4 className="font-semibold">Kiran Mental Health Helpline (India)</h4>
                <p className="text-sm text-muted-foreground">24/7 free mental health support</p>
              </div>
              <Button
                variant="outline"
                className="glass border-green-500/50 bg-transparent"
                onClick={() => window.open("tel:14416")}
              >
                Call 14416
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div>
                <h4 className="font-semibold">AASRA 24/7 Suicide Prevention</h4>
                <p className="text-sm text-muted-foreground">Confidential support, all India</p>
              </div>
              <Button
                variant="outline"
                className="glass border-green-500/50 bg-transparent"
                onClick={() => window.open("tel:+919820466726")}
              >
                Call +91 98204 66726
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div>
                <h4 className="font-semibold">CHILDLINE India</h4>
                <p className="text-sm text-muted-foreground">24/7 help for children in need</p>
              </div>
              <Button
                variant="outline"
                className="glass border-green-500/50 bg-transparent"
                onClick={() => window.open("tel:1098")}
              >
                Call 1098
              </Button>
            </div>
          </div>
        </Card>

        {/* Affirmation */}
        <Card className="glass-strong p-6 text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <h3 className="text-xl font-semibold mb-3">Remember</h3>
          <p className="text-lg leading-relaxed">
            You are valuable. Your life matters. This difficult moment will pass, and there are people who want to help
            you through it.
          </p>
        </Card>
      </div>
    </div>
  )
}
