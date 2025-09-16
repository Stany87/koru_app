"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Settings, Bell, Moon, Sun, Volume2, Shield, Trash2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface UserSettings {
  darkMode: boolean
  notifications: boolean
  soundEnabled: boolean
  volume: number
  dailyReminders: boolean
  dataCollection: boolean
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()

  const [settings, setSettings] = useState<UserSettings>({
    darkMode: true,
    notifications: true,
    soundEnabled: true,
    volume: 50,
    dailyReminders: true,
    dataCollection: false,
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("koru-settings")
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setSettings(parsedSettings)
      setTheme(parsedSettings.darkMode ? "dark" : "light")
    }
  }, [setTheme])

  const updateSetting = (key: keyof UserSettings, value: boolean | number) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("koru-settings", JSON.stringify(newSettings))

    if (key === "darkMode") {
      setTheme(value ? "dark" : "light")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2 max-h-96 overflow-y-auto hide-scrollbar">
          {/* Appearance */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark Mode</span>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => updateSetting("darkMode", checked)} />
            </div>
          </Card>

          {/* Notifications */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable Notifications</span>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting("notifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily Check-in Reminders</span>
                <Switch
                  checked={settings.dailyReminders}
                  onCheckedChange={(checked) => updateSetting("dailyReminders", checked)}
                />
              </div>
            </div>
          </Card>

          {/* Audio */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Audio
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sound Effects</span>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm">Volume</span>
                <Slider
                  value={[settings.volume]}
                  onValueChange={(value) => updateSetting("volume", value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm">Anonymous Usage Data</span>
                  <p className="text-xs text-muted-foreground">Help improve Koru</p>
                </div>
                <Switch
                  checked={settings.dataCollection}
                  onCheckedChange={(checked) => updateSetting("dataCollection", checked)}
                />
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Data Management
            </h3>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Are you sure you want to clear all your data? This cannot be undone.")) {
                  localStorage.removeItem("koru-journal")
                  localStorage.removeItem("koru-settings")
                  alert("All data has been cleared.")
                }
              }}
              className="w-full glass border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              Clear All Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2">This will delete all your journal entries and settings</p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
