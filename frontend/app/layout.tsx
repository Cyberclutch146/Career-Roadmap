import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { MobileNav } from '@/components/MobileNav'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background text-on-surface pb-16 md:pb-0 overflow-x-hidden antialiased">
        {/* Atmospheric Background Glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/[0.05] blur-[180px]" />
          <div className="absolute bottom-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-orange-500/[0.03] blur-[200px]" />
        </div>
        <AuthProvider>
          {children}
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  )
}
