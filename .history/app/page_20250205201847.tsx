'use client'

import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowRight, Shield, Clock, FileText } from 'lucide-react'
import Image from 'next/image'
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'
import SplitText from '@/components/SplitText'
import StarBorder from '../components/StarBorder';


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
          <StarBorder
  as="button"
  className="px-6 py-3 text-white font-semibold rounded-full bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
  color="cyan"
  speed="5s"
>
  Jetzt bestellen
</StarBorder>
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
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: Shield,
                title: "Rechtssicher",
                description: "Nach aktuellen gesetzlichen Vorgaben erstellt"
              },
              {
                icon: Clock,
                title: "Schnell verfügbar",
                description: "Digitale Zusendung innerhalb von 48 Stunden"
              },
              {
                icon: FileText,
                title: "Offiziell anerkannt",
                description: "Rechtskonforme Dokumentation Ihrer Heizungsanlage"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="relative p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Einfach. Schnell. Digital.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              In nur wenigen Schritten zu Ihrer Heizungsplakette
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                number: "01",
                title: "Daten eingeben",
                description: "Füllen Sie das Online-Formular mit den Daten Ihrer Heizungsanlage aus."
              },
              {
                number: "02",
                title: "Zahlung",
                description: "Zahlen Sie bequem und sicher online (49€ inkl. MwSt.)."
              },
              {
                number: "03",
                title: "Prüfung",
                description: "Wir prüfen Ihre Angaben nach aktuellen Vorschriften."
              },
              {
                number: "04",
                title: "Erhalt",
                description: "Erhalten Sie Ihre digitale Heizungsplakette per E-Mail."
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="flex gap-6 p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-5xl font-bold text-blue-100">{step.number}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Bereit für Ihre digitale Heizungsplakette?
            </h2>
            <p className="text-xl mb-12 text-gray-600">
              Sichern Sie sich jetzt Ihre rechtskonforme Dokumentation.
            </p>
            <Button asChild className="bg-blue-600 text-white rounded-full px-8 py-6 text-lg font-medium hover:bg-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl">
              <Link href="/heizungsplakette">
                Jetzt für 49€ bestellen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2025 Heizungsplakette.de
            </div>
            <nav className="flex gap-8 text-sm">
              <Link href="/impressum" className="text-gray-500 hover:text-gray-900 transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-gray-500 hover:text-gray-900 transition-colors">
                Datenschutz
              </Link>
              <Link href="/agb" className="text-gray-500 hover:text-gray-900 transition-colors">
                AGB
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}