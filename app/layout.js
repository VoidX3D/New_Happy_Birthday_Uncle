import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Luxury Birthday Card for Dear Uncle | Rajendra Regmi',
  description: 'An elegant 3D interactive birthday card with sophisticated animations, luxury design, and personalized touches - crafted with love',
  keywords: 'luxury birthday card, 3D animation, elegant design, interactive greeting, sophisticated card, Uncle Rajendra Regmi',
  openGraph: {
    title: 'Luxury Birthday Card for Dear Uncle',
    description: 'An elegant 3D interactive birthday card with sophisticated animations and luxury design',
    type: 'website',
    images: ['/api/placeholder/profile']
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  robots: 'index, follow',
  authors: [{ name: 'Birthday Card Designer' }],
  creator: 'Luxury Card Studio',
  themeColor: '#0f172a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-hidden scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden bg-slate-900`}>
        {children}
      </body>
    </html>
  )
}