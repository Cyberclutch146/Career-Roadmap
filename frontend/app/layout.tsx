import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { MobileNav } from '@/components/MobileNav'
import { ChatWidget } from '@/components/AIMentor'
import Galaxy from '@/components/Galaxy'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
})

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'RoadmapAI - Your Personal Learning Journey',
  description: 'AI-powered educational roadmap generator. Transform your learning goals into structured, achievable roadmaps with personalized guidance.',
  keywords: ['learning', 'education', 'roadmap', 'AI', 'study planner', 'courses'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} overflow-x-hidden max-w-full`}>
      <body className="min-h-screen bg-background text-on-surface pb-16 md:pb-0 overflow-x-hidden max-w-full antialiased">
        {/* Galaxy Background */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-black">
          <Galaxy 
            transparent={true} 
            mouseInteraction={true} 
            mouseRepulsion={true}
            density={1.2}
            glowIntensity={0.2}
            saturation={0}
            hueShift={240}
            className="w-full h-full opacity-80"
          />
        </div>
        <AuthProvider>
          {children}
          <MobileNav />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  )
}
