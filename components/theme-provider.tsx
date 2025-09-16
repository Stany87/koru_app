"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "dark", ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const savedSettings = localStorage.getItem("koru-settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      const savedTheme = settings.darkMode ? "dark" : "light"
      setTheme(savedTheme)
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(savedTheme)
    } else {
      document.documentElement.classList.add(defaultTheme)
    }
  }, [defaultTheme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme)

      // Update localStorage settings
      const savedSettings = localStorage.getItem("koru-settings")
      const settings = savedSettings ? JSON.parse(savedSettings) : {}
      settings.darkMode = theme === "dark"
      localStorage.setItem("koru-settings", JSON.stringify(settings))
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
