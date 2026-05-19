import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { MobileNav } from '@/components/MobileNav'

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

// Plus Jakarta Sans loaded via Google Fonts
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['600', '700', '800'],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500', '700'],
})

export const metadata: Metadata = {
  title: 'RoadmapAI - Your Personal Learning Journey',
  description: 'AI-powered educational roadmap generator. Transform your learning goals into structured, achievable roadmaps with personalized guidance.',
  keywords: ['learning', 'education', 'roadmap', 'AI', 'study planner', 'courses'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${dmSans.variable} ${plusJakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background text-on-surface pb-16 md:pb-0 overflow-x-hidden antialiased">
        {/* Atmospheric Background Glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/[0.07] blur-[140px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-secondary/[0.04] blur-[160px]" />
        </div>
        <AuthProvider>
          {children}
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  )
}
