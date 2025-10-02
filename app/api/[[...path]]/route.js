import { NextResponse } from 'next/server'

// Health check endpoint
export async function GET(request) {
  const { pathname } = new URL(request.url)
  
  // Health check
  if (pathname.includes('/health')) {
    return NextResponse.json({ 
      status: 'healthy', 
      service: 'Luxury Birthday Card API',
      timestamp: new Date().toISOString() 
    })
  }
  
  // Birthday info endpoint
  if (pathname.includes('/birthday-info')) {
    const currentDate = new Date()
    return NextResponse.json({
      celebrant: 'Dear Uncle - Rajendra Regmi',
      birthdayBS: 'Asoj 16, 2082',
      currentDateAD: currentDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      message: 'Happy Birthday! Wishing you joy and celebration'
    })
  }
  
  // Placeholder image endpoints
  if (pathname.includes('/placeholder/')) {
    const imageType = pathname.split('/').pop()
    
    // Return SVG placeholder images
    let svgContent = ''
    
    if (imageType === 'profile') {
      svgContent = `
        <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#065f46;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="300" height="300" fill="url(#bg)" rx="15"/>
          <circle cx="150" cy="120" r="45" fill="#f1f5f9" opacity="0.3"/>
          <path d="M150 165 C120 165, 90 185, 90 220 L210 220 C210 185, 180 165, 150 165 Z" fill="#f1f5f9" opacity="0.3"/>
          <text x="150" y="260" text-anchor="middle" fill="#f1f5f9" font-family="serif" font-size="14" opacity="0.7">Uncle's Portrait</text>
        </svg>
      `
    } else if (imageType.startsWith('celebration-')) {
      const celebrationNum = imageType.split('-')[1]
      svgContent = `
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg${celebrationNum}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#374151;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#bg${celebrationNum})" rx="10"/>
          <circle cx="100" cy="60" r="8" fill="#fef3c7"/>
          <rect x="92" y="80" width="16" height="30" fill="#fef3c7" rx="2"/>
          <ellipse cx="100" cy="120" rx="25" ry="15" fill="#f59e0b"/>
          <path d="M85 135 Q100 125 115 135" stroke="#f59e0b" stroke-width="3" fill="none"/>
          <text x="100" y="170" text-anchor="middle" fill="#f1f5f9" font-family="serif" font-size="10" opacity="0.7">Memory ${celebrationNum}</text>
        </svg>
      `
    } else {
      // Default placeholder
      svgContent = `
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#374151" rx="10"/>
          <text x="100" y="105" text-anchor="middle" fill="#9ca3af" font-family="serif" font-size="14">Image Placeholder</text>
        </svg>
      `
    }
    
    return new Response(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }
  
  return NextResponse.json({ message: 'Luxury Birthday Card API is running' })
}

// Handle photo upload placeholder
export async function POST(request) {
  const { pathname } = new URL(request.url)
  
  if (pathname.includes('/upload-photo')) {
    try {
      const formData = await request.formData()
      const file = formData.get('photo')
      const photoType = formData.get('type') || 'general'
      
      if (!file) {
        return NextResponse.json(
          { error: 'No photo provided' }, 
          { status: 400 }
        )
      }
      
      // In a real app, you would save the file to storage
      // For now, just return success with file info
      return NextResponse.json({
        success: true,
        message: `Beautiful ${photoType} photo uploaded successfully!`,
        filename: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        placeholder: `Your ${photoType} photo will appear here once processed`
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Upload failed', details: error.message }, 
        { status: 500 }
      )
    }
  }
  
  // Enhanced confetti sound effect endpoint
  if (pathname.includes('/confetti-sound')) {
    return NextResponse.json({
      sounds: [
        { frequency: 800, duration: 0.2, type: 'sine' },
        { frequency: 1000, duration: 0.15, type: 'triangle' },
        { frequency: 600, duration: 0.25, type: 'sine' }
      ],
      message: 'Enhanced confetti sound configuration'
    })
  }
  
  return NextResponse.json({ message: 'Invalid endpoint' }, { status: 404 })
}