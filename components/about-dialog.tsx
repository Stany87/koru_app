"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Shield, Users, Sparkles, Github, Mail } from "lucide-react"

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/20 max-w-2xl max-h-[80vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            About Koru
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Mission */}
          <Card className="glass p-6 text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-sm leading-relaxed">
              Koru is designed to provide accessible, confidential, and empathetic mental wellness support
              specifically for young people. We believe that everyone deserves a safe space to explore their emotions
              and find the support they need.
            </p>
          </Card>

          {/* Features */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-400" />
              What Koru Offers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 glass rounded-lg">
                <h4 className="font-semibold text-sm mb-1">AI Companion</h4>
                <p className="text-xs text-muted-foreground">Empathetic conversations powered by advanced AI</p>
              </div>
              <div className="p-3 glass rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Crisis Support</h4>
                <p className="text-xs text-muted-foreground">Immediate help and professional resources</p>
              </div>
              <div className="p-3 glass rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Wellness Tools</h4>
                <p className="text-xs text-muted-foreground">Meditation, music therapy, and journaling</p>
              </div>
              <div className="p-3 glass rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Mood Tracking</h4>
                <p className="text-xs text-muted-foreground">Daily check-ins and emotional awareness</p>
              </div>
            </div>
          </Card>

          {/* Privacy & Safety */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              Privacy & Safety
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm">Your conversations and journal entries are stored locally on your device</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm">We don't collect or share your personal information</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm">All data remains confidential and under your control</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm">Crisis detection protocols prioritize your immediate safety</p>
              </div>
            </div>
          </Card>

          {/* Team */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Our Team
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Koru was created by a team of students passionate about mental health and technology. We understand
              the unique challenges young people face and wanted to create a tool that truly helps.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="glass border-blue-500/50 bg-transparent">
                <Github className="h-3 w-3 mr-2" />
                GitHub
              </Button>
              <Button size="sm" variant="outline" className="glass border-purple-500/50 bg-transparent">
                <Mail className="h-3 w-3 mr-2" />
                Contact
              </Button>
            </div>
          </Card>

          {/* Version Info */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3">Version Information</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Version:</strong> 1.0.0
              </p>
              <p>
                <strong>Built with:</strong> Next.js, React, Tailwind CSS
              </p>
              <p>
                <strong>AI Powered by:</strong> Gemini AI
              </p>
              <p>
                <strong>Last Updated:</strong> December 2024
              </p>
            </div>
          </Card>

          {/* Acknowledgments */}
          <Card className="glass p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
            <h3 className="font-semibold mb-3">Acknowledgments</h3>
            <p className="text-sm text-muted-foreground">
              Special thanks to mental health professionals, crisis counselors, and the open-source community who made
              this project possible. Koru is dedicated to everyone who has struggled with mental health challenges
              - you are not alone, and your story matters.
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
