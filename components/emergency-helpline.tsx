"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Phone, MessageSquare, Globe, Clock, Heart, Users, Shield, ShieldAlert, Headphones } from "lucide-react"

interface EmergencyHelplineProps {
  onBack: () => void
}

const emergencyContacts = [
  {
    name: "Emergency Services (India)",
    number: "112",
    description: "Immediate emergency response (Police/Ambulance/Fire)",
    icon: Phone,
    color: "text-red-400",
    urgent: true,
    textOnly: false,
  },
  {
    name: "Kiran Mental Health Helpline",
    number: "14416",
    description: "24/7 mental health support across India",
    icon: Heart,
    color: "text-pink-400",
    urgent: true,
    textOnly: false,
  },
  {
    name: "AASRA 24/7 Suicide Prevention",
    number: "+91 98204 66726",
    description: "Confidential support, all India",
    icon: Phone,
    color: "text-blue-400",
    textOnly: false,
  },
  {
    name: "CHILDLINE India",
    number: "1098",
    description: "24/7 help for children in need of care and protection",
    icon: Shield,
    color: "text-orange-400",
    textOnly: false,
  },
]

const internationalResources = [
  { country: "India", number: "14416", service: "Kiran Mental Health Helpline" },
  { country: "India", number: "+91 98204 66726", service: "AASRA Suicide Prevention" },
  { country: "India", number: "1098", service: "CHILDLINE" },
  { country: "International", number: "befrienders.org", service: "Befrienders Worldwide" },
]

export default function EmergencyHelpline({ onBack }: EmergencyHelplineProps) {
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
              <Phone className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Emergency Helpline</h1>
              <p className="text-sm text-muted-foreground">24/7 professional support</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Immediate Help Banner */}
        <Card className="glass-strong border-red-500/30 bg-gradient-to-r from-red-500/10 to-pink-500/10 p-6">
          <div className="text-center space-y-4">
            <Clock className="h-12 w-12 mx-auto text-red-400" />
            <h2 className="text-2xl font-bold">Need Help Right Now?</h2>
            <p className="text-lg text-muted-foreground">
              These resources are available 24/7. You don't have to face this alone.
            </p>
          </div>
        </Card>

        {/* Affirmation (from Crisis Support) */}
        <Card className="glass-strong p-6 text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <h3 className="text-xl font-semibold mb-3">Remember</h3>
          <p className="text-lg leading-relaxed">
            You are valuable. Your life matters. This difficult moment will pass, and there are people who want to help
            you through it.
          </p>
        </Card>

        {/* Emergency Contacts */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Emergency Contacts</h3>
          {emergencyContacts.map((contact, index) => {
            const IconComponent = contact.icon
            return (
              <Card key={index} className={`glass-strong p-4 ${contact.urgent ? "border-red-500/30" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                      <IconComponent className={`h-6 w-6 ${contact.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">{contact.description}</p>
                      <p className="text-lg font-mono mt-1">{contact.number}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {contact.textOnly ? (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(`sms:${contact.number}?body=HOME`)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Text
                      </Button>
                    ) : (
                      <Button
                        className={contact.urgent ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                        onClick={() => window.open(`tel:${contact.number}`)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* International Resources */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            International Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internationalResources.map((resource, index) => (
              <div key={index} className="p-4 glass rounded-lg">
                <h4 className="font-semibold">{resource.country}</h4>
                <p className="text-sm text-muted-foreground">{resource.service}</p>
                <p className="font-mono mt-1">{resource.number}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* What to Expect */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4">What to Expect When You Call</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">A trained counselor will listen without judgment</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">Your call is confidential and free</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">They'll help you work through your immediate crisis</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">They can connect you with local resources</p>
            </div>
          </div>
        </Card>

        {/* Immediate Actions (from Crisis Support) */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-blue-400" />
            Right Now, You Can:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Take slow, deep breaths",
              "Find a safe, comfortable space",
              "Remind yourself: 'This feeling will pass'",
              "Reach out to someone you trust",
              "Use a coping strategy that has helped before",
              "Consider calling a crisis helpline",
            ].map((action, index) => (
              <div key={index} className="flex items-center gap-3 p-3 glass rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                <p className="text-sm">{action}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Coping Strategies (from Crisis Support) */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-400" />
            Coping Strategies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "5-4-3-2-1 Grounding", description: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste" },
              { title: "Box Breathing", description: "Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat." },
              { title: "Safe Person", description: "Call or text someone you trust - a friend, family member, or counselor" },
              { title: "Kiran Helpline (India)", description: "Call 14416 for 24/7 mental health support" },
            ].map((strategy, index) => (
              <Card key={index} className="glass p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center flex-shrink-0">
                    <Headphones className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{strategy.title}</h4>
                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Safety Planning */}
        <Card className="glass-strong p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <h3 className="text-xl font-semibold mb-4">Creating a Safety Plan</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Consider creating a safety plan with a counselor. This includes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Warning signs to watch for</p>
            </div>
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Coping strategies that work for you</p>
            </div>
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">People you can contact for support</p>
            </div>
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Professional contacts and resources</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
