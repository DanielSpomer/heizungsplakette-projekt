'use client'

import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowRight, Shield, Clock, FileText } from 'lucide-react'
import Image from 'next/image'
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'
import SplitText from '@/components/SplitText'

function SquaresBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <div 
        className="absolute h-full w-full bg-white"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, black 70%, transparent 110%)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-60" />
    </div>
  )
}

export default function HeizungsplaketteHomepage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updateScrolled = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', updateScrolled)
    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Image 
              src="/images/heizungsplakette-logo.png" 
              alt="Heizungsplakette Logo" 
              width={140} 
              height={35} 
              className="w-auto h-8"
              priority
            />
          </Link>
          <Button asChild className="bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-blue-700 transition-all hover:scale-105">
            <Link href="/heizungsplakette">Jetzt bestellen</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen px-4">
        <SquaresBackground />
        <motion.div 
          className="text-center max-w-4xl mx-auto flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col items-center space-y-0">
            <SplitText
              text={`Heizungsplakette.\nDigital und sicher.`}
              className="text-5xl md:text-7xl font-bold tracking-tight whitespace-pre-line leading-tight mb-16"
              delay={50}
              animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              easing="easeOutQuint"
              threshold={0.5}
              rootMargin="-20%"
              render={(text, index) => (
                <span
                  key={index}
                  className={index === 0 ? 'text-[#1a1a1a] block' : 'text-[#4B6FFF] block'}
                >
                  {text}
                </span>
              )}
            />
          </div>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Ihre Heizungsplakette. Schnell und unkompliziert online beantragen.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8"
          >
            <Button asChild className="bg-blue-600 text-white rounded-full px-8 py-6 text-lg font-medium hover:bg-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl">
              <Link href="/heizungsplakette">
                Jetzt bestellen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      {/* Process Section */}
      {/* CTA Section */}
      {/* Footer */}
    </div>
  )
}