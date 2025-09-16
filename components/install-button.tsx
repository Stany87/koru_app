"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Check, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if the app is already installed on page load
    if ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)
    
    try {
      // Show the install prompt
      await deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
    } catch (error) {
      console.error('Error showing install prompt:', error)
    } finally {
      setIsInstalling(false)
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  // Don't show anything if app is already installed
  if (isInstalled) {
    return (
      <Button variant="outline" size="sm" className="glass-strong" disabled>
        <Check className="h-4 w-4 mr-2" />
        Installed
      </Button>
    )
  }

  // Don't show install button if prompt is not available
  if (!showInstallButton) {
    return null
  }

  return (
    <Button 
      onClick={handleInstallClick}
      disabled={isInstalling}
      className="glass-strong bg-primary hover:bg-primary/90 text-white"
      size="sm"
    >
      {isInstalling ? (
        <>
          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Installing...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Install App
        </>
      )}
    </Button>
  )
}
