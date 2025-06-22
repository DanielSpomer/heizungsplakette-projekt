"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  Shield,
  Clock,
  FileText,
  CheckCircle,
  Users,
  Award,
  Menu,
  X,
  Camera,
  Building,
  Scale,
  FileCheck,
  AlertCircle,
  Lightbulb,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% -20%, black 70%, transparent 110%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-60" />
    </div>
  )
}

export default function HeizungsplaketteHomepage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const updateScrolled = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", updateScrolled)
    return () => window.removeEventListener("scroll", updateScrolled)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false)
    }
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isMobileMenuOpen])

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* Header - Mobile Optimized */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/heizungsplakette-logo.png"
                alt="Heizungsplakette Logo"
                width={160}
                height={32}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <Link
                href="#was-ist"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                Was ist das?
              </Link>
              <Link href="#warum" className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base">
                Warum wichtig?
              </Link>
              <Link
                href="#process"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                So funktioniert's
              </Link>
              <Link href="#trust" className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base">
                Vertrauen
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }}
              aria-label="Menu öffnen"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="py-4 space-y-2">
                  <Link
                    href="#was-ist"
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Was ist das?
                  </Link>
                  <Link
                    href="#warum"
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Warum wichtig?
                  </Link>
                  <Link
                    href="#process"
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    So funktioniert's
                  </Link>
                  <Link
                    href="#trust"
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Vertrauen
                  </Link>
                  <div className="px-4 pt-2">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3"
                      onClick={() => {
                        router.push("/heizungsplakette")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Jetzt bestellen
                    </Button>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <SquaresBackground />
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              className="text-center lg:text-left order-2 lg:order-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="inline-block px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ✨ Ihre Heizung braucht eine Plakette
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-gray-900 block">Heizungsplakette</span>
                <span className="text-blue-600 block">einfach gemacht</span>
              </motion.h1>

              {/* Fragen aus der PDF */}
              <motion.div
                className="mb-6 sm:mb-8 space-y-2 text-base sm:text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="flex items-center justify-center lg:justify-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Muss die Heizung raus?
                </p>
                <p className="flex items-center justify-center lg:justify-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Wie lange darf diese Heizung weiterbetrieben werden?
                </p>
                <p className="flex items-center justify-center lg:justify-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Was sagt das Heizungsgesetz zu meiner Heizung?
                </p>
              </motion.div>

              <motion.p
                className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Die Heizungsplakette ist die Lösung für alle Fragen zum Weiterbetrieb Ihrer Heizung.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
                  onClick={() => router.push("/heizungsplakette")}
                >
                  Jetzt Plakette beantragen
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium border-2 hover:bg-gray-50 w-full sm:w-auto"
                  onClick={() => document.getElementById("was-ist")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Mehr erfahren
                </Button>
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span>Rechtssicher</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span>48h Lieferung</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span>Nur 49€</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative order-1 lg:order-2 mb-8 lg:mb-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-md mx-auto lg:max-w-none">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 sm:h-4 bg-blue-200 rounded w-1/2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
                      <div className="flex items-center gap-2 text-blue-700 font-medium">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Heizungsplakette erstellt</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Was ist die Heizungsplakette Section */}
      <section id="was-ist" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Was ist die Heizungsplakette?
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-blue-600 mx-auto mb-6 sm:mb-8"></div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-lg sm:text-xl">
                Zu den schwierigen Fragen bei der Anwendung des Heizungsgesetzes gehört, ob eine Heizung in einem
                Einfamilienhaus oder einer Eigentumswohnung weiterbetrieben werden darf, ob die Heizung zwingend
                ausgetauscht werden muss oder ob gar keine Anpassungen erforderlich sind.
              </p>
              <p>
                Viele Diskussionen um den Weiterbetrieb von Heizungen haben ihren Ursprung in der Unsicherheit. Bei der
                Neugestaltung des Gesetzes sind viele dieser Fragen zwar inzwischen beantwortet; dennoch bleibt die
                Unsicherheit über die Frage, wie lange die vorhandene Heizung tatsächlich weiter betrieben werden darf.
              </p>
              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
                <p className="font-semibold text-blue-900 mb-2">Die Lösung:</p>
                <p className="text-blue-800">
                  Die Heizungsplakette klärt alle Fragen rund um den Weiterbetrieb Ihrer Heizung für
                  Immobilieneigentümer, Kaufinteressenten, Immobilienmakler, finanzierende Banken und alle weiteren
                  interessierten Parteien.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Clock,
                  title: "Betriebsdauer",
                  description: "Wie lange darf die Heizung noch betrieben werden?",
                },
                {
                  icon: AlertCircle,
                  title: "Austauschpflicht",
                  description: "Muss die Heizung ausgetauscht werden?",
                },
               /* {
                  icon: Calendar,
                  title: "Übergangsfrist",
                  description: "Wie lange ist die Übergangsfrist für den Austausch?",
                },*/
                {
                  icon: FileCheck,
                  title: "Endgültiges Datum",
                  description: "Ab wann darf die Heizung nicht mehr betrieben werden?",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Warum eine Heizungsplakette Section */}
      <section id="warum" className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Warum eine Heizungsplakette?
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <div className="space-y-12 sm:space-y-16">
            {/* Wichtig beim Immobilienverkauf */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="order-2 lg:order-1">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                  Wichtige Unterlage beim Verkauf der Immobilie
                </h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Die Heizungsplakette sagt aus, wie lange eine Heizung in einer Immobilie weiterbetrieben werden darf
                    und ist daher eine wesentliche Ergänzung für Verkaufsunterlagen von Immobilien.
                  </p>
                  <p>
                    Eigentümer und Kaufinteressenten, aber auch Finanzierungsberater und Banken sind oft nicht sicher,
                    wie die Regelungen des GEG (Gebäudeenergiegesetz) auf die vorhandene Heizung anzuwenden sind.
                  </p>
                  <p>
                    Nur mit der Heizungsplakette erfolgt ein Abgleich der bestehenden gesetzlichen Regelungen aus dem
                    Heizungsgesetz mit der vorhandenen Heizung und die Bestätigung, wie lange die Heizung nach den
                    aktuell geltenden Vorschriften weiterbetrieben werden darf.
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 font-medium">Verkaufsunterlagen</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 font-medium">Finanzierungsberatung</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 font-medium">Rechtssicherheit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-800 font-medium">Klarheit für alle Beteiligten</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Heizungsplakette vs Energieausweis */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                  Heizungsplakette zusätzlich zum Energieausweis?
                </h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Im Energieausweis werden die energetischen Anforderungen des Gebäudes erläutert. Im Energieausweis
                    werden keine konkreten Angaben zur Heizung und zur Frage der Dauer der Weiternutzung der Heizung
                    beantwortet.
                  </p>
                  <p>
                    Deshalb schließt die Heizungsplakette eine wichtige Lücke bei den energetischen Unterlagen für eine
                    Immobilie. Neben dem Energieausweis sollte deswegen bei jedem Verkauf einer Immobilie immer eine
                    Heizungsplakette vorhanden sein.
                  </p>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-medium">
                    💡 Die Heizungsplakette ergänzt den Energieausweis perfekt und schließt wichtige Informationslücken.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-blue-900 mb-2">Energieausweis</h4>
                  <p className="text-sm text-blue-700">Energetische Anforderungen des Gebäudes</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-green-900 mb-2">Heizungsplakette</h4>
                  <p className="text-sm text-green-700">Konkrete Angaben zur Heizung und Betriebsdauer</p>
                </div>
              </div>
            </motion.div>

            {/* Zukunftssicherheit */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 sm:p-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                  Muss die Heizungsplakette noch sein, wenn das GEG abgeschafft wird?
                </h3>
              </div>
              <div className="max-w-4xl mx-auto space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  <strong>Das GEG wird nicht abgeschafft und kann auch gar nicht abgeschafft werden.</strong>
                </p>
                <p>
                  Es ist damit zu rechnen, dass das GEG im Jahr 2026 an die Anforderungen aus der EU-Gebäuderichtlinie
                  angepasst wird und es deshalb eine Neufassung des Gesetzes geben wird. In dieser Neufassung muss die
                  jetzt schon beschlossene Vorgabe zum Ende fossiler Energieträger im Jahr 2045 auch in nationales Recht
                  umgesetzt werden.
                </p>
                <div className="bg-white rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Wichtiger Hinweis:</p>
                      <p className="text-gray-700">
                        Bislang spricht das Heizungsgesetz davon, dass fossile Energieträger bis Ende 2044 eingesetzt
                        werden dürfen. Die neue EU-Gebäuderichtlinie schreibt jedoch vor, dass es ein absolutes
                        Betriebsverbot für alle Öl- und Gasheizungen (fossile Energieträger) ab 2039 gibt.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-medium text-blue-900">
                  Die Diskussion um den Austausch bestehender Heizungen wird es demnach weiterhin geben. Damit wird auch
                  die Heizungsplakette als „Ausweis" wie lange eine bestehende Heizung noch weiterbetrieben werden darf,
                  wichtig wie nie.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section - Mobile Optimized */}
      <section id="process" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              So einfach geht's
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              In nur 4 Schritten zu Ihrer rechtssicheren Heizungsplakette
            </p>
            <div className="w-16 sm:w-24 h-1 bg-blue-600 mx-auto mt-6 sm:mt-8"></div>
          </motion.div>

          <div className="space-y-12 sm:space-y-16">
            {[
              {
                number: "01",
                title: "Ihre Daten eingeben",
                description:
                  "Erzählen Sie uns von Ihrer Heizung. Unser Formular führt Sie Schritt für Schritt durch alle wichtigen Informationen.",
                icon: FileText,
                color: "blue",
              },
              {
                number: "02",
                title: "Fotos hochladen",
                description:
                  "Laden Sie Fotos der Heizung, des Typenschildes, des Heizungslabels und der Bedienungsanleitung hoch. Diese werden in Ihre Heizungsplakette integriert.",
                icon: Camera,
                color: "green",
              },
              {
                number: "03",
                title: "Expertenprüfung",
                description:
                  "Unsere Bausachverständigen und Rechtsanwälte überprüfen Ihre Angaben nach den neuesten gesetzlichen Bestimmungen. Das dauert maximal 48 Stunden.",
                icon: Users,
                color: "purple",
              },
              {
                number: "04",
                title: "Plakette erhalten",
                description:
                  "Sie erhalten Ihre digitale Heizungsplakette per E-Mail mit allen wichtigen Unterlagen an einer Stelle zusammengefasst. Rechtssicher und offiziell anerkannt.",
                icon: Award,
                color: "orange",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Mobile: Number first, then content */}
                <div className="flex flex-col lg:hidden items-center text-center w-full">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white mb-6 ${
                      step.color === "blue"
                        ? "bg-blue-500"
                        : step.color === "green"
                          ? "bg-green-500"
                          : step.color === "purple"
                            ? "bg-purple-500"
                            : "bg-orange-500"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 w-full max-w-md">
                    <div className="flex flex-col items-center gap-4 mb-4 sm:mb-6">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                          step.color === "blue"
                            ? "bg-blue-100"
                            : step.color === "green"
                              ? "bg-green-100"
                              : step.color === "purple"
                                ? "bg-purple-100"
                                : "bg-orange-100"
                        }`}
                      >
                        <step.icon
                          className={`h-6 w-6 sm:h-8 sm:w-8 ${
                            step.color === "blue"
                              ? "text-blue-600"
                              : step.color === "green"
                                ? "text-green-600"
                                : step.color === "purple"
                                  ? "text-purple-600"
                                  : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-gray-500 block">
                          Schritt {step.number}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Desktop: Alternating layout */}
                <div className={`hidden lg:flex flex-1 ${index % 2 === 1 ? "order-2" : ""}`}>
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 w-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          step.color === "blue"
                            ? "bg-blue-100"
                            : step.color === "green"
                              ? "bg-green-100"
                              : step.color === "purple"
                                ? "bg-purple-100"
                                : "bg-orange-100"
                        }`}
                      >
                        <step.icon
                          className={`h-8 w-8 ${
                            step.color === "blue"
                              ? "text-blue-600"
                              : step.color === "green"
                                ? "text-green-600"
                                : step.color === "purple"
                                  ? "text-purple-600"
                                  : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Schritt {step.number}</span>
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>

                <div className={`hidden lg:flex flex-shrink-0 ${index % 2 === 1 ? "order-1" : ""}`}>
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white ${
                      step.color === "blue"
                        ? "bg-blue-500"
                        : step.color === "green"
                          ? "bg-green-500"
                          : step.color === "purple"
                            ? "bg-purple-500"
                            : "bg-orange-500"
                    }`}
                  >
                    {step.number}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Foto-Upload Details */}
          <motion.div
            className="mt-16 sm:mt-20 bg-white rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                Upload von Fotos in der Heizungsplakette
              </h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Bei der Bestellung der Heizungsplakette gibt es die Möglichkeit, verschiedene Fotos bereitzustellen und
                in das Dokument „Heizungsplakette" zu integrieren. Auch dies dient der Vollständigkeit der
                Verkaufsunterlagen für eine Immobilie.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Building, title: "Foto der Heizung", description: "Gesamtansicht Ihrer Heizungsanlage" },
                { icon: FileText, title: "Foto des Typenschildes", description: "Technische Daten der Heizung" },
                { icon: Award, title: "Foto des Heizungslabels", description: "Energiekennklasse der Heizung" },
                { icon: FileCheck, title: "Foto der Bedienungsanleitung", description: "Erste Seite der Anleitung" },
                { icon: Shield, title: "Foto des Energieausweises", description: "Energetische Bewertung" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 text-center">
                <strong>Vollständigkeit:</strong> Mit dem Einfügen dieser Bilder in das spätere Dokument der
                Heizungsplakette sind alle wichtigen Angaben für Eigentümer, Kaufinteressenten, Finanzierungsberater und
                die finanzierende Bank an einer Stelle zusammengefasst.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expertenprüfung und Sicherheit Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Expertenprüfung und Sicherheit
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Scale className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                Ausgestellt vom Bausachverständigen und anwaltliche Prüfung
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Die Angaben in der Heizungsplakette werden von einem Bausachverständigen und einem Rechtsanwalt
                  überprüft, so dass sowohl eine technische als auch eine rechtliche Prüfung zur Einhaltung der Vorgaben
                  aus dem Gebäudeenergiegesetz, das auch als Heizungsgesetz bekannt ist, erfolgt.
                </p>
                <p>
                  Die Aussteller der Heizungsplakette prüfen die Angaben zur Heizung anhand der Fotografie des
                  Typenschildes, anhand des Baujahrs der Heizung, anhand der vorhandenen Technologie der Heizung, die
                  zum Einsatz kommt.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold text-green-900 mb-2">Bausachverständiger</h4>
                <p className="text-sm text-green-700">Technische Prüfung der Heizungsangaben</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <Scale className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold text-blue-900 mb-2">Rechtsanwalt</h4>
                <p className="text-sm text-blue-700">Rechtliche Prüfung nach GEG-Vorgaben</p>
              </div>
            </motion.div>
          </div>

          {/* Haftung */}
          <motion.div
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 sm:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                Keine zusätzliche Haftung aus der Heizungsplakette
              </h3>
            </div>
            <div className="max-w-4xl mx-auto space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Immobilienmakler, die für Ihre Kunden die Heizungsplakette bestellen, können normalerweise nicht in
                Haftung genommen werden, so dass kein Risiko bei der Nutzung dieser Verkaufsunterlage besteht.
              </p>
              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Wichtiger Hinweis:</p>
                    <p className="text-gray-700">
                      Lediglich vorsätzliche Falschangaben bei der Bestellung der Heizungsplakette können zu einer
                      möglichen haftungsrechtlichen Relevanz führen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section - Mobile Optimized */}
      <section id="trust" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Darauf können Sie vertrauen
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: Shield,
                title: "100% Rechtssicher",
                description:
                  "Unsere Heizungsplaketten entsprechen exakt den gesetzlichen Vorgaben des GEG (Gebäudeenergiegesetz).",
                stats: "Nach aktuellen Bestimmungen",
              },
              {
                icon: Clock,
                title: "Blitzschnell",
                description:
                  "Maximal 48 Stunden von der Bestellung bis zur fertigen Plakette in Ihrem E-Mail-Postfach.",
                stats: "Durchschnitt: 24 Stunden",
              },
              {
                icon: Award,
                title: "Offiziell anerkannt",
                description: "Unsere Plaketten werden von Behörden, Schornsteinfegern und Energieberatern anerkannt.",
                stats: "Bundesweit gültig",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto sm:mx-0">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 text-center sm:text-left">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base text-center sm:text-left">
                  {feature.description}
                </p>
                <div className="text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mx-auto sm:mx-0">
                  {feature.stats}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Energieausweis Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Haben Sie einen Energieausweis?
            </h2>
            <p className="text-lg sm:text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
              Wenn Sie bei uns die Heizungsplakette bestellen, aber noch keinen Energieausweis haben, können Sie gerne
              über unseren Partner einen Energieausweis beantragen. Denken Sie daran, dass ein Energieausweis bei jedem
              Verkauf einer Immobilie vorliegen muss und deswegen eine Pflichtunterlage ist.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 rounded-full text-lg font-medium border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all"
            >
              Energieausweis bestellen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <SquaresBackground />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Bereit für Ihre Heizungsplakette?
            </h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-12 text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Schließen Sie sich tausenden zufriedenen Kunden an und sichern Sie sich Ihre rechtskonforme
              Heizungsplakette – einfach, schnell und günstig.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 sm:mb-8">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto max-w-xs sm:max-w-none"
                onClick={() => router.push("/heizungsplakette")}
              >
                Jetzt für 49€ bestellen
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                <span>Keine versteckten Kosten</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                <span>Geld-zurück-Garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                <span>Sofort verfügbar</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="py-8 sm:py-12 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Image
                src="/images/heizungsplakette-logo.png"
                alt="Heizungsplakette Logo"
                width={120}
                height={24}
                className="h-6 sm:h-8 w-auto"
              />
              <span className="text-xs sm:text-sm text-gray-500">© 2025 Heizungsplakette.de</span>
            </div>
            <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs sm:text-sm text-center">
              <Link href="/impressum" className="text-gray-500 hover:text-gray-900 transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutzerklaerung" className="text-gray-500 hover:text-gray-900 transition-colors">
                Datenschutzerklärung
              </Link>
              <Link
                href="mailto:service@heizungsplakette.de"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Kontakt
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
