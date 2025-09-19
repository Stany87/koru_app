"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, Headphones, Volume2 } from "lucide-react"

interface MoodMusicProps {
  onBack: () => void
}

const musicTracks = [
  {
    title: "Birds Chirping & Sea Breeze",
    file: "/music/Birds Chirping & Sea Breeze.mp3",
    description: "Gentle birdsong mixed with ocean waves",
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    color: "from-blue-400/20 to-cyan-400/20",
    category: "Nature Sounds"
  },
  {
    title: "Ocean Breeze",
    file: "/music/Ocean Breeze.mp3", 
    description: "Calming ocean waves and sea breeze",
    poster: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop&crop=center",
    color: "from-cyan-400/20 to-blue-500/20",
    category: "Ocean Sounds"
  },
  {
    title: "Rain with Birds Chirping",
    file: "/music/Rain with Birds Chirping.mp3",
    description: "Peaceful rain with morning bird songs",
    poster: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop&crop=center",
    color: "from-gray-400/20 to-blue-400/20", 
    category: "Rain Sounds"
  },
  {
    title: "A Rainy Day",
    file: "/music/A Rainy Day.mp3",
    description: "Relaxing rainfall for deep focus",
    poster: "https://images.unsplash.com/photo-1433863448220-78aaa064ff47?w=400&h=300&fit=crop&crop=center",
    color: "from-slate-400/20 to-gray-500/20",
    category: "Rain Sounds"
  }
]

export default function MoodMusic({ onBack }: MoodMusicProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.7)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlayPause = async (trackIndex: number) => {
    try {
      console.log("Toggle play/pause for track:", trackIndex)
      
      if (isPlaying && currentTrack === trackIndex) {
        // Pause current track
        if (audioRef.current) {
          audioRef.current.pause()
        }
        setIsPlaying(false)
      } else {
        // Play new track or resume current
        const track = musicTracks[trackIndex]
        console.log("Playing track:", track)
        
        if (audioRef.current) {
          // If switching tracks, reset time
          if (currentTrack !== trackIndex) {
            setCurrentTime(0)
            setDuration(0)
          }
          
          console.log("Setting audio src to:", track.file)
          audioRef.current.src = track.file
          audioRef.current.volume = volume
          
          // Try to play immediately
          try {
            await audioRef.current.play()
            setCurrentTrack(trackIndex)
            setIsPlaying(true)
            console.log("Playback started successfully")
          } catch (playError) {
            console.error("Play failed:", playError)
            // If autoplay is blocked, try loading first
            audioRef.current.load()
            // Wait a bit and try again
            setTimeout(async () => {
              try {
                await audioRef.current?.play()
                setCurrentTrack(trackIndex)
                setIsPlaying(true)
                console.log("Playback started on retry")
              } catch (retryError) {
                console.error("Retry play failed:", retryError)
                alert("Please click the play button to start audio playback")
              }
            }, 100)
          }
        } else {
          console.error("Audio ref is null!")
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
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Initialize audio on first user interaction
  const initializeAudio = () => {
    if (audioRef.current) {
      // Create a silent audio buffer to initialize the audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
    }
  }


  return (
    <div className="min-h-screen pb-24">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration)
          }
        }}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentTrack(null)
          setCurrentTime(0)
        }}
        onError={(e) => {
          console.error("Audio error:", e)
          setIsPlaying(false)
          setCurrentTrack(null)
        }}
      />
      
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
                        onClick={() => {
                          initializeAudio()
                          togglePlayPause(index)
                        }}
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

      {/* Fixed Bottom Music Bar - Spotify Style */}
      {currentTrack !== null && (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            {/* Left: Track Info, Controls & Progress Bar */}
            <div className="flex-1 flex items-center gap-4">
              {/* Track Poster */}
              <div className="w-12 h-12 glass-strong rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={musicTracks[currentTrack].poster} 
                  alt={musicTracks[currentTrack].title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Track Info */}
              <div className="min-w-0 w-48">
                <h4 className="text-sm font-semibold text-white truncate">
                  {musicTracks[currentTrack].title}
                </h4>
                <p className="text-xs text-white/70 truncate">
                  {musicTracks[currentTrack].category}
                </p>
              </div>
              
              {/* Play/Pause Button */}
              <Button
                variant="ghost"
                size="icon"
                className="glass-strong w-10 h-10 flex-shrink-0"
                onClick={() => {
                  initializeAudio()
                  togglePlayPause(currentTrack)
                }}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              {/* Progress Bar */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-white/70 w-8">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-white/70 w-8">{formatTime(duration)}</span>
              </div>
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
