import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function HeizungsplaketteHomepage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Heizungsplakette</h1>
          <Button asChild>
            <Link href="/heizungsplakette">Jetzt kaufen</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Heizungsplakette – Jetzt einfach und schnell online bestellen</h2>
            <p className="text-lg font-medium">Sichern Sie sich Ihre personalisierte Heizungsplakette für nur 49,- EUR inkl. MwSt.!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Was ist die Heizungsplakette?</h3>
              <p className="text-gray-700">Die Heizungsplakette ist ein offizielles Dokument, das den Betrieb Ihrer Heizungsanlage rechtssicher bestätigt. Gemäß den Vorgaben der Energieeinsparverordnung (EnEV) und anderer gesetzlicher Regelungen benötigen viele Heizungsanlagen eine solche Kennzeichnung. Unsere Heizungsplaketten werden nach den neuesten Richtlinien erstellt und bieten Ihnen den optimalen Nachweis, dass Ihre Heizungsanlage den geltenden Anforderungen entspricht.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Warum benötigen Sie eine Heizungsplakette?</h3>
              <p className="text-gray-700">Die Heizungsplakette ist ein Nachweis für die regelmäßige Wartung und den ordnungsgemäßen Betrieb Ihrer Heizungsanlage. Sie ist besonders wichtig für Anlagen, die älter als 15 Jahre sind oder besondere Anforderungen erfüllen müssen. Mit der Heizungsplakette dokumentieren Sie, dass Ihre Heizung den aktuellen technischen Standards entspricht, und sorgen so für Rechtssicherheit und Transparenz – sowohl für Vermieter, Hausbesitzer als auch Mieter.</p>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ihre Vorteile auf einen Blick</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Personalisierte Heizungsplakette",
                  "Schnell und einfach online",
                  "Direkte Zustellung per E-Mail",
                  "Rechtssicher und gesetzeskonform",
                  "Professionelles Layout"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">So funktioniert der Bestellprozess:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Formular ausfüllen: Geben Sie die erforderlichen Daten zu Ihrer Heizungsanlage ein.</li>
              <li>Zahlung tätigen: Bezahlen Sie bequem über unsere sicheren Zahlungsmethoden.</li>
              <li>Personalisierte PDF-Heizungsplakette: Nach erfolgreicher Zahlung wird Ihre individuelle Plakette automatisch generiert und Ihnen per E-Mail zugeschickt.</li>
              <li>Download und Nutzung: Laden Sie die Plakette herunter und nutzen Sie sie für Ihre Unterlagen oder zur Vorlage bei Inspektionen und Überprüfungen.</li>
            </ol>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Warum bei uns bestellen?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Wir bieten Ihnen einen schnellen und zuverlässigen Service, der sicherstellt, dass Sie Ihre Heizungsplakette unkompliziert und rechtzeitig erhalten. Unser Online-Shop ist DSGVO-konform und Ihre Daten werden sicher verarbeitet. Darüber hinaus garantieren wir Ihnen eine einfache Handhabung – von der Eingabe der Daten bis hin zum Erhalt Ihrer Plakette.</p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/heizungsplakette">Jetzt Heizungsplakette bestellen</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2023 Heizungsplakette. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}