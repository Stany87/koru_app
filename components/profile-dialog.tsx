'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { User, Edit, Save, X, Camera, Bell, Shield, Palette, Heart, RotateCcw } from "lucide-react"
import { resetMoodAssessmentStatus } from "@/lib/mood-assessment"

interface UserProfile {
  name: string
  age: number
  gender: string
  weight: number
  bio: string
  preferences: {
    notifications: boolean
    darkMode: boolean
    theme: string
    privacy: string
  }
}

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userProfile?: any // Accept any type to handle different profile structures
  onSave: (profile: UserProfile) => void
  onMoodCheck?: () => void
  userId?: string // For mood assessment reset functionality
}

// Default profile structure
const defaultProfile: UserProfile = {
  name: "User",
  age: 25,
  gender: "prefer-not-to-say",
  weight: 70,
  bio: "",
  preferences: {
    notifications: true,
    darkMode: true,
    theme: "emerald",
    privacy: "private"
  }
}

export default function ProfileDialog({ open, onOpenChange, userProfile, onSave, onMoodCheck, userId }: ProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  
  // Create a properly merged profile with defaults
  const createProfile = (userProfile?: any): UserProfile => {
    if (!userProfile) return defaultProfile
    
    return {
      name: userProfile.name || defaultProfile.name,
      age: userProfile.age || defaultProfile.age,
      gender: userProfile.gender || userProfile.sex || defaultProfile.gender, // Handle both 'gender' and 'sex' fields
      weight: userProfile.weight || defaultProfile.weight,
      bio: userProfile.bio || defaultProfile.bio,
      preferences: {
        notifications: userProfile.preferences?.notifications ?? defaultProfile.preferences.notifications,
        darkMode: userProfile.preferences?.darkMode ?? defaultProfile.preferences.darkMode,
        theme: userProfile.preferences?.theme || defaultProfile.preferences.theme,
        privacy: userProfile.preferences?.privacy || defaultProfile.preferences.privacy
      }
    }
  }
  
  const [profile, setProfile] = useState<UserProfile>(createProfile(userProfile))

  // Update profile when userProfile prop changes
  useEffect(() => {
    setProfile(createProfile(userProfile))
  }, [userProfile])

  const handleSave = () => {
    onSave(profile)
    setIsEditing(false)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setProfile(createProfile(userProfile))
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="glass">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Upload a profile picture to personalize your experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Personal Information
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="ml-auto"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(value) => setProfile({ ...profile, gender: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="glass"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  className="glass"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive wellness reminders and updates
                  </p>
                </div>
                <Switch
                  checked={profile.preferences.notifications}
                  onCheckedChange={(checked) =>
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, notifications: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for better night viewing
                  </p>
                </div>
                <Switch
                  checked={profile.preferences.darkMode}
                  onCheckedChange={(checked) =>
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, darkMode: checked }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Theme Color</Label>
                <Select
                  value={profile.preferences.theme}
                  onValueChange={(value) =>
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, theme: value }
                    })
                  }
                >
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emerald">Emerald</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Privacy Level</Label>
                <Select
                  value={profile.preferences.privacy}
                  onValueChange={(value) =>
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, privacy: value }
                    })
                  }
                >
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quick Mood Check-in */}
          {onMoodCheck && (
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Quick Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Take a moment to check in with yourself and track your current mood.
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={onMoodCheck} 
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Start Mood Check-in
                  </Button>
                  {userId && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resetMoodAssessmentStatus(userId)
                        alert('Mood assessment status reset! The initial mood check will appear again on next profile setup or login.')
                      }}
                      className="w-full glass text-xs"
                    >
                      <RotateCcw className="h-3 w-3 mr-2" />
                      Reset Initial Assessment (Dev)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel} className="glass">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-secondary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
