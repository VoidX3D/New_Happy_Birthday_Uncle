'use client'

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
    if (this.y > this.canvas.height + 20 || this.life <= 0) return false
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

  const getCurrentDate = () => {
    const now = new Date()
    const adDate = now.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const bsDate = 'Asoj 16, 2082'
    return { adDate, bsDate }
  }

  const { adDate, bsDate } = getCurrentDate()

  const createAdvancedBirthdayMusic = () => {
    if (!audioContextRef.current || isMuted) return
    const ctx = audioContextRef.current
    const melody = [
      { freq: 523.25, duration: 0.6, velocity: 0.3 },
      { freq: 523.25, duration: 0.4, velocity: 0.3 },
      { freq: 587.33, duration: 1.2, velocity: 0.4 },
      { freq: 523.25, duration: 1.2, velocity: 0.4 },
      { freq: 698.46, duration: 1.2, velocity: 0.5 },
      { freq: 659.25, duration: 2.4, velocity: 0.4 },
      { freq: 523.25, duration: 0.6, velocity: 0.35 },
      { freq: 523.25, duration: 0.4, velocity: 0.35 },
      { freq: 587.33, duration: 1.2, velocity: 0.45 },
      { freq: 523.25, duration: 1.2, velocity: 0.45 },
      { freq: 783.99, duration: 1.2, velocity: 0.55 },
      { freq: 698.46, duration: 2.4, velocity: 0.45 },
      { freq: 523.25, duration: 0.6, velocity: 0.4 },
      { freq: 523.25, duration: 0.4, velocity: 0.4 },
      { freq: 1046.50, duration: 1.2, velocity: 0.6 },
      { freq: 880.00, duration: 1.2, velocity: 0.5 },
      { freq: 698.46, duration: 1.2, velocity: 0.5 },
      { freq: 659.25, duration: 1.2, velocity: 0.4 },
      { freq: 587.33, duration: 2.4, velocity: 0.4 },
      { freq: 932.33, duration: 0.6, velocity: 0.45 },
      { freq: 932.33, duration: 0.4, velocity: 0.45 },
      { freq: 880.00, duration: 1.2, velocity: 0.5 },
      { freq: 698.46, duration: 1.2, velocity: 0.5 },
      { freq: 783.99, duration: 1.2, velocity: 0.55 },
      { freq: 698.46, duration: 3.6, velocity: 0.6 },
    ]
    let currentTime = ctx.currentTime + 0.1
    melody.forEach(note => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.frequency.value = note.freq
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(note.velocity, currentTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration)
      oscillator.start(currentTime)
      oscillator.stop(currentTime + note.duration)
      currentTime += note.duration
    })
  }

  const playBirthdayMusic = async () => {
    if (isMuted) return
    try {
      if (mp3AudioRef.current) {
        mp3AudioRef.current.pause()
        mp3AudioRef.current.currentTime = 0
      }
      mp3AudioRef.current = new Audio('/audio/happy-birthday.mp3')
      mp3AudioRef.current.volume = 0.8
      mp3AudioRef.current.loop = true
      await mp3AudioRef.current.play()
    } catch (error) {
      createAdvancedBirthdayMusic()
    }
  }

  const stopBirthdayMusic = () => {
    if (mp3AudioRef.current) {
      mp3AudioRef.current.pause()
      mp3AudioRef.current.currentTime = 0
    }
    if (musicIntervalRef.current) clearInterval(musicIntervalRef.current)
  }

  const startEnhancedConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    for (let i = 0; i < 200; i++) {
      const particle = new ConfettiParticle(canvas, audioContextRef.current)
      confettiRef.current.push(particle)
      if (Math.random() < 0.1) {
        setTimeout(() => particle.playSound(), Math.random() * 2000)
      }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      confettiRef.current = confettiRef.current.filter(p => {
        p.update()
        p.draw()
        return p.life > 0
      })
      if (Math.random() < 0.05 && confettiRef.current.length < 150) {
        const particle = new ConfettiParticle(canvas, audioContextRef.current)
        confettiRef.current.push(particle)
        if (Math.random() < 0.2) particle.playSound()
      }
      if (confettiRef.current.length > 0) animationRef.current = requestAnimationFrame(animate)
    }
    animate()
  }

  const handleEnvelopeOpen = async () => {
    if (isEnvelopeAnimating) return
    setIsEnvelopeAnimating(true)
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume()
    setTimeout(() => {
      setIsOpen(true)
      startEnhancedConfetti()
    }, 1000)
    setTimeout(() => {
      setIsPlaying(true)
      playBirthdayMusic()
    }, 2000)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) stopBirthdayMusic()
    else if (isPlaying) playBirthdayMusic()
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (musicIntervalRef.current) clearInterval(musicIntervalRef.current)
      if (mp3AudioRef.current) mp3AudioRef.current.pause()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100vw', height: '100vh' }}
      />

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

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {!isOpen ? (
          <div className="envelope-container perspective-2000" onClick={handleEnvelopeOpen}>
            <div
              className={`luxury-envelope relative mx-auto cursor-pointer transform transition-all duration-1000 ${
                isEnvelopeAnimating ? 'animate-envelope-open' : 'hover:scale-105 hover:rotate-1'
              }`}
            >
              <div className="absolute inset-0 bg-black/40 blur-2xl transform translate-y-12 scale-110 rounded-xl"></div>

              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 w-[480px] h-[320px] md:w-[600px] md:h-[400px] rounded-lg shadow-2xl border-2 border-slate-200">
                <div className="absolute top-4 right-4 w-20 h-24 md:w-24 md:h-28 bg-gradient-to-br from-blue-600 to-blue-800 rounded-sm shadow-lg border-2 border-white">
                  <div className="absolute inset-1 border border-white/50 rounded-sm">
                    <div className="flex flex-col items-center justify-center h-full text-white text-xs md:text-sm">
                      <Heart className="w-4 h-4 md:w-6 md:h-6 mb-1" />
                      <span className="font-serif">Birthday</span>
                      <span className="font-serif text-xs">2025</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-4 border-dashed border-slate-200 rounded-sm animate-ping"></div>
                </div>
              </div>

              <div className="envelope-flap absolute top-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-700 via-blue-600 to-blue-900 rounded-t-lg shadow-inner transform origin-top transition-transform duration-1000"></div>
            </div>
          </div>
        ) : (
          <div className="card-open-container grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <Card className="bg-gradient-to-br from-white/80 via-slate-50 to-white/90 shadow-2xl border-2 border-slate-200 transform hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-emerald-900 font-serif flex items-center gap-2">
                  🎉 Happy Birthday!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-lg md:text-xl font-serif leading-relaxed">
                  Wishing you a day filled with joy, laughter, and unforgettable memories. May your dreams soar higher than the tallest mountains and your heart be lighter than a feather.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/80 via-slate-50 to-white/90 shadow-2xl border-2 border-slate-200 transform hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-900 font-serif text-xl md:text-2xl">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6" /> Today’s Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-lg md:text-xl font-mono">
                  AD: {adDate}
                </p>
                <p className="text-slate-700 text-lg md:text-xl font-mono">
                  BS: {bsDate}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style jsx>{`
        .envelope-container {
          perspective: 2000px;
        }
        .luxury-envelope {
          width: 480px;
          height: 320px;
        }
        .envelope-flap.animate-envelope-open {
          transform: rotateX(-180deg);
        }
        @media (min-width: 768px) {
          .luxury-envelope {
            width: 600px;
            height: 400px;
          }
        }
      `}</style>
    </div>
  )
}
