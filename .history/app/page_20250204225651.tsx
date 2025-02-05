import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, Users, CheckCircle, Clock, Shield, FileText, ArrowRight } from 'lucide-react'

export default function HeizungsplakettePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
            </div>
            <nav className="hidden md:flex space-x-10">
              <Link href="#why" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Warum Heizungsplakette?
              </Link>
              <Link href="#benefits" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Vorteile
              </Link>
              <Link href="#process" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Bestellprozess
              </Link>
              <Link href="#contact" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Kontakt
              </Link>
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Button asChild className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Link href="#order">
                  Jetzt bestellen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Heizungsplakette –</span>{' '}
                  <span className="block text-blue-600 xl:inline">Ihre Sicherheit auf einen Blick</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Sichern Sie Ihre Immobilie rechtlich ab und erhalten Sie wichtige Informationen über Ihre Heizung. Ideal für Immobilieneigentümer, Käufer und Makler.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button asChild className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                      <Link href="#order">
                        Jetzt Heizungsplakette bestellen
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        </div>
      </div>

      {/* Why Section */}
      <div id="why" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Warum ist die Heizungsplakette wichtig?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Sicherheit und Transparenz für Ihre Heizung
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Die Heizungsplakette bietet Ihnen rechtliche Absicherung und einen klaren Überblick über den Zustand Ihrer Heizungsanlage.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Shield className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Rechtssicherheit</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Schützen Sie sich vor rechtlichen Risiken bei Immobilienverkäufen und Vermietungen.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <FileText className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Transparenz</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Erhalten Sie einen detaillierten Überblick über den Zustand und die Effizienz Ihrer Heizungsanlage.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* For Whom Section */}
      <div id="for-whom" className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Für wen ist die Heizungsplakette geeignet?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Unverzichtbar für viele Immobilienbeteiligte
            </p>
          </div>

          <div className="mt-10">
            <ul className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <li className="relative">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <Home className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg leading-6 font-medium text-gray-900">Immobilieneigentümer</h4>
                    <p className="mt-2 text-base text-gray-500">
                      Sichern Sie Ihre Immobilie rechtlich ab und erhalten Sie wichtige Informationen über Ihre Heizungsanlage.
                    </p>
                  </div>
                </div>
              </li>
              <li className="relative mt-10 md:mt-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <Users className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg leading-6 font-medium text-gray-900">Kaufinteressenten</h4>
                    <p className="mt-2 text-base text-gray-500">
                      Erhalten Sie transparente Informationen über die Heizungsanlage vor dem Immobilienkauf.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Ihre Vorteile auf einen Blick</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Alles, was Sie von uns erwarten können
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  icon: CheckCircle,
                  title: 'Personalisierte Heizungsplakette',
                  description: 'Maßgeschneidert für Ihre spezifische Heizungsanlage.'
                },
                {
                  icon: Shield,
                  title: 'Rechtssicherheit',
                  description: 'Entspricht allen aktuellen gesetzlichen Anforderungen.'
                },
                {
                  icon: Clock,
                  title: 'Schnell und unkompliziert',
                  description: 'Einfacher Online-Prozess, der nur wenige Minuten dauert.'
                },
                {
                  icon: FileText,
                  title: 'Detaillierte Dokumentation',
                  description: 'Umfassende Informationen zu Ihrer Heizungsanlage.'
                }
              ].map((benefit, index) => (
                <div key={index} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <benefit.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{benefit.title}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {benefit.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Order From Us Section */}
      <div id="why-us" className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Warum bei uns bestellen?</span>
          </h2>
          <div className="mt-6 text-xl text-blue-200 max-w-3xl">
            <ul className="list-disc pl-5 space-y-2">
              <li>Schnelle Lieferung: Ihre Plakette wird sofort nach Bestellung per E-Mail versendet.</li>
              <li>Datenschutz und Sicherheit: Unser Bestellprozess ist DSGVO-konform.</li>
              <li>Kundenzufriedenheit: Wir bieten Ihnen einen zuverlässigen Service.</li>
            </ul>
          </div>
          <div className="mt-8 flex">
            <div className="inline-flex rounded-md shadow">
              <Button asChild className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                <Link href="#order">
                  Jetzt bestellen
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Process Section */}
      <div id="process" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Bestellprozess</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Wie funktioniert die Bestellung?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              In wenigen einfachen Schritten zu Ihrer personalisierten Heizungsplakette
            </p>
          </div>

          <div className="mt-10">
            <ol className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {[
                {
                  step: '1',
                  title: 'Formular ausfüllen',
                  description: 'Geben Sie die Daten zu Ihrer Heizungsanlage in unser benutzerfreundliches Formular ein.'
                },
                {
                  step: '2',
                  title: 'Zahlung tätigen',
                  description: 'Bezahlen Sie sicher und bequem online (49€ inkl. MwSt.).'
                },
                {
                  step: '3',
                  title: 'Plakette erhalten',
                  description: 'Erhalten Sie Ihre personalisierte Heizungsplakette sofort per E-Mail.'
                }
              ].map((step, index) => (
                <li key={index} className="relative">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    {step.step}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg leading-6 font-medium text-gray-900">{step.title}</h4>
                    <p className="mt-2 text-base text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="order" className="bg-blue-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Bereit für Ihre Heizungsplakette?</span>
            <span className="block text-blue-600">Bestellen Sie jetzt und sichern Sie sich ab.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button asChild className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <Link href="/beantragen">
                  Jetzt Heizungsplakette bestellen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link href="/impressum" className="text-base text-gray-500 hover:text-gray-900">
                Impressum
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="/datenschutz" className="text-base text-gray-500 hover:text-gray-900">
                Datenschutzerklärung
              </Link>
            </div>
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            <span className="text-gray-400">E-Mail: service@heizungsplakette.de</span>
            <span className="text-gray-400">Tel: +49 123 456789</span>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2023 Heizungsplakette GmbH. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  )
}