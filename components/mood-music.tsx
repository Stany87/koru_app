"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, Headphones, Volume2 } from "lucide-react"

interface MoodMusicProps {
  onBack: () => void
}


// Nature sound generators using Web Audio API
interface Track {
  title: string
  description: string
  poster: string
  color: string
  category: string
  soundType: 'ocean' | 'rain' | 'forest' | 'white'
}

const musicTracks: Track[] = [
  {
    title: "Ocean Waves",
    description: "Gentle ocean waves for deep relaxation",
    poster: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop&crop=center",
    color: "from-blue-400/20 to-cyan-400/20",
    category: "Ocean Sounds",
    soundType: 'ocean'
  },
  {
    title: "Gentle Rain",
    description: "Peaceful rainfall for focus and sleep",
    poster: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop&crop=center",
    color: "from-gray-400/20 to-blue-400/20", 
    category: "Rain Sounds",
    soundType: 'rain'
  },
  {
    title: "Forest Breeze",
    description: "Wind through trees with subtle nature sounds",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    color: "from-green-400/20 to-emerald-500/20",
    category: "Nature Sounds",
    soundType: 'forest'
  },
  {
    title: "White Noise",
    description: "Pure white noise for concentration",
    poster: "https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=400&h=300&fit=crop&crop=center",
    color: "from-slate-400/20 to-gray-500/20",
    category: "Focus Sounds",
    soundType: 'white'
  }
]

