"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, Clock, FileText, CheckCircle, Users, Award, Heart } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
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
  const router = useRouter()

  useEffect(() => {
    const updateScrolled = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", updateScrolled)
    return () => window.removeEventListener("scroll", updateScrolled)
  }, [])

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/heizungsplakette-logo.png"
              alt="Heizungsplakette Logo"
              width={200}
              height={40}
              priority
            />
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="#story" className="text-gray-600 hover:text-gray-900 transition-colors">
              Unsere Geschichte
            </Link>
            <Link href="#process" className="text-gray-600 hover:text-gray-900 transition-colors">
              So funktioniert's
            </Link>
            <Link href="#trust" className="text-gray-600 hover:text-gray-900 transition-colors">
              Vertrauen
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Storytelling Approach */}
      <section className="relative flex items-center justify-center min-h-screen px-4">
        <SquaresBackground />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ✨ Ihre Heizung braucht eine Plakette
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-gray-900">Heizungsplakette</span>
              <br />
              <span className="text-blue-600">einfach gemacht</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Wir verstehen, dass das neue Heizungsgesetz verwirrend sein kann. Deshalb haben wir einen einfachen Weg
              geschaffen, wie Sie Ihre Heizungsplakette schnell und rechtssicher erhalten.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => router.push("/heizungsplakette")}
              >
                Jetzt Plakette beantragen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 rounded-full text-lg font-medium border-2 hover:bg-gray-50"
                onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
              >
                Mehr erfahren
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-6 mt-8 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Rechtssicher</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>48h Lieferung</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Nur 49€</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 text-blue-700 font-medium">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Heizungsplakette erstellt</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Warum gibt es uns?</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>

          <motion.div
            className="prose prose-lg mx-auto text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-xl mb-8">
              Als das neue Heizungsgesetz in Kraft trat, standen viele Hausbesitzer vor einem Problem:
              <strong className="text-gray-900"> Wie bekomme ich eine rechtssichere Heizungsplakette?</strong>
            </p>

            <p className="mb-8">
              Die Bürokratie war kompliziert, die Wartezeiten lang und die Unsicherheit groß. Genau hier wollten wir
              helfen. Unser Team aus Experten für Heizungstechnik und Rechtsberatern hat einen einfachen, digitalen Weg
              entwickelt.
            </p>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 my-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Unser Versprechen</h3>
                  <p className="text-gray-600 mb-0">
                    Wir machen die Heizungsplakette so einfach wie möglich – ohne Papierkram, ohne lange Wartezeiten,
                    ohne Stress. Einfach online, schnell und rechtssicher.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section - Storytelling Style */}
      <section id="process" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">So einfach geht's</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              In nur 4 Schritten zu Ihrer rechtssicheren Heizungsplakette
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-8"></div>
          </motion.div>

          <div className="space-y-16">
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
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex-1">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
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

                <div className="flex-shrink-0">
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

      {/* Trust Section */}
      <section id="trust" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Darauf können Sie vertrauen</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

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
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                  {feature.stats}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <SquaresBackground />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Bereit für Ihre Heizungsplakette?</h2>
            <p className="text-xl mb-12 text-gray-600 max-w-2xl mx-auto">
              Schließen Sie sich tausenden zufriedenen Kunden an und sichern Sie sich Ihre rechtskonforme
              Heizungsplakette – einfach, schnell und günstig.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => router.push("/heizungsplakette")}
              >
                Jetzt für 49€ bestellen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Keine versteckten Kosten</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Geld-zurück-Garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Sofort verfügbar</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Image src="/images/heizungsplakette-logo.png" alt="Heizungsplakette Logo" width={150} height={30} />
              <span className="text-sm text-gray-500">© 2025 Heizungsplakette.de</span>
            </div>
            <nav className="flex gap-8 text-sm">
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
