"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock } from "lucide-react"
import { FernFrond } from "@/components/icons/fern-frond"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"

interface AuthLoginProps {
  onSwitchToSignup: () => void
}

export default function AuthLogin({ onSwitchToSignup }: AuthLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    if (!email || !password) return "Please fill in all fields"
    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/
    if (!emailRegex.test(email)) return "Please enter a valid email"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    const validation = validate()
    if (validation) {
      setError(validation)
      return
    }
    setIsSubmitting(true)
    try {
      if (!auth) throw new Error("Auth not configured. Add Firebase env vars.")
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e: any) {
      setError(e?.message || "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    if (!auth) {
      setError("Auth not configured. Add Firebase env vars.")
      return
    }
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (e: any) {
      setError(e?.message || "Google sign-in failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md glass-strong rounded-2xl p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-3">
            <FernFrond className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Koru</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 glass bg-transparent border-white/20 focus:border-white/40"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 glass bg-transparent border-white/20 focus:border-white/40"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-md">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="h-px bg-white/20 flex-1" />
          <span className="px-3 text-xs text-muted-foreground">OR</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        {/* Instagram-like Google button: white boxed */}
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 bg-white text-black border border-white rounded-md py-2 hover:bg-white/90 transition-colors"
        >
          <span className="inline-flex items-center justify-center w-5 h-5">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.7h5.3c-.2 1.2-1.6 3.6-5.3 3.6-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.9 3 14.7 2 12 2 6.9 2 2.7 6.2 2.7 11.3S6.9 20.7 12 20.7c6.9 0 9.5-4.8 8.9-9.1H12z"/>
            </svg>
          </span>
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Don&apos;t have an account?{" "}
          <button className="underline underline-offset-4 hover:text-foreground" onClick={onSwitchToSignup}>Create one</button>
        </p>
      </Card>
    </div>
  )
}


