import { NextResponse } from 'next/server'

// Health check endpoint
export async function GET(request) {
  const { pathname } = new URL(request.url)
  
  // Health check
  if (pathname.includes('/health')) {
    return NextResponse.json({ 
      status: 'healthy', 
      service: 'Birthday Card API',
      timestamp: new Date().toISOString() 
    })
  }
  
  // Birthday info endpoint
  if (pathname.includes('/birthday-info')) {
    const currentDate = new Date()
    return NextResponse.json({
      celebrant: 'Uncle Rajendra Regmi',
      birthdayBS: 'Asoj 16, 2082',
      currentDateAD: currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      message: 'Happy Birthday! 🎂'
    })
  }
  
  return NextResponse.json({ message: 'Birthday Card API is running' })
}

// Handle photo upload placeholder
export async function POST(request) {
  const { pathname } = new URL(request.url)
  
  if (pathname.includes('/upload-photo')) {
    try {
      const formData = await request.formData()
      const file = formData.get('photo')
      
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
        message: 'Photo uploaded successfully! 📸',
        filename: file.name,
        size: file.size,
        type: file.type
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Upload failed', details: error.message }, 
        { status: 500 }
      )
    }
  }
  
  return NextResponse.json({ message: 'Invalid endpoint' }, { status: 404 })
}