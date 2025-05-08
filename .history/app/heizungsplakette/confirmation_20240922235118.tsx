'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface FormData {
  // Definieren Sie hier die Struktur Ihrer Formulardaten
  [key: string]: string | number | boolean;
}

export default function Confirmation() {
  const [formData, setFormData] = useState<FormData | null>(null)

  useEffect(() => {
    const storedData = sessionStorage.getItem('heizungsplaketteFormData')
    if (storedData) {
      setFormData(JSON.parse(storedData))
    }
  }, [])

  if (!formData) {
    return <div>Laden...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bestellung bestätigt</CardTitle>
          <CardDescription>Vielen Dank für Ihre Bestellung</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Hier können Sie die Bestelldetails anzeigen */}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => window.print()}>Bestellung drucken</Button>
        </CardFooter>
      </Card>
    </div>
  )
}