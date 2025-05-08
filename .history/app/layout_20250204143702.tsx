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
      { url: '/images/favicon.ico?v=2' }, // Standard-Favicon
      { url: '/images/Heizungsplakette-FavIcon.png?v=2', type: 'image/png' }, // PNG-Version
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
        {/* Favicon-Definition */}
        <link rel="icon" href="/images/favicon.ico?v=2" />
        <link rel="icon" type="image/png" href="/images/Heizungsplakette-FavIcon.png?v=2" />
        <link rel="apple-touch-icon" href="/images/Heizungsplakette-FavIcon.png?v=2" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