export default function MoodMusic({ onBack }: MoodMusicProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.7)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)

  // Initialize Web Audio API
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.connect(audioContextRef.current.destination)
      gainNodeRef.current.gain.value = volume
    }
  }

  // Generate nature sounds using Web Audio API
  const generateSound = (soundType: Track['soundType']) => {
    if (!audioContextRef.current || !gainNodeRef.current) return

    const audioContext = audioContextRef.current

    switch (soundType) {
      case 'ocean':
        return generateOceanWaves(audioContext)
      case 'rain':
        return generateRain(audioContext)
      case 'forest':
        return generateForestWind(audioContext)
      case 'white':
        return generateWhiteNoise(audioContext)
      default:
        return generateWhiteNoise(audioContext)
    }
  }

  // Ocean waves generator
  const generateOceanWaves = (audioContext: AudioContext) => {
    const bufferSize = audioContext.sampleRate * 2
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      // Generate filtered noise for ocean-like sound
      const wave1 = Math.sin(i * 0.01) * 0.3
      const wave2 = Math.sin(i * 0.007) * 0.2
      const noise = (Math.random() * 2 - 1) * 0.1
      output[i] = wave1 + wave2 + noise
    }

    return noiseBuffer
  }

  // Rain generator
  const generateRain = (audioContext: AudioContext) => {
    const bufferSize = audioContext.sampleRate * 2
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      // High frequency filtered noise for rain
      output[i] = (Math.random() * 2 - 1) * 0.3
    }

    return noiseBuffer
  }

  // Forest wind generator
  const generateForestWind = (audioContext: AudioContext) => {
    const bufferSize = audioContext.sampleRate * 2
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      // Low frequency wind-like sound
      const wind = Math.sin(i * 0.001) * 0.2
      const noise = (Math.random() * 2 - 1) * 0.05
      output[i] = wind + noise
    }

    return noiseBuffer
  }

  // White noise generator
  const generateWhiteNoise = (audioContext: AudioContext) => {
    const bufferSize = audioContext.sampleRate * 2
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const output = noiseBuffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.3
    }

    return noiseBuffer
  }

  const togglePlayPause = async (trackIndex: number) => {
    try {
      initAudioContext()
      
      if (isPlaying && currentTrack === trackIndex) {
        // Stop current track
        if (sourceNodeRef.current) {
          sourceNodeRef.current.stop()
          sourceNodeRef.current = null
        }
        setIsPlaying(false)
      } else {
        // Stop previous track if playing
        if (sourceNodeRef.current) {
          sourceNodeRef.current.stop()
        }

        // Start new track
        if (audioContextRef.current && gainNodeRef.current) {
          const track = musicTracks[trackIndex]
          const audioBuffer = generateSound(track.soundType)
          
          if (audioBuffer) {
            const source = audioContextRef.current.createBufferSource()
            source.buffer = audioBuffer
            source.loop = true
            source.connect(gainNodeRef.current)
            source.start(0)
            
            sourceNodeRef.current = source
            setCurrentTrack(trackIndex)
            setIsPlaying(true)
            
            // Handle when the sound ends
            source.onended = () => {
              if (sourceNodeRef.current === source) {
                setIsPlaying(false)
                setCurrentTrack(null)
                sourceNodeRef.current = null
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Audio playback failed:", error)
      setIsPlaying(false)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume
    }
  }

  // Remove seek functionality since we're using generated loops

  // Clean up audio resources
  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])


  return (
    <div className="min-h-screen pb-24">
      
      {/* Header */}
      <header className="glass border-b border-white/10 p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="glass-strong" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Headphones className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Mood Music</h1>
              <p className="text-sm text-muted-foreground">Ambient sounds for your emotions</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-6xl mx-auto space-y-6">
        {/* Music Tracks Grid */}
          <Card className="glass-strong p-6">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-2xl font-semibold text-white">Nature Sounds</h3>
            <p className="text-white/70">Choose from our collection of relaxing nature sounds</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {musicTracks.map((track, index) => (
                <Card
                  key={index}
                className={`glass cursor-pointer transition-all duration-300 hover:glass-strong hover:scale-105 group bg-gradient-to-br ${track.color} border border-white/10 hover:border-white/20`}
              >
                <CardContent className="p-4">
                  {/* Music Poster */}
                  <div className="w-full h-32 glass-strong rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={track.poster} 
                      alt={track.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient background if image fails to load
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement
                        if (fallback) {
                          fallback.style.display = 'flex'
                        }
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center text-4xl hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      🎵
                    </div>
                  </div>
                  
                  {/* Track Info */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-white truncate">
                      {track.title}
                    </h4>
                    <p className="text-white/70 text-sm line-clamp-2">{track.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 glass-strong rounded-full text-white/80">
                        {track.category}
                      </span>
                      
                      {/* Play Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="glass-strong w-10 h-10"
                        onClick={() => togglePlayPause(index)}
                      >
                        {isPlaying && currentTrack === index ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Playing Indicator */}
                    {isPlaying && currentTrack === index && (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span>Now Playing</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                </Card>
              ))}
            </div>
          </Card>


        {/* Music Benefits */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4">How Ambient Sounds Help Your Mental Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Reduces Stress</h4>
              <p className="text-sm text-muted-foreground">
                Nature sounds can lower cortisol levels and promote relaxation
              </p>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Improves Focus</h4>
              <p className="text-sm text-muted-foreground">
                White noise and ambient sounds can mask distractions and enhance concentration
              </p>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Better Sleep</h4>
              <p className="text-sm text-muted-foreground">
                Consistent ambient sounds can help regulate sleep patterns
              </p>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Emotional Balance</h4>
              <p className="text-sm text-muted-foreground">Natural sounds can help regulate emotions and mood</p>
            </div>
          </div>
        </Card>

      </div>

      {/* Fixed Bottom Music Bar - Simple Version */}
      {currentTrack !== null && (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Track Info & Controls */}
            <div className="flex items-center gap-4">
              {/* Track Poster */}
              <div className="w-12 h-12 glass-strong rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={musicTracks[currentTrack].poster} 
                  alt={musicTracks[currentTrack].title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Track Info */}
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">
                  {musicTracks[currentTrack].title}
                </h4>
                <p className="text-xs text-white/70 truncate">
                  {musicTracks[currentTrack].category} • Looping
                </p>
              </div>
              
              {/* Play/Pause Button */}
              <Button
                variant="ghost"
                size="icon"
                className="glass-strong w-10 h-10 flex-shrink-0"
                onClick={() => togglePlayPause(currentTrack)}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Right: Volume Control */}
            <div className="flex items-center gap-2 w-32">
              <Volume2 className="h-4 w-4 text-white/70" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-xs text-white/70 w-8">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
