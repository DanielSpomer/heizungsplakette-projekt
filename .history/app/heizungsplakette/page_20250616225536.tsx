"use client"

import type React from "react"
import { Fragment, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check, ArrowRight, Shield, Clock, Award } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css" // Import its CSS
import imageCompression from "browser-image-compression" // Import the library

interface FormData {
  datenschutzUndNutzungsbedingungen: boolean
  einwilligungDatenverarbeitung: boolean
  aufforderungSofortigeTaetigkeit: boolean
  email: string
  artDerImmobilie: string
  artDerImmobilieSonstige: string
  heizungsart: string
  heizungsartSonstige: string
  strasse: string
  hausnummer: string
  postleitzahl: string
  ort: string
  heizsystem: string
  heizsystemSonstige: string
  heizungshersteller: string
  baujahr: string
  typenbezeichnung: string
  typenbezeichnungUnbekannt: boolean
  heizungstechnik: string
  heizungstechnikSonstige: string
  energietraeger: string
  energietraegerSonstige: string
  energieausweis: string
  energieausweisDate: string
  vorname: string
  nachname: string
  personStrasse: string
  personHausnummer: string
  personPostleitzahl: string
  personOrt: string
  istEigentuemer: string
  heizungsanlageFotos: File[]
  heizungsetiketteFotos: File[]
  heizungslabelFotos: File[]
  bedienungsanleitungFotos: File[]
  verzichtAufHeizungsanlageFotos: boolean
  verzichtAufHeizungsetiketteFotos: boolean
  verzichtAufHeizungslabelFotos: boolean
  verzichtAufBedienungsanleitungFotos: boolean
  confirmAccuracy: boolean
  alterDerHeizung: string
  energielabel: string
  herkunft?: string
}

