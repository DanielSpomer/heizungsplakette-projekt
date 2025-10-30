"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  Star,
  Zap,
  Calendar,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

function ModernBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-indigo-600/20 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59,130,246,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59,130,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% -20%, black 70%, transparent 110%)",
        }}
      />
    </div>
  )
}

function GlassmorphismCard({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`backdrop-blur-xl bg-white/70 border border-white/20 shadow-2xl ${className}`} {...props}>
      {children}
    </div>
  )
}

export default function HeizungsplaketteHomepage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [announceMessage, setAnnounceMessage] = useState("")
  const [accessibilityMode, setAccessibilityMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const updateScrolled = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", updateScrolled)
    return () => window.removeEventListener("scroll", updateScrolled)
  }, [])

  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false)
    }
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
    }
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isMobileMenuOpen])

  // Load accessibility preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem("accessibility-mode")
    if (savedPreference === "true") {
      setAccessibilityMode(true)
    }
  }, [])

  // Save accessibility preference to localStorage
  useEffect(() => {
    localStorage.setItem("accessibility-mode", accessibilityMode.toString())
  }, [accessibilityMode])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const scrollToSection = (sectionId: string) => {
    // Erst das mobile Menü schließen
    setIsMobileMenuOpen(false)

    // Ankündigung für Screenreader nur im Accessibility-Modus
    if (accessibilityMode) {
      setAnnounceMessage(`Navigiere zu Abschnitt ${sectionId}`)
    }

    // Kurz warten, damit das Menü-Schließen abgeschlossen ist
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        // Dynamische Header-Höhe basierend auf Bildschirmgröße
        const headerHeight = window.innerWidth < 1024 ? 60 : 80
        const elementPosition = element.offsetTop - headerHeight

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        })

        // Fokus auf das Ziel-Element setzen nur im Accessibility-Modus
        if (accessibilityMode) {
          element.focus({ preventScroll: true })
          // Ankündigung zurücksetzen
          setTimeout(() => setAnnounceMessage(""), 1000)
        }
      }
    }, 100)
  }

  const handleContactMail = () => {
    window.location.href = "mailto:service@heizungsplakette.de?subject=Anfrage - Heizungsplakette"
    setIsContactOpen(false)
    if (accessibilityMode) {
      setAnnounceMessage("E-Mail-Programm wird geöffnet")
      setTimeout(() => setAnnounceMessage(""), 2000)
    }
  }

  const handleContactPhone = () => {
    window.location.href = "tel:+4930206307940"
    setIsContactOpen(false)
    if (accessibilityMode) {
      setAnnounceMessage("Telefon-App wird geöffnet")
      setTimeout(() => setAnnounceMessage(""), 2000)
    }
  }

  const toggleAccessibility = () => {
    setAccessibilityMode(!accessibilityMode)
    if (!accessibilityMode) {
      setAnnounceMessage("Barrierefreiheit aktiviert")
    } else {
      setAnnounceMessage("Barrierefreiheit deaktiviert")
    }
    setTimeout(() => setAnnounceMessage(""), 2000)
  }

  // Dynamische CSS-Klassen basierend auf Accessibility-Modus
  const getButtonClasses = (baseClasses: string) => {
    if (accessibilityMode) {
      return baseClasses
        .replace(/from-blue-600/g, "from-blue-700")
        .replace(/to-indigo-600/g, "to-indigo-700")
        .replace(/hover:from-blue-700/g, "hover:from-blue-800")
        .replace(/hover:to-indigo-700/g, "hover:to-indigo-800")
    }
    return baseClasses
  }

  const getTextClasses = (baseClasses: string) => {
    if (accessibilityMode) {
      return baseClasses
        .replace(/text-blue-600/g, "text-blue-700")
        .replace(/hover:text-blue-600/g, "hover:text-blue-700")
        .replace(/text-gray-600/g, "text-gray-700")
        .replace(/text-gray-500/g, "text-gray-600")
    }
    return baseClasses
  }

  return (
    <div
      className="min-h-screen bg-white selection:bg-blue-100 overflow-x-hidden"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        html {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        /* Accessibility-spezifische Stile nur wenn aktiviert */
        ${
          accessibilityMode
            ? `
        *:focus {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
        }
        
        button:focus,
        a:focus,
        [role="button"]:focus {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .text-blue-600 {
          color: #1d4ed8;
        }
        
        .hover\\:text-blue-600:hover {
          color: #1e40af;
        }
        
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #1d4ed8;
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 1000;
        }
        
        .skip-link:focus {
          top: 6px;
        }
        `
            : ""
        }
        
        /* Reduzierte Bewegung für Nutzer mit Präferenz */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Skip-Link nur im Accessibility-Modus */}
      {accessibilityMode && (
        <a href="#main-content" className="skip-link">
          Zum Hauptinhalt springen
        </a>
      )}

      {/* Live-Region nur im Accessibility-Modus */}
      {accessibilityMode && (
        <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
          {announceMessage}
        </div>
      )}

      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? "backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg" : "bg-transparent"
        }`}
        {...(accessibilityMode && { role: "banner" })}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <Link
              href="/"
              className="flex-shrink-0"
              {...(accessibilityMode && { "aria-label": "Zur Startseite von Heizungsplakette.de" })}
            >
              <Image
                src="/images/heizungsplakette-logo.png"
                alt={
                  accessibilityMode
                    ? "Heizungsplakette.de - Logo für rechtssichere Heizungsplaketten"
                    : "Heizungsplakette Logo"
                }
                width={180}
                height={36}
                className="h-7 sm:h-8 lg:h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex space-x-6 xl:space-x-8"
              {...(accessibilityMode && { role: "navigation", "aria-label": "Hauptnavigation" })}
            >
              {[
                { label: "Was ist das?", id: "was-ist" },
                { label: "Warum wichtig?", id: "warum" },
                { label: "So funktioniert's", id: "process" },
                { label: "Vertrauen", id: "trust" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={getTextClasses(
                    "text-gray-600 hover:text-blue-600 transition-all duration-300 text-sm xl:text-base font-medium hover:scale-105 focus:scale-105",
                  )}
                  {...(accessibilityMode && { "aria-label": `Navigiere zu Abschnitt: ${item.label}` })}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Button Desktop */}
            <div className="hidden md:block">
              <Button
                onClick={() => router.push("/heizungsplakette")}
                className={getButtonClasses(
                  "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full text-sm lg:text-base font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl focus:scale-105",
                )}
                {...(accessibilityMode && { "aria-label": "Heizungsplakette jetzt bestellen - 49 Euro" })}
              >
                Jetzt bestellen
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsMobileMenuOpen(!isMobileMenuOpen)
                if (accessibilityMode) {
                  setAnnounceMessage(isMobileMenuOpen ? "Menü geschlossen" : "Menü geöffnet")
                }
              }}
              {...(accessibilityMode && {
                "aria-label": isMobileMenuOpen ? "Menü schließen" : "Menü öffnen",
                "aria-expanded": isMobileMenuOpen,
                "aria-controls": "mobile-menu",
              })}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                {...(accessibilityMode && { id: "mobile-menu" })}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-white/20 backdrop-blur-xl bg-white/90"
                onClick={(e) => e.stopPropagation()}
                {...(accessibilityMode && { role: "navigation", "aria-label": "Mobile Navigation" })}
              >
                <nav className="py-4 space-y-1">
                  {[
                    { label: "Was ist das?", id: "was-ist" },
                    { label: "Warum wichtig?", id: "warum" },
                    { label: "So funktioniert's", id: "process" },
                    { label: "Vertrauen", id: "trust" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={getTextClasses(
                        "block w-full text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors font-medium focus:bg-blue-50/50",
                      )}
                      {...(accessibilityMode && { "aria-label": `Navigiere zu Abschnitt: ${item.label}` })}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="px-4 pt-2">
                    <Button
                      className={getButtonClasses(
                        "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full py-3 font-medium focus:scale-105",
                      )}
                      onClick={() => {
                        router.push("/heizungsplakette")
                        setIsMobileMenuOpen(false)
                        if (accessibilityMode) {
                          setAnnounceMessage("Weiterleitung zur Bestellseite")
                        }
                      }}
                      {...(accessibilityMode && { "aria-label": "Heizungsplakette jetzt bestellen - 49 Euro" })}
                    >
                      Jetzt bestellen
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" {...(accessibilityMode && { role: "main" })}>
        {/* Hero Section */}
        <section
          className="relative flex items-center justify-center min-h-screen px-3 sm:px-4 lg:px-6 pt-14 sm:pt-16 lg:pt-20"
          {...(accessibilityMode && { "aria-labelledby": "hero-heading" })}
        >
          <ModernBackground />
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
              <motion.div
                className="text-center xl:text-left order-2 xl:order-1 px-2 sm:px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 ${getTextClasses("text-blue-600")} rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-200/50 backdrop-blur-sm`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  {...(accessibilityMode && { role: "banner", "aria-label": "Wichtiger Hinweis" })}
                >
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  Ihre Heizung braucht eine Plakette
                </motion.div>

                <motion.h1
                  id="hero-heading"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-gray-900 block mb-2 sm:mb-3">Heizungsplakette</span>
                  <span
                    className={`${getTextClasses("text-blue-600")} block mb-2 sm:mb-3 inline-block whitespace-nowrap`}
                  >
                    einfach gemacht
                  </span>
                </motion.h1>

                {/* Fragen aus der PDF */}
                <motion.div
                  className={`mb-4 sm:mb-6 space-y-2 text-sm sm:text-base lg:text-lg ${getTextClasses("text-gray-600")}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  {...(accessibilityMode && { role: "list", "aria-label": "Häufige Fragen zur Heizung" })}
                >
                  {[
                    "Muss die Heizung raus?",
                    "Wie lange darf diese Heizung weiterbetrieben werden?",
                    "Was sagt das Heizungsgesetz zu meiner Heizung?",
                  ].map((question, index) => (
                    <motion.p
                      key={index}
                      className="flex items-center justify-center xl:justify-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      {...(accessibilityMode && { role: "listitem" })}
                    >
                      <span className={`${getTextClasses("text-blue-600")} mr-2 text-lg`} aria-hidden="true">
                        •
                      </span>
                      {question}
                    </motion.p>
                  ))}
                </motion.div>

                <motion.p
                  className={`text-base sm:text-lg lg:text-xl ${getTextClasses("text-gray-600")} mb-6 sm:mb-8 leading-relaxed font-medium max-w-2xl mx-auto xl:mx-0`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Die Heizungsplakette ist die Lösung für alle Fragen zum Weiterbetrieb Ihrer Heizung.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center xl:justify-start mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    size="lg"
                    className={getButtonClasses(
                      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl focus:scale-105",
                    )}
                    onClick={() => {
                      router.push("/heizungsplakette")
                      if (accessibilityMode) {
                        setAnnounceMessage("Weiterleitung zur Bestellseite")
                      }
                    }}
                    {...(accessibilityMode && { "aria-label": "Heizungsplakette jetzt beantragen - 49 Euro" })}
                  >
                    Jetzt Plakette beantragen
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium border-2 hover:bg-white/50 backdrop-blur-sm focus:bg-white/50"
                    onClick={() => scrollToSection("was-ist")}
                    {...(accessibilityMode && { "aria-label": "Mehr über Heizungsplaketten erfahren" })}
                  >
                    Mehr erfahren
                  </Button>
                </motion.div>

                <motion.div
                  className={`flex flex-wrap items-center justify-center xl:justify-start gap-4 sm:gap-6 text-xs sm:text-sm ${getTextClasses("text-gray-500")}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  {...(accessibilityMode && { role: "list", "aria-label": "Vorteile der Heizungsplakette" })}
                >
                  {[
                    { icon: CheckCircle, text: "Rechtssicher" },
                    { icon: Clock, text: "48h Lieferung" },
                    { icon: Star, text: "Nur 49€" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      {...(accessibilityMode && { role: "listitem" })}
                    >
                      <item.icon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" aria-hidden="true" />
                      <span className="font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                className="relative order-1 xl:order-2 mb-8 xl:mb-0 px-4 sm:px-8 xl:px-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                {...(accessibilityMode && { "aria-label": "Visualisierung des Heizungsplakette-Prozesses" })}
              >
                <div className="relative max-w-md mx-auto xl:max-w-lg">
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    aria-hidden="true"
                  >
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                  </motion.div>

                  <motion.div
                    className="absolute -top-1 sm:-top-2 -right-3 sm:-right-6 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                    aria-hidden="true"
                  >
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-2 sm:-bottom-4 -left-3 sm:-left-6 w-11 h-11 sm:w-14 sm:h-14 lg:w-18 lg:h-18 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                    aria-hidden="true"
                  >
                    <Clock className="h-6 w-6 sm:h-7 sm:w-7 lg:h-9 lg:w-9 text-white" />
                  </motion.div>

                  {/* Main Card */}
                  <GlassmorphismCard className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"
                          aria-hidden="true"
                        ></div>
                        <span className={`text-xs sm:text-sm font-medium ${getTextClasses("text-gray-600")}`}>
                          Heizungsplakette Status
                        </span>
                      </div>

                      <div
                        className="space-y-3 sm:space-y-4"
                        {...(accessibilityMode && { role: "list", "aria-label": "Prüfungsschritte" })}
                      >
                        {[
                          { label: "Rechtsprüfung", color: "blue" },
                          { label: "Technische Prüfung", color: "green" },
                          { label: "Dokumentation", color: "orange" },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className={`flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r ${
                              item.color === "blue"
                                ? "from-blue-50 to-blue-100"
                                : item.color === "green"
                                  ? "from-green-50 to-green-100"
                                  : "from-orange-50 to-orange-100"
                            } rounded-xl backdrop-blur-sm`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + index * 0.2 }}
                            {...(accessibilityMode && { role: "listitem" })}
                          >
                            <span
                              className={`text-xs sm:text-sm font-medium ${
                                item.color === "blue"
                                  ? "text-blue-900"
                                  : item.color === "green"
                                    ? "text-green-900"
                                    : "text-orange-900"
                              }`}
                            >
                              {item.label}
                            </span>
                            <CheckCircle
                              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                item.color === "blue"
                                  ? "text-blue-600"
                                  : item.color === "green"
                                    ? "text-green-600"
                                    : "text-orange-600"
                              }`}
                              {...(accessibilityMode && { "aria-label": "Abgeschlossen" })}
                            />
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        className={`bg-gradient-to-r ${getButtonClasses("from-blue-600 to-indigo-600")} rounded-xl p-3 sm:p-4 text-white`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.6 }}
                        {...(accessibilityMode && { role: "status", "aria-label": "Ergebnis der Heizungsplakette" })}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                          <span className="font-semibold text-sm sm:text-base">Plakette erstellt</span>
                        </div>
                        <p className="text-xs sm:text-sm opacity-90">
                          Ihre Heizung darf bis 2044 weiterbetrieben werden
                        </p>
                      </motion.div>
                    </div>
                  </GlassmorphismCard>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Was ist die Heizungsplakette Section */}
        <section
          id="was-ist"
          className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30"
          {...(accessibilityMode && { "aria-labelledby": "was-ist-heading", tabIndex: -1 })}
        >
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              className="text-center mb-8 sm:mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                id="was-ist-heading"
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 text-gray-900"
              >
                Was ist die Heizungsplakette?
              </h2>
              <div
                className={`w-12 sm:w-16 lg:w-24 h-1 bg-gradient-to-r ${getButtonClasses("from-blue-600 to-indigo-600")} mx-auto mb-4 sm:mb-6 lg:mb-8`}
                aria-hidden="true"
              ></div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className={`space-y-4 sm:space-y-6 ${getTextClasses("text-gray-600")} leading-relaxed`}>
                <p className="text-base sm:text-lg lg:text-xl">
                  Zu den schwierigen Fragen bei der Anwendung des Heizungsgesetzes gehört, ob eine Heizung in einem
                  Einfamilienhaus oder einer Eigentumswohnung weiterbetrieben werden darf, ob die Heizung zwingend
                  ausgetauscht werden muss oder ob gar keine Anpassungen erforderlich sind.
                </p>
                <p className="text-sm sm:text-base lg:text-lg">
                  Viele Diskussionen um den Weiterbetrieb von Heizungen haben ihren Ursprung in der Unsicherheit. Bei
                  der Neugestaltung des Gesetzes sind viele dieser Fragen zwar inzwischen beantwortet; dennoch bleibt
                  die Unsicherheit über die Frage, wie lange die vorhandene Heizung tatsächlich weiter betrieben werden
                  darf.
                </p>
                <GlassmorphismCard
                  className={`rounded-xl p-4 sm:p-6 border-l-4 ${accessibilityMode ? "border-blue-700" : "border-blue-600"}`}
                >
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Die Lösung:</h3>
                  <p className="text-blue-800 text-sm sm:text-base">
                    Die Heizungsplakette klärt alle Fragen rund um den Weiterbetrieb Ihrer Heizung für
                    Immobilieneigentümer, Kaufinteressenten, Immobilienmakler, finanzierende Banken und alle weiteren
                    interessierten Parteien.
                  </p>
                </GlassmorphismCard>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                {...(accessibilityMode && { role: "list", "aria-label": "Wichtige Fragen zur Heizung" })}
              >
                {[
                  {
                    icon: Clock,
                    title: "Betriebsdauer",
                    description: "Wie lange darf die Heizung noch betrieben werden?",
                    gradient: "from-blue-500 to-blue-600",
                  },
                  {
                    icon: AlertCircle,
                    title: "Austauschpflicht",
                    description: "Muss die Heizung ausgetauscht werden?",
                    gradient: "from-orange-500 to-orange-600",
                  },
                  {
                    icon: Calendar,
                    title: "Übergangsfrist",
                    description: "Wie lange ist die Übergangsfrist für den Austausch?",
                    gradient: "from-green-500 to-green-600",
                  },
                  {
                    icon: FileCheck,
                    title: "Endgültiges Datum",
                    description: "Ab wann darf die Heizung nicht mehr betrieben werden?",
                    gradient: "from-purple-500 to-purple-600",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    {...(accessibilityMode && { role: "listitem" })}
                  >
                    <GlassmorphismCard className="rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}
                        aria-hidden="true"
                      >
                        <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{item.title}</h3>
                      <p className={`text-xs sm:text-sm ${getTextClasses("text-gray-600")} leading-relaxed`}>
                        {item.description}
                      </p>
                    </GlassmorphismCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Warum eine Heizungsplakette Section */}
        <section
          id="warum"
          className="py-12 sm:py-16 lg:py-20 xl:py-24"
          {...(accessibilityMode && { "aria-labelledby": "warum-heading", tabIndex: -1 })}
        >
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              className="text-center mb-8 sm:mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                id="warum-heading"
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 text-gray-900"
              >
                Warum eine Heizungsplakette?
              </h2>
              <div
                className={`w-12 sm:w-16 lg:w-24 h-1 bg-gradient-to-r ${getButtonClasses("from-blue-600 to-indigo-600")} mx-auto`}
                aria-hidden="true"
              ></div>
            </motion.div>

            <div className="space-y-4 sm:space-y-6">
              {/* Collapsible Sections */}
              {[
                {
                  id: "verkauf",
                  icon: Building,
                  title: "Wichtige Unterlage beim Verkauf der Immobilie",
                  gradient: "from-green-500 to-green-600",
                  content: (
                    <div
                      className={`space-y-4 ${getTextClasses("text-gray-600")} leading-relaxed text-sm sm:text-base`}
                    >
                      <p>
                        Die Heizungsplakette sagt aus, wie lange eine Heizung in einer Immobilie weiterbetrieben werden
                        darf und ist daher eine wesentliche Ergänzung für Verkaufsunterlagen von Immobilien.
                      </p>
                      <p>
                        Eigentümer und Kaufinteressenten, aber auch Finanzierungsberater und Banken sind oft nicht
                        sicher, wie die Regelungen des GEG (Gebäudeenergiegesetz) auf die vorhandene Heizung anzuwenden
                        sind.
                      </p>
                      <p>
                        Nur mit der Heizungsplakette erfolgt ein Abgleich der bestehenden gesetzlichen Regelungen aus
                        dem Heizungsgesetz mit der vorhandenen Heizung und die Bestätigung, wie lange die Heizung nach
                        den aktuell geltenden Vorschriften weiterbetrieben werden darf.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "energieausweis",
                  icon: FileText,
                  title: "Heizungsplakette zusätzlich zum Energieausweis?",
                  gradient: "from-orange-500 to-orange-600",
                  content: (
                    <div
                      className={`space-y-4 ${getTextClasses("text-gray-600")} leading-relaxed text-sm sm:text-base`}
                    >
                      <p>
                        Im Energieausweis werden die energetischen Anforderungen des Gebäudes erläutert. Im
                        Energieausweis werden keine konkreten Angaben zur Heizung und zur Frage der Dauer der
                        Weiternutzung der Heizung beantwortet.
                      </p>
                      <p>
                        Deshalb schließt die Heizungsplakette eine wichtige Lücke bei den energetischen Unterlagen für
                        eine Immobilie. Neben dem Energieausweis sollte deswegen bei jedem Verkauf einer Immobilie immer
                        eine Heizungsplakette vorhanden sein.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <GlassmorphismCard className="rounded-xl p-4 text-center">
                          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-3" aria-hidden="true" />
                          <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Energieausweis</h4>
                          <p className="text-xs sm:text-sm text-blue-800">Energetische Anforderungen des Gebäudes</p>
                        </GlassmorphismCard>
                        <GlassmorphismCard className="rounded-xl p-4 text-center">
                          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-3" aria-hidden="true" />
                          <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Heizungsplakette</h4>
                          <p className="text-xs sm:text-sm text-green-800">
                            Konkrete Angaben zur Heizung und Betriebsdauer
                          </p>
                        </GlassmorphismCard>
                      </div>
                    </div>
                  ),
                },
                {
                  id: "zukunft",
                  icon: Lightbulb,
                  title: "Muss die Heizungsplakette noch sein, wenn das GEG abgeschafft wird?",
                  gradient: "from-blue-500 to-blue-600",
                  content: (
                    <div
                      className={`space-y-4 ${getTextClasses("text-gray-600")} leading-relaxed text-sm sm:text-base`}
                    >
                      <p className="text-base sm:text-lg font-medium text-blue-900">
                        <strong>Das GEG wird nicht abgeschafft und kann auch gar nicht abgeschafft werden.</strong>
                      </p>
                      <p>
                        Es ist damit zu rechnen, dass das GEG im Jahr 2026 an die Anforderungen aus der
                        EU-Gebäuderichtlinie angepasst wird und es deshalb eine Neufassung des Gesetzes geben wird. In
                        dieser Neufassung muss die jetzt schon beschlossene Vorgabe zum Ende fossiler Energieträger im
                        Jahr 2045 auch in nationales Recht umgesetzt werden.
                      </p>
                      <GlassmorphismCard className="rounded-xl p-4 sm:p-6 border border-orange-300">
                        <div className="flex items-start gap-4">
                          <AlertCircle
                            className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 flex-shrink-0 mt-1"
                            aria-hidden="true"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                              Wichtiger Hinweis:
                            </h4>
                            <p className={`${getTextClasses("text-gray-600")} text-sm sm:text-base`}>
                              Bislang spricht das Heizungsgesetz davon, dass fossile Energieträger bis Ende 2044
                              eingesetzt werden dürfen. Die neue EU-Gebäuderichtlinie schreibt jedoch vor, dass es ein
                              absolutes Betriebsverbot für alle Öl- und Gasheizungen (fossile Energieträger) ab 2039
                              gibt.
                            </p>
                          </div>
                        </div>
                      </GlassmorphismCard>
                      <p className="text-base sm:text-lg font-medium text-blue-900">
                        Die Diskussion um den Austausch bestehender Heizungen wird es demnach weiterhin geben. Damit
                        wird auch die Heizungsplakette als „Ausweis" wie lange eine bestehende Heizung noch
                        weiterbetrieben werden darf, wichtig wie nie.
                      </p>
                    </div>
                  ),
                },
              ].map((section, index) => (
                <Collapsible
                  key={section.id}
                  open={openSections[section.id]}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger className="w-full" asChild>
                    <motion.button
                      className="cursor-pointer w-full"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      {...(accessibilityMode && {
                        "aria-expanded": openSections[section.id],
                        "aria-controls": `section-${section.id}`,
                      })}
                    >
                      <GlassmorphismCard className="rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${section.gradient} rounded-xl flex items-center justify-center`}
                              aria-hidden="true"
                            >
                              <section.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 text-left">
                              {section.title}
                            </h3>
                          </div>
                          {openSections[section.id] ? (
                            <ChevronUp
                              className={`h-5 w-5 sm:h-6 sm:w-6 ${getTextClasses("text-gray-500")} flex-shrink-0`}
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronDown
                              className={`h-5 w-5 sm:h-6 sm:w-6 ${getTextClasses("text-gray-500")} flex-shrink-0`}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </GlassmorphismCard>
                    </motion.button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <motion.div
                      {...(accessibilityMode && { id: `section-${section.id}` })}
                      className="mt-4 rounded-xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {section.content}
                    </motion.div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section
          id="process"
          className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30"
          {...(accessibilityMode && { "aria-labelledby": "process-heading", tabIndex: -1 })}
        >
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              className="text-center mb-8 sm:mb-12 lg:mb-16 xl:mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                id="process-heading"
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 text-gray-900"
              >
                So einfach geht's
              </h2>
              <p
                className={`text-base sm:text-lg lg:text-xl ${getTextClasses("text-gray-600")} max-w-2xl mx-auto px-4 sm:px-0`}
              >
                In nur 4 Schritten zu Ihrer rechtssicheren Heizungsplakette
              </p>
              <div
                className={`w-12 sm:w-16 lg:w-24 h-1 bg-gradient-to-r ${getButtonClasses("from-blue-600 to-indigo-600")} mx-auto mt-4 sm:mt-6 lg:mt-8`}
                aria-hidden="true"
              ></div>
            </motion.div>

            <div
              className="space-y-8 sm:space-y-12 lg:space-y-16"
              {...(accessibilityMode && { role: "list", "aria-label": "Schritte zur Heizungsplakette" })}
            >
              {[
                {
                  number: "01",
                  title: "Ihre Daten eingeben",
                  description:
                    "Erzählen Sie uns von Ihrer Heizung. Unser Formular führt Sie Schritt für Schritt durch alle wichtigen Informationen.",
                  icon: FileText,
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  number: "02",
                  title: "Fotos hochladen",
                  description:
                    "Laden Sie Fotos der Heizung, des Typenschildes, des Heizungslabels und der Bedienungsanleitung hoch. Diese werden in Ihre Heizungsplakette integriert.",
                  icon: Camera,
                  gradient: "from-green-500 to-green-600",
                },
                {
                  number: "03",
                  title: "Expertenprüfung",
                  description:
                    "Unsere Bausachverständigen und Rechtsanwälte überprüfen Ihre Angaben nach den neuesten gesetzlichen Bestimmungen. Das dauert maximal 48 Stunden.",
                  icon: Users,
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  number: "04",
                  title: "Plakette erhalten",
                  description:
                    "Sie erhalten Ihre digitale Heizungsplakette per E-Mail mit allen wichtigen Unterlagen an einer Stelle zusammengefasst. Rechtssicher und offiziell anerkannt.",
                  icon: Award,
                  gradient: "from-orange-500 to-orange-600",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  {...(accessibilityMode && { role: "listitem" })}
                >
                  {/* Mobile: Number first, then content */}
                  <div className="flex flex-col lg:hidden items-center text-center w-full">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r ${step.gradient} shadow-lg`}
                      {...(accessibilityMode && { "aria-label": `Schritt ${step.number}` })}
                    >
                      {step.number}
                    </div>
                    <GlassmorphismCard className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl w-full max-w-md">
                      <div className="flex flex-col items-center gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-r ${step.gradient}`}
                          aria-hidden="true"
                        >
                          <step.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                        </div>
                        <div>
                          <span className={`text-xs sm:text-sm font-medium ${getTextClasses("text-gray-500")} block`}>
                            Schritt {step.number}
                          </span>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                      </div>
                      <p
                        className={`${getTextClasses("text-gray-600")} text-sm sm:text-base lg:text-lg leading-relaxed`}
                      >
                        {step.description}
                      </p>
                    </GlassmorphismCard>
                  </div>

                  {/* Desktop: Alternating layout */}
                  <div className={`hidden lg:flex flex-1 ${index % 2 === 1 ? "order-2" : ""}`}>
                    <GlassmorphismCard className="rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 w-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${step.gradient}`}
                          aria-hidden="true"
                        >
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <span className={`text-sm font-medium ${getTextClasses("text-gray-500")}`}>
                            Schritt {step.number}
                          </span>
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                      </div>
                      <p className={`${getTextClasses("text-gray-600")} text-lg leading-relaxed`}>{step.description}</p>
                    </GlassmorphismCard>
                  </div>

                  <div className={`hidden lg:flex flex-shrink-0 ${index % 2 === 1 ? "order-1" : ""}`}>
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-r ${step.gradient} shadow-lg`}
                      {...(accessibilityMode && { "aria-label": `Schritt ${step.number}` })}
                    >
                      {step.number}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Foto-Upload Details - Collapsible */}
            <motion.div
              className="mt-12 sm:mt-16 lg:mt-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Collapsible open={openSections.fotos} onOpenChange={() => toggleSection("fotos")}>
                <CollapsibleTrigger className="w-full" asChild>
                  <motion.button
                    className="cursor-pointer w-full"
                    whileHover={{ scale: 1.02 }}
                    {...(accessibilityMode && {
                      "aria-expanded": openSections.fotos,
                      "aria-controls": "fotos-section",
                    })}
                  >
                    <GlassmorphismCard className="rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div
                            className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${getButtonClasses("from-blue-600 to-blue-600")} rounded-full flex items-center justify-center`}
                            aria-hidden="true"
                          >
                            <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-gray-900">
                              Upload von Fotos in der Heizungsplakette
                            </h3>
                            <p className={`${getTextClasses("text-gray-600")} text-sm sm:text-base`}>
                              Erfahren Sie mehr über die verschiedenen Foto-Kategorien
                            </p>
                          </div>
                        </div>
                        {openSections.fotos ? (
                          <ChevronUp
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${getTextClasses("text-gray-500")} flex-shrink-0`}
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${getTextClasses("text-gray-500")} flex-shrink-0`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </GlassmorphismCard>
                  </motion.button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <motion.div
                    {...(accessibilityMode && { id: "fotos-section" })}
                    className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 lg:p-12"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p
                      className={`${getTextClasses("text-gray-600")} max-w-3xl mx-auto mb-6 sm:mb-8 text-center text-sm sm:text-base`}
                    >
                      Bei der Bestellung der Heizungsplakette gibt es die Möglichkeit, verschiedene Fotos
                      bereitzustellen und in das Dokument „Heizungsplakette" zu integrieren. Auch dies dient der
                      Vollständigkeit der Verkaufsunterlagen für eine Immobilie.
                    </p>

                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                      {...(accessibilityMode && { role: "list", "aria-label": "Foto-Kategorien" })}
                    >
                      {[
                        {
                          icon: Building,
                          title: "Foto der Heizung",
                          description: "Gesamtansicht Ihrer Heizungsanlage",
                          gradient: "from-blue-500 to-blue-600",
                        },
                        {
                          icon: FileText,
                          title: "Foto des Typenschildes",
                          description: "Technische Daten der Heizung",
                          gradient: "from-green-500 to-green-600",
                        },
                        {
                          icon: Award,
                          title: "Foto des Heizungslabels",
                          description: "Energiekennklasse der Heizung",
                          gradient: "from-orange-500 to-orange-600",
                        },
                        {
                          icon: FileCheck,
                          title: "Foto der Bedienungsanleitung",
                          description: "Erste Seite der Anleitung",
                          gradient: "from-purple-500 to-purple-600",
                        },
                        {
                          icon: Shield,
                          title: "Foto des Energieausweises",
                          description: "Energetische Bewertung",
                          gradient: "from-indigo-500 to-indigo-600",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          {...(accessibilityMode && { role: "listitem" })}
                        >
                          <GlassmorphismCard className="rounded-xl p-4 sm:p-6 text-center hover:bg-gray-50/50 transition-colors h-full">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                              aria-hidden="true"
                            >
                              <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{item.title}</h4>
                            <p className={`text-xs sm:text-sm ${getTextClasses("text-gray-600")}`}>
                              {item.description}
                            </p>
                          </GlassmorphismCard>
                        </motion.div>
                      ))}
                    </div>

                    <GlassmorphismCard className="mt-6 sm:mt-8 p-4 sm:p-6 border border-blue-300">
                      <p className="text-blue-800 text-center text-sm sm:text-base">
                        <strong>Vollständigkeit:</strong> Mit dem Einfügen dieser Bilder in das spätere Dokument der
                        Heizungsplakette sind alle wichtigen Angaben für Eigentümer, Kaufinteressenten,
                        Finanzierungsberater und die finanzierende Bank an einer Stelle zusammengefasst.
                      </p>
                    </GlassmorphismCard>
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          </div>
        </section>

        {/* Expertenprüfung und Sicherheit Section - Collapsible */}
        <section
          className="py-12 sm:py-16 lg:py-20 xl:py-24"
          {...(accessibilityMode && { "aria-labelledby": "experten-heading" })}
        >
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              className="text-center mb-8 sm:mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                id="experten-heading"
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 text-gray-900"
              >
                Expertenprüfung und Sicherheit
              </h2>
              <div
                className={`w-12 sm:w-16 lg:w-24 h-1 bg-gradient-to-r ${getButtonClasses("from-blue-600 to-indigo-600")} mx-auto`}
                aria-hidden="true"
              ></div>
            </motion.div>

            <div className="space-y-4 sm:space-y-6">
              {/* Expertenprüfung */}
              <Collapsible open={openSections.experten} onOpenChange={() => toggleSection("experten")}>
                <CollapsibleTrigger className="w-full" asChild>
                  <motion.button
                    className="cursor-pointer w-full"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    {...(accessibilityMode && {
                      "aria-expanded": openSections.experten,
                      "aria-controls": "experten-section",
                    })}
                  >
                    <GlassmorphismCard className="rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div
                            className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-gray-900">
                              Ausgestellt vom Bausachverständigen und anwaltliche Prüfung
                            </h3>
                            <p className={`${getTextClasses("text-gray-600")} text-sm sm:text-base`}>
                              Technische und rechtliche Prüfung nach GEG-Vorgaben
                            </p>
                          </div>
                        </div>
                        {openSections.experten ? (
                          <ChevronUp
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${getTextClasses("text-gray-500")} flex-shrink-0`}
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${getTextClasses("text-gray-500")} flex-shrink-0`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </GlassmorphismCard>
                  </motion.button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <motion.div
                    {...(accessibilityMode && { id: "experten-section" })}
                    className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div
                      className={`space-y-3 sm:space-y-4 ${getTextClasses("text-gray-600")} leading-relaxed text-sm sm:text-base`}
                    >
                      <p>
                        Die Angaben in der Heizungsplakette werden von einem Bausachverständigen und einem Rechtsanwalt
                        überprüft, so dass sowohl eine technische als auch eine rechtliche Prüfung zur Einhaltung der
                        Vorgaben aus dem Gebäudeenergiegesetz, das auch als Heizungsgesetz bekannt ist, erfolgt.
                      </p>
                      <p>
                        Die Aussteller der Heizungsplakette prüfen die Angaben zur Heizung anhand der Fotografie des
                        Typenschildes, anhand des Baujahrs der Heizung, anhand der vorhandenen Technologie der Heizung,
                        die zum Einsatz kommt.
                      </p>
                    </div>

                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                      {...(accessibilityMode && { role: "list", "aria-label": "Prüfungsarten" })}
                    >
                      <GlassmorphismCard
                        className="rounded-xl p-4 sm:p-6 text-center"
                        {...(accessibilityMode && { role: "listitem" })}
                      >
                        <Users
                          className="h-10 w-10 sm:h-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4"
                          aria-hidden="true"
                        />
                        <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Bausachverständiger</h4>
                        <p className="text-xs sm:text-sm text-green-800">Technische Prüfung der Heizungsangaben</p>
                      </GlassmorphismCard>
                      <GlassmorphismCard
                        className="rounded-xl p-4 sm:p-6 text-center"
                        {...(accessibilityMode && { role: "listitem" })}
                      >
                        <Scale
                          className="h-10 w-10 sm:h-12 sm:h-12 text-blue-600 mx-auto mb-3 sm:mb-4"
                          aria-hidden="true"
                        />
                        <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Rechtsanwalt</h4>
                        <p className="text-xs sm:text-sm text-blue-800">Rechtliche Prüfung nach GEG-Vorgaben</p>
                      </GlassmorphismCard>
                    </div>
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>

              {/* Haftung */}
              <Collapsible open={openSections.haftung} onOpenChange={() => toggleSection("haftung")}>
                <CollapsibleTrigger className="w-full" asChild>
                  <motion.button
                    className="cursor-pointer w-full"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    {...(accessibilityMode && {
                      "aria-expanded": openSections.haftung,
                      "aria-controls": "haftung-section",
                    })}
                  >
                    <GlassmorphismCard className="rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div
                            className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${getButtonClasses("from-blue-600 to-blue-600")} rounded-full flex items-center justify-center`}
                            aria-hidden="true"
                          >
                            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-gray-900">
                              Keine zusätzliche Haftung aus der Heizungsplakette
                            </h3>
                            <p className={`${getTextClasses("text-gray-600")} text-sm sm:text-base`}>
                              Rechtssicherheit für Makler und Berater
                            </p>
                          </div>
                        </div>
                        {openSections.haftung ? (
                          <ChevronUp
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${getTextClasses("text-gray-500")} flex-shrink-0`}
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDown
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${getTextClasses("text-gray-500")} flex-shrink-0`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </GlassmorphismCard>
                  </motion.button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <motion.div
                    {...(accessibilityMode && { id: "haftung-section" })}
                    className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 space-y-3 sm:space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className={`text-base sm:text-lg ${getTextClasses("text-gray-600")} leading-relaxed`}>
                      Immobilienmakler, die für Ihre Kunden die Heizungsplakette bestellen, können normalerweise nicht
                      in Haftung genommen werden, so dass kein Risiko bei der Nutzung dieser Verkaufsunterlage besteht.
                    </p>
                    <GlassmorphismCard className="rounded-xl p-4 sm:p-6 border border-orange-300">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <AlertCircle
                          className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 flex-shrink-0 mt-1"
                          aria-hidden="true"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Wichtiger Hinweis:</h4>
                          <p className={`${getTextClasses("text-gray-600")} text-sm sm:text-base`}>
                            Lediglich vorsätzliche Falschangaben bei der Bestellung der Heizungsplakette können zu einer
                            möglichen haftungsrechtlichen Relevanz führen.
                          </p>
                        </div>
                      </div>
                    </GlassmorphismCard>
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section
          id="trust"
          className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30"
          {...(accessibilityMode && { "aria-labelledby": "trust-heading", tabIndex: -1 })}
        >
          <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              className="text-center mb-8 sm:mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                id="trust-heading"
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 text-gray-900"
              >
                Darauf können Sie vertrauen
              </h2>
              <div
                className={`w-12 sm:w-16 lg:w-24 h-1 bg-gradient-to-r ${getButtonClasses("from-blue-600 to-indigo-600")} mx-auto`}
                aria-hidden="true"
              ></div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              {...(accessibilityMode && { role: "list", "aria-label": "Vertrauensmerkmale" })}
            >
              {[
                {
                  icon: Shield,
                  title: "100% Rechtssicher",
                  description:
                    "Unsere Heizungsplaketten entsprechen exakt den gesetzlichen Vorgaben des GEG (Gebäudeenergiegesetz).",
                  stats: "Nach aktuellen Bestimmungen",
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  icon: Clock,
                  title: "Blitzschnell",
                  description:
                    "Maximal 48 Stunden von der Bestellung bis zur fertigen Plakette in Ihrem E-Mail-Postfach.",
                  stats: "Durchschnitt: 24 Stunden",
                  gradient: "from-green-500 to-green-600",
                },
                {
                  icon: Award,
                  title: "Offiziell anerkannt",
                  description: "Unsere Plaketten werden von Behörden, Schornsteinfegern und Energieberatern anerkannt.",
                  stats: "Bundesweit gültig",
                  gradient: "from-purple-500 to-purple-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  {...(accessibilityMode && { role: "listitem" })}
                >
                  <GlassmorphismCard className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 h-full">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 mx-auto sm:mx-0`}
                      aria-hidden="true"
                    >
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 lg:mb-4 text-gray-900 text-center sm:text-left">
                      {feature.title}
                    </h3>
                    <p
                      className={`${getTextClasses("text-gray-600")} leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base text-center sm:text-left`}
                    >
                      {feature.description}
                    </p>
                    <div
                      className={`text-xs sm:text-sm font-medium ${getTextClasses("text-blue-600")} bg-blue-50 px-2 sm:px-3 py-1 rounded-full inline-block mx-auto sm:mx-0`}
                    >
                      {feature.stats}
                    </div>
                  </GlassmorphismCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Energieausweis Section */}
        <section
          className="py-12 sm:py-16 lg:py-20 xl:py-24"
          {...(accessibilityMode && { "aria-labelledby": "energieausweis-heading" })}
        >
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                id="energieausweis-heading"
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 text-gray-900"
              >
                Energieausweis? Haben wir auch!
              </h2>
              <div
                className={`w-12 sm:w-16 lg:w-24 h-1 bg-gradient-to-r ${getButtonClasses("from-blue-600 to-indigo-600")} mx-auto mb-6 sm:mb-8 lg:mb-12`}
                aria-hidden="true"
              ></div>
              <p
                className={`text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 lg:mb-12 ${getTextClasses("text-gray-600")} max-w-2xl mx-auto`}
              >
                Neben der Heizungsplakette bieten wir auch die Erstellung von Energieausweisen an. So erhalten Sie alle
                wichtigen energetischen Unterlagen für Ihre Immobilie aus einer Hand.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-medium border-2 hover:bg-gray-50 w-full sm:w-auto backdrop-blur-sm focus:bg-gray-50"
                  onClick={() => {
                    window.open("https://www.energieausweis48.de/", "_blank")
                    if (accessibilityMode) {
                      setAnnounceMessage("Externe Seite wird in neuem Tab geöffnet")
                    }
                  }}
                  {...(accessibilityMode && {
                    "aria-label": "Energieausweis auf datenschutz.immobilien bestellen - öffnet in neuem Tab",
                  })}
                >
                  Energieausweis bestellen
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" aria-hidden="true" />
                </Button>
              </div>

              <p className={`text-xs sm:text-sm ${getTextClasses("text-gray-500")}`}>
                Besuchen Sie datenschutz.immobilien für weitere Informationen
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-12 sm:py-16 lg:py-20 xl:py-24 relative overflow-hidden"
          {...(accessibilityMode && { "aria-labelledby": "cta-heading" })}
        >
          <ModernBackground />
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                id="cta-heading"
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 text-gray-900"
              >
                Bereit für Ihre Heizungsplakette?
              </h2>
              <p
                className={`text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 lg:mb-12 ${getTextClasses("text-gray-600")} max-w-2xl mx-auto`}
              >
                Schließen Sie sich tausenden zufriedenen Kunden an und sichern Sie sich Ihre rechtskonforme
                Heizungsplakette.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-6 lg:mb-8">
                <Button
                  size="lg"
                  className={getButtonClasses(
                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto focus:scale-105",
                  )}
                  onClick={() => {
                    router.push("/heizungsplakette")
                    if (accessibilityMode) {
                      setAnnounceMessage("Weiterleitung zur Bestellseite")
                    }
                  }}
                  {...(accessibilityMode && { "aria-label": "Heizungsplakette jetzt für 49 Euro bestellen" })}
                >
                  Jetzt für 49€ bestellen
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" aria-hidden="true" />
                </Button>
              </div>

              <div
                className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-8 text-xs sm:text-sm ${getTextClasses("text-gray-500")}`}
                {...(accessibilityMode && { role: "list", "aria-label": "Garantien und Vorteile" })}
              >
                {[
                  { icon: CheckCircle, text: "Keine versteckten Kosten" },
                  { icon: Shield, text: "Geld-zurück-Garantie" },
                  { icon: Zap, text: "Sofort verfügbar" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2" {...(accessibilityMode && { role: "listitem" })}>
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" aria-hidden="true" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="py-6 sm:py-8 lg:py-12 border-t border-gray-200 bg-white"
        {...(accessibilityMode && { role: "contentinfo" })}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 lg:gap-4">
              <Image
                src="/images/heizungsplakette-logo.png"
                alt="Heizungsplakette.de - Logo"
                width={120}
                height={24}
                className="h-5 sm:h-6 lg:h-8 w-auto"
              />
              <span className={`text-xs sm:text-sm ${getTextClasses("text-gray-500")}`}>
                © 2025 Heizungsplakette.de
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Accessibility Toggle */}
              <button
                onClick={toggleAccessibility}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  accessibilityMode
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                {...(accessibilityMode && {
                  "aria-label": `Barrierefreiheit ${accessibilityMode ? "deaktivieren" : "aktivieren"}`,
                })}
                title={`Barrierefreiheit ${accessibilityMode ? "deaktivieren" : "aktivieren"}`}
              >
                {accessibilityMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="text-xs font-medium hidden sm:inline">
                  {accessibilityMode ? "Barrierefrei" : "Standard"}
                </span>
              </button>

              <nav
                className="flex flex-wrap gap-3 sm:gap-4 lg:gap-8 text-xs sm:text-sm"
                {...(accessibilityMode && { role: "navigation", "aria-label": "Footer Navigation" })}
              >
                <Link
                  href="/impressum"
                  className={getTextClasses("text-gray-500 hover:text-gray-900 transition-colors focus:text-gray-900")}
                >
                  Impressum
                </Link>
                <Link
                  href="/datenschutzerklaerung"
                  className={getTextClasses("text-gray-500 hover:text-gray-900 transition-colors focus:text-gray-900")}
                >
                  Datenschutzerklärung
                </Link>
                <Popover open={isContactOpen} onOpenChange={setIsContactOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className={getTextClasses(
                        "text-gray-500 hover:text-gray-900 transition-colors focus:text-gray-900",
                      )}
                      {...(accessibilityMode && {
                        "aria-label": "Kontaktoptionen anzeigen",
                        "aria-expanded": isContactOpen,
                        "aria-haspopup": "true",
                      })}
                    >
                      Kontakt
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-56 p-0"
                    align="end"
                    {...(accessibilityMode && { role: "menu", "aria-label": "Kontaktoptionen" })}
                  >
                    <div className="p-2">
                      <button
                        onClick={handleContactMail}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm ${getTextClasses("text-gray-600")} hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100`}
                        {...(accessibilityMode && {
                          role: "menuitem",
                          "aria-label": "E-Mail senden an service@heizungsplakette.de",
                        })}
                      >
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        <span>Mail</span>
                      </button>
                      <button
                        onClick={handleContactPhone}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm ${getTextClasses("text-gray-600")} hover:bg-gray-100 rounded-md transition-colors focus:bg-gray-100`}
                        {...(accessibilityMode && {
                          role: "menuitem",
                          "aria-label": "Anrufen unter 030 206307940",
                        })}
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        <span>Telefonisch</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
