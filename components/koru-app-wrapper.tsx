"use client"

import { Suspense } from "react"
import KoruAppContent from "./koru-app-content"

export default function KoruAppWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <KoruAppContent />
    </Suspense>
  )
}