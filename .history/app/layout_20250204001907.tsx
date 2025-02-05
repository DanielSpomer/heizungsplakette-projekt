import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Heizungsplakette',
  description: 'Ihre Heizungsplakette einfach und schnell',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Heizungsplakette-FavIcon-y16rvIn0l6p5UXxp4juysSjmSzTFOl.png',
    shortcut: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Heizungsplakette-FavIcon-y16rvIn0l6p5UXxp4juysSjmSzTFOl.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Heizungsplakette-FavIcon-y16rvIn0l6p5UXxp4juysSjmSzTFOl.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Heizungsplakette-FavIcon-y16rvIn0l6p5UXxp4juysSjmSzTFOl.png',
      },
      {
        rel: 'apple-touch-icon',
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Heizungsplakette-FavIcon-y16rvIn0l6p5UXxp4juysSjmSzTFOl.png',
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
      <head>
        <link rel="icon" type="image/png" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Heizungsplakette-FavIcon-y16rvIn0l6p5UXxp4juysSjmSzTFOl.png" />
        <link rel="shortcut icon" type="image/png" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Heizungsplakette-FavIcon-y16rvIn0l6p5UXxp4juysSjmSzTFOl.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}