"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface SplashLoaderProps {
  onFinish: () => void
  durationMs?: number
}

export default function SplashLoader({ onFinish, durationMs = 2000 }: SplashLoaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      onFinish()
    }, durationMs)
    return () => clearTimeout(timer)
  }, [onFinish, durationMs])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="relative w-[320px] h-[320px] glass-strong rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div
            className={`w-24 h-24 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-700 ${
              mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <img src="/koru_logo.png" alt="Koru logo" className="h-24 w-24 object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)]" />
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text [background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [&:not(:has(*))]:text-primary">
              Koru
            </h1>
            <p className="text-sm text-muted-foreground mt-2">A calm space for your mind</p>
          </div>

          <div className="mt-8 w-40 h-2 bg-secondary/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary animate-[loading_2s_ease-in-out_infinite]" />
          </div>
        </div>

        <div className="absolute -inset-24 opacity-40 animate-[spin_8s_linear_infinite]">
          <div className="w-full h-full rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-transparent via-primary/20 to-transparent" />
        </div>

        <style>{`
          @keyframes loading {
            0% { transform: translateX(-60%); }
            50% { transform: translateX(10%); }
            100% { transform: translateX(120%); }
          }
        `}</style>
      </Card>
    </div>
  )
}





