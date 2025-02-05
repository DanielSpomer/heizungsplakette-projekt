'use client'

import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowRight, Shield, Clock, FileText } from 'lucide-react'
import Image from 'next/image'
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'

function SquaresBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute h-full w-full 
        [background-image:linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] 
        [background-size:24px_24px]
        [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]">
      </div>
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-[980px] mx-auto px-4 h-12 md:h-14 flex items-center justify-between">
          <Link href="/">
            <Image 
              src="/images/heizungsplakette-logo.png" 
              alt="Heizungsplakette Logo" 
              width={140} 
              height={35} 
              className="w-auto h-6 md:h-8"
              priority
            />
          </Link>
          <Button asChild className="bg-blue-600 text-white rounded-full px-4 py-1.5 text-sm hover:bg-blue-700 transition-colors">
            <Link href="/heizungsplakette">Jetzt bestellen</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen">
        <SquaresBackground />
        <motion.div 
          className="text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-black mb-6">
            Heizungsplakette.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Digital und sicher.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8">
            Ihre Heizungsplakette. Schnell und unkompliziert online beantragen.
          </p>
          <Button asChild className="bg-blue-600 text-white rounded-full px-8 py-6 text-lg hover:bg-blue-700 transition-all transform hover:scale-105">
            <Link href="/heizungsplakette">
              Jetzt bestellen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
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
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="h-12 w-12 mx-auto mb-6 text-blue-500" />
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">
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
                className="flex gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-5xl font-bold text-gray-200">{step.number}</span>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">
              Bereit für Ihre digitale Heizungsplakette?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Sichern Sie sich jetzt Ihre rechtskonforme Dokumentation.
            </p>
            <Button asChild className="bg-white text-blue-600 rounded-full px-8 py-6 text-lg hover:bg-gray-100 transition-all transform hover:scale-105">
              <Link href="/heizungsplakette">
                Jetzt für 49€ bestellen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © 2025 Heizungsplakette.de
            </div>
            <nav className="flex gap-8 text-sm">
              <Link href="/impressum" className="text-gray-600 hover:text-black transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-gray-600 hover:text-black transition-colors">
                Datenschutz
              </Link>
              <Link href="/agb" className="text-gray-600 hover:text-black transition-colors">
                AGB
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}