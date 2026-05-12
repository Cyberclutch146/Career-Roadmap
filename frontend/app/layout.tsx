import type { Metadata } from 'next'
import { Inter, Merriweather, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
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
    <html lang="en" className={`${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-paper-50">
        {children}
      </body>
    </html>
  )
}