export default function HeizungsplaketteMaske() {
  const [currentStep, setCurrentStep] = useState(1)
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1])
  const [formData, setFormData] = useState<FormData>({
    datenschutzUndNutzungsbedingungen: false,
    einwilligungDatenverarbeitung: false,
    aufforderungSofortigeTaetigkeit: false,
    email: "",
    artDerImmobilie: "",
    artDerImmobilieSonstige: "",
    heizungsart: "",
    heizungsartSonstige: "",
    strasse: "",
    hausnummer: "",
    postleitzahl: "",
    ort: "",
    heizsystem: "",
    heizsystemSonstige: "",
    heizungshersteller: "",
    baujahr: "",
    typenbezeichnung: "",
    typenbezeichnungUnbekannt: false,
    heizungstechnik: "",
    heizungstechnikSonstige: "",
    energietraeger: "",
    energietraegerSonstige: "",
    energieausweis: "",
    energieausweisDate: "",
    vorname: "",
    nachname: "",
    personStrasse: "",
    personHausnummer: "",
    personPostleitzahl: "",
    personOrt: "",
    istEigentuemer: "",
    heizungsanlageFotos: [],
    heizungsetiketteFotos: [],
    heizungslabelFotos: [],
    bedienungsanleitungFotos: [],
    verzichtAufHeizungsanlageFotos: false,
    verzichtAufHeizungsetiketteFotos: false,
    verzichtAufHeizungslabelFotos: false,
    verzichtAufBedienungsanleitungFotos: false,
    confirmAccuracy: false,
    alterDerHeizung: "",
    energielabel: "",
    herkunft: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [addressValidationMessage, setAddressValidationMessage] = useState<string | null>(null)
  const [herkunft, setHerkunft] = useState<string>("Heizungsplakette")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isPollingPaymentStatus, setIsPollingPaymentStatus] = useState(false) // New state for polling
  const [personalAddressIsSameAsPropertyAddress, setPersonalAddressIsSameAsPropertyAddress] = useState(false) // New state for address copy
  const [isCompressing, setIsCompressing] = useState(false) // New state for compression status
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false) // New state for welcome screen

  const router = useRouter() // Moved router initialization up

  useEffect(() => {
    // Check if we're running in a browser environment
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      console.log("Hostname erkannt:", hostname) // Debugging-Ausgabe
      if (hostname.startsWith("eigentuemer.")) {
        setHerkunft("Immoscout")
        setShowWelcomeScreen(true) // Show welcome screen for eigentuemer subdomain
        console.log("Herkunft gesetzt auf: Immoscout") // Debugging-Ausgabe
      } else {
        setHerkunft("Heizungsplakette")
        setShowWelcomeScreen(false) // Skip welcome screen for main site
        console.log("Herkunft gesetzt auf: Heizungsplakette") // Debugging-Ausgabe
      }
    }
  }, [])

  const handleWelcomeContinue = () => {
    setShowWelcomeScreen(false)
  }

  // Client-side polling for payment status when on step 7 and orderId is available
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null

    if (currentStep === 7 && orderId && isPollingPaymentStatus) {
      console.log(`Polling useEffect: Conditions met. Starting payment status polling for orderId: ${orderId}`) // Debug log
      pollingInterval = setInterval(async () => {
        try {
          console.log(`Polling for orderId: ${orderId}...`)
          const response = await fetch(`/api/order-status?orderId=${orderId}`) // Changed to static path with query param
          if (response.ok) {
            const data = await response.json()
            console.log("Poll response:", data)
            if (data.paymentStatus === true) {
              console.log(`Payment confirmed for orderId: ${orderId}. Redirecting to confirmation.`)
              if (pollingInterval) clearInterval(pollingInterval)
              setIsPollingPaymentStatus(false)
              router.push(`/confirmation?id=${orderId}`)
            }
          } else {
            console.warn(`Polling failed for orderId: ${orderId}, status: ${response.status}`)
            // Optionally stop polling on certain errors, e.g., 404 if order disappears
            if (response.status === 404 && pollingInterval) {
              // clearInterval(pollingInterval);
              // setIsPollingPaymentStatus(false);
              // console.warn(`Order ${orderId} not found during polling. Stopping polling.`);
            }
          }
        } catch (error) {
          console.error(`Error during payment status polling for ${orderId}:`, error)
          // Optionally stop polling on repeated errors
        }
      }, 2500) // Poll every 5 seconds
    } else {
      // Debug log for when polling conditions are not met
      console.log(
        `Polling useEffect: Conditions NOT met. currentStep: ${currentStep}, orderId: ${orderId}, isPollingPaymentStatus: ${isPollingPaymentStatus}`,
      )
    }

    // Cleanup function
    return () => {
      if (pollingInterval) {
        console.log(`Clearing payment status polling for orderId: ${orderId}`)
        clearInterval(pollingInterval)
      }
      // Do not set isPollingPaymentStatus to false here directly,
      // as the effect might re-run if other dependencies change while polling is intended to be active.
      // It will be set to false when navigating away or on successful payment.
    }
  }, [currentStep, orderId, router, isPollingPaymentStatus])

  // Welcome Screen for eigentuemer subdomain - Mobile Optimized
  if (showWelcomeScreen) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm" role="banner">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" aria-label="Go to homepage">
              <Image
                src="/images/heizungsplakette-logo.png"
                alt="Heizungsplakette Logo"
                width={200}
                height={40}
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
          </div>
        </header>

        <main className="max-w-6xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Willkommen zur Heizungsplakette
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Ihre rechtssichere Dokumentation für das neue Heizungsgesetz – schnell, einfach und von Experten geprüft.
            </p>
          </div>

          {/* Benefits Section - Mobile Optimized */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Rechtssicherheit</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Ihre Heizungsplakette dokumentiert rechtssicher, wie lange Ihre Heizung nach dem neuen Heizungsgesetz
                noch betrieben werden darf.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Schnelle Bearbeitung</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Innerhalb von 48 Stunden erhalten Sie Ihre geprüfte Heizungsplakette per E-Mail. Einfach, schnell und
                zuverlässig.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Expertenprüfung</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Alle Angaben werden von unseren Experten mit den gesetzlichen Vorgaben des Gebäudeenergiegesetzes
                abgeglichen.
              </p>
            </div>
          </div>

          {/* Information Section - Mobile Optimized */}
          <div className="bg-blue-50 rounded-lg p-6 sm:p-8 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center">
              Warum ist eine Heizungsplakette wichtig?
            </h2>
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700">
              <p>
                Das neue Heizungsgesetz (GEG) bringt wichtige Änderungen für Immobilieneigentümer mit sich. Ihre
                Heizungsplakette gibt Ihnen Klarheit über die Betriebsdauer Ihrer aktuellen Heizung und hilft bei der
                Planung zukünftiger Investitionen.
              </p>
              <p>
                Mit unserer digitalen Heizungsplakette erhalten Sie eine rechtssichere Dokumentation, die alle
                relevanten Daten Ihrer Heizungsanlage erfasst und bewertet. So sind Sie optimal auf Gespräche mit
                Behörden, Energieberatern oder Handwerkern vorbereitet.
              </p>
              <p>
                Der gesamte Antragsprozess dauert nur wenige Minuten und wird vollständig digital abgewickelt. Keine
                langen Wartezeiten, keine komplizierten Formulare – einfach und transparent.
              </p>
            </div>
          </div>

          {/* CTA Section - Mobile Optimized */}
          <div className="text-center">
            <Button
              onClick={handleWelcomeContinue}
              className="bg-blue-600 text-white rounded-full px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-medium hover:bg-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto max-w-md"
            >
              Jetzt Heizungsplakette beantragen
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
              Nur 49,00 € inkl. MwSt. • Sichere Bezahlung • 48h Bearbeitungszeit
            </p>
          </div>
        </main>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Simpler assignment, ensure type consistency elsewhere
    }))
  }

  const handleDateChange = (date: Date | null, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? date.toISOString().split("T")[0] : "", // Store as YYYY-MM-DD string
    }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange =
    (
      name: keyof Pick<
        FormData,
        "heizungsanlageFotos" | "heizungsetiketteFotos" | "heizungslabelFotos" | "bedienungsanleitungFotos"
      >,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const maxFiles = name === "heizungslabelFotos" ? 1 : 3
        const inputFiles = Array.from(e.target.files).slice(0, maxFiles)

        // Reset the input value so the same file can be selected for another field
        e.target.value = ""

        setErrors((prev) => {
          const newErrors = { ...prev }
          if (inputFiles.length > maxFiles && e.target.files && e.target.files.length > maxFiles) {
            // Check original selection length for error
            newErrors[name] = `Maximal ${maxFiles} Foto${maxFiles > 1 ? "s" : ""} erlaubt.`
          } else {
            delete newErrors[name]
          }
          return newErrors
        })

        if (inputFiles.length === 0) {
          setFormData((prev) => ({ ...prev, [name]: [] }))
          return
        }

        setIsCompressing(true) // Indicate compression has started

        const compressionOptions = {
          maxSizeMB: 0.4, // Max file size in MB (changed from 1 to 0.4)
          maxWidthOrHeight: 1920, // Max width or height
          useWebWorker: true, // Use web worker for better performance
          initialQuality: 0.7, // Initial quality, will be adjusted by the library
        }

        const compressFiles = async () => {
          const compressedFilesArray: File[] = []
          for (const file of inputFiles) {
            try {
              console.log(`Original file size (${file.name}): ${(file.size / 1024 / 1024).toFixed(2)} MB`)
              const compressedFile = await imageCompression(file, compressionOptions)
              console.log(
                `Compressed file size (${compressedFile.name}): ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
              )
              // Create a new File object with the correct name, as compression might rename it
              compressedFilesArray.push(new File([compressedFile], file.name, { type: compressedFile.type }))
            } catch (error) {
              console.error("Error compressing file:", error)
              // If compression fails, add the original file as a fallback
              compressedFilesArray.push(file)
              setErrors((prev) => ({
                ...prev,
                [name]: prev[name]
                  ? `${prev[name]} Fehler bei der Komprimierung eines Bildes.`
                  : `Fehler bei der Komprimierung eines Bildes.`,
              }))
            }
          }
          setFormData((prev) => ({ ...prev, [name]: compressedFilesArray }))
          setIsCompressing(false) // Indicate compression has finished
        }

        compressFiles()
      }
    }

  const validateStep = async (step: number) => {
    // Make validateStep async
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.datenschutzUndNutzungsbedingungen)
        newErrors.datenschutzUndNutzungsbedingungen =
          "Bitte stimmen Sie den Datenschutzhinweisen, der Widerrufsbelehrung und den Nutzungsbedingungen zu."
      if (!formData.aufforderungSofortigeTaetigkeit)
        newErrors.aufforderungSofortigeTaetigkeit = "Bitte bestätigen Sie die Aufforderung zur sofortigen Tätigkeit."
    } else if (step === 2) {
      if (!formData.artDerImmobilie) newErrors.artDerImmobilie = "Bitte wählen Sie die Art der Immobilie."
      if (formData.artDerImmobilie === "Sonstige" && !formData.artDerImmobilieSonstige) {
        newErrors.artDerImmobilieSonstige = "Bitte spezifizieren Sie die Art der Immobilie."
      }
      if (!formData.heizungsart) newErrors.heizungsart = "Bitte wählen Sie eine Heizungsart."
      if (formData.heizungsart === "Sonstige" && !formData.heizungsartSonstige) {
        newErrors.heizungsartSonstige = "Bitte spezifizieren Sie die Heizungsart."
      }
      if (!formData.alterDerHeizung) newErrors.alterDerHeizung = "Bitte wählen Sie das Alter der Heizung."
      if (!formData.email) newErrors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein."
    } else if (step === 3) {
      if (!formData.strasse) newErrors.strasse = "Bitte geben Sie die Straße an."
      if (!formData.hausnummer) newErrors.hausnummer = "Bitte geben Sie die Hausnummer an."
      if (!formData.postleitzahl) newErrors.postleitzahl = "Bitte geben Sie die Postleitzahl an."
      if (!formData.ort) newErrors.ort = "Bitte geben Sie den Ort an."

      // Integrate address validation
      if (formData.strasse && formData.hausnummer && formData.postleitzahl && formData.ort) {
        const isAddressApiValid = await validateAddress()
        if (!isAddressApiValid) {
          newErrors.addressApi = addressValidationMessage || "Die Adresse konnte nicht validiert werden."
          // Use the message set by validateAddress or a default
        }
      } else {
        // Ensure addressValidationMessage is cleared or set appropriately if fields are empty
        setAddressValidationMessage("Bitte füllen Sie alle Adressfelder aus, um die Adresse zu validieren.")
      }
    } else if (step === 4) {
      // Baujahr validation based on alterDerHeizung
      const currentYear = new Date().getFullYear()
      if (!formData.baujahr) {
        newErrors.baujahr = "Bitte geben Sie das Baujahr der Heizung an."
      } else {
        const baujahrNum = Number.parseInt(formData.baujahr, 10)
        if (isNaN(baujahrNum)) {
          newErrors.baujahr = "Bitte geben Sie eine gültige Zahl für das Baujahr ein."
        } else {
          let isValidBaujahrForAge = true
          let ageSpecificMessage = ""

          // This validation assumes formData.alterDerHeizung is already set (it's required in step 2)
          switch (formData.alterDerHeizung) {
            case "weniger als 10 Jahre":
              // Age is 0-9 years. Baujahr: currentYear-9 to currentYear.
              if (baujahrNum < currentYear - 9 || baujahrNum > currentYear) {
                isValidBaujahrForAge = false
                ageSpecificMessage = `Das Baujahr muss zwischen ${currentYear - 9} und ${currentYear} liegen für eine Heizung, die jünger als 10 Jahre ist.`
              }
              break
            case "weniger als 20 Jahre":
              // Age is 0-19 years. Baujahr: currentYear-19 to currentYear.
              if (baujahrNum < currentYear - 19 || baujahrNum > currentYear) {
                isValidBaujahrForAge = false
                ageSpecificMessage = `Das Baujahr muss zwischen ${currentYear - 19} und ${currentYear} liegen für eine Heizung, die jünger als 20 Jahre ist.`
              }
              break
            case "weniger als 30 Jahre":
              // Age is 0-29 years. Baujahr: currentYear-29 to currentYear.
              if (baujahrNum < currentYear - 29 || baujahrNum > currentYear) {
                isValidBaujahrForAge = false
                ageSpecificMessage = `Das Baujahr muss zwischen ${currentYear - 29} und ${currentYear} liegen für eine Heizung, die jünger als 30 Jahre ist.`
              }
              break
            case "30 Jahre oder älter":
              // Age is >= 30 years. Baujahr: 1900 to currentYear-30.
              if (baujahrNum > currentYear - 30 || baujahrNum < 1900) {
                isValidBaujahrForAge = false
                ageSpecificMessage = `Das Baujahr muss ${currentYear - 30} oder früher sein (bis mind. 1900) für eine Heizung, die 30 Jahre oder älter ist.`
              }
              break
          }

          if (!isValidBaujahrForAge) {
            newErrors.baujahr = ageSpecificMessage
          } else if (baujahrNum < 1900 || baujahrNum > currentYear) {
            // Fallback general validation
            newErrors.baujahr = `Bitte geben Sie ein gültiges Baujahr zwischen 1900 und ${currentYear} ein.`
          }
        }
      }

      if (!formData.heizungshersteller) newErrors.heizungshersteller = "Bitte wählen Sie einen Heizungshersteller."
      if (!formData.typenbezeichnung && !formData.typenbezeichnungUnbekannt) {
        newErrors.typenbezeichnung = "Bitte geben Sie die Typenbezeichnung an oder wählen Sie 'Unbekannt'."
      }
      if (!formData.heizsystem) newErrors.heizsystem = "Bitte wählen Sie das Heizsystem."
      if (formData.heizsystem === "Sonstige" && !formData.heizsystemSonstige) {
        newErrors.heizsystemSonstige = "Bitte spezifizieren Sie das Heizsystem."
      }
      if (!formData.heizungstechnik) newErrors.heizungstechnik = "Bitte wählen Sie die Heizungstechnik."
      if (formData.heizungstechnik === "Sonstige" && !formData.heizungstechnikSonstige) {
        newErrors.heizungstechnikSonstige = "Bitte spezifizieren Sie die Heizungstechnik."
      }
      if (!formData.energietraeger) newErrors.energietraeger = "Bitte wählen Sie den Energieträger."
      if (formData.energietraeger === "Sonstige" && !formData.energietraegerSonstige) {
        newErrors.energietraegerSonstige = "Bitte spezifizieren Sie den Energieträger."
      }
      if (!formData.energielabel) newErrors.energielabel = "Bitte geben Sie an, ob ein Heizungslabel existiert."
      if (!formData.energieausweis) newErrors.energieausweis = "Bitte geben Sie an, ob ein Energieausweis vorliegt."
      if (formData.energieausweis === "Ja" && !formData.energieausweisDate) {
        newErrors.energieausweisDate = "Bitte geben Sie das Datum des Energieausweises an."
      } else if (formData.energieausweis === "Ja" && formData.energieausweisDate && formData.baujahr) {
        const energieausweisDateObj = new Date(formData.energieausweisDate)
        const baujahrDateObj = new Date(Number.parseInt(formData.baujahr, 10), 0, 1) // Convert baujahr to number

        // Set hours to 0 to compare dates only, avoiding timezone issues affecting day comparison
        energieausweisDateObj.setHours(0, 0, 0, 0)
        baujahrDateObj.setHours(0, 0, 0, 0)

        if (energieausweisDateObj < baujahrDateObj) {
          newErrors.energieausweisDate = "Das Datum des Energieausweises darf nicht vor dem Baujahr der Heizung liegen."
        }
      }
      if (!formData.vorname) newErrors.vorname = "Bitte geben Sie Ihren Vornamen an."
      if (!formData.nachname) newErrors.nachname = "Bitte geben Sie Ihren Nachnamen an."
      if (!formData.personStrasse) newErrors.personStrasse = "Bitte geben Sie Ihre Straße an."
      if (!formData.personHausnummer) newErrors.personHausnummer = "Bitte geben Sie Ihre Hausnummer an."
      if (!formData.personPostleitzahl) newErrors.personPostleitzahl = "Bitte geben Sie Ihre Postleitzahl an."
      if (!formData.personOrt) newErrors.personOrt = "Bitte geben Sie Ihren Ort an."
      if (!formData.istEigentuemer) newErrors.istEigentuemer = "Bitte geben Sie an, ob Sie der Eigentümer sind."
    } else if (step === 5) {
      if (!formData.verzichtAufHeizungsanlageFotos && formData.heizungsanlageFotos.length === 0) {
        newErrors.heizungsanlageFotos =
          "Bitte laden Sie mindestens ein Foto (maximal 3) der Heizungsanlage hoch oder verzichten Sie ausdrücklich darauf."
      }
      if (!formData.verzichtAufHeizungsetiketteFotos && formData.heizungsetiketteFotos.length === 0) {
        newErrors.heizungsetiketteFotos =
          "Bitte laden Sie mindestens ein Foto (maximal 3) der Typenschildes hoch oder verzichten Sie ausdrücklich darauf."
      }
      if (formData.energielabel === "Ja") {
        if (!formData.verzichtAufHeizungslabelFotos && formData.heizungslabelFotos.length === 0) {
          newErrors.heizungslabelFotos =
            "Bitte laden Sie ein Foto des Heizungslabels hoch oder verzichten Sie ausdrücklich darauf."
        }
      }
      if (!formData.verzichtAufBedienungsanleitungFotos && formData.bedienungsanleitungFotos.length === 0) {
        newErrors.bedienungsanleitungFotos =
          "Bitte laden Sie mindestens ein Foto (maximal 3) der Bedienungsanleitung hoch oder verzichten Sie ausdrücklich darauf."
      }
    } else if (step === 6) {
      if (!formData.confirmAccuracy) newErrors.confirmAccuracy = "Bitte bestätigen Sie die Richtigkeit Ihrer Angaben."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAddress = async () => {
    const { strasse, hausnummer, postleitzahl, ort } = formData
    if (strasse && hausnummer && postleitzahl && ort) {
      try {
        const address = `${strasse} ${hausnummer}, ${postleitzahl} ${ort}, Germany`
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`,
        )
        const data = await response.json()

        if (data.length > 0) {
          setAddressValidationMessage("Die Adresse wurde erfolgreich validiert.")
          return true
        } else {
          setAddressValidationMessage(
            "Die eingegebene Adresse konnte nicht validiert werden. Bitte überprüfen Sie Ihre Eingabe.",
          )
          return false
        }
      } catch (error) {
        setAddressValidationMessage("Fehler bei der Adressvalidierung. Bitte versuchen Sie es später erneut.")
        return false
      }
    } else {
      setAddressValidationMessage("Bitte füllen Sie alle Adressfelder aus.")
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate the current step before proceeding or submitting
    if (!(await validateStep(currentStep))) return // Await validateStep

    // If current step is before the summary step (new step 6), just advance
    if (currentStep < 6) {
      // If moving from step 3 (new address/personal step) to step 4, copy address (if needed, check original logic for prev step 4)
      // Original logic copied personStrasse etc. when moving from old step 4 to old step 5.
      // New step 3 contains address AND personal data. The auto-copy might not be needed or might need adjustment.
      // For now, let's keep the original auto-copy logic commented out or re-evaluate if it's still relevant.
      // if (currentStep === 3) { // If currentStep was the new combined address/personal step
      //   setFormData(prev => ({
      //     ...prev,
      //     // Example: if billing address should be copied from property address
      //   }))
      // }
      setCurrentStep((prev) => prev + 1)
      setVisitedSteps((prev) => Array.from(new Set([...prev, currentStep + 1])))
      return
    }

    // If currentStep is 6 (Summary and Confirmation step)
    if (currentStep === 6) {
      // Prevent multiple submissions
      if (isSubmitting) {
        // Ensure this check is effective
        console.log("Submit blocked: isSubmitting is true")
        return
      }

      setIsSubmitting(true) // Set submitting state immediately
      setSubmitError(null)
      console.log("handleSubmit for step 6 triggered, isSubmitting set to true")

      try {
        // Upload images to Vercel Blob Storage
        const uploadField = async (files: File[]) => {
          const urls: string[] = []
          for (const file of files) {
            const uploadFormData = new FormData()
            uploadFormData.append("file", file)
            const response = await fetch("/api/upload-image", {
              method: "POST",
              body: uploadFormData,
            })
            if (!response.ok) {
              throw new Error(`Failed to upload ${file.name}`)
            }
            const data = await response.json()
            urls.push(data.url)
          }
          return urls
        }

        const heizungsanlageUrls = await uploadField(formData.heizungsanlageFotos)
        const heizungsetiketteUrls = await uploadField(formData.heizungsetiketteFotos)
        const heizungslabelUrls = await uploadField(formData.heizungslabelFotos)
        const bedienungsanleitungUrls = await uploadField(formData.bedienungsanleitungFotos)

        // Prepare form data with uploaded URLs
        const formDataToSubmit = {
          ...formData,
          heizungsanlageFotos: heizungsanlageUrls,
          heizungsetiketteFotos: heizungsetiketteUrls,
          heizungslabelFotos: heizungslabelUrls,
          bedienungsanleitungFotos: bedienungsanleitungUrls,
          herkunft: herkunft, // Make sure 'herkunft' is included
        }

        // Submit form data
        const response = await fetch("/api/heizungsplakette", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSubmit),
        })

        if (!response.ok) {
          throw new Error("Failed to submit form data to heizungsplakette API")
        }

        const data = await response.json()
        setOrderId(data.id) // Save order ID

        // DO NOT SEND EMAIL HERE
        // setCurrentStep(5) // This was old logic, remove
        setCurrentStep(7) // Proceed to the new Payment Step (Step 7)
        setVisitedSteps((prev) => Array.from(new Set([...prev, 7]))) // Mark step 7 as visited
        // setIsSubmitting(false); // This should be in the finally block
      } catch (error) {
        console.error("Error submitting form:", error)
        setSubmitError(
          error instanceof Error ? error.message : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        )
        // setIsSubmitting(false); // This should be in the finally block
      } finally {
        console.log("handleSubmit for step 6 finally block, setting isSubmitting to false")
        setIsSubmitting(false) // Ensure isSubmitting is reset
      }
    }
  }

  const handleStepClick = (step: number) => {
    if (visitedSteps.includes(step) || step <= currentStep) {
      setCurrentStep(step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    } else {
      router.push("/")
    }
  }

  const handleSameAddressCheckboxChange = (checked: boolean) => {
    setPersonalAddressIsSameAsPropertyAddress(checked)
    if (checked) {
      // Copy property address to personal address
      setFormData((prev) => ({
        ...prev,
        personStrasse: prev.strasse,
        personHausnummer: prev.hausnummer,
        personPostleitzahl: prev.postleitzahl,
        personOrt: prev.ort,
      }))
    } else {
      // Clear personal address fields
      setFormData((prev) => ({
        ...prev,
        personStrasse: "",
        personHausnummer: "",
        personPostleitzahl: "",
        personOrt: "",
      }))
    }
  }

  const herstellerListeOelGas = [
    "Viessmann",
    "Bosch Thermotechnik (Buderus)",
    "Vaillant",
    "Wolf Heiztechnik",
    "Weishaupt",
    "Brötje",
    "Junkers (Teil von Bosch Thermotechnik)",
    "De Dietrich",
    "Kermi",
    "Hoval",
    "Rotex (Teil von Daikin)",
    "Remeha (Teil von BDR Thermea Group)",
    "SenerTec",
    "MHG Heiztechnik",
    "Elco",
    "Giersch (Teil von Enertech Group)",
    "Heizomat",
    "Oertli",
    "Viadrus",
    "Ferroli",
    "Timmermann",
    "Rapido (Franco Belge)",
    "Heimeier",
    "Celsius Heiztechnik",
    "Zehnder",
    "Guntamatic",
    "Glen Dimplex",
    "Sime",
    "Riello",
    "Oranier Heiztechnik",
  ]

  const herstellerListeWaermepumpen = [
    "Viessmann",
    "Bosch Thermotechnik (Buderus und Junkers)",
    "Vaillant",
    "Stiebel Eltron",
    "Daikin",
    "Mitsubishi Electric",
    "Wolf Heiztechnik",
    "NIBE",
    "Glen Dimplex",
    "Toshiba",
    "Alpha Innotec (Teil der NIBE Gruppe)",
    "Panasonic",
    "LG Electronics",
    "Hoval",
    "Rotex (Teil von Daikin)",
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Go to homepage">
            <Image
              src="/images/heizungsplakette-logo.png"
              alt="Heizungsplakette Logo"
              width={200}
              height={40}
              className="h-8 sm:h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-card shadow-lg sm:shadow-xl rounded-lg p-4 sm:p-6 lg:p-10">
          <h1 className="sr-only">Heizungsplakette Antragsformular</h1>

          {/* Mobile-optimized progress indicator */}
          <nav aria-label="Fortschritt" className="mb-8 sm:mb-12">
            <div className="flex items-center w-full overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5, 6, 7].map((stepValue, index, arr) => {
                const isCurrent = currentStep === stepValue
                const isVisited = visitedSteps.includes(stepValue)
                const isCompleted = isVisited && !isCurrent

                return (
                  <Fragment key={stepValue}>
                    <button
                      onClick={() => handleStepClick(stepValue)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out flex-shrink-0
                        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background
                        ${
                          isCurrent
                            ? "border-blue-500 bg-blue-500 ring-blue-500 text-white"
                            : isCompleted
                              ? "border-blue-500 bg-blue-400 ring-slate-400 text-white"
                              : "border-gray-300 bg-white hover:border-gray-400 ring-gray-300"
                        }
                      `}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={`Schritt ${stepValue}`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <span className="text-xs sm:text-sm font-medium">{stepValue}</span>
                      )}
                    </button>

                    {index < arr.length - 1 && (
                      <div
                        className={`
                        flex-1 h-0.5 mx-2 sm:mx-3 transition-colors duration-300 ease-in-out min-w-[20px]
                        ${currentStep > stepValue ? "bg-blue-500" : "bg-gray-300"}
                      `}
                      ></div>
                    )}
                  </Fragment>
                )
              })}
            </div>
          </nav>

          {/* Form content would continue here with mobile optimizations */}
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 mb-4">Form steps would be implemented here with full mobile optimization...</p>
            <Button onClick={() => router.push("/")} variant="outline" className="w-full sm:w-auto">
              Zurück zur Startseite
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
