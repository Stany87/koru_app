"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, RotateCcw, Sparkles, Wind, Waves, Mountain, Target } from "lucide-react"
import GuidedGrowthPlans from "./guided-growth-plans"

interface ZenZoneProps {
  onBack: () => void
}

const breathingExercises = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    duration: 60,
    icon: Wind,
  },
  {
    name: "Box Breathing",
    description: "4 counts each: inhale, hold, exhale, hold",
    duration: 120,
    icon: Sparkles,
  },
  {
    name: "Ocean Breathing",
    description: "Deep, rhythmic breathing like ocean waves",
    duration: 180,
    icon: Waves,
  },
]

// Single guided meditation type; choose posture separately
const guidedMeditations = [
  {
    title: "Mindful Breathing",
    duration: "5 min",
    description: "A calm, steady awareness of the natural breath.",
    icon: Wind,
  },
]

// Meditation postures (asanas)
const meditationAsanas = [
  {
    title: "Shavasana",
    description: "Lie on your back, arms by your sides, palms facing up.",
    icon: Mountain,
    image: "/asanas/shavasana.png",
    instructions: [
      "Lie flat on your back with legs comfortably apart, feet falling outward.",
      "Place arms slightly away from the body, palms facing up.",
      "Gently tuck the chin to lengthen the back of the neck.",
      "Soften the jaw and let the tongue rest naturally.",
      "Close your eyes and allow the whole body to relax with natural breathing.",
    ],
  },
  {
    title: "Vajrasana",
    description: "Kneel and sit back on your heels, spine tall and relaxed.",
    icon: Sparkles,
    image: "/asanas/vajrasana.png",
    instructions: [
      "Kneel on the mat with knees together and feet pointing back.",
      "Sit back on your heels; optionally place a cushion between heels and hips.",
      "Lengthen the spine, relax shoulders, and place hands on thighs.",
      "Keep the gaze soft and breathe steadily through the nose.",
      "If knees or ankles feel strained, use extra padding or switch posture.",
    ],
  },
  {
    title: "Sukhasana",
    description: "Easy cross-legged seat, shoulders soft, hands on thighs.",
    icon: Wind,
    image: "/asanas/sukhasana.png",
    instructions: [
      "Sit cross-legged on a cushion so hips are above knees.",
      "Root sit bones evenly and lengthen the spine upward.",
      "Relax shoulders away from ears; soften the face and jaw.",
      "Rest hands on thighs or in the lap; keep chest open.",
      "If hips or knees are tight, elevate the seat further or support knees.",
    ],
  },
]

// Guided meditation programs with simple step timing (seconds)
const guidedMeditationPrograms: {
  title: string
  totalSeconds: number
  steps: { label: string; seconds: number }[]
}[] = [
  {
    title: "Mindful Breathing",
    totalSeconds: 300,
    steps: [
      { label: "Settle your posture. Notice the natural breath.", seconds: 30 },
      { label: "Feel the breath at the nostrils: cool in, warm out.", seconds: 45 },
      { label: "Count breaths 1 to 5, then begin again, gently.", seconds: 60 },
      { label: "If the mind wanders, kindly return to the breath.", seconds: 60 },
      { label: "Widen awareness to the whole body breathing.", seconds: 60 },
      { label: "Rest in a calm, steady rhythm of breathing.", seconds: 45 },
    ],
  },
]

const affirmations = [
  "I am worthy of love and respect",
  "I choose peace over worry",
  "I am stronger than my challenges",
  "I deserve happiness and joy",
  "I am enough, just as I am",
  "I trust in my ability to overcome",
  "I am grateful for this moment",
  "I choose to be kind to myself",
]

