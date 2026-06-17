import './globals.css'

import WorldNavigation from '@/components/navigation/WorldNavigation'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  
  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable}
          ${playfair.variable}
        `}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}