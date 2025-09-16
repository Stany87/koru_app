"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Phone, MessageSquare, Globe, Book, Users, Heart } from "lucide-react"

interface ResourcesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const crisisResources = [
  {
    name: "Emergency Services (India)",
    contact: "112",
    description: "Immediate emergency response (Police/Ambulance/Fire)",
    type: "phone" as const,
  },
  {
    name: "Kiran Mental Health Helpline",
    contact: "14416",
    description: "24/7 mental health support across India",
    type: "phone" as const,
  },
  {
    name: "AASRA Suicide Prevention",
    contact: "+91 98204 66726",
    description: "24/7 confidential suicide prevention helpline",
    type: "phone" as const,
  },
  {
    name: "CHILDLINE India",
    contact: "1098",
    description: "24/7 help for children in need of care and protection",
    type: "phone" as const,
  },
]

const mentalHealthResources = [
  {
    name: "Ministry of Health & Family Welfare (India)",
    url: "https://www.mohfw.gov.in/",
    description: "Official health advisories and resources",
  },
  {
    name: "National Institute of Mental Health & Neurosciences (NIMHANS)",
    url: "https://nimhans.ac.in/",
    description: "Mental health information and services",
  },
  {
    name: "Kiran Mental Health Helpline Portal",
    url: "https://mindingourmind.gov.in/",
    description: "National mental health support initiative",
  },
  {
    name: "Befrienders Worldwide",
    url: "https://www.befrienders.org/",
    description: "Find listening support centres worldwide",
  },
]

const selfCareResources = [
  {
    name: "Headspace",
    description: "Meditation and mindfulness app",
    category: "Meditation",
  },
  {
    name: "Calm",
    description: "Sleep stories, meditation, and relaxation",
    category: "Relaxation",
  },
  {
    name: "7 Cups",
    description: "Free emotional support and online therapy",
    category: "Support",
  },
  {
    name: "Sanvello",
    description: "Anxiety and mood tracking with coping tools",
    category: "Mood Tracking",
  },
]

export default function ResourcesDialog({ open, onOpenChange }: ResourcesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/20 max-w-2xl max-h-[80vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Mental Health Resources
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Crisis Resources */}
          <Card className="glass p-4 border-red-500/30">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-400">
              <Phone className="h-4 w-4" />
              Crisis Support (24/7)
            </h3>
            <div className="space-y-3">
              {crisisResources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">{resource.name}</h4>
                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                    <p className="text-sm font-mono mt-1">{resource.contact}</p>
                  </div>
                  <Button
                    size="sm"
                    className={
                      resource.type === "phone" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    }
                    onClick={() => {
                      if (resource.type === "phone") {
                        window.open(`tel:${resource.contact}`)
                      } else {
                        window.open("sms:741741?body=HOME")
                      }
                    }}
                  >
                    {resource.type === "phone" ? <Phone className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Mental Health Organizations */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Mental Health Organizations
            </h3>
            <div className="space-y-3">
              {mentalHealthResources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">{resource.name}</h4>
                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="glass border-blue-500/50 bg-transparent"
                    onClick={() => window.open(resource.url, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Self-Care Apps */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Self-Care Apps & Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selfCareResources.map((resource, index) => (
                <div key={index} className="p-3 glass rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{resource.name}</h4>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Educational Resources */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Learn More About Mental Health
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Understanding mental health is the first step toward wellness. Here are some key points:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Mental health affects everyone, and seeking help is a sign of strength</li>
                <li>• Professional therapy can provide valuable tools and support</li>
                <li>• Self-care practices like meditation, exercise, and journaling help</li>
                <li>• Building a support network of friends and family is important</li>
                <li>• Recovery is possible, and you don't have to face challenges alone</li>
              </ul>
            </div>
          </Card>

          {/* Disclaimer */}
          <Card className="glass p-4 bg-yellow-500/10 border-yellow-500/30">
            <p className="text-xs text-muted-foreground">
              <strong>Important:</strong> Koru is not a replacement for professional mental health care. If you're
              experiencing a mental health crisis, please contact emergency services or a mental health professional
              immediately.
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
