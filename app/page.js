'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Calendar, Camera, Music, VolumeX, Upload } from 'lucide-react'

// Confetti particle system
class ConfettiParticle {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.x = Math.random() * canvas.width
    this.y = -10
    this.vx = (Math.random() - 0.5) * 6
    this.vy = Math.random() * 3 + 2
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 10
    this.size = Math.random() * 6 + 3
    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`
    this.gravity = 0.1
    this.life = 1.0
    this.decay = Math.random() * 0.02 + 0.005
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += this.gravity
    this.rotation += this.rotationSpeed
    this.life -= this.decay
    
    if (this.y > this.canvas.height + 10 || this.life <= 0) {
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
    this.ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
    this.ctx.restore()
  }
}

export default function BirthdayCard() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const canvasRef = useRef(null)
  const audioContextRef = useRef(null)
  const confettiRef = useRef([])
  const animationRef = useRef(null)

  // Get current date in both calendars
  const getCurrentDate = () => {
    const now = new Date()
    const adDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const bsDate = 'Asoj 16, 2082' // Static BS date as requested
    return { adDate, bsDate }
  }

  const { adDate, bsDate } = getCurrentDate()

  // Initialize confetti animation
  const startConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')

    // Create initial burst of confetti
    for (let i = 0; i < 150; i++) {
      confettiRef.current.push(new ConfettiParticle(canvas))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      confettiRef.current = confettiRef.current.filter(particle => {
        particle.update()
        particle.draw()
        return particle.life > 0
      })

      // Add new particles occasionally
      if (Math.random() < 0.1 && confettiRef.current.length < 200) {
        confettiRef.current.push(new ConfettiParticle(canvas))
      }

      if (confettiRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()
  }

  // Create birthday melody using Web Audio API
  const createBirthdayMelody = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const notes = [
      { freq: 523.25, duration: 0.5 }, // C
      { freq: 523.25, duration: 0.5 }, // C
      { freq: 587.33, duration: 1.0 }, // D
      { freq: 523.25, duration: 1.0 }, // C
      { freq: 698.46, duration: 1.0 }, // F
      { freq: 659.25, duration: 2.0 }, // E
    ]

    let currentTime = ctx.currentTime

    notes.forEach(note => {
      if (isMuted) return
      
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = note.freq
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration)
      
      oscillator.start(currentTime)
      oscillator.stop(currentTime + note.duration)
      
      currentTime += note.duration
    })
  }

  const handleCardOpen = () => {
    setIsOpen(true)
    startConfetti()
    
    // Small delay before playing music
    setTimeout(() => {
      createBirthdayMelody()
      setIsPlaying(true)
    }, 800)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
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
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Audio Controls */}
      {isOpen && (
        <div className="fixed top-4 right-4 z-40">
          <Button
            onClick={toggleMute}
            variant="outline"
            size="icon"
            className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Music className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {!isOpen ? (
          /* Closed Envelope */
          <div className="envelope-container perspective-1000" onClick={handleCardOpen}>
            <div className="envelope relative mx-auto cursor-pointer transform hover:scale-105 transition-transform duration-300">
              {/* Envelope Shadow */}
              <div className="absolute inset-0 bg-black/20 blur-xl transform translate-y-8 scale-110 rounded-lg"></div>
              
              {/* Envelope Body */}
              <div className="relative bg-gradient-to-br from-amber-100 to-orange-200 w-80 h-56 md:w-96 md:h-64 rounded-lg shadow-2xl border border-amber-300/50">
                {/* Envelope Flap */}
                <div className="envelope-flap absolute -top-0 left-0 right-0 h-32 bg-gradient-to-br from-amber-200 to-orange-300 transform origin-bottom rotate-0 transition-transform duration-1000 ease-out border border-amber-300/50"
                     style={{
                       clipPath: 'polygon(0 0, 100% 0, 50% 80%)'
                     }}>
                  {/* Wax Seal */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-lg border-2 border-red-700 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-100" />
                  </div>
                </div>
                
                {/* Click Instruction */}
                <div className="absolute inset-0 flex items-center justify-center text-amber-800 font-semibold text-lg">
                  <div className="text-center">
                    <div className="animate-pulse mb-2">🎉</div>
                    <div>Click to Open</div>
                    <div className="text-sm opacity-75 mt-1">Birthday Card for</div>
                    <div className="font-bold text-xl text-red-700">Uncle Rajendra Regmi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Opened Card Content */
          <div className="opened-card animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-bounce">
                🎉 Happy Birthday! 🎂
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mt-4 font-semibold">
                Dear Uncle Rajendra Regmi
              </p>
            </div>

            {/* Date Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* AD Date */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                  <h3 className="font-semibold text-lg mb-2">Today's Date (AD)</h3>
                  <p className="text-sm opacity-90">{adDate}</p>
                </CardContent>
              </Card>

              {/* BS Date */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-red-400" />
                  <h3 className="font-semibold text-lg mb-2">Birthday (BS)</h3>
                  <p className="text-sm opacity-90">{bsDate}</p>
                </CardContent>
              </Card>
            </div>

            {/* Photo Gallery Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Profile Picture */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-white flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Profile Picture
                  </h3>
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-white/60" />
                    <p className="text-white/70 text-sm">Drop your favorite photo here</p>
                    <p className="text-white/50 text-xs mt-1">or click to browse</p>
                  </div>
                </CardContent>
              </Card>

              {/* Birthday Photos */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-white flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Celebration Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="aspect-square border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center hover:border-white/50 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-white/60" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Birthday Message */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
              <CardContent className="p-8 text-center">
                <div className="text-white space-y-4">
                  <p className="text-lg font-medium">
                    May your special day be filled with happiness, love, and wonderful memories! 🎈
                  </p>
                  <p className="text-base">
                    Another year of wisdom, joy, and adventures awaits you.
                    Thank you for being such an amazing part of our lives! ✨
                  </p>
                  <p className="text-xl font-bold text-yellow-400">
                    Wishing you all the best on your birthday! 🎊
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center">
              <p className="text-white/70 text-sm">
                Made with ❤️ for Uncle Rajendra Regmi's Birthday
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .envelope {
          transform-style: preserve-3d;
        }
        
        .envelope-flap {
          transform-origin: bottom center;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        @media (max-width: 768px) {
          .envelope {
            width: 280px;
            height: 200px;
          }
        }
      `}</style>
    </div>
  )
}