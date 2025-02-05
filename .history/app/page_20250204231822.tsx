'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { CheckCircle2, FileText, ShieldCheck, Clock, Mail, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function HeizungsplaketteHomepage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

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
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
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
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeIn}>
            <Card className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <CardTitle className="text-2xl font-bold">Ihre Vorteile</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <motion.ul className="space-y-4" variants={staggerChildren}>
                  {[
                    { icon: FileText, text: "Personalisierte Heizungsplakette" },
                    { icon: ShieldCheck, text: "Rechtssicherheit" },
                    { icon: Clock, text: "Schnell und unkompliziert online" },
                    { icon: Mail, text: "Direkte Zustellung per E-Mail" },
                    { icon: CheckCircle2, text: "Professionelles Layout" }
                  ].map((item, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center" 
                      variants={fadeIn}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    >
                      <item.icon className="h-6 w-6 text-blue-600 mr-3" />
                      <span className="text-gray-700">{item.text}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <CardTitle className="text-2xl font-bold">Bestellprozess</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <motion.ol className="space-y-4" variants={staggerChildren}>
                  {[
                    "Formular ausfüllen",
                    "Zahlung tätigen (49€ inkl. MwSt.)",
                    "Heizungsplakette per E-Mail erhalten",
                    "Plakette herunterladen und nutzen"
                  ].map((step, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center" 
                      variants={fadeIn}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    >
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-md">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </motion.li>
                  ))}
                </motion.ol>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Warum ist die Heizungsplakette wichtig?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Die Heizungsplakette ist ein offizielles Zertifikat, das den Betrieb Ihrer Heizungsanlage rechtlich absichert. Sie gibt Ihnen einen präzisen Überblick über den Zustand Ihrer Heizung und hilft, Unsicherheiten bei Immobilienverkäufen, Finanzierungen und Mietverhältnissen zu vermeiden.
          </p>
          <Button asChild className="bg-white text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300 text-lg px-8 py-3 shadow-md hover:shadow-lg transform hover:-translate-y-1">
            <Link href="/mehr-infos">
              Mehr erfahren
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </main>

      <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            className="mb-4 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            &copy; 2025 Heizungsplakette.de | Alle Rechte vorbehalten.
          </motion.p>
          <motion.div 
            className="space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/impressum" className="hover:text-blue-400 transition-colors">Impressum</Link>
            <Link href="/datenschutzerklaerung" className="hover:text-blue-400 transition-colors">Datenschutzerklärung</Link>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}