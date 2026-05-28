
import type { Metadata }
from 'next'

import './globals.css'

import ClientLayout
from './ClientLayout'

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

    <html lang="en">

<body suppressHydrationWarning={true}>


        <ClientLayout>

          {children}

        </ClientLayout>

      </body>

    </html>

  )
}

