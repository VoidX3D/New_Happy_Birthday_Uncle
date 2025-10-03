update this to make the images work 'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Calendar, Upload, Volume2, VolumeX, Heart } from 'lucide-react'

// Enhanced Confetti Particle System with Sound
class ConfettiParticle {
  constructor(canvas, audioContext) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.audioContext = audioContext
    this.x = Math.random() * canvas.width
    this.y = -20
    this.vx = (Math.random() - 0.5) * 8
    this.vy = Math.random() * 4 + 3
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 15
    this.size = Math.random() * 8 + 4
    this.colors = ['#1e3a8a', '#065f46', '#374151', '#f8fafc']
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    this.gravity = 0.15
    this.life = 1.0
    this.decay = Math.random() * 0.015 + 0.008
    this.shape = Math.random() > 0.5 ? 'circle' : 'square'
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += this.gravity
    this.rotation += this.rotationSpeed
    this.life -= this.decay
    
    if (this.y > this.canvas.height + 20 || this.life <= 0) {
      return false
    }
    return true
  }

  draw() {
    this.ctx.save()
    this.ctx.globalAlpha = this.life
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate((this.rotation * Math.PI) / 180)
    this.ctx.fillStyle = this.color
    
    if (this.shape === 'circle') {
      this.ctx.beginPath()
      this.ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
      this.ctx.fill()
    } else {
      this.ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
    }
    
    this.ctx.restore()
  }

  playSound() {
    if (!this.audioContext || this.audioContext.state !== 'running') return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.value = 800 + Math.random() * 400
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.2)
  }
}

