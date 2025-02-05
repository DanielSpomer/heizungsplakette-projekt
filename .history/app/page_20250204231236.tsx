'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Menu, Star, Upload, ArrowRight, MapPin, Shield, Clock, Check, Building, Users, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/logo.svg" 
                alt="Heizungsplakette Logo"
                width={160}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            
            <Button asChild className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg">
              <Link href="/beantragen">Jetzt kaufen – 49€</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-6">
              Heizungsplakette – Ihre Sicherheit auf einen Blick
            </h1>
            <p className="text-[#334155] text-lg md:text-xl mb-8">
              Bestellen Sie Ihre Heizungsplakette und erhalten Sie in wenigen Schritten wichtige Informationen darüber, wie lange Ihre Heizung noch betrieben werden darf, ob sie ausgetauscht werden muss oder ob zukünftige Investitionen nötig sind.
            </p>
            
            <div className="space-y-8">
              <Button asChild className="h-12 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg">
                <Link href="/beantragen">
                  Jetzt Heizungsplakette bestellen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <div className="flex items-center gap-8 text-sm text-[#334155]">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2">4.9/5</span>
                </div>
                <span>TÜV-zertifiziert</span>
                <span>DEKRA-geprüft</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Important Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-semibold text-[#1E293B] mb-4">
              Warum ist die Heizungsplakette wichtig?
            </h2>
            <p className="text-[#334155]">
              Die Heizungsplakette ist ein offizielles Zertifikat, das den Betrieb Ihrer Heizungsanlage rechtlich absichert. Sie wird gemäß den Vorgaben der Energieeinsparverordnung (EnEV) und aktuellen gesetzlichen Bestimmungen erstellt und gibt Ihnen einen präzisen Überblick über den Zustand Ihrer Heizungsanlage.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#1E293B] mb-4">
              Für wen ist die Heizungsplakette geeignet?
            </h2>
            <ul className="space-y-4">
              {[
                { icon: Building, text: "Immobilieneigentümer" },
                { icon: Users, text: "Kaufinteressenten" },
                { icon: FileText, text: "Immobilienmakler" },
                { icon: Shield, text: "Verwalter" }
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-[#334155]">
                  <item.icon className="h-5 w-5 text-[#2563EB]" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-semibold text-[#1E293B] mb-6">
              Ihre Vorteile auf einen Blick
            </h2>
            <ul className="space-y-4">
              {[
                "Personalisierte Heizungsplakette",
                "Rechtssicherheit",
                "Schnell und unkompliziert online",
                "Direkte Zustellung per E-Mail",
                "Professionelles Layout"
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-[#334155]">
                  <Check className="h-5 w-5 text-[#10B981]" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#1E293B] mb-6">
              Warum bei uns bestellen?
            </h2>
            <Card className="p-6 space-y-4">
              <p className="text-[#334155]">
                Unser Onlineshop bietet Ihnen einen schnellen, rechtssicheren und komfortablen Weg, die nötigen Dokumente für Ihre Heizungsanlage zu erhalten. Wir garantieren:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[#334155]">
                  <Clock className="h-5 w-5 text-[#2563EB] mt-1" />
                  <span>Schnelle Lieferung: Ihre Plakette wird sofort nach Bestellung per E-Mail versendet.</span>
                </li>
                <li className="flex items-start gap-3 text-[#334155]">
                  <Shield className="h-5 w-5 text-[#2563EB] mt-1" />
                  <span>Datenschutz und Sicherheit: Unser Bestellprozess ist DSGVO-konform, und Ihre Daten werden sicher verarbeitet.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Order Process */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1E293B] mb-8">
            Wie funktioniert die Bestellung?
          </h2>
          <div className="space-y-4">
            {[
              "Formular ausfüllen: Geben Sie die Daten zu Ihrer Heizungsanlage in unser benutzerfreundliches Formular ein.",
              "Zahlung tätigen: Wählen Sie aus unseren sicheren Zahlungsmethoden und begleichen Sie den Betrag von nur 49,- EUR inkl. MwSt.",
              "Heizungsplakette erhalten: Nach erfolgreicher Zahlung erhalten Sie Ihre personalisierte Heizungsplakette als PDF per E-Mail.",
              "Download und Nutzung: Laden Sie die Plakette herunter und nutzen Sie sie zur Vorlage bei Inspektionen, Überprüfungen oder Verhandlungen."
            ].map((step, index) => (
              <Card key={index} className="p-6 flex items-start gap-4">
                <div className="w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-[#334155]">{step}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#334155]">
              © 2024 Heizungsplakette.de | Alle Rechte vorbehalten.
            </div>
            <nav className="flex gap-8">
              <Link href="/impressum" className="text-sm text-[#334155] hover:text-[#2563EB]">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-sm text-[#334155] hover:text-[#2563EB]">
                Datenschutzerklärung
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:hidden">
        <Button asChild className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
          <Link href="/beantragen">
            Jetzt bestellen – 49€
          </Link>
        </Button>
      </div>
    </div>
  )
}