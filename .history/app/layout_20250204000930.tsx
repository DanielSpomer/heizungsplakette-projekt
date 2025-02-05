import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'; // Import React

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Heizungsplakette',
  description: 'Ihre Heizungsplakette einfach und schnell',
  icons: {
    icon: '/images/Heizungsplakette-FavIcon.png',
    shortcut: '/images/Heizungsplakette-FavIcon.png',
    apple: '/images/Heizungsplakette-FavIcon-180x180.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/images/Heizungsplakette-FavIcon-180x180.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#ffffff',
  appleWebApp: {
    title: 'Heizungsplakette',
    statusBarStyle: 'default',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  )
}