"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Shield } from "lucide-react"

interface PrivacyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PrivacyDialog({ open, onOpenChange }: PrivacyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/20 max-w-2xl max-h-[80vh] overflow-y-auto hide-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Safety
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-2">
          <Card className="glass p-4">
            <h3 className="font-semibold mb-2">What We Store</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Minimal data necessary to provide the service</li>
              <li>Preferences saved locally on your device (e.g., theme, onboarding)</li>
              <li>No storage of sensitive medical information</li>
            </ul>
          </Card>

          <Card className="glass p-4">
            <h3 className="font-semibold mb-2">AI Conversations</h3>
            <p className="text-sm text-muted-foreground">
              Conversations may be processed by an AI provider to generate supportive responses. Avoid sharing personally
              identifiable information. If you are in crisis in India, call 112 or Kiran 14416.
            </p>
          </Card>

          <Card className="glass p-4">
            <h3 className="font-semibold mb-2">Security Measures</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>HTTPS in production</li>
              <li>Scoped API keys and least-privilege access</li>
              <li>Regular dependency updates</li>
            </ul>
          </Card>

          <Card className="glass p-4">
            <h3 className="font-semibold mb-2">Your Choices</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Clear local data via your browser</li>
              <li>Use the app without sharing personal details</li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}


