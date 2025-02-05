import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

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
        {/* Setze Favicons manuell */}
        <link rel="icon" type="image/png" href="/images/Heizungsplakette-FavIcon.png?v=1" />
        <link rel="icon" type="image/svg+xml" href="/images/Heizungsplakette-FavIcon.png?v=1" />
        {/* Falls benötigt, zusätzliche Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/images/Heizungsplakette-FavIcon.png?v=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
