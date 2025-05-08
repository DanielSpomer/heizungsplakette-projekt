'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { CheckCircle2, FileText, ShieldCheck, Clock, Mail, ChevronRight, ChevronDown, ChevronUp, Users, Building2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function HeizungsplaketteHomepage() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/">
            <Image src="/images/heizungsplakette-logo.png" alt="Heizungsplakette Logo" width={180} height={90} />
          </Link>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Link href="/heizungsplakette">Jetzt bestellen - 49€</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Heizungsplakette – <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Ihre Sicherheit auf einen Blick
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Erhalten Sie wichtige Informationen über Ihre Heizung und sichern Sie sich rechtlich ab. Ideal für Immobilieneigentümer, Käufer und Makler.
          </p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-lg px-10 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Link href="/heizungsplakette">Jetzt Heizungsplakette bestellen</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <Card className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <CardTitle className="text-2xl font-bold">Ihre Vorteile</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {[
                  { icon: FileText, text: "Personalisierte Heizungsplakette" },
                  { icon: ShieldCheck, text: "Rechtssicherheit" },
                  { icon: Clock, text: "Schnell und unkompliziert online" },
                  { icon: Mail, text: "Direkte Zustellung per E-Mail" },
                  { icon: CheckCircle2, text: "Professionelles Layout" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center group cursor-pointer transform transition-transform duration-200 hover:translate-x-2">
                    <item.icon className="h-6 w-6 text-blue-600 mr-3 transition-colors duration-200 group-hover:text-indigo-600" />
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <CardTitle className="text-2xl font-bold">Bestellprozess</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ol className="space-y-4">
                {[
                  "Formular ausfüllen",
                  "Zahlung tätigen (49€ inkl. MwSt.)",
                  "Heizungsplakette per E-Mail erhalten",
                  "Plakette herunterladen und nutzen"
                ].map((step, index) => (
                  <li key={index} className="flex items-center group cursor-pointer transform transition-transform duration-200 hover:translate-x-2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-md transition-all duration-200 group-hover:shadow-lg">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Warum ist die Heizungsplakette wichtig?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Die Heizungsplakette ist ein offizielles Zertifikat, das den Betrieb Ihrer Heizungsanlage rechtlich absichert. Sie gibt Ihnen einen präzisen Überblick über den Zustand Ihrer Heizung und hilft, Unsicherheiten bei Immobilienverkäufen, Finanzierungen und Mietverhältnissen zu vermeiden.
          </p>
          <Button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300 text-lg px-8 py-3 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center mx-auto"
          >
            {isExpanded ? (
              <>
                Weniger anzeigen
                <ChevronUp className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Mehr erfahren
                <ChevronDown className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            <div className="space-y-8">
              <Card className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Users className="mr-2 h-6 w-6" />
                    Für wen ist die Heizungsplakette geeignet?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span>Immobilieneigentümer</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span>Kaufinteressenten</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span>Immobilienmakler</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span>Verwalter</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Building2 className="mr-2 h-6 w-6" />
                    Warum bei uns bestellen?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span>Schnelle Lieferung: Ihre Plakette wird sofort nach Bestellung per E-Mail versendet.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span>Datenschutz und Sicherheit: Unser Bestellprozess ist DSGVO-konform.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span>Kundenzufriedenheit: Wir bieten Ihnen einen zuverlässigen Service.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <Card className="relative bg-white shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative h-[600px] w-full">
                      <Image 
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Foto%20HP%20fu%CC%88r%20Webseite%20(1)-qVhsrQXyv1fp2OZijWm5rBgY0ESru5.png"
                        alt="Beispiel einer Heizungsplakette" 
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <h3 className="text-xl font-bold mb-2 flex items-center">
                      <AlertCircle className="mr-2 h-5 w-5" />
                      Beispiel einer Heizungsplakette
                    </h3>
                    <p>
                      So könnte Ihre personalisierte Heizungsplakette aussehen. Alle wichtigen Informationen werden übersichtlich und professionell dargestellt.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">&copy; 2025 Heizungsplakette.de | Alle Rechte vorbehalten.</p>
          <div className="space-x-6">
            <Link href="/impressum" className="hover:text-blue-400 transition-colors">Impressum</Link>
            <Link href="/datenschutzerklaerung" className="hover:text-blue-400 transition-colors">Datenschutzerklärung</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}