'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Confirmation() {
  const router = useRouter()

  const handleDownload = () => {
    // Assuming the PDF is in the public folder
    const link = document.createElement('a')
    link.href = '/Heizungsplakette_Ausgefuellt.pdf'
    link.download = 'Heizungsplakette_Ausgefuellt.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Heizungsplakette</h1>
          <Image src="/placeholder.svg?height=50&width=50" alt="Logo" width={50} height={50} />
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
                Sollten Sie noch Fragen haben oder weitere Informationen benötigen, können Sie uns jederzeit unter <a href="mailto:heizungsplakette@gmail.com" className="text-blue-600 hover:underline">heizungsplakette@gmail.com</a> erreichen. Wir helfen Ihnen gerne weiter!
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
          <Button onClick={handleDownload}>
            Heizungsplakette downloaden
          </Button>
        </div>
      </main>
    </div>
  )
}