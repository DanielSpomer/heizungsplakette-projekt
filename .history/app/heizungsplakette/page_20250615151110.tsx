"use client"

import type React from "react"
import { Fragment, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ClipboardList,
  Home,
  MapPin,
  Camera,
  CheckCircle,
  CreditCard,
  Thermometer,
  Building,
  Calendar,
  FileText,
  User,
  Key,
  Factory,
  HelpCircle,
  Check,
  ArrowRight,
  Shield,
  Clock,
  Award,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import DatePicker from "react-datepicker" // Import react-datepicker
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
        setShowWelcomeScreen(true) // Skip welcome screen for main site
        console.log("Herkunft gesetzt auf: Heizungsplakette") // Debugging-Ausgabe
      }
    }
  }, [])

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

  const handleOpenPaymentPopup = () => {
    const popupWidth = 900
    const popupHeight = 800
    const left = (window.screen.width - popupWidth) / 2
    const top = (window.screen.height - popupHeight) / 2
    const windowName = "CopeCartPayment"
    const features = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable,scrollbars`

    if (orderId) {
      // Use 'metadata' query parameter as per CopeCart support
      const copecartCheckoutUrl = `https://copecart.com/products/795e1d47/checkout?metadata=${orderId}`

      const paymentWindow = window.open(copecartCheckoutUrl, windowName, features)
      if (paymentWindow) {
        setIsPollingPaymentStatus(true) // Start polling only if window opened successfully
        setSubmitError(null) // Clear any previous error like "popup blocked"
        console.log("handleOpenPaymentPopup: Popup opened/refreshed. isPollingPaymentStatus set to true.")
      } else {
        // Popup was blocked or failed to open
        setIsPollingPaymentStatus(false) // Ensure polling is not active if window failed
        setSubmitError(
          "Das Zahlungsfenster konnte nicht geöffnet werden. Bitte überprüfen Sie Ihren Popup-Blocker und versuchen Sie es erneut.",
        )
        console.error("handleOpenPaymentPopup: Popup was blocked or failed to open.")
      }
    } else {
      setSubmitError(
        "Ein interner Fehler ist aufgetreten (Bestell-ID nicht gefunden). Bitte laden Sie die Seite neu oder kontaktieren Sie den Support.",
      )
      console.error("handleOpenPaymentPopup: Cannot open payment window: orderId is missing.")
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

  const handleWelcomeContinue = () => {
    setShowWelcomeScreen(false)
  }

  // Welcome Screen for eigentuemer subdomain
  if (showWelcomeScreen) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm" role="banner">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" aria-label="Go to homepage">
              <Image src="/images/heizungsplakette-logo.png" alt="Heizungsplakette Logo" width={250} height={50} />
            </Link>
          </div>
        </header>

        <main className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Willkommen zur Heizungsplakette</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ihre rechtssichere Dokumentation für das neue Heizungsgesetz – schnell, einfach und von Experten geprüft.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rechtssicherheit</h3>
              <p className="text-gray-600">
                Ihre Heizungsplakette dokumentiert rechtssicher, wie lange Ihre Heizung nach dem neuen Heizungsgesetz
                noch betrieben werden darf.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Schnelle Bearbeitung</h3>
              <p className="text-gray-600">
                Innerhalb von 48 Stunden erhalten Sie Ihre geprüfte Heizungsplakette per E-Mail. Einfach, schnell und
                zuverlässig.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expertenprüfung</h3>
              <p className="text-gray-600">
                Alle Angaben werden von unseren Experten mit den gesetzlichen Vorgaben des Gebäudeenergiegesetzes
                abgeglichen.
              </p>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-blue-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-center">Warum ist eine Heizungsplakette wichtig?</h2>
            <div className="max-w-4xl mx-auto space-y-4 text-gray-700">
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

          {/* CTA Section */}
          <div className="text-center">
            <Button
              onClick={handleWelcomeContinue}
              className="bg-blue-600 text-white rounded-full px-12 py-6 text-lg font-medium hover:bg-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Jetzt Heizungsplakette beantragen
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Nur 49,00 € inkl. MwSt. • Sichere Bezahlung • 48h Bearbeitungszeit
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Go to homepage">
            <Image src="/images/heizungsplakette-logo.png" alt="Heizungsplakette Logo" width={250} height={50} />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {" "}
        {/* Changed py-12 to py-6 */}
        <div className="bg-card shadow-xl rounded-lg p-10">
          {" "}
          {/* Increased p-6 to p-10, shadow-md to shadow-xl */}
          <h1 className="sr-only">Heizungsplakette Antragsformular</h1>
          <nav aria-label="Fortschritt" className="mb-12">
            {" "}
            {/* Added mb-12 here for overall spacing below nav */}
            <div className="flex items-center w-full">
              {[1, 2, 3, 4, 5, 6, 7].map((stepValue, index, arr) => {
                const isCurrent = currentStep === stepValue
                const isVisited = visitedSteps.includes(stepValue)
                const isCompleted = isVisited && !isCurrent

                return (
                  <Fragment key={stepValue}>
                    <button
                      onClick={() => handleStepClick(stepValue)}
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background
                        ${
                          isCurrent
                            ? "border-blue-500 bg-blue-500 ring-blue-500"
                            : /* Changed bg-white to bg-blue-500 */
                              isCompleted
                              ? "border-blue-500 bg-blue-400 ring-slate-400"
                              : "border-gray-300 bg-white hover:border-gray-400 ring-gray-300"
                        }
                      `}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={`Schritt ${stepValue}`}
                    >
                      {isCompleted && <Check className="w-4 h-4 text-black" />}
                    </button>

                    {index < arr.length - 1 && (
                      <div
                        className={`
                        flex-1 h-0.5 transition-colors duration-300 ease-in-out
                        ${currentStep > stepValue ? "bg-blue-500" : "bg-gray-300"}
                      `}
                      ></div>
                    )}
                  </Fragment>
                )
              })}
            </div>
            {/* Old ol and progress bar div removed */}
          </nav>
          <form onSubmit={handleSubmit} className="space-y-8 mt-8">
            {" "}
            {/* mt-8 provides space below new progress indicator */}
            {currentStep === 1 && (
              <div className="step-content-animate-in">
                <fieldset>
                  <legend className="text-3xl font-semibold mb-8 flex items-center">
                    {" "}
                    {/* Increased text-xl to text-3xl, mb-4 to mb-8 */}
                    <ClipboardList className="h-8 w-8 mr-3 text-blue-600" aria-hidden="true" />{" "}
                    {/* Increased icon size and mr-2 to mr-3 */}
                    Richtlinien und Bedingungen
                  </legend>
                  <div className="mb-4  space-y-4">
                    <p>Herzlich willkommen bei &bdquo;heizungsplakette.de&ldquo;!</p>
                    <p>
                      Auf Basis Ihrer Angaben erstellen wir eine Heizungsplakette für Ihre Heizung, aus der hervorgeht,
                      wie lange diese noch betrieben werden darf. Bevor wir Ihnen die Heizungsplakette per E-Mail
                      zusenden, überprüfen wir Ihre Eingaben sorgfältig.
                    </p>
                    <p>
                      Bitte rechnen Sie damit, dass Sie die Heizungsplakette innerhalb von etwa 48 Stunden per E-Mail
                      erhalten. Diese Zeit benötigen wir, um Ihre Angaben mit den gesetzlichen Vorgaben des
                      Heizungsgesetzes abzugleichen.
                    </p>
                    <p>Bei Fragen wenden Sie sich gerne jederzeit per E-Mail an: service@heizungsplakette.de</p>
                  </div>
                  <div className="space-y-6">
                    {" "}
                    {/* Increased space-y-4 to space-y-6 */}
                    <div className="flex items-center space-x-3 text-sm text-gray-700">
                      {" "}
                      {/* Increased space-x-2 to space-x-3 */}
                      <Checkbox
                        id="datenschutzUndNutzungsbedingungen"
                        checked={formData.datenschutzUndNutzungsbedingungen}
                        onCheckedChange={handleCheckboxChange("datenschutzUndNutzungsbedingungen")}
                      />
                      <Label htmlFor="datenschutzUndNutzungsbedingungen" className="text-sm">
                        Ich stimme den{" "}
                        <a
                          href="/Datenschutzhinweis.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Datenschutzhinweisen
                        </a>
                        , der{" "}
                        <a
                          href="/Widerrufsbelehrung.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Widerrufsbelehrung
                        </a>{" "}
                        und den{" "}
                        <a
                          href="/Nutzungsbedingungen.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Nutzungsbedingungen
                        </a>{" "}
                        zu
                      </Label>
                    </div>
                    {errors.datenschutzUndNutzungsbedingungen && (
                      <p className="text-red-500" role="alert">
                        {errors.datenschutzUndNutzungsbedingungen}
                      </p>
                    )}
                    <div className="flex items-center space-x-3">
                      {" "}
                      {/* Increased space-x-2 to space-x-3 */}
                      <Checkbox
                        id="einwilligungDatenverarbeitung"
                        checked={formData.einwilligungDatenverarbeitung}
                        onCheckedChange={handleCheckboxChange("einwilligungDatenverarbeitung")}
                      />
                      <Label htmlFor="einwilligungDatenverarbeitung" className="text-sm text-gray-700">
                        {" "}
                        {/* Softer text */}
                        Ich erkläre mich mit der Verarbeitung meiner personenbezogenen Daten zum Zweck der Übermittlung
                        weiterer Informationen rund um die Heizungsplakette, das GEG sowie weiterer fachlicher und/oder
                        technischer Informationen und der Kontaktaufnahme per Telefon und/oder E-Mail einverstanden und
                        kann diese Einwilligungserklärung gegenüber dem Anbieter jederzeit widerrufen
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      {" "}
                      {/* Increased space-x-2 to space-x-3 */}
                      <Checkbox
                        id="aufforderungSofortigeTaetigkeit"
                        checked={formData.aufforderungSofortigeTaetigkeit}
                        onCheckedChange={handleCheckboxChange("aufforderungSofortigeTaetigkeit")}
                      />
                      <Label htmlFor="aufforderungSofortigeTaetigkeit" className="text-sm text-gray-700">
                        {" "}
                        {/* Softer text */}
                        Ich verlange ausdrücklich, dass Sie mit Ihrer Leistung vor Ablauf der Widerrufsfrist beginnen.
                        Mir ist bekannt, dass mein Widerrufsrecht bei vollständiger Vertragserfüllung durch Sie erlischt
                        (§ 356 Abs. 4 BGB). Mir ist ebenfalls bekannt, dass ich Wertersatz für die bis zum Widerruf
                        erbrachten Leistungen gem. § 357 a Abs. 2 BGB schulde, wenn ich den Vertrag fristgemäß
                        widerrufe.
                      </Label>
                    </div>
                    {errors.aufforderungSofortigeTaetigkeit && (
                      <p className="text-red-500 text-sm mt-1" role="alert">
                        {" "}
                        {/* Added text-sm, mt-1 */}
                        {errors.aufforderungSofortigeTaetigkeit}
                      </p>
                    )}
                  </div>
                </fieldset>
              </div>
            )}
            {currentStep === 2 && (
              <div className="step-content-animate-in">
                <fieldset>
                  <legend className="text-3xl font-semibold mb-8 flex items-center">
                    {" "}
                    {/* Increased text-xl to text-3xl, mb-4 to mb-8 */}
                    <Home className="h-8 w-8 mr-3 text-blue-600" aria-hidden="true" />{" "}
                    {/* Increased icon size and mr-2 to mr-3 */}
                    Grundlegende Informationen
                  </legend>
                  <div className="space-y-6">
                    {" "}
                    {/* Increased space-y-4 to space-y-6 */}
                    <div>
                      <Label htmlFor="artDerImmobilie" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Art der Immobilie *
                      </Label>
                      <Select
                        name="artDerImmobilie"
                        onValueChange={handleSelectChange("artDerImmobilie")}
                        value={formData.artDerImmobilie}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Wählen Sie die Art der Immobilie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Einfamilienhaus">Einfamilienhaus</SelectItem>
                          <SelectItem value="Mehrfamilienhaus">Mehrfamilienhaus</SelectItem>
                          <SelectItem value="Doppelhaushälfte">Doppelhaushälfte</SelectItem>
                          <SelectItem value="Reihenhaus">Reihenhaus</SelectItem>
                          <SelectItem value="Sonstige">Sonstige</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.artDerImmobilie && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {" "}
                          {/* Added text-sm, mt-1 */}
                          {errors.artDerImmobilie}
                        </p>
                      )}
                    </div>
                    {formData.artDerImmobilie === "Sonstige" && (
                      <div>
                        <Label htmlFor="artDerImmobilieSonstige" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Sonstige Art der Immobilie *
                        </Label>
                        <Input
                          id="artDerImmobilieSonstige"
                          name="artDerImmobilieSonstige"
                          value={formData.artDerImmobilieSonstige}
                          onChange={handleInputChange}
                          placeholder="Bitte spezifizieren Sie die Art der Immobilie"
                        />
                        {errors.artDerImmobilieSonstige && (
                          <p className="text-red-500 text-sm mt-1" role="alert">
                            {" "}
                            {/* Added text-sm, mt-1 */}
                            {errors.artDerImmobilieSonstige}
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <Label htmlFor="heizungsart" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Heizungsart *
                      </Label>
                      <Select
                        name="heizungsart"
                        onValueChange={handleSelectChange("heizungsart")}
                        value={formData.heizungsart}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Wählen Sie die Heizungsart" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gasheizung">Gasheizung</SelectItem>
                          <SelectItem value="Ölheizung">Ölheizung</SelectItem>
                          <SelectItem value="Wärmepumpe">Wärmepumpe</SelectItem>
                          <SelectItem value="Sonstige">Sonstige</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.heizungsart && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {" "}
                          {/* Added text-sm, mt-1 */}
                          {errors.heizungsart}
                        </p>
                      )}
                    </div>
                    {formData.heizungsart === "Sonstige" && (
                      <div>
                        <Label htmlFor="heizungsartSonstige" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Sonstige Heizungsart *
                        </Label>
                        <Input
                          id="heizungsartSonstige"
                          name="heizungsartSonstige"
                          value={formData.heizungsartSonstige}
                          onChange={handleInputChange}
                          placeholder="Bitte spezifizieren Sie die Heizungsart"
                        />
                        {errors.heizungsartSonstige && (
                          <p className="text-red-500 text-sm mt-1" role="alert">
                            {" "}
                            {/* Added text-sm, mt-1 */}
                            {errors.heizungsartSonstige}
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <Label htmlFor="alterDerHeizung" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Alter der Heizung *
                      </Label>
                      <Select
                        name="alterDerHeizung"
                        onValueChange={handleSelectChange("alterDerHeizung")}
                        value={formData.alterDerHeizung}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Wählen Sie das Alter der Heizung" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weniger als 10 Jahre">weniger als 10 Jahre</SelectItem>
                          <SelectItem value="weniger als 20 Jahre">weniger als 20 Jahre</SelectItem>
                          <SelectItem value="weniger als 30 Jahre">weniger als 30 Jahre</SelectItem>
                          <SelectItem value="30 Jahre oder älter">30 Jahre oder älter</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.alterDerHeizung && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {" "}
                          {/* Added text-sm, mt-1 */}
                          {errors.alterDerHeizung}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        E-Mail *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Ihre E-Mail-Adresse"
                        type="email"
                        aria-required="true"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {" "}
                          {/* Added text-sm, mt-1 */}
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </fieldset>
              </div>
            )}
            {currentStep === 3 && (
              <div className="step-content-animate-in">
                <fieldset>
                  <legend className="text-3xl font-semibold mb-8 flex items-center">
                    {" "}
                    {/* Increased text-xl to text-3xl, mb-4 to mb-8 */}
                    <MapPin className="h-8 w-8 mr-3 text-blue-600" aria-hidden="true" />{" "}
                    {/* Increased icon size and mr-2 to mr-3 */}
                    Adresse der Immobilie
                  </legend>
                  <div className="space-y-6">
                    {" "}
                    {/* Increased space-y-4 to space-y-6 */}
                    <div>
                      <Label htmlFor="strasse" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Straße *
                      </Label>
                      <Input
                        id="strasse"
                        name="strasse"
                        value={formData.strasse}
                        onChange={handleInputChange}
                        placeholder="Straßenname"
                        aria-required="true"
                      />
                      {errors.strasse && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {" "}
                          {/* Added text-sm, mt-1 */}
                          {errors.strasse}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="hausnummer" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Hausnummer *
                      </Label>
                      <Input
                        id="hausnummer"
                        name="hausnummer"
                        value={formData.hausnummer}
                        onChange={handleInputChange}
                        placeholder="Hausnummer"
                        aria-required="true"
                      />
                      {errors.hausnummer && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {" "}
                          {/* Added text-sm, mt-1 */}
                          {errors.hausnummer}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postleitzahl" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Postleitzahl *
                      </Label>
                      <Input
                        id="postleitzahl"
                        name="postleitzahl"
                        value={formData.postleitzahl}
                        onChange={handleInputChange}
                        placeholder="PLZ"
                        aria-required="true"
                      />
                      {errors.postleitzahl && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {" "}
                          {/* Added text-sm, mt-1 */}
                          {errors.postleitzahl}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ort" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Ort *
                      </Label>
                      <Input
                        id="ort"
                        name="ort"
                        value={formData.ort}
                        onChange={handleInputChange}
                        placeholder="Ort"
                        aria-required="true"
                      />
                      {errors.ort && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {" "}
                          {/* Added text-sm, mt-1 */}
                          {errors.ort}
                        </p>
                      )}
                    </div>
                    {addressValidationMessage && (
                      <Alert variant={addressValidationMessage.includes("erfolgreich") ? "default" : "destructive"}>
                        <AlertTitle>Adressvalidierung</AlertTitle>
                        <AlertDescription>{addressValidationMessage}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </fieldset>
                {/* Persönliche Daten and Eigentümer sections will be MOVED FROM HERE to Step 4 */}
              </div>
            )}
            {currentStep === 4 && (
              <div className="step-content-animate-in">
                <>
                  <fieldset>
                    <legend className="text-3xl font-semibold mb-8 flex items-center">
                      {" "}
                      {/* Increased text-xl to text-3xl, mb-4 to mb-8 */}
                      <Thermometer className="h-8 w-8 mr-3 text-blue-600" aria-hidden="true" />{" "}
                      {/* Increased icon size and mr-2 to mr-3 */}
                      Angaben zur Heizung
                    </legend>
                    <div className="space-y-6">
                      {" "}
                      {/* Increased space-y-4 to space-y-6 */}
                      <div>
                        <h3 className="text-xl font-semibold flex items-center mb-3">
                          {" "}
                          {/* Increased text-lg to text-xl, added mb-3 */}
                          <Building className="h-6 w-6 mr-2 text-blue-600" /> {/* Increased icon size */}
                          Heizsystem
                        </h3>
                        <Label htmlFor="heizsystem" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Heizsystem *
                        </Label>
                        <Select
                          name="heizsystem"
                          onValueChange={handleSelectChange("heizsystem")}
                          value={formData.heizsystem}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wählen Sie das Heizsystem" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Zentralheizung">Zentralheizung</SelectItem>
                            <SelectItem value="Etagenheizung">Etagenheizung</SelectItem>
                            <SelectItem value="Einzelraumheizung">Einzelraumheizung</SelectItem>
                            <SelectItem value="Sonstige">Sonstige</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.heizsystem && <p className="text-red-500 text-sm mt-1">{errors.heizsystem}</p>}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      {formData.heizsystem === "Sonstige" && (
                        <div>
                          <Label htmlFor="heizsystemSonstige" className="font-semibold block mb-2">
                            {" "}
                            {/* Added block mb-2 */}
                            Sonstiges Heizsystem *
                          </Label>
                          <Input
                            id="heizsystemSonstige"
                            name="heizsystemSonstige"
                            value={formData.heizsystemSonstige}
                            onChange={handleInputChange}
                            placeholder="Bitte spezifizieren Sie das Heizsystem"
                          />
                          {errors.heizsystemSonstige && (
                            <p className="text-red-500 text-sm mt-1">{errors.heizsystemSonstige}</p>
                          )}{" "}
                          {/* Added text-sm, mt-1 */}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold flex items-center mb-3">
                          {" "}
                          {/* Increased text-lg to text-xl, added mb-3 */}
                          <Factory className="h-6 w-6 mr-2 text-blue-600" /> {/* Increased icon size */}
                          Heizungshersteller
                        </h3>
                        <Label htmlFor="heizungshersteller" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Heizungshersteller *
                        </Label>
                        {formData.heizungsart === "Sonstige" ? (
                          <Input
                            id="heizungshersteller"
                            name="heizungshersteller"
                            value={formData.heizungshersteller}
                            onChange={handleInputChange}
                            placeholder="Geben Sie den Herstelleran"
                          />
                        ) : (
                          <Select
                            name="heizungshersteller"
                            onValueChange={handleSelectChange("heizungshersteller")}
                            value={formData.heizungshersteller}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Wählen Sie den Heizungshersteller" />
                              <SelectContent>
                                {(formData.heizungsart === "Wärmepumpe"
                                  ? herstellerListeWaermepumpen
                                  : herstellerListeOelGas
                                ).map((hersteller) => (
                                  <SelectItem key={hersteller} value={hersteller}>
                                    {hersteller}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </SelectTrigger>
                          </Select>
                        )}
                        {errors.heizungshersteller && (
                          <p className="text-red-500 text-sm mt-1">{errors.heizungshersteller}</p>
                        )}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center mb-3">
                          {" "}
                          {/* Increased text-lg to text-xl, added mb-3 */}
                          <Calendar className="h-6 w-6 mr-2 text-blue-600" /> {/* Increased icon size */}
                          Baujahr der Heizung
                        </h3>
                        <Label htmlFor="baujahr" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Baujahr der Heizung *
                        </Label>
                        <Input
                          id="baujahr"
                          name="baujahr"
                          value={formData.baujahr}
                          onChange={handleInputChange}
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                        {errors.baujahr && <p className="text-red-500 text-sm mt-1">{errors.baujahr}</p>}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center mb-3">
                          {" "}
                          {/* Increased text-lg to text-xl, added mb-3 */}
                          <FileText className="h-6 w-6 mr-2 text-blue-600" /> {/* Increased icon size */}
                          Typenbezeichnung
                        </h3>
                        <Label htmlFor="typenbezeichnung" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Typenbezeichnung *
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="typenbezeichnung"
                            name="typenbezeichnung"
                            value={formData.typenbezeichnung}
                            onChange={handleInputChange}
                            placeholder="Geben Sie die Typenbezeichnung ein"
                            disabled={formData.typenbezeichnungUnbekannt}
                          />
                          <div className="flex items-center">
                            <Checkbox
                              id="typenbezeichnungUnbekannt"
                              checked={formData.typenbezeichnungUnbekannt}
                              onCheckedChange={handleCheckboxChange("typenbezeichnungUnbekannt")}
                            />
                            <Label htmlFor="typenbezeichnungUnbekannt" className="ml-2">
                              Unbekannt
                            </Label>
                          </div>
                        </div>
                        {errors.typenbezeichnung && (
                          <p className="text-red-500 text-sm mt-1">{errors.typenbezeichnung}</p>
                        )}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center mb-3">
                          {" "}
                          {/* Increased text-lg to text-xl, added mb-3 */}
                          <Thermometer className="h-6 w-6 mr-2 text-blue-600" /> {/* Increased icon size */}
                          Heizungstechnik
                        </h3>
                        <Label htmlFor="heizungstechnik" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Heizungstechnik *
                        </Label>
                        <Select
                          name="heizungstechnik"
                          onValueChange={handleSelectChange("heizungstechnik")}
                          value={formData.heizungstechnik}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wählen Sie die Heizungstechnik" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Brennwerttechnik">Brennwerttechnik</SelectItem>
                            <SelectItem value="Niedertemperaturkessel">Niedertemperaturkessel</SelectItem>
                            <SelectItem value="Konstanttemperatur">Konstanttemperatur</SelectItem>
                            <SelectItem value="Unbekannt">Unbekannt</SelectItem>
                            <SelectItem value="Sonstige">Sonstige</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.heizungstechnik && (
                          <p className="text-red-500 text-sm mt-1">{errors.heizungstechnik}</p>
                        )}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      {formData.heizungstechnik === "Sonstige" && (
                        <div>
                          <Label htmlFor="heizungstechnikSonstige" className="font-semibold block mb-2">
                            {" "}
                            {/* Added block mb-2 */}
                            Sonstige Heizungstechnik *
                          </Label>
                          <Input
                            id="heizungstechnikSonstige"
                            name="heizungstechnikSonstige"
                            value={formData.heizungstechnikSonstige}
                            onChange={handleInputChange}
                            placeholder="Bitte spezifizieren Sie die Heizungstechnik"
                          />
                          {errors.heizungstechnikSonstige && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.heizungstechnikSonstige}
                            </p> /* Added text-sm, mt-1 */
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold flex items-center mb-3">
                          {" "}
                          {/* Increased text-lg to text-xl, added mb-3 */}
                          <Thermometer className="h-6 w-6 mr-2 text-blue-600" /> {/* Increased icon size */}
                          Energieträger
                        </h3>
                        <Label htmlFor="energietraeger" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Energieträger *
                        </Label>
                        <Select
                          name="energietraeger"
                          onValueChange={handleSelectChange("energietraeger")}
                          value={formData.energietraeger}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wählen Sie den Energieträger" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Strom">Strom</SelectItem>
                            <SelectItem value="Gas">Gas</SelectItem>
                            <SelectItem value="Öl">Öl</SelectItem>
                            <SelectItem value="Kohle">Kohle</SelectItem>
                            <SelectItem value="Holz/Pellet">Holz/Pellet</SelectItem>
                            <SelectItem value="Torf">Torf</SelectItem>
                            <SelectItem value="Unbekannt">Unbekannt</SelectItem>
                            <SelectItem value="Sonstige">Sonstige</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.energietraeger && <p className="text-red-500 text-sm mt-1">{errors.energietraeger}</p>}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      {formData.energietraeger === "Sonstige" && (
                        <div>
                          <Label htmlFor="energietraegerSonstige" className="font-semibold block mb-2">
                            {" "}
                            {/* Added block mb-2 */}
                            Sonstiger Energieträger *
                          </Label>
                          <Input
                            id="energietraegerSonstige"
                            name="energietraegerSonstige"
                            value={formData.energietraegerSonstige}
                            onChange={handleInputChange}
                            placeholder="Bitte spezifizieren Sie den Energieträger"
                          />
                          {errors.energietraegerSonstige && (
                            <p className="text-red-500 text-sm mt-1">{errors.energietraegerSonstige}</p>
                          )}{" "}
                          {/* Added text-sm, mt-1 */}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold flex items-center mb-3">
                          {" "}
                          {/* Increased text-lg to text-xl, added mb-3 */}
                          <FileText className="h-6 w-6 mr-2 text-blue-600" /> {/* Increased icon size */}
                          Heizungslabel
                        </h3>
                        <Label htmlFor="energielabel" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Existiert ein Heizungslabel? *
                        </Label>
                        <RadioGroup
                          name="energielabel"
                          value={formData.energielabel}
                          onValueChange={handleSelectChange("energielabel")}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Ja" id="energielabelJa" />
                            <Label htmlFor="energielabelJa" className="text-gray-700">
                              Ja
                            </Label>{" "}
                            {/* Softer text */}
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Nein" id="energielabelNein" />
                            <Label htmlFor="energielabelNein" className="text-gray-700">
                              Nein
                            </Label>{" "}
                            {/* Softer text */}
                          </div>
                        </RadioGroup>
                        {errors.energielabel && <p className="text-red-500 text-sm mt-1">{errors.energielabel}</p>}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center mb-3">
                          {" "}
                          {/* Increased text-lg to text-xl, added mb-3 */}
                          <FileText className="h-6 w-6 mr-2 text-blue-600" /> {/* Increased icon size */}
                          Energieausweis
                        </h3>
                        <Label htmlFor="energieausweis" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Liegt ein Energieausweis vor? *
                        </Label>
                        <RadioGroup
                          name="energieausweis"
                          value={formData.energieausweis}
                          onValueChange={handleSelectChange("energieausweis")}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Ja" id="energieausweisJa" />
                            <Label htmlFor="energieausweisJa" className="text-gray-700">
                              Ja
                            </Label>{" "}
                            {/* Softer text */}
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Nein" id="energieausweisNein" />
                            <Label htmlFor="energieausweisNein" className="text-gray-700">
                              Nein
                            </Label>{" "}
                            {/* Softer text */}
                          </div>
                        </RadioGroup>
                        {errors.energieausweis && <p className="text-red-500 text-sm mt-1">{errors.energieausweis}</p>}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      {formData.energieausweis === "Ja" && (
                        <div>
                          <Label htmlFor="energieausweisDate" className="font-semibold block mb-2">
                            {" "}
                            {/* Added block mb-2 */}
                            Datum des Energieausweises *
                          </Label>
                          <DatePicker
                            id="energieausweisDate"
                            selected={formData.energieausweisDate ? new Date(formData.energieausweisDate) : null}
                            onChange={(date) => handleDateChange(date, "energieausweisDate")}
                            dateFormat="dd/MM/yyyy"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholderText="TT/MM/JJJJ"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            maxDate={new Date()} // Prevent future dates
                            popperPlacement="bottom-start"
                          />
                          {errors.energieausweisDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.energieausweisDate}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </fieldset>
                  {/* Persönliche Daten and Eigentümer sections will be INSERTED HERE */}
                  <div className="mt-8">
                    {" "}
                    {/* Added mt-8 for spacing */}
                    <h3 className="text-2xl font-semibold flex items-center mt-6 mb-6">
                      {" "}
                      {/* Increased text-lg to text-2xl, mb-4 to mb-6 */}
                      <User className="h-7 w-7 mr-3 text-blue-600" /> {/* Increased icon size */}
                      Persönliche Daten
                    </h3>
                    <div className="space-y-6">
                      {" "}
                      {/* Increased space-y-4 to space-y-6 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {" "}
                        {/* Increased gap-4 to gap-6 */}
                        <div>
                          <Label htmlFor="vorname" className="font-semibold block mb-2">
                            Vorname *
                          </Label>{" "}
                          {/* Added block mb-2 */}
                          <Input
                            id="vorname"
                            name="vorname"
                            value={formData.vorname}
                            onChange={handleInputChange}
                            placeholder="Vorname"
                          />
                          {errors.vorname && <p className="text-red-500 text-sm mt-1">{errors.vorname}</p>}{" "}
                          {/* Added text-sm, mt-1 */}
                        </div>
                        <div>
                          <Label htmlFor="nachname" className="font-semibold block mb-2">
                            Nachname *
                          </Label>{" "}
                          {/* Added block mb-2 */}
                          <Input
                            id="nachname"
                            name="nachname"
                            value={formData.nachname}
                            onChange={handleInputChange}
                            placeholder="Nachname"
                          />
                          {errors.nachname && <p className="text-red-500 text-sm mt-1">{errors.nachname}</p>}{" "}
                          {/* Added text-sm, mt-1 */}
                        </div>
                      </div>
                      {/* Checkbox for copying address */}
                      <div className="flex items-center space-x-3 pt-2">
                        {" "}
                        {/* Increased space-x-2 to space-x-3 */}
                        <Checkbox
                          id="personalAddressIsSame"
                          checked={personalAddressIsSameAsPropertyAddress}
                          onCheckedChange={handleSameAddressCheckboxChange} // We will create this handler next
                        />
                        <Label htmlFor="personalAddressIsSame" className="text-sm text-gray-700">
                          {" "}
                          {/* Softer text */}
                          Meine persönliche Adresse ist identisch mit der Adresse der Immobilie.
                        </Label>
                      </div>
                      <div>
                        <Label htmlFor="personStrasse" className="font-semibold block mb-2">
                          Straße *
                        </Label>{" "}
                        {/* Added block mb-2 */}
                        <Input
                          id="personStrasse"
                          name="personStrasse"
                          value={formData.personStrasse}
                          onChange={handleInputChange}
                          placeholder="Straße"
                          disabled={personalAddressIsSameAsPropertyAddress}
                        />
                        {errors.personStrasse && <p className="text-red-500 text-sm mt-1">{errors.personStrasse}</p>}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      <div>
                        <Label htmlFor="personHausnummer" className="font-semibold block mb-2">
                          Hausnummer *
                        </Label>{" "}
                        {/* Added block mb-2 */}
                        <Input
                          id="personHausnummer"
                          name="personHausnummer"
                          value={formData.personHausnummer}
                          onChange={handleInputChange}
                          placeholder="Hausnummer"
                          disabled={personalAddressIsSameAsPropertyAddress}
                        />
                        {errors.personHausnummer && (
                          <p className="text-red-500 text-sm mt-1">{errors.personHausnummer}</p>
                        )}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      <div>
                        <Label htmlFor="personPostleitzahl" className="font-semibold block mb-2">
                          Postleitzahl *
                        </Label>{" "}
                        {/* Added block mb-2 */}
                        <Input
                          id="personPostleitzahl"
                          name="personPostleitzahl"
                          value={formData.personPostleitzahl}
                          onChange={handleInputChange}
                          placeholder="PLZ"
                          disabled={personalAddressIsSameAsPropertyAddress}
                        />
                        {errors.personPostleitzahl && (
                          <p className="text-red-500 text-sm mt-1">{errors.personPostleitzahl}</p>
                        )}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                      <div>
                        <Label htmlFor="personOrt" className="font-semibold block mb-2">
                          Ort *
                        </Label>{" "}
                        {/* Added block mb-2 */}
                        <Input
                          id="personOrt"
                          name="personOrt"
                          value={formData.personOrt}
                          onChange={handleInputChange}
                          placeholder="Ort"
                          disabled={personalAddressIsSameAsPropertyAddress}
                        />
                        {errors.personOrt && <p className="text-red-500 text-sm mt-1">{errors.personOrt}</p>}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    {" "}
                    {/* Added mt-8 for spacing */}
                    <h3 className="text-2xl font-semibold flex items-center mt-6 mb-6">
                      {" "}
                      {/* Increased text-lg to text-2xl, mb-4 to mb-6 */}
                      <Key className="h-7 w-7 mr-3 text-blue-600" /> {/* Increased icon size */}
                      Eigentümer
                    </h3>
                    <div className="space-y-6">
                      {" "}
                      {/* Increased space-y-4 to space-y-6 */}
                      <Label htmlFor="istEigentuemer" className="font-semibold block mb-2">
                        Sind Sie der Eigentümer der Immobilie? *
                      </Label>{" "}
                      {/* Added block mb-2 */}
                      <RadioGroup
                        name="istEigentuemer"
                        value={formData.istEigentuemer}
                        onValueChange={handleSelectChange("istEigentuemer")}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Ja" id="istEigentuemerJa" />
                          <Label htmlFor="istEigentuemerJa" className="text-gray-700">
                            Ja
                          </Label>{" "}
                          {/* Softer text */}
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Nein" id="istEigentuemerNein" />
                          <Label htmlFor="istEigentuemerNein" className="text-gray-700">
                            Nein
                          </Label>{" "}
                          {/* Softer text */}
                        </div>
                      </RadioGroup>
                      {errors.istEigentuemer && <p className="text-red-500 text-sm mt-1">{errors.istEigentuemer}</p>}{" "}
                      {/* Added text-sm, mt-1 */}
                    </div>
                  </div>
                </>
              </div>
            )}
            {currentStep === 5 && (
              <div className="step-content-animate-in">
                <>
                  <div className="flex items-center justify-between mb-8">
                    {" "}
                    {/* Increased mb-4 to mb-8 */}
                    <h2 className="text-3xl font-semibold flex items-center">
                      {" "}
                      {/* Increased text-xl to text-3xl */}
                      <Camera className="h-8 w-8 mr-3 text-blue-600" /> {/* Increased icon size */}
                      Fotos hochladen
                    </h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-5 w-5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Bitte laden Sie hier Fotos von Ihrer Heizungsanlage hoch. Die Fotos helfen uns, die Angaben
                            zu überprüfen und die Heizungsplakette korrekt auszustellen. Falls Sie keine Fotos hochladen
                            möchten oder können, haben Sie die Möglichkeit, darauf zu verzichten. Bitte beachten Sie,
                            dass in diesem Fall möglicherweise nicht alle Vorteile des Heizungsgesetzes für Sie genutzt
                            werden können.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-8">
                    {" "}
                    {/* Increased space-y-4 to space-y-8 */}
                    <div>
                      <Label htmlFor="heizungsanlageFotos" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Fotos der Heizungsanlage (max. 3)
                      </Label>
                      <label className="block relative cursor-pointer">
                        <input
                          id="heizungsanlageFotos"
                          name="heizungsanlageFotos"
                          type="file"
                          multiple
                          onChange={handleFileChange("heizungsanlageFotos")}
                          accept="image/*"
                          max="3"
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="border rounded px-3 py-2 bg-white text-gray-700 flex items-center min-h-[40px]">
                          {formData.heizungsanlageFotos.length > 0
                            ? formData.heizungsanlageFotos.map((f) => f.name).join(", ")
                            : "Dateien auswählen..."}
                        </div>
                      </label>
                      <div className="flex items-center mt-2">
                        <Checkbox
                          id="verzichtAufHeizungsanlageFotos"
                          checked={formData.verzichtAufHeizungsanlageFotos}
                          onCheckedChange={handleCheckboxChange("verzichtAufHeizungsanlageFotos")}
                        />
                        <Label htmlFor="verzichtAufHeizungsanlageFotos" className="ml-2 text-sm text-gray-700">
                          {" "}
                          {/* Softer text */}
                          Ich verzichte auf das Hochladen von Fotos der Heizungsanlage
                        </Label>
                      </div>
                      {errors.heizungsanlageFotos && (
                        <p className="text-red-500 text-sm mt-1">{errors.heizungsanlageFotos}</p>
                      )}{" "}
                      {/* Added text-sm, mt-1 */}
                    </div>
                    <div>
                      <Label htmlFor="heizungsetiketteFotos" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Fotos der Typenschildes (max. 3)
                      </Label>
                      <label className="block relative cursor-pointer">
                        <input
                          id="heizungsetiketteFotos"
                          name="heizungsetiketteFotos"
                          type="file"
                          multiple
                          onChange={handleFileChange("heizungsetiketteFotos")}
                          accept="image/*"
                          max="3"
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="border rounded px-3 py-2 bg-white text-gray-700 flex items-center min-h-[40px]">
                          {formData.heizungsetiketteFotos.length > 0
                            ? formData.heizungsetiketteFotos.map((f) => f.name).join(", ")
                            : "Dateien auswählen..."}
                        </div>
                      </label>
                      <div className="flex items-center mt-2">
                        <Checkbox
                          id="verzichtAufHeizungsetiketteFotos"
                          checked={formData.verzichtAufHeizungsetiketteFotos}
                          onCheckedChange={handleCheckboxChange("verzichtAufHeizungsetiketteFotos")}
                        />
                        <Label htmlFor="verzichtAufHeizungsetiketteFotos" className="ml-2 text-sm text-gray-700">
                          {" "}
                          {/* Softer text */}
                          Ich verzichte auf das Hochladen von Fotos der Typenschildes
                        </Label>
                      </div>
                      {errors.heizungsetiketteFotos && (
                        <p className="text-red-500 text-sm mt-1">{errors.heizungsetiketteFotos}</p>
                      )}{" "}
                      {/* Added text-sm, mt-1 */}
                    </div>
                    {formData.energielabel === "Ja" && (
                      <div>
                        <Label htmlFor="heizungslabelFotos" className="font-semibold block mb-2">
                          {" "}
                          {/* Added block mb-2 */}
                          Foto des Heizungslabels (max. 1)
                        </Label>
                        <label className="block relative cursor-pointer">
                          <input
                            id="heizungslabelFotos"
                            name="heizungslabelFotos"
                            type="file"
                            onChange={handleFileChange("heizungslabelFotos")}
                            accept="image/*"
                            max="1"
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                          />
                          <div className="border rounded px-3 py-2 bg-white text-gray-700 flex items-center min-h-[40px]">
                            {formData.heizungslabelFotos.length > 0
                              ? formData.heizungslabelFotos.map((f) => f.name).join(", ")
                              : "Dateien auswählen..."}
                          </div>
                        </label>
                        <div className="flex items-center mt-2">
                          <Checkbox
                            id="verzichtAufHeizungslabelFotos"
                            checked={formData.verzichtAufHeizungslabelFotos}
                            onCheckedChange={handleCheckboxChange("verzichtAufHeizungslabelFotos")}
                          />
                          <Label htmlFor="verzichtAufHeizungslabelFotos" className="ml-2 text-sm text-gray-700">
                            {" "}
                            {/* Softer text */}
                            Ich verzichte auf das Hochladen vom Foto zum Heizungslabel
                          </Label>
                        </div>
                        {errors.heizungslabelFotos && (
                          <p className="text-red-500 text-sm mt-1">{errors.heizungslabelFotos}</p>
                        )}{" "}
                        {/* Added text-sm, mt-1 */}
                      </div>
                    )}
                    <div>
                      <Label htmlFor="bedienungsanleitungFotos" className="font-semibold block mb-2">
                        {" "}
                        {/* Added block mb-2 */}
                        Fotos der Bedienungsanleitung (max. 3)
                      </Label>
                      <label className="block relative cursor-pointer">
                        <input
                          id="bedienungsanleitungFotos"
                          name="bedienungsanleitungFotos"
                          type="file"
                          multiple
                          onChange={handleFileChange("bedienungsanleitungFotos")}
                          accept="image/*"
                          max="3"
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="border rounded px-3 py-2 bg-white text-gray-700 flex items-center min-h-[40px]">
                          {formData.bedienungsanleitungFotos.length > 0
                            ? formData.bedienungsanleitungFotos.map((f) => f.name).join(", ")
                            : "Dateien auswählen..."}
                        </div>
                      </label>
                      <div className="flex items-center mt-2">
                        <Checkbox
                          id="verzichtAufBedienungsanleitungFotos"
                          checked={formData.verzichtAufBedienungsanleitungFotos}
                          onCheckedChange={handleCheckboxChange("verzichtAufBedienungsanleitungFotos")}
                        />
                        <Label htmlFor="verzichtAufBedienungsanleitungFotos" className="ml-2 text-sm text-gray-700">
                          {" "}
                          {/* Softer text */}
                          Ich verzichte auf das Hochladen von Fotos der Bedienungsanleitung
                        </Label>
                      </div>
                      {errors.bedienungsanleitungFotos && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bedienungsanleitungFotos}
                        </p> /* Added text-sm, mt-1 */
                      )}
                    </div>
                  </div>
                </>
              </div>
            )}
            {currentStep === 6 && (
              <div className="step-content-animate-in">
                <>
                  <h2 className="text-3xl font-semibold mb-8 flex items-center">
                    {" "}
                    {/* Increased text-xl to text-3xl, mb-4 to mb-8 */}
                    <CheckCircle className="h-8 w-8 mr-3 text-blue-600" /> {/* Increased icon size */}
                    Zusammenfassung und Bestätigung
                  </h2>
                  <div className="space-y-6 text-gray-700">
                    {" "}
                    {/* Increased space-y-4 to space-y-6, softer text */}
                    <h3 className="text-xl font-semibold text-gray-800">Überprüfen Sie Ihre Angaben:</h3>{" "}
                    {/* Increased text-lg, darker text for heading */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {" "}
                      {/* Increased gap-4 to gap-6 */}
                      <div>
                        <p>
                          <strong>Art der Immobilie:</strong> {formData.artDerImmobilie}
                        </p>
                        {formData.artDerImmobilie === "Sonstige" && (
                          <p>
                            <strong>Sonstige Art der Immobilie:</strong> {formData.artDerImmobilieSonstige}
                          </p>
                        )}
                        <p>
                          <strong>Heizungsart:</strong> {formData.heizungsart}
                        </p>
                        {formData.heizungsart === "Sonstige" && (
                          <p>
                            <strong>Sonstige Heizungsart:</strong> {formData.heizungsartSonstige}
                          </p>
                        )}
                        <p>
                          <strong>Alter der Heizung:</strong> {formData.alterDerHeizung}
                        </p>
                        <p>
                          <strong>E-Mail:</strong> {formData.email}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Adresse der Immobilie:</strong>
                        </p>
                        <p>
                          {formData.strasse} {formData.hausnummer}
                        </p>
                        <p>
                          {formData.postleitzahl} {formData.ort}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Angaben zur Heizung:</h4>
                      <p>
                        <strong>Heizsystem:</strong> {formData.heizsystem}
                      </p>
                      {formData.heizsystem === "Sonstige" && (
                        <p>
                          <strong>Sonstiges Heizsystem:</strong> {formData.heizsystemSonstige}
                        </p>
                      )}
                      <p>
                        <strong>Heizungshersteller:</strong> {formData.heizungshersteller}
                      </p>
                      <p>
                        <strong>Baujahr:</strong> {formData.baujahr}
                      </p>
                      <p>
                        <strong>Typenbezeichnung:</strong> {formData.typenbezeichnung || "Unbekannt"}
                      </p>
                      <p>
                        <strong>Heizungstechnik:</strong> {formData.heizungstechnik}
                      </p>
                      {formData.heizungstechnik === "Sonstige" && (
                        <p>
                          <strong>Sonstige Heizungstechnik:</strong> {formData.heizungstechnikSonstige}
                        </p>
                      )}
                      <p>
                        <strong>Energieträger:</strong> {formData.energietraeger}
                      </p>
                      {formData.energietraeger === "Sonstige" && (
                        <p>
                          <strong>Sonstiger Energieträger:</strong> {formData.energietraegerSonstige}
                        </p>
                      )}
                      <p>
                        <strong>Energielabel:</strong> {formData.energielabel}
                      </p>
                      <p>
                        <strong>Energieausweis:</strong> {formData.energieausweis}
                      </p>
                      {formData.energieausweis === "Ja" && (
                        <p>
                          <strong>Datum des Energieausweises:</strong>{" "}
                          {formData.energieausweisDate
                            ? new Date(formData.energieausweisDate).toLocaleDateString("de-DE", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : ""}
                        </p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">Persönliche Daten:</h4>
                      <p>
                        {formData.vorname} {formData.nachname}
                      </p>
                      <p>
                        {formData.personStrasse} {formData.personHausnummer}
                      </p>
                      <p>
                        {formData.personPostleitzahl} {formData.personOrt}
                      </p>
                      <p>
                        <strong>Eigentümer:</strong> {formData.istEigentuemer}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Hochgeladene Dokumente:</h4>
                      <p>
                        Heizungsanlage:{" "}
                        {formData.heizungsanlageFotos.length > 0
                          ? `${formData.heizungsanlageFotos.length} Foto(s)`
                          : formData.verzichtAufHeizungsanlageFotos
                            ? "Hochladen verzichtet"
                            : "Keine"}
                      </p>
                      <p>
                        Heizungsetikette:{" "}
                        {formData.heizungsetiketteFotos.length > 0
                          ? `${formData.heizungsetiketteFotos.length} Foto(s)`
                          : formData.verzichtAufHeizungsetiketteFotos
                            ? "Hochladen verzichtet"
                            : "Keine"}
                      </p>
                      {formData.energielabel === "Ja" && (
                        <p>
                          Heizungslabel:{" "}
                          {formData.heizungslabelFotos.length > 0
                            ? `${formData.heizungslabelFotos.length} Foto(s)`
                            : formData.verzichtAufHeizungslabelFotos
                              ? "Hochladen verzichtet"
                              : "Keine"}
                        </p>
                      )}
                      <p>
                        Bedienungsanleitung:{" "}
                        {formData.bedienungsanleitungFotos.length > 0
                          ? `${formData.bedienungsanleitungFotos.length} Foto(s)`
                          : formData.verzichtAufBedienungsanleitungFotos
                            ? "Hochladen verzichtet"
                            : "Keine"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="confirmAccuracy"
                        checked={formData.confirmAccuracy}
                        onCheckedChange={handleCheckboxChange("confirmAccuracy")}
                      />
                      <Label htmlFor="confirmAccuracy" className="text-gray-700">
                        {" "}
                        {/* Softer text */}
                        Ich bestätige, dass alle von mir gemachten Angaben korrekt und vollständig sind.
                      </Label>
                    </div>
                    {errors.confirmAccuracy && <p className="text-red-500 text-sm mt-1">{errors.confirmAccuracy}</p>}{" "}
                    {/* Added text-sm, mt-1 */}
                  </div>
                </>
              </div>
            )}
            {currentStep === 7 && (
              <div className="step-content-animate-in">
                <fieldset>
                  <legend className="text-3xl font-semibold mb-8 flex items-center">
                    {" "}
                    {/* Increased text-xl to text-3xl, mb-4 to mb-8 */}
                    <CreditCard className="h-8 w-8 mr-3 text-blue-600" aria-hidden="true" /> {/* Increased icon size */}
                    Bezahlung
                  </legend>
                  <div className="space-y-6">
                    {" "}
                    {/* Increased space-y-4 to space-y-6 */}
                    {submitError && !isPollingPaymentStatus && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Fehler</AlertTitle>
                        <AlertDescription>{submitError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-2">Heizungsplakette – Ihre Sicherheit auf einen Blick</h3>
                      <p className="text-gray-600 mb-4">Bestellen Sie Ihre Heizungsplakette</p>
                      <div className="flex justify-between items-center py-2 border-t border-gray-200">
                        <span>Preis (inkl. MwSt)</span>
                        <span className="font-semibold">49,00 €</span>
                      </div>
                    </div>
                    {isPollingPaymentStatus && (
                      <Alert variant="default" className="mt-4">
                        <AlertTitle>Warte auf Zahlungsbestätigung...</AlertTitle>
                        <AlertDescription>
                          Bitte schließen Sie die Zahlung im Popup-Fenster ab. Wir überprüfen den Status Ihrer Zahlung.
                          Diese Seite wird automatisch weitergeleiten, sobald die Zahlung bestätigt ist.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex justify-center">
                      <Button
                        onClick={handleOpenPaymentPopup}
                        className="w-full max-w-md transition-all duration-200 ease-out transform hover:shadow-lg hover:-translate-y-0.5 active:shadow-md active:translate-y-0"
                        aria-label="Zur Bezahlung auf Copecart"
                      >
                        {isPollingPaymentStatus ? "Zahlungs-Popup aktiv (erneut öffnen)" : "Zur Bezahlung"}
                      </Button>
                    </div>
                    {!isPollingPaymentStatus && orderId && (
                      <p className="text-sm text-gray-500 text-center mt-4">
                        {" "}
                        {/* Increased mt-2 to mt-4 */}
                        Falls das Zahlungsfenster nicht erschienen ist, oder Sie es geschlossen haben, klicken Sie bitte
                        erneut auf &quot;Zur Bezahlung&quot;.
                      </p>
                    )}
                    <p className="text-sm text-gray-500 text-center">Sichere Bezahlung über Copecart</p>
                  </div>
                </fieldset>
              </div>
            )}
            {currentStep !== 7 && ( // Hide main navigation on Step 7 (Payment step)
              <div className="flex justify-between mt-10">
                {" "}
                {/* Increased mt-6 to mt-10 */}
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="transition-all duration-200 ease-out transform hover:shadow-md hover:-translate-y-px active:shadow-sm active:translate-y-0"
                >
                  Zurück
                </Button>
                <Button
                  type="submit"
                  className="transition-all duration-200 ease-out transform hover:shadow-lg hover:-translate-y-0.5 active:shadow-md active:translate-y-0"
                  disabled={isCompressing || isSubmitting} // Disable button if compressing or submitting
                >
                  {isCompressing
                    ? "Bilder werden verarbeitet..."
                    : currentStep < 6
                      ? "Weiter"
                      : "Angaben speichern und zur Bezahlung"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </main>
      <style jsx global>{`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        .step-content-animate-in {
          animation: fadeInSlideUp 0.8s ease-in-out forwards; /* Changed from 0.5s to 0.8s */
        }
      `}</style>
    </div>
  )
}