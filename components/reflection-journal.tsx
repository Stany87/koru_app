"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Book, Plus, Trash2, Calendar, Heart, Star } from "lucide-react"

interface JournalEntry {
  id: string
  date: Date
  mood: string
  content: string
  gratitude?: string
}

interface ReflectionJournalProps {
  onBack: () => void
}

const moodOptions = [
  { emoji: "😊", label: "Happy", color: "text-yellow-400" },
  { emoji: "😌", label: "Calm", color: "text-blue-400" },
  { emoji: "😔", label: "Sad", color: "text-gray-400" },
  { emoji: "😰", label: "Anxious", color: "text-orange-400" },
  { emoji: "😡", label: "Angry", color: "text-red-400" },
  { emoji: "🤔", label: "Thoughtful", color: "text-purple-400" },
]

const journalPrompts = [
  "What am I grateful for today?",
  "What challenged me today and how did I handle it?",
  "What made me smile today?",
  "What would I like to improve about tomorrow?",
  "How am I feeling right now and why?",
  "What positive affirmation do I need to hear today?",
  "What progress have I made recently?",
  "What support do I need right now?",
]

export default function ReflectionJournal({ onBack }: ReflectionJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isWriting, setIsWriting] = useState(false)
  const [currentEntry, setCurrentEntry] = useState("")
  const [currentMood, setCurrentMood] = useState("")
  const [currentGratitude, setCurrentGratitude] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  const usePrompt = (prompt: string) => {
    setSelectedPrompt(prompt)
    setCurrentEntry(prompt + "\n\n")
    setIsWriting(true)
  }

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem("koru-journal")
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries)
      setEntries(
        parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        })),
      )
    }
  }, [])

  const saveEntries = (newEntries: JournalEntry[]) => {
    localStorage.setItem("koru-journal", JSON.stringify(newEntries))
    setEntries(newEntries)
  }

  const saveEntry = () => {
    if (!currentEntry.trim() || !currentMood) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: currentMood,
      content: currentEntry,
      gratitude: currentGratitude || undefined,
    }

    const newEntries = [newEntry, ...entries]
    saveEntries(newEntries)

    setCurrentEntry("")
    setCurrentMood("")
    setCurrentGratitude("")
    setSelectedPrompt(null)
    setIsWriting(false)
  }

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter((entry) => entry.id !== id)
    saveEntries(newEntries)
  }

  const startWriting = () => {
    setIsWriting(true)
    setSelectedPrompt(null)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getMoodEmoji = (mood: string) => {
    const moodOption = moodOptions.find((option) => option.label === mood)
    return moodOption ? moodOption.emoji : "😊"
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/10 p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="glass-strong" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Book className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Reflection Journal</h1>
              <p className="text-sm text-muted-foreground">Your safe space for thoughts</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Writing Interface */}
        {isWriting ? (
          <Card className="glass-strong p-6">
            <h3 className="text-xl font-semibold mb-4">New Journal Entry</h3>

            {/* Mood Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">How are you feeling?</label>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.label}
                    variant={currentMood === mood.label ? "default" : "outline"}
                    className={`glass ${currentMood === mood.label ? "bg-purple-500/20" : ""}`}
                    onClick={() => setCurrentMood(mood.label)}
                  >
                    <span className="mr-2">{mood.emoji}</span>
                    {mood.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Main Entry */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your thoughts</label>
              <Textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="What's on your mind today? How are you feeling? What happened that was meaningful?"
                className="glass bg-transparent border-white/20 focus:border-white/40 min-h-[200px]"
              />
            </div>

            {/* Gratitude Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-400" />
                What are you grateful for today? (optional)
              </label>
              <Textarea
                value={currentGratitude}
                onChange={(e) => setCurrentGratitude(e.target.value)}
                placeholder="Three things I'm grateful for today..."
                className="glass bg-transparent border-white/20 focus:border-white/40"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={saveEntry}
                disabled={!currentEntry.trim() || !currentMood}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Entry
              </Button>
              <Button variant="outline" onClick={() => setIsWriting(false)} className="glass">
                Cancel
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* New Entry Button */}
            <Card className="glass-strong p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Ready to reflect?</h3>
              <Button onClick={startWriting} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Journal Entry
              </Button>
            </Card>

            {/* Journal Prompts */}
            <Card className="glass-strong p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Writing Prompts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {journalPrompts.map((prompt, index) => (
                  <Card
                    key={index}
                    className="glass cursor-pointer hover:glass-strong transition-all duration-200 p-4"
                    onClick={() => usePrompt(prompt)}
                  >
                    <p className="text-sm">{prompt}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Previous Entries */}
        {entries.length > 0 && !isWriting && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Your Journal Entries
            </h3>
            {entries.map((entry) => (
              <Card key={entry.id} className="glass-strong p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div>
                      <p className="font-semibold">{entry.mood}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="glass rounded-lg p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                  </div>

                  {entry.gratitude && (
                    <div className="glass rounded-lg p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-400" />
                        Gratitude
                      </h4>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.gratitude}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Benefits of Journaling */}
        {!isWriting && (
          <Card className="glass-strong p-6">
            <h3 className="text-xl font-semibold mb-4">Benefits of Journaling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 glass rounded-lg">
                <h4 className="font-semibold mb-2">Process Emotions</h4>
                <p className="text-sm text-muted-foreground">
                  Writing helps you understand and work through complex feelings
                </p>
              </div>
              <div className="p-4 glass rounded-lg">
                <h4 className="font-semibold mb-2">Reduce Stress</h4>
                <p className="text-sm text-muted-foreground">
                  Expressing thoughts on paper can lower anxiety and stress levels
                </p>
              </div>
              <div className="p-4 glass rounded-lg">
                <h4 className="font-semibold mb-2">Track Progress</h4>
                <p className="text-sm text-muted-foreground">See patterns in your mood and growth over time</p>
              </div>
              <div className="p-4 glass rounded-lg">
                <h4 className="font-semibold mb-2">Safe Expression</h4>
                <p className="text-sm text-muted-foreground">
                  A judgment-free space to be completely honest with yourself
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
