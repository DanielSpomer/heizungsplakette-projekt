import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { CheckCircle2, FileText, ShieldCheck, Clock, Mail } from 'lucide-react'
import Image from 'next/image';

export default function HeizungsplaketteHomepage() {
  return (
      <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/">
            <Image src="/images/heizungsplakette-logo.png" alt="Heizungsplakette Logo" width={250} height={50} />
          </Link>
          <Button asChild className="bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
            <Link href="/heizungsplakette">Jetzt kaufen - 49€</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Heizungsplakette – Ihre Sicherheit auf einen Blick</h2>
            <p className="text-lg">
              Bestellen Sie Ihre Heizungsplakette und erhalten Sie in wenigen Schritten wichtige Informationen darüber, wie lange Ihre Heizung noch betrieben werden darf, ob sie ausgetauscht werden muss oder ob zukünftige Investitionen nötig sind. Unsere Heizungsplaketten bieten Ihnen und potenziellen Käufern die nötige Sicherheit bei Immobilientransaktionen und -finanzierungen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Warum ist die Heizungsplakette wichtig?</h3>
              <p className="text-gray-700">
                Die Heizungsplakette ist ein offizielles Zertifikat, das den Betrieb Ihrer Heizungsanlage rechtlich absichert. Sie wird gemäß den Vorgaben der Energieeinsparverordnung (EnEV) und aktuellen gesetzlichen Bestimmungen erstellt und gibt Ihnen einen präzisen Überblick über den Zustand Ihrer Heizungsanlage. Mit der Heizungsplakette vermeiden Sie Unsicherheiten und Missverständnisse, insbesondere bei Immobilienverkäufen, Finanzierungen und Mietverhältnissen.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Für wen ist die Heizungsplakette geeignet?</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Immobilieneigentümer</li>
                <li>Kaufinteressenten</li>
                <li>Immobilienmakler</li>
                <li>Verwalter</li>
              </ul>
              <p className="mt-4 text-gray-700">
                Vermeiden Sie finanzielle Risiken und sorgen Sie für Klarheit bei Immobilientransaktionen und -finanzierungen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle>Ihre Vorteile auf einen Blick</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    { icon: FileText, text: "Personalisierte Heizungsplakette" },
                    { icon: ShieldCheck, text: "Rechtssicherheit" },
                    { icon: Clock, text: "Schnell und unkompliziert online" },
                    { icon: Mail, text: "Direkte Zustellung per E-Mail" },
                    { icon: CheckCircle2, text: "Professionelles Layout" }
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <item.icon className="h-5 w-5 text-green-500 mr-2" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle>Warum bei uns bestellen?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Unser Onlineshop bietet Ihnen einen schnellen, rechtssicheren und komfortablen Weg, die nötigen Dokumente für Ihre Heizungsanlage zu erhalten. Wir garantieren:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Schnelle Lieferung: Ihre Plakette wird sofort nach Bestellung per E-Mail versendet.</li>
                  <li>Datenschutz und Sicherheit: Unser Bestellprozess ist DSGVO-konform, und Ihre Daten werden sicher verarbeitet.</li>
                  <li>Kundenzufriedenheit: Wir bieten Ihnen einen zuverlässigen Service und stehen bei Fragen jederzeit zur Verfügung.</li>
                </ul>
                <Button asChild className="mt-4 w-full bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                <Link href="/heizungsplakette">Jetzt Heizungsplakette bestellen</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Wie funktioniert die Bestellung?</h3>
            <ol className="list-inside space-y-4 text-gray-700">
              {[
                "Formular ausfüllen: Geben Sie die Daten zu Ihrer Heizungsanlage in unser benutzerfreundliches Formular ein.",
                "Zahlung tätigen: Wählen Sie aus unseren sicheren Zahlungsmethoden und begleichen Sie den Betrag von nur 49,- EUR inkl. MwSt.",
                "Heizungsplakette erhalten: Nach erfolgreicher Zahlung erhalten Sie Ihre personalisierte Heizungsplakette als PDF per E-Mail.",
                "Download und Nutzung: Laden Sie die Plakette herunter und nutzen Sie sie zur Vorlage bei Inspektionen, Überprüfungen oder Verhandlungen."
              ].map((step, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow">
                  <span className="font-semibold">{`Schritt ${index + 1}: `}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>

      <footer className="bg-[#28299F] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>&copy; 2025 Heizungsplakette.de | Alle Rechte vorbehalten.</p>
          <div>
          <Link href="/impressum" className="mr-4 hover:underline">Impressum</Link>
          <Link href="/datenschutzerklaerung" className="hover:underline">Datenschutzerklärung</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}