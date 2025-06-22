"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, Clock, FileText, CheckCircle, Users, Award, Heart, Menu, X } from "lucide-react"
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
              <Link href="#story" className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base">
                Unsere Mission
              </Link>
              <Link
                href="#process"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                So funktioniert&apos;s
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
                    href="#story"
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Unsere Geschichte
                  </Link>
                  <Link
                    href="#process"
                    className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    So funktioniert&apos;s
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

              <motion.p
                className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Wir verstehen, dass das neue Heizungsgesetz verwirrend sein kann. Deshalb haben wir einen einfachen Weg
                geschaffen, wie Sie Ihre Heizungsplakette schnell und rechtssicher erhalten.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                  onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Mehr erfahren
                </Button>
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
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

      {/* Story Section - Mobile Optimized */}
      <section id="story" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Warum gibt es uns?
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-blue-600 mx-auto mb-6 sm:mb-8"></div>
          </motion.div>

          <motion.div
            className="text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-center sm:text-left">
              Als das neue Heizungsgesetz in Kraft trat, standen viele Hausbesitzer vor einem Problem:
              <strong className="text-gray-900"> Wie bekomme ich eine rechtssichere Heizungsplakette?</strong>
            </p>

            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-center sm:text-left">
              Die Bürokratie war kompliziert, die Wartezeiten lang und die Unsicherheit groß. Genau hier wollten wir
              helfen. Unser Team aus Experten für Heizungstechnik und Rechtsberatern hat einen einfachen, digitalen Weg
              entwickelt.
            </p>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 my-8 sm:my-12">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Unser Versprechen</h3>
                  <p className="text-gray-600 mb-0 text-sm sm:text-base">
                    Wir machen die Heizungsplakette so einfach wie möglich – ohne Papierkram, ohne lange Wartezeiten,
                    ohne Stress. Einfach online, schnell und rechtssicher.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section - Mobile Optimized */}
      <section id="process" className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              So einfach geht&apos;s
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
                title: "Sicher bezahlen",
                description:
                  "Nur 49€ für Ihre Heizungsplakette. Bezahlen Sie bequem und sicher online – ohne versteckte Kosten.",
                icon: Shield,
                color: "green",
              },
              {
                number: "03",
                title: "Wir prüfen alles",
                description:
                  "Unsere Experten überprüfen Ihre Angaben nach den neuesten gesetzlichen Bestimmungen. Das dauert maximal 48 Stunden.",
                icon: Users,
                color: "purple",
              },
              {
                number: "04",
                title: "Plakette erhalten",
                description:
                  "Sie erhalten Ihre digitale Heizungsplakette per E-Mail. Ausdrucken, fertig! Rechtssicher und offiziell anerkannt.",
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
