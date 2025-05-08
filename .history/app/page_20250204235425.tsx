'use client'

import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowRight, Shield, Clock, FileText } from 'lucide-react'
import Image from 'next/image'
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/">
                <Image 
                  src="/images/heizungsplakette-logo.png" 
                  alt="Heizungsplakette Logo" 
                  width={180} 
                  height={45} 
                  className="w-auto h-8 sm:h-10"
                  priority
                />
              </Link>
            </div>
            <div className="flex items-center justify-end md:flex-1 lg:w-0">
              <Button asChild className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Link href="/heizungsplakette">
                  Jetzt bestellen
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1 
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="block xl:inline">Heizungsplakette</span>{' '}
                  <span className="block text-blue-600 xl:inline">digital und sicher</span>
                </motion.h1>
                <motion.p 
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Bestellen Sie Ihre Heizungsplakette schnell und unkompliziert online. Erhalten Sie wichtige Informationen über Ihre Heizung und sichern Sie sich rechtlich ab.
                </motion.p>
                <motion.div 
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="rounded-md shadow">
                    <Button asChild className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                      <Link href="/heizungsplakette">
                        Jetzt bestellen
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button asChild className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                      <Link href="/ablauf">
                        Mehr erfahren
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/images/heizung-hero.jpg"
            alt="Moderne Heizungsanlage"
            width={1920}
            height={1080}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Vorteile</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Ihre Heizungsplakette - einfach und sicher
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Erfahren Sie, warum unsere digitale Heizungsplakette die beste Wahl für Sie ist.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: 'Rechtssicher',
                  description: 'Unsere Heizungsplaketten entsprechen allen aktuellen gesetzlichen Anforderungen.',
                  icon: Shield,
                },
                {
                  name: 'Schnell verfügbar',
                  description: 'Erhalten Sie Ihre digitale Heizungsplakette innerhalb von 48 Stunden.',
                  icon: Clock,
                },
                {
                  name: 'Einfacher Prozess',
                  description: 'Unkomplizierte Online-Beantragung ohne lästigen Papierkram.',
                  icon: FileText,
                },
                {
                  name: 'Kostengünstig',
                  description: 'Sparen Sie Zeit und Geld mit unserem effizienten digitalen Service.',
                  icon: ArrowRight,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Bereit für Ihre Heizungsplakette?</span>
            <span className="block">Starten Sie jetzt den Bestellprozess.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Sichern Sie sich Ihre digitale Heizungsplakette schnell, einfach und rechtssicher.
          </p>
          <Button asChild className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto">
            <Link href="/heizungsplakette">
              Jetzt bestellen
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/impressum" className="text-gray-400 hover:text-gray-500">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-gray-400 hover:text-gray-500">
              Datenschutz
            </Link>
            <Link href="/agb" className="text-gray-400 hover:text-gray-500">
              AGB
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2025 Heizungsplakette.de. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}