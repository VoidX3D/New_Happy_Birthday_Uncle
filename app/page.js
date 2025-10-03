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
    return !(this.y > this.canvas.height + 20 || this.life <= 0)
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
  const mp3AudioRef = useRef(null)

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
    } catch {
      console.log('MP3 failed, fallback not implemented yet')
    }
  }

  const stopBirthdayMusic = () => {
    if (mp3AudioRef.current) {
      mp3AudioRef.current.pause()
      mp3AudioRef.current.currentTime = 0
    }
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
      if (Math.random() < 0.1) particle.playSound()
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      confettiRef.current = confettiRef.current.filter(particle => {
        particle.update()
        particle.draw()
        return particle.life > 0
      })
      if (confettiRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    animate()
  }

  const handleEnvelopeOpen = async () => {
    if (isEnvelopeAnimating) return
    setIsEnvelopeAnimating(true)
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }
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
      if (mp3AudioRef.current) mp3AudioRef.current.pause()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4 overflow-hidden relative">
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
            <div className={`luxury-envelope relative mx-auto cursor-pointer transform transition-all duration-1000 ${isEnvelopeAnimating ? 'animate-envelope-open' : 'hover:scale-105 hover:rotate-1'}`}>
              <div className="absolute inset-0 bg-black/40 blur-2xl transform translate-y-12 scale-110 rounded-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 w-[480px] h-[320px] md:w-[600px] md:h-[400px] rounded-lg shadow-2xl border-2 border-slate-200"></div>
            </div>
          </div>
        ) : (
          <div className="opened-card animate-fade-in-up text-center text-slate-200">
            <h1 className="text-5xl md:text-7xl font-serif font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-shimmer">
              Happy Birthday!
            </h1>
            <p className="text-2xl md:text-3xl font-serif mb-12">Wishing you joy and celebration, Dear Uncle</p>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
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
          </div>
        )}
      </div>
    </div>
  )
}
