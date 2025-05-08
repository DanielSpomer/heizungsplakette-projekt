import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Heizungsplakette',
  description: 'Ihre Heizungsplakette einfach und schnell',
  icons: {
    icon: [
      { url: '/images/Heizungsplakette-FavIcon.png?v=1' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Heizungsplakette',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/images/Heizungsplakette-FavIcon.png?v=1" />
        <link rel="icon" type="image/svg+xml" href="/images/Heizungsplakette-FavIcon.png?v=1" />
      </head>
    </html>
  )
}
