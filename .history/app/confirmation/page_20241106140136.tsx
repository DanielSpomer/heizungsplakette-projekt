'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Confirmation() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/">
            <Image src="/images/heizungsplakette-logo.png" alt="Heizungsplakette Logo" width={250} height={50} />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card className="bg-white shadow sm:rounded-lg">
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-900">Vielen Dank für Ihre Bestellung der Heizungsplakette!</h1>
              <p className="text-gray-600">
                Wir freuen uns, dass Sie sich für den Erwerb einer Heizungsplakette entschieden haben. Ihre Bestellung wurde erfolgreich bearbeitet, und Sie erhalten in Kürze eine E-Mail mit der Zusammenfassung Ihrer Angaben sowie der generierten Heizungsplakette im Anhang.
              </p>
              <p className="text-gray-600">
                Sollten Sie noch Fragen haben oder weitere Informationen benötigen, können Sie uns jederzeit unter <a href="mailto:service@heizungsplakette.de" className="text-blue-600 hover:underline">service@heizungsplakette.de</a> erreichen. Wir helfen Ihnen gerne weiter!
              </p>
              <p className="text-gray-600">
                Vielen Dank für Ihr Vertrauen!
              </p>
              <p className="text-gray-600">
                Mit freundlichen Grüßen,<br />
                Ihr Heizungsplakette-Team
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center space-x-4">
          <Button onClick={() => router.push('/')} variant="outline">
            Hauptseite
          </Button>
        </div>
      </main>
    </div>
  )
}