export default function RetroLuxuryBirthdayCard() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isEnvelopeAnimating, setIsEnvelopeAnimating] = useState(false)
  const canvasRef = useRef(null)
  const audioContextRef = useRef(null)
  const confettiRef = useRef([])
  const animationRef = useRef(null)
  const musicIntervalRef = useRef(null)
  const mp3AudioRef = useRef(null)

  // Get current date in both calendars
  const getCurrentDate = () => {
    const now = new Date()
    const adDate = now.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const bsDate = 'Asoj 16, 2082'
    return { adDate, bsDate }
  }

  const { adDate, bsDate } = getCurrentDate()

  // Professional Orchestra-Style Birthday Music
  const createAdvancedBirthdayMusic = () => {
    if (!audioContextRef.current || isMuted) return

    const ctx = audioContextRef.current
    
    // Complete Happy Birthday arrangement
    const melody = [
      // Verse 1: "Happy Birthday to you"
      { freq: 523.25, duration: 0.6, velocity: 0.3 }, // C - Hap-
      { freq: 523.25, duration: 0.4, velocity: 0.3 }, // C - py
      { freq: 587.33, duration: 1.2, velocity: 0.4 }, // D - Birth-
      { freq: 523.25, duration: 1.2, velocity: 0.4 }, // C - day
      { freq: 698.46, duration: 1.2, velocity: 0.5 }, // F - to
      { freq: 659.25, duration: 2.4, velocity: 0.4 }, // E - you
      
      // Verse 2: "Happy Birthday to you"
      { freq: 523.25, duration: 0.6, velocity: 0.35 },
      { freq: 523.25, duration: 0.4, velocity: 0.35 },
      { freq: 587.33, duration: 1.2, velocity: 0.45 },
      { freq: 523.25, duration: 1.2, velocity: 0.45 },
      { freq: 783.99, duration: 1.2, velocity: 0.55 }, // G
      { freq: 698.46, duration: 2.4, velocity: 0.45 }, // F
      
      // Verse 3: "Happy Birthday dear Uncle"
      { freq: 523.25, duration: 0.6, velocity: 0.4 },
      { freq: 523.25, duration: 0.4, velocity: 0.4 },
      { freq: 1046.50, duration: 1.2, velocity: 0.6 }, // High C
      { freq: 880.00, duration: 1.2, velocity: 0.5 }, // A
      { freq: 698.46, duration: 1.2, velocity: 0.5 }, // F - dear
      { freq: 659.25, duration: 1.2, velocity: 0.4 }, // E - Un-
      { freq: 587.33, duration: 2.4, velocity: 0.4 }, // D - cle
      
      // Verse 4: "Happy Birthday to you!"
      { freq: 932.33, duration: 0.6, velocity: 0.45 }, // A#
      { freq: 932.33, duration: 0.4, velocity: 0.45 },
      { freq: 880.00, duration: 1.2, velocity: 0.5 }, // A
      { freq: 698.46, duration: 1.2, velocity: 0.5 }, // F
      { freq: 783.99, duration: 1.2, velocity: 0.55 }, // G
      { freq: 698.46, duration: 3.6, velocity: 0.6 }, // F - finale
    ]

    // Rich bass accompaniment
    const bassNotes = [
      { freq: 261.63, duration: 4.8, velocity: 0.25 }, // C major
      { freq: 349.23, duration: 4.8, velocity: 0.25 }, // F major
      { freq: 261.63, duration: 4.8, velocity: 0.25 }, // C major
      { freq: 392.00, duration: 4.8, velocity: 0.25 }, // G major
      { freq: 261.63, duration: 4.8, velocity: 0.25 }, // C major
      { freq: 349.23, duration: 4.8, velocity: 0.25 }, // F major
      { freq: 392.00, duration: 2.4, velocity: 0.25 }, // G major
      { freq: 261.63, duration: 2.4, velocity: 0.3 }   // C major finale
    ]

    // Harmony line for richness
    const harmony = [
      { freq: 659.25, duration: 2.4, velocity: 0.2 }, // E
      { freq: 698.46, duration: 2.4, velocity: 0.2 }, // F
      { freq: 783.99, duration: 2.4, velocity: 0.2 }, // G
      { freq: 880.00, duration: 2.4, velocity: 0.2 }, // A
      { freq: 523.25, duration: 2.4, velocity: 0.2 }, // C
      { freq: 587.33, duration: 2.4, velocity: 0.2 }, // D
      { freq: 659.25, duration: 2.4, velocity: 0.2 }, // E
      { freq: 523.25, duration: 2.4, velocity: 0.25 } // C finale
    ]

    let currentTime = ctx.currentTime + 0.1

    // Create main melody with realistic instrument sound
    melody.forEach(note => {
      // Primary melody voice
      const oscillator1 = ctx.createOscillator()
      const gainNode1 = ctx.createGain()
      const filter1 = ctx.createBiquadFilter()
      
      oscillator1.connect(filter1)
      filter1.connect(gainNode1)
      gainNode1.connect(ctx.destination)
      
      oscillator1.frequency.value = note.freq
      oscillator1.type = 'sine'
      filter1.type = 'lowpass'
      filter1.frequency.value = 2000
      
      gainNode1.gain.setValueAtTime(0, currentTime)
      gainNode1.gain.linearRampToValueAtTime(note.velocity, currentTime + 0.1)
      gainNode1.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration)
      
      oscillator1.start(currentTime)
      oscillator1.stop(currentTime + note.duration)
      
      // Add slight vibrato for realism
      const vibrato = ctx.createOscillator()
      const vibratoGain = ctx.createGain()
      vibrato.connect(vibratoGain)
      vibratoGain.connect(oscillator1.frequency)
      vibrato.frequency.value = 5
      vibratoGain.gain.value = 3
      vibrato.start(currentTime)
      vibrato.stop(currentTime + note.duration)
      
      currentTime += note.duration
    })

    // Rich bass line
    let bassTime = ctx.currentTime + 0.1
    bassNotes.forEach(note => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      
      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = note.freq
      oscillator.type = 'sawtooth'
      filter.type = 'lowpass'
      filter.frequency.value = 800
      
      gainNode.gain.setValueAtTime(0, bassTime)
      gainNode.gain.linearRampToValueAtTime(note.velocity, bassTime + 0.2)
      gainNode.gain.exponentialRampToValueAtTime(0.01, bassTime + note.duration)
      
      oscillator.start(bassTime)
      oscillator.stop(bassTime + note.duration)
      
      bassTime += note.duration
    })

    // Harmony line for orchestral feel
    let harmonyTime = ctx.currentTime + 0.1
    harmony.forEach(note => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      
      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = note.freq
      oscillator.type = 'triangle'
      filter.type = 'highpass'
      filter.frequency.value = 200
      
      gainNode.gain.setValueAtTime(0, harmonyTime)
      gainNode.gain.linearRampToValueAtTime(note.velocity, harmonyTime + 0.15)
      gainNode.gain.exponentialRampToValueAtTime(0.01, harmonyTime + note.duration)
      
      oscillator.start(harmonyTime)
      oscillator.stop(harmonyTime + note.duration)
      
      harmonyTime += note.duration
    })

    // Add percussion/rhythm
    const percussion = [0, 1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6, 10.8, 12.0, 13.2]
    percussion.forEach(beatTime => {
      const noise = ctx.createBufferSource()
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1
      }
      noise.buffer = noiseBuffer
      
      const noiseGain = ctx.createGain()
      const noiseFilter = ctx.createBiquadFilter()
      
      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      
      noiseFilter.type = 'highpass'
      noiseFilter.frequency.value = 1000
      
      noiseGain.gain.setValueAtTime(0.1, ctx.currentTime + beatTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + beatTime + 0.1)
      
      noise.start(ctx.currentTime + beatTime)
      noise.stop(ctx.currentTime + beatTime + 0.1)
    })
  }

  // MP3 Audio Implementation with Synthesized Fallback
  const playBirthdayMusic = async () => {
    if (isMuted) return

    try {
      // Try to play MP3 version first
      if (mp3AudioRef.current) {
        mp3AudioRef.current.pause()
        mp3AudioRef.current.currentTime = 0
      }

      mp3AudioRef.current = new Audio('/audio/happy-birthday.mp3')
      mp3AudioRef.current.volume = 0.8
      mp3AudioRef.current.loop = true
      
      // Add event listeners for better control
      mp3AudioRef.current.addEventListener('canplaythrough', () => {
        console.log('🎵 MP3 Birthday music loaded successfully')
      })
      
      mp3AudioRef.current.addEventListener('error', (e) => {
        console.log('🎵 MP3 failed, using synthesized fallback:', e.message)
        createAdvancedBirthdayMusic()
      })

      await mp3AudioRef.current.play()
      console.log('🎵 Playing MP3 birthday song')
      
    } catch (error) {
      console.log('🎵 MP3 playback failed, using synthesized music:', error.message)
      // Fallback to synthesized version
      createAdvancedBirthdayMusic()
    }
  }

  // Stop MP3 music
  const stopBirthdayMusic = () => {
    if (mp3AudioRef.current) {
      mp3AudioRef.current.pause()
      mp3AudioRef.current.currentTime = 0
    }
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current)
    }
  }

  // Enhanced confetti system
  const startEnhancedConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')

    // Create burst of luxury confetti
    for (let i = 0; i < 200; i++) {
      const particle = new ConfettiParticle(canvas, audioContextRef.current)
      confettiRef.current.push(particle)
      
      // Play confetti sound for some particles
      if (Math.random() < 0.1) {
        setTimeout(() => particle.playSound(), Math.random() * 2000)
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      confettiRef.current = confettiRef.current.filter(particle => {
        particle.update()
        particle.draw()
        return particle.life > 0
      })

      // Add new particles occasionally
      if (Math.random() < 0.05 && confettiRef.current.length < 150) {
        const particle = new ConfettiParticle(canvas, audioContextRef.current)
        confettiRef.current.push(particle)
        if (Math.random() < 0.2) {
          particle.playSound()
        }
      }

      if (confettiRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()
  }

  const handleEnvelopeOpen = async () => {
    if (isEnvelopeAnimating) return
    
    setIsEnvelopeAnimating(true)
    
    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }

    // Start opening animation
    setTimeout(() => {
      setIsOpen(true)
      startEnhancedConfetti()
    }, 1000)

    // Start music after envelope opens
    setTimeout(() => {
      setIsPlaying(true)
      playBirthdayMusic()
    }, 2000)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      // Muting - stop all audio
      stopBirthdayMusic()
    } else {
      // Unmuting - restart music if card is open
      if (isPlaying) {
        playBirthdayMusic()
      }
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (musicIntervalRef.current) {
        clearInterval(musicIntervalRef.current)
      }
      if (mp3AudioRef.current) {
        mp3AudioRef.current.pause()
        mp3AudioRef.current = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Luxury Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Audio Controls */}
      {isOpen && (
        <div className="fixed top-6 right-6 z-40">
          <Button
            onClick={toggleMute}
            variant="outline"
            size="icon"
            className="bg-slate-900/80 backdrop-blur-md border-slate-600 text-white hover:bg-slate-800/90 shadow-xl"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {!isOpen ? (
          /* Luxury Envelope */
          <div className="envelope-container perspective-2000" onClick={handleEnvelopeOpen}>
            <div className={`luxury-envelope relative mx-auto cursor-pointer transform transition-all duration-1000 ${isEnvelopeAnimating ? 'animate-envelope-open' : 'hover:scale-105 hover:rotate-1'}`}>
              {/* Envelope Shadow */}
              <div className="absolute inset-0 bg-black/40 blur-2xl transform translate-y-12 scale-110 rounded-xl"></div>
              
              {/* Main Envelope Body */}
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 w-[480px] h-[320px] md:w-[600px] md:h-[400px] rounded-lg shadow-2xl border-2 border-slate-200">
                {/* Postal Stamp */}
                <div className="absolute top-4 right-4 w-20 h-24 md:w-24 md:h-28 bg-gradient-to-br from-blue-600 to-blue-800 rounded-sm shadow-lg border-2 border-white">
                  <div className="absolute inset-1 border border-white/50 rounded-sm">
                    <div className="flex flex-col items-center justify-center h-full text-white text-xs md:text-sm">
                      <Heart className="w-4 h-4 md:w-6 md:h-6 mb-1" />
                      <span className="font-serif">Birthday</span>
                      <span className="font-serif text-xs">2025</span>
                    </div>
                  </div>
                  {/* Stamp perforation */}
                  <div className="absolute inset-0 border-4 border-dashed border-slate-700/20 rounded-sm"></div>
                </div>

                {/* Address Section */}
                <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-slate-800">
                  <div className="font-serif text-lg md:text-xl mb-2">To:</div>
                  <div className="font-serif text-2xl md:text-3xl font-bold text-emerald-800">Dear Uncle</div>
                  <div className="font-serif text-base md:text-lg mt-1 text-slate-600">Rajendra Regmi</div>
                  <div className="mt-4 text-sm md:text-base text-slate-600">
                    <div>Special Birthday Delivery</div>
                    <div className="mt-1 text-xs text-slate-500">Handle with Love</div>
                  </div>
                </div>

                {/* Envelope Flap */}
                <div className={`envelope-flap absolute -top-1 left-0 right-0 h-40 md:h-48 bg-gradient-to-br from-slate-100 to-slate-200 transform origin-bottom transition-transform duration-2000 ease-out border-2 border-slate-200 ${isEnvelopeAnimating ? 'rotate-x-180' : ''}`}
                     style={{
                       clipPath: 'polygon(0 0, 100% 0, 50% 75%)'
                     }}>
                  {/* Wax Seal */}
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-full shadow-2xl border-4 border-emerald-600 flex items-center justify-center">
                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-emerald-100" />
                  </div>
                </div>
                
                {/* Click Instruction */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-slate-800/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg font-serif">
                    Click to Open Your Birthday Surprise
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Opened Card Content */
          <div className="opened-card animate-fade-in-up">
            {/* Elegant Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-serif font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-shimmer">
                Happy Birthday!
              </h1>
              <p className="text-2xl md:text-3xl text-slate-200 font-serif">
                Wishing you joy and celebration, Dear Uncle
              </p>
            </div>

            {/* Elegant Date Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* AD Date */}
              <Card className="luxury-glass border-slate-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-100 flex items-center text-xl font-serif">
                    <Calendar className="w-6 h-6 mr-3 text-blue-400" />
                    Today's Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-lg font-serif">{adDate}</p>
                  <p className="text-slate-400 text-sm mt-2">Gregorian Calendar</p>
                </CardContent>
              </Card>

              {/* BS Date */}
              <Card className="luxury-glass border-slate-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-100 flex items-center text-xl font-serif">
                    <Calendar className="w-6 h-6 mr-3 text-emerald-400" />
                    Your Special Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-lg font-serif">{bsDate}</p>
                  <p className="text-slate-400 text-sm mt-2">Bikram Sambat Calendar</p>
                </CardContent>
              </Card>
            </div>

            {/* Photo Gallery Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Profile Picture */}
              <Card className="luxury-glass border-slate-600">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center font-serif">
                    <Camera className="w-5 h-5 mr-2" />
                    Your Portrait
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="aspect-square border-2 border-dashed border-slate-500 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer bg-slate-800/50">
                      <div className="flex flex-col items-center justify-center h-full">
                        <Upload className="w-16 h-16 mb-4 text-slate-400" />
                        <p className="text-slate-300 font-serif">Your favorite portrait</p>
                        <p className="text-slate-500 text-sm mt-2">Click to upload or replace</p>
                      </div>
                    </div>
                    {/* Placeholder image file */}
                    <img 
                      src="/api/placeholder/profile" 
                      alt="Profile placeholder" 
                      className="hidden" 
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Birthday Photos */}
              <Card className="luxury-glass border-slate-600">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center font-serif">
                    <Camera className="w-5 h-5 mr-2" />
                    Celebration Memories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="aspect-square border-2 border-dashed border-slate-500 rounded-lg flex items-center justify-center hover:border-slate-400 transition-colors cursor-pointer bg-slate-800/50 relative">
                        <Upload className="w-8 h-8 text-slate-400" />
                        <img 
                          src={`/api/placeholder/celebration-${item}`} 
                          alt={`Celebration ${item} placeholder`} 
                          className="hidden" 
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Elegant Birthday Message */}
            <Card className="luxury-glass border-slate-600 mb-12">
              <CardContent className="p-12 text-center">
                <div className="text-slate-200 space-y-6 font-serif">
                  <p className="text-2xl font-light leading-relaxed">
                    May this special day bring you endless joy and wonderful surprises.
                  </p>
                  <p className="text-xl leading-relaxed">
                    Another year of wisdom, laughter, and cherished moments awaits.
                    Your presence in our lives is a gift we treasure every day.
                  </p>
                  <div className="flex items-center justify-center mt-8">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                    <Heart className="w-6 h-6 mx-4 text-emerald-400" />
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                  </div>
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text">
                    Happy Birthday, Dear Uncle!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Signature */}
            <div className="text-center">
              <p className="text-slate-400 text-sm font-serif italic">
                Crafted with love and warm wishes
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .perspective-2000 {
          perspective: 2000px;
        }
        
        .luxury-envelope {
          transform-style: preserve-3d;
        }
        
        .envelope-flap {
          transform-style: preserve-3d;
        }
        
        .luxury-glass {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(71, 85, 105, 0.5);
        }
        
        @keyframes envelope-open {
          0% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.1) rotate(2deg);
          }
          100% {
            transform: scale(1.2) rotate(0deg) translateZ(100px);
            opacity: 0;
          }
        }
        
        .animate-envelope-open {
          animation: envelope-open 2s ease-out forwards;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1.5s ease-out;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .rotate-x-180 {
          transform: rotateX(-180deg);
        }
        
        @media (max-width: 768px) {
          .luxury-envelope {
            width: 320px !important;
            height: 240px !important;
          }
          
          .luxury-envelope .envelope-flap {
            height: 120px !important;
          }
        }
      `}</style>
    </div>
  )
}
