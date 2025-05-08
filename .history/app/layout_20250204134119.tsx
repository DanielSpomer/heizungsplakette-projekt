import { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import './globals.css'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/images/Heizungsplakette-FavIcon.png" />
      </head>
      <body className={inter.className}>
        {/* Falls du das Logo in deinem Layout brauchst, kannst du es hier platzieren */}
        <Image
          src="/images/heizungsplakette-logo.png"
          width={200} // Setze eine feste Breite
          height={100} // Setze eine feste Höhe
          alt="Heizungsplakette Logo"
          style={{ width: 'auto', height: 'auto' }} // Verhindert Verzerrungen
        />
        {children}
      </body>
    </html>
  )
}
