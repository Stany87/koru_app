"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X, ChevronRight } from "lucide-react"

interface MoodCheckinCardProps {
  onMoodCheck: () => void
  onDismiss: () => void
}

export default function MoodCheckinCard({ onMoodCheck, onDismiss }: MoodCheckinCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="glass-strong p-4 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-primary">How are you feeling?</h3>
          </div>
          
          {!isExpanded ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Take a moment to check in with yourself and track your current mood.
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={onMoodCheck}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Quick Check-in
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Why check in?
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Regular mood check-ins help you:</strong></p>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• Track emotional patterns over time</li>
                  <li>• Identify triggers and positive influences</li>
                  <li>• Build self-awareness and mindfulness</li>
                  <li>• Get personalized wellness recommendations</li>
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={onMoodCheck}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Start Check-in
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Collapse
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  )
}