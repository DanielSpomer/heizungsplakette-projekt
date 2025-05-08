import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Heizungsplakette',
  description: 'Ihre Heizungsplakette einfach und schnell',
  icons: {
    icon: [
      { url: '/images/Heizungsplakette-FavIcon.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/Heizungsplakette-FavIcon.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/Heizungsplakette-FavIcon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/images/Heizungsplakette-FavIcon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/images/Heizungsplakette-FavIcon.png', color: '#5bbad5' },
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