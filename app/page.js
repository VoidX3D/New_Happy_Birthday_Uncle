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

  // Play / stop music functions (unchanged)
  const createAdvancedBirthdayMusic = () => { /* omitted for brevity */ }
  const playBirthdayMusic = async () => { /* omitted for brevity */ }
  const stopBirthdayMusic = () => { /* omitted for brevity */ }

  const startEnhancedConfetti = () => { /* omitted for brevity */ }

  const handleEnvelopeOpen = async () => {
    if (isEnvelopeAnimating) return
    setIsEnvelopeAnimating(true)
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
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
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ width: '100vw', height: '100vh' }} />
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
            {/* Envelope HTML unchanged */}
          </div>
        ) : (
          <div className="opened-card animate-fade-in-up">
            {/* Header & Date Cards unchanged */}

            {/* Photo Gallery */}
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
                    <img 
                      src="/placeholder/uncle-profile.png" 
                      alt="Uncle Rajendra Regmi" 
                      className="rounded-xl shadow-lg object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Celebration Photos */}
              <Card className="luxury-glass border-slate-600">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center font-serif">
                    <Camera className="w-5 h-5 mr-2" />
                    Celebration Memories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="aspect-square border-2 border-dashed border-slate-500 rounded-lg flex items-center justify-center hover:border-slate-400 transition-colors cursor-pointer bg-slate-800/50 relative">
                        <Upload className="w-8 h-8 text-slate-400" />
                        <img
                          src={`/placeholder/celebration-${item}.png`}
                          alt={`Celebration ${item}`}
                          className="rounded-lg object-cover w-full h-full absolute top-0 left-0"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Birthday Message & Signature unchanged */}
          </div>
        )}
      </div>
    </div>
  )
}
