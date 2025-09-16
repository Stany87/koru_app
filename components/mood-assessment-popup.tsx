"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, X } from "lucide-react"
import { FernFrond } from "@/components/icons/fern-frond"

interface MoodAssessment {
  question: string
  options: string[]
}

interface MoodAssessmentPopupProps {
  open: boolean
  onComplete: (answers: string[]) => void
  onClose: () => void
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

export default function MoodAssessmentPopup({ open, onComplete, onClose }: MoodAssessmentPopupProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showConsolation, setShowConsolation] = useState(false)

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < moodQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowConsolation(true)
    }
  }

  const handleComplete = () => {
    onComplete(answers)
    setShowConsolation(false)
    setCurrentQuestion(0)
    setAnswers([])
  }

  const handleClose = () => {
    onClose()
    setShowConsolation(false)
    setCurrentQuestion(0)
    setAnswers([])
  }

  const getConsolationMessage = () => {
    const moodScore = answers.reduce((score, answer, index) => {
      const questionOptions = moodQuestions[index].options
      const answerIndex = questionOptions.indexOf(answer)
      return score + (4 - answerIndex)
    }, 0)

    if (moodScore >= 10) {
      return "You're doing wonderfully! Your positive energy shines through. Keep nurturing that beautiful spirit of yours."
    } else if (moodScore >= 7) {
      return "You're managing well, and that takes strength. Remember to be gentle with yourself as you navigate today."
    } else if (moodScore >= 4) {
      return "It's okay to have challenging days. You're not alone in this journey, and every small step forward matters."
    } else {
      return "I can sense you're going through a difficult time. Please know that your feelings are valid, and reaching out shows incredible courage. You matter, and there are people who want to help."
    }
  }

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  }

  if (showConsolation) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent showCloseButton={false} className="glass-strong border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 text-red-400" />A Message for You
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-2">
            <p className="text-center leading-relaxed">{getConsolationMessage()}</p>
            <div className="glass rounded-lg p-4 border border-border">
              <p className="text-sm italic text-center text-muted-foreground">"{getRandomQuote()}"</p>
            </div>
            <Button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Continue to Koru
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false} className="glass-strong border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <FernFrond className="h-5 w-5 text-white" />
            </div>
            Koru Check-in
          </DialogTitle>
          <p className="text-center text-muted-foreground">Let's see how you're doing today</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Question {currentQuestion + 1} of {moodQuestions.length}
              </span>
              <span>{Math.round(((currentQuestion + 1) / moodQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / moodQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-6">
              {moodQuestions[currentQuestion].question}
            </h2>

            {moodQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full transition-all duration-200 text-left justify-start h-auto p-4 !border-[0.15px] !border-emerald-300 bg-emerald-500/10 text-white hover:!bg-emerald-500 hover:!border-emerald-400 shadow-sm hover:shadow-md hover:scale-[1.02] focus-visible:ring-emerald-400"
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  )
}

