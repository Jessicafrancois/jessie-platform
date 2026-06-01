
import type { Metadata } from 'next'
import { ThemeProvider } from '../providers/ThemeProvider'
import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata: Metadata = {

  title:
    'Jessie Platform',

  description:
    'Creative operating system',

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