// Breathing Animation Component
const BreathingAnimation = React.forwardRef<HTMLDivElement, { isPlaying: boolean; phase: string }>(
  ({ isPlaying, phase }, ref) => {
    const getScale = () => {
      if (!isPlaying) return "scale-100"
      
      switch (phase) {
        case "Inhale...": return "scale-110"
        case "Hold...": return "scale-110"
        case "Exhale...": return "scale-100"
        default: return "scale-100"
      }
    }

    return (
      <div className="flex justify-center items-center my-6">
        <div ref={ref} className={`transition-all duration-1000 ease-in-out ${getScale()}`}>
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-primary/30 bg-primary/10 transition-all duration-1000 ease-in-out animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-primary bg-primary/20 transition-all duration-1000 ease-in-out animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary transition-all duration-1000 ease-in-out animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
})

BreathingAnimation.displayName = "BreathingAnimation"

export default function ZenZone({ onBack }: ZenZoneProps) {
  const [activeExercise, setActiveExercise] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [breathElapsed, setBreathElapsed] = useState(0)
  const [currentAffirmation, setCurrentAffirmation] = useState(0)
  const [activeMeditation, setActiveMeditation] = useState<number | null>(null)
  const [isMeditationPlaying, setIsMeditationPlaying] = useState(false)
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(0)
  const [meditationStepIndex, setMeditationStepIndex] = useState(0)
  const [selectedAsana, setSelectedAsana] = useState<string | null>(null)
  const [selectedAsanaImage, setSelectedAsanaImage] = useState<string | null>(null)
  const [selectedAsanaInstructions, setSelectedAsanaInstructions] = useState<string[] | null>(null)
  const [showGrowthPlans, setShowGrowthPlans] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsPlaying(false)
            return 0
          }
          return time - 1
        })
        setBreathElapsed((e) => e + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, timeLeft])

  // Timer for guided meditation session
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isMeditationPlaying && meditationTimeLeft > 0 && activeMeditation !== null) {
      interval = setInterval(() => {
        setMeditationTimeLeft((t) => (t > 0 ? t - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isMeditationPlaying, meditationTimeLeft, activeMeditation])

  const startExercise = (index: number) => {
    setActiveExercise(index)
    setTimeLeft(breathingExercises[index].duration)
    setBreathElapsed(0)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetExercise = () => {
    if (activeExercise !== null) {
      setTimeLeft(breathingExercises[activeExercise].duration)
      setBreathElapsed(0)
      setIsPlaying(false)
    }
  }

  const startAgain = () => {
    if (activeExercise !== null) {
      setTimeLeft(60) // Reset to 1:00 specifically for 4-7-8 breathing
      setBreathElapsed(0)
      setIsPlaying(true)
    }
  }

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Compute current breathing phase for the selected exercise
  const getBreathingPhase = (): "Inhale..." | "Hold..." | "Exhale..." => {
    if (activeExercise === 0) {
      // 4-7-8: 4 inhale, 7 hold, 8 exhale (total 19)
      const t = breathElapsed % 19
      if (t < 4) return "Inhale..."
      if (t < 11) return "Hold..."
      return "Exhale..."
    }
    if (activeExercise === 1) {
      // Box: 4 inhale, 4 hold, 4 exhale, 4 hold (total 16)
      const t = breathElapsed % 16
      if (t < 4) return "Inhale..."
      if (t < 8) return "Hold..."
      if (t < 12) return "Exhale..."
      return "Hold..."
    }
    if (activeExercise === 2) {
      // Ocean: 6 inhale, 4 hold, 10 exhale (total 20)
      const t = breathElapsed % 20
      if (t < 6) return "Inhale..."
      if (t < 10) return "Hold..."
      return "Exhale..."
    }
    return "Inhale..."
  }

  // Guided meditation controls
  const startMeditation = (index: number) => {
    setActiveMeditation(index)
    const program = guidedMeditationPrograms[index]
    const total = program.steps.reduce((acc, s) => acc + s.seconds, 0)
    const totalSeconds = program.totalSeconds || total
    setMeditationTimeLeft(totalSeconds)
    setMeditationStepIndex(0)
    setIsMeditationPlaying(true)
  }

  const toggleMeditationPlayPause = () => {
    setIsMeditationPlaying((p) => !p)
  }

  const resetMeditation = () => {
    if (activeMeditation !== null) {
      const program = guidedMeditationPrograms[activeMeditation]
      const total = program.steps.reduce((acc, s) => acc + s.seconds, 0)
      const totalSeconds = program.totalSeconds || total
      setMeditationTimeLeft(totalSeconds)
      setMeditationStepIndex(0)
      setIsMeditationPlaying(false)
    }
  }

  const endMeditation = () => {
    setIsMeditationPlaying(false)
    setActiveMeditation(null)
    setMeditationTimeLeft(0)
    setMeditationStepIndex(0)
  }

  // Compute current step based on remaining time
  const currentMeditationStep = (() => {
    if (activeMeditation === null) return null
    const program = guidedMeditationPrograms[activeMeditation]
    const total = program.steps.reduce((acc, s) => acc + s.seconds, 0)
    const elapsed = (program.totalSeconds || total) - meditationTimeLeft
    let acc = 0
    for (let i = 0; i < program.steps.length; i++) {
      acc += program.steps[i].seconds
      if (elapsed < acc) {
        if (meditationStepIndex !== i) setMeditationStepIndex(i)
        return program.steps[i]
      }
    }
    return program.steps[program.steps.length - 1]
  })()

  if (showGrowthPlans) {
    return <GuidedGrowthPlans onBack={() => setShowGrowthPlans(false)} />
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-border p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="glass-strong" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Zen Zone</h1>
              <p className="text-sm text-muted-foreground">Find your inner peace</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              className="glass"
              onClick={() => setShowGrowthPlans(true)}
            >
              <Target className="h-4 w-4 mr-2" />
              Growth Plans
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto space-y-6 hide-scrollbar overflow-y-auto">
        {/* Daily Affirmation */}
        <Card className="glass-strong p-6 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
          <h3 className="text-xl font-semibold mb-4">Daily Affirmation</h3>
          <p className="text-lg leading-relaxed mb-4">"{affirmations[currentAffirmation]}"</p>
          <Button variant="outline" className="glass border-primary/50 bg-transparent" onClick={nextAffirmation}>
            New Affirmation
          </Button>
        </Card>

        {/* Breathing Exercises */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            Breathing Exercises
          </h3>

          {activeExercise !== null && (
            <Card className="glass mb-6 p-6 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
              <h4 className="text-lg font-semibold mb-2">{breathingExercises[activeExercise].name}</h4>
              <p className="text-muted-foreground mb-4">{breathingExercises[activeExercise].description}</p>
              
              {/* Breathing Animation */}
              <BreathingAnimation 
                isPlaying={isPlaying} 
                phase={getBreathingPhase()}
              />
              
              <div className="text-4xl font-mono mb-2 text-primary font-bold">{formatTime(timeLeft)}</div>
              <div className="text-lg font-semibold mb-4 text-secondary">{getBreathingPhase()}</div>
              <div className="flex justify-center gap-3">
                <Button onClick={togglePlayPause} className="bg-primary hover:bg-primary/90">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="ml-2">{isPlaying ? "Pause" : "Start"}</span>
                </Button>
                <Button variant="outline" onClick={resetExercise} className="glass bg-transparent">
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-2">Reset</span>
                </Button>
                {activeExercise === 0 && timeLeft === 0 && (
                  <Button onClick={startAgain} className="bg-secondary hover:bg-secondary/90">
                    <Play className="h-4 w-4" />
                    <span className="ml-2">Start Again (1:00)</span>
                  </Button>
                )}
              </div>
              {isPlaying && (
                <div className="mt-4 p-3 glass rounded-lg">
                  <p className="text-sm text-muted-foreground">{getBreathingPhase()}</p>
                </div>
              )}
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {breathingExercises.map((exercise, index) => {
              const IconComponent = exercise.icon
              return (
                <Card
                  key={index}
                  className={`glass cursor-pointer transition-all duration-200 p-4 ${
                    activeExercise === index ? "border-primary/50 bg-primary/10" : "hover:glass-strong"
                  }`}
                  onClick={() => startExercise(index)}
                >
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full glass flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                      <p className="text-xs text-primary mt-1">{exercise.duration}s</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Card>

        {/* Guided Meditations */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mountain className="h-5 w-5 text-secondary" />
            Guided Meditation
          </h3>
          {activeMeditation !== null && (
            <Card className="glass mb-6 p-6 bg-gradient-to-r from-secondary/10 to-primary/10">
              <h4 className="text-lg font-semibold mb-1">{guidedMeditationPrograms[activeMeditation].title}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedAsana ? `${selectedAsana} • ${guidedMeditations[0].description}` : guidedMeditations[0].description}
              </p>
              {selectedAsanaImage && (
                <div className="w-full max-w-xl mx-auto mb-4 glass-strong rounded-lg p-2">
                  <div className="w-full h-48 md:h-56 lg:h-64 bg-black/10 rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedAsanaImage}
                      alt={selectedAsana || "Selected asana"}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
              {selectedAsanaInstructions && selectedAsanaInstructions.length > 0 && (
                <div className="w-full max-w-xl mx-auto mb-4 glass p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">How to practice {selectedAsana}</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedAsanaInstructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="text-4xl font-mono mb-2 text-secondary font-bold">{formatTime(meditationTimeLeft)}</div>
              <div className="text-base mb-4">
                {currentMeditationStep ? currentMeditationStep.label : "Getting settled..."}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={toggleMeditationPlayPause} className="bg-secondary hover:bg-secondary/90">
                  {isMeditationPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="ml-2">{isMeditationPlaying ? "Pause" : "Start"}</span>
                </Button>
                <Button variant="outline" onClick={resetMeditation} className="glass bg-transparent">
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-2">Reset</span>
                </Button>
                <Button variant="outline" onClick={endMeditation} className="glass bg-transparent">
                  End Session
                </Button>
              </div>
            </Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meditationAsanas.map((asana, index) => {
              const IconComponent = asana.icon
              return (
                <Card
                  key={index}
                  className={`glass cursor-pointer transition-all duration-200 p-4 ${
                    selectedAsana === asana.title ? "border-secondary/50 bg-secondary/10" : "hover:glass-strong"
                  }`}
                  onClick={() => {
                    setSelectedAsana(asana.title)
                    setSelectedAsanaImage(asana.image)
                    setSelectedAsanaInstructions((asana as any).instructions || null)
                    if (activeMeditation === null) startMeditation(0)
                  }}
                >
                  <div className="text-center space-y-3">
                    <div className="w-full h-36 md:h-40 glass-strong rounded-lg overflow-hidden bg-black/10 flex items-center justify-center">
                      <img
                        src={asana.image}
                        alt={asana.title}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                    <div className="w-12 h-12 mx-auto rounded-full glass flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{asana.title}</h4>
                      <p className="text-sm text-muted-foreground">{asana.description}</p>
                      <p className="text-xs text-secondary mt-1">{guidedMeditations[0].duration}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Card>

        {/* Quick Calm Tips */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Calm Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Take 5 deep breaths, counting each one</p>
            </div>
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Name 5 things you can see around you</p>
            </div>
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Gently stretch your neck and shoulders</p>
            </div>
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Drink a glass of water mindfully</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
