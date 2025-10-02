import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Happy Birthday Uncle Rajendra Regmi! 🎂',
  description: 'Interactive 3D Birthday Card with Animation & Music - Made with Love ❤️',
  keywords: 'birthday card, 3D animation, interactive card, celebration, Rajendra Regmi',
  openGraph: {
    title: 'Happy Birthday Uncle Rajendra Regmi! 🎂',
    description: 'Interactive 3D Birthday Card with Animation & Music',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}