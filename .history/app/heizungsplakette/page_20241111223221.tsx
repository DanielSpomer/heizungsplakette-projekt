'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ClipboardList, Home, MapPin, Camera, CheckCircle, CreditCard, Thermometer, Building, Calendar, FileText, User, Key, Factory, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
//import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'    

/*const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 2000 })
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: { theme: 'stripe' },
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setError(error.message || 'Ein Fehler ist aufgetreten.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Button type="submit" disabled={!stripe || processing} className="mt-4">
        {processing ? 'Verarbeitung...' : 'Jetzt bezahlen'}
      </Button>
    </form>
  );
}*/

export default function HeizungsplaketteMaske() {
  const [currentStep, setCurrentStep] = useState(1)
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1])
  const [formData, setFormData] = useState({
    datenschutzUndNutzungsbedingungen: false,
    einwilligungDatenverarbeitung: false,
    aufforderungSofortigeTaetigkeit: false,
    email: '',
    artDerImmobilie: '',
    artDerImmobilieSonstige: '',
    heizungsart: '',
    heizungsartSonstige: '',
    strasse: '',
    hausnummer: '',
    postleitzahl: '',
    ort: '',
    heizsystem: '',
    heizsystemSonstige: '',
    heizungshersteller: '',
    baujahr: '',
    typenbezeichnung: '',
    typenbezeichnungUnbekannt: false,
    heizungstechnik: '',
    heizungstechnikSonstige: '',
    energietraeger: '',
    energietraegerSonstige: '',
    energieausweis: '',
    energieausweisDate: '',
    vorname: '',
    nachname: '',
    personStrasse: '',
    personHausnummer: '',
    personPostleitzahl: '',
    personOrt: '',
    istEigentuemer: '',
    heizungsanlageFotos: [] as File[],
    heizungsetiketteFotos: [] as File[],
    heizungslabelFotos: [] as File[],
    bedienungsanleitungFotos: [] as File[],
    verzichtAufHeizungsanlageFotos: false,
    verzichtAufHeizungsetiketteFotos: false,
    verzichtAufHeizungslabelFotos: false,
    verzichtAufBedienungsanleitungFotos: false,
    confirmAccuracy: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [addressValidationMessage, setAddressValidationMessage] = useState<string | null>(null)
  const router = useRouter()

  const herstellerListeOelGas = [
    'Viessmann', 'Bosch Thermotechnik (Buderus)', 'Vaillant', 'Wolf Heiztechnik', 'Weishaupt',
    'Brötje', 'Junkers (Teil von Bosch Thermotechnik)', 'De Dietrich', 'Kermi', 'Hoval',
    'Rotex (Teil von Daikin)', 'Remeha (Teil von BDR Thermea Group)', 'SenerTec', 'MHG Heiztechnik',
    'Elco', 'Giersch (Teil von Enertech Group)', 'Heizomat', 'Oertli', 'Viadrus', 'Ferroli',
    'Timmermann', 'Rapido (Franco Belge)', 'Heimeier', 'Celsius Heiztechnik', 'Zehnder',
    'Guntamatic', 'Glen Dimplex', 'Sime', 'Riello', 'Oranier Heiztechnik'
  ]

  const herstellerListeWaermepumpen = [
    'Viessmann', 'Bosch Thermotechnik (Buderus und Junkers)', 'Vaillant', 'Stiebel Eltron',
    'Daikin', 'Mitsubishi Electric', 'Wolf Heiztechnik', 'NIBE', 'Glen Dimplex', 'Toshiba',
    'Alpha Innotec (Teil der NIBE Gruppe)', 'Panasonic', 'LG Electronics', 'Hoval', 'Rotex (Teil von Daikin)'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [name]: e.target.files![0] }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.datenschutzUndNutzungsbedingungen) newErrors.datenschutzUndNutzungsbedingungen = "Bitte stimmen Sie den Datenschutzhinweisen, der Widerrufsbelehrung und den Nutzungsbedingungen zu."
      if (!formData.aufforderungSofortigeTaetigkeit) newErrors.aufforderungSofortigeTaetigkeit = "Bitte bestätigen Sie die Aufforderung zur sofortigen Tätigkeit."
    } else if (step === 2) {
      if (!formData.artDerImmobilie) newErrors.artDerImmobilie = "Bitte wählen Sie die Art der Immobilie."
      if (formData.artDerImmobilie === 'Sonstige' && !formData.artDerImmobilieSonstige) {
        newErrors.artDerImmobilieSonstige = "Bitte spezifizieren Sie die Art der Immobilie."
      }
      if (!formData.heizungsart) newErrors.heizungsart = "Bitte wählen Sie eine Heizungsart."
      if (formData.heizungsart === 'Sonstige' && !formData.heizungsartSonstige) {
        newErrors.heizungsartSonstige = "Bitte spezifizieren Sie die Heizungsart."
      }
      if (!formData.email) newErrors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein."
    } else if (step === 4) {
      if (!formData.strasse) newErrors.strasse = "Bitte geben Sie die Straße an."
      if (!formData.hausnummer) newErrors.hausnummer = "Bitte geben Sie die Hausnummer an."
      if (!formData.postleitzahl) newErrors.postleitzahl = "Bitte geben Sie die Postleitzahl an."
      if (!formData.ort) newErrors.ort = "Bitte geben Sie den Ort an."
    } else if (step === 5) {
      if (!formData.heizsystem) newErrors.heizsystem = "Bitte wählen Sie ein Heizsystem."
      if (formData.heizsystem === 'Sonstige' && !formData.heizsystemSonstige) {
        newErrors.heizsystemSonstige = "Bitte spezifizieren Sie das Heizsystem."
      }
      if (!formData.heizungshersteller) newErrors.heizungshersteller = "Bitte wählen Sie einen Heizungshersteller."
      if (!formData.baujahr) newErrors.baujahr = "Bitte geben Sie das Baujahr der Heizung an."
      if (isNaN(Number(formData.baujahr))) newErrors.baujahr = "Bitte geben Sie eine gültige Jahreszahl ein."
      if (!formData.typenbezeichnung && !formData.typenbezeichnungUnbekannt) {
        newErrors.typenbezeichnung = "Bitte geben Sie die Typenbezeichnung an oder wählen Sie &apos;Unbekannt&apos;."
      }
      if (!formData.heizungstechnik) newErrors.heizungstechnik = "Bitte wählen Sie die Heizungstechnik."
      if (formData.heizungstechnik === 'Sonstige' && !formData.heizungstechnikSonstige) {
        newErrors.heizungstechnikSonstige = "Bitte spezifizieren Sie die Heizungstechnik."
      }
      if (!formData.energietraeger) newErrors.energietraeger = "Bitte wählen Sie den Energieträger."
      if (formData.energietraeger === 'Sonstige' && !formData.energietraegerSonstige) {
        newErrors.energietraegerSonstige = "Bitte spezifizieren Sie den Energieträger."
      }
      if (!formData.energieausweis) newErrors.energieausweis = "Bitte geben Sie an, ob ein Energieausweis vorliegt."
      if (formData.energieausweis === 'Ja' && !formData.energieausweisDate) {
        newErrors.energieausweisDate = "Bitte geben Sie das Datum des Energieausweises an."
      }
      if (!formData.vorname) newErrors.vorname = "Bitte geben Sie Ihren Vornamen an."
      if (!formData.nachname) newErrors.nachname = "Bitte geben Sie Ihren Nachnamen an."
      if (!formData.personStrasse) newErrors.personStrasse = "Bitte geben Sie Ihre Straße an."
      if (!formData.personHausnummer) newErrors.personHausnummer = "Bitte geben Sie Ihre Hausnummer an."
      if (!formData.personPostleitzahl) newErrors.personPostleitzahl = "Bitte geben Sie Ihre Postleitzahl an."
      if (!formData.personOrt) newErrors.personOrt = "Bitte geben Sie Ihren Ort an."
      if (!formData.istEigentuemer) newErrors.istEigentuemer = "Bitte geben Sie an, ob Sie der Eigentümer sind."
    } else if (step === 6) {
      if (!formData.verzichtAufHeizungsanlageFotos && formData.heizungsanlageFotos.length === 0) {
        newErrors.heizungsanlageFotos = "Bitte laden Sie mindestens ein Foto der Heizungsanlage hoch oder verzichten Sie ausdrücklich darauf."
      }
      if (!formData.verzichtAufHeizungsetiketteFotos && formData.heizungsetiketteFotos.length === 0) {
        newErrors.heizungsetiketteFotos = "Bitte laden Sie mindestens ein Foto des Heizungsetiketts hoch oder verzichten Sie ausdrücklich darauf."
      }
      if (!formData.verzichtAufHeizungslabelFotos && formData.heizungslabelFotos.length === 0) {
        newErrors.heizungslabelFotos = "Bitte laden Sie ein Foto des Heizungslabels hoch oder verzichten Sie ausdrücklich darauf."
      }
      if (!formData.verzichtAufBedienungsanleitungFotos && formData.bedienungsanleitungFotos.length === 0) {
        newErrors.bedienungsanleitungFotos = "Bitte laden Sie mindestens ein Foto der Bedienungsanleitung hoch oder verzichten Sie ausdrücklich darauf."
      }
    } else if (step === 7) {
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
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`)
        const data = await response.json()

        if (data.length > 0) {
          setAddressValidationMessage("Die Adresse wurde erfolgreich validiert.")
          return true
        } else {
          setAddressValidationMessage("Die eingegebene Adresse konnte nicht validiert werden. Bitte überprüfen Sie Ihre Eingabe.")
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
    const isValid = validateStep(currentStep)
    if (isValid) {
      if (currentStep === 4) {
        const isAddressValid = await validateAddress()
        if (!isAddressValid) return
      }
      if (currentStep < 7) {
        setCurrentStep(prev => prev + 1)
        setVisitedSteps(prev => Array.from(new Set([...prev, currentStep + 1])))
      } else {
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            console.log('E-Mails erfolgreich gesendet');
            router.push('/heizungsplakette/confirmation');
          } else {
            console.error('Fehler beim Senden der E-Mails');
            // Hier könnten Sie eine Fehlermeldung für den Benutzer anzeigen
          }
        } catch (error) {
          console.error('Fehler beim Senden der E-Mails:', error);
          // Hier könnten Sie eine Fehlermeldung für den Benutzer anzeigen
        }
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
      setCurrentStep(prev => prev - 1)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/">
            <Image src="/images/heizungsplakette-logo.png" alt="Heizungsplakette Logo" width={250} height={50} />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <div 
                  key={step} 
                  className={`w-1/7 text-center cursor-pointer
                    ${currentStep === step ? 'text-blue-600 font-bold' : 
                    visitedSteps.includes(step) ? 'text-blue-600 font-bold' : 'text-gray-400'}`}
                  onClick={() => handleStepClick(step)}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              ></div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ClipboardList className="mr-2 text-blue-600" />
                    Richtlinien und Bedingungen
                  </h2>
                </div>
                <p className="mb-4">
                  Herzlich Willkommen bei &quot;heizungsplakette.de&quot;. Wir stellen aufgrund Ihrer Angaben die Heizungsplakette für ihre Heizung aus, aus der sich ergibt, wie lange Ihre Heizung weiter betrieben werden darf. Wir werden die Angaben, die Sie hier eingeben überprüfen, bevor wir die Heizungsplakette an Sie versenden. Gehen Sie bitte deshalb davon aus, dass die Heizungsplakette etwa innerhalb von 48 Stunden bei Ihnen per E-Mail ankommen wird. Wir benötigen diese Zeit, um die Angaben vor der Anfertigung der Heizungsplakette mit den gesetzlichen Vorgaben aus dem Heizungsgesetz abzugleichen. Wir bitten um Verständnis. Wenn Sie Fragen haben, wenden Sie sich jederzeit per E-Mail an service@heizungsplakette.de.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="datenschutzUndNutzungsbedingungen"
                      checked={formData.datenschutzUndNutzungsbedingungen}
                      onCheckedChange={handleCheckboxChange('datenschutzUndNutzungsbedingungen')}
                    />
                    <Label htmlFor="datenschutzUndNutzungsbedingungen">
                      Ich stimme den <a href="/Datenschutzhinweis.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Datenschutzhinweisen</a>, der <a href="/Widerrufsbelehrung.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Widerrufsbelehrung</a> und den <a href="/Nutzungsbedingungen.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Nutzungsbedingungen</a> zu
                    </Label>
                  </div>
                  {errors.datenschutzUndNutzungsbedingungen && <p className="text-red-500">{errors.datenschutzUndNutzungsbedingungen}</p>}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="einwilligungDatenverarbeitung"
                      checked={formData.einwilligungDatenverarbeitung}
                      onCheckedChange={handleCheckboxChange('einwilligungDatenverarbeitung')}
                    />
                    <Label htmlFor="einwilligungDatenverarbeitung">
                      Ich erkläre mich mit der Verarbeitung meiner personenbezogenen Daten zum Zweck der Übermittlung weiterer Informationen rund um die Heizungsplakette, das GEG sowie weiterer fachlicher und/oder technischer Informationen und der Kontaktaufnahme per Telefon und/oder E-Mail einverstanden und kann diese Einwilligungserklärung gegenüber der heizungsplakette.de GmbH jederzeit widerrufen
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aufforderungSofortigeTaetigkeit"
                      checked={formData.aufforderungSofortigeTaetigkeit}
                      onCheckedChange={handleCheckboxChange('aufforderungSofortigeTaetigkeit')}
                    />
                    <Label htmlFor="aufforderungSofortigeTaetigkeit">
                      Ich verlange ausdrücklich, dass Sie mit Ihrer Leistung vor Ablauf der Widerrufsfrist beginnen. Mir ist bekannt, dass mein Widerrufsrecht bei vollständiger Vertragserfüllung durch Sie erlischt (§ 356 Abs. 4 BGB). Mir ist ebenfalls bekannt, dass ich Wertersatz für die bis zum Widerruf erbrachten Leistungen gem. § 357 a Abs. 2 BGB schulde, wenn ich den Vertrag fristgemäß widerrufe.
                    </Label>
                  </div>
                  {errors.aufforderungSofortigeTaetigkeit && <p className="text-red-500">{errors.aufforderungSofortigeTaetigkeit}</p>}
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Home className="mr-2 text-blue-600" />
                    Grundlegende Informationen
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-5 w-5 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Damit die Heizungsplakette mit den Anforderungen des Heizungsgesetzes von uns abgeglichen werden kann, benötigen wir ein paar grundlegende Angaben. In Einfamilienhäusern kann es anders aussehen als in Mehrfamilienhäusern oder Eigentumswohnungen. Es gibt spezielle Regelungen für Etagenheizungen, die wir ebenfalls berücksichtigen wollen. Bitte geben Sie deshalb an, um was für eine Heizungsart es sich handelt.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="artDerImmobilie" className="font-semibold">Art der Immobilie *</Label>
                    <Select name="artDerImmobilie" onValueChange={handleSelectChange('artDerImmobilie')} value={formData.artDerImmobilie}>
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
                    {errors.artDerImmobilie && <p className="text-red-500">{errors.artDerImmobilie}</p>}
                  </div>
                  {formData.artDerImmobilie === 'Sonstige' && (
                    <div>
                      <Label htmlFor="artDerImmobilieSonstige" className="font-semibold">Sonstige Art der Immobilie *</Label>
                      <Input
                        id="artDerImmobilieSonstige"
                        name="artDerImmobilieSonstige"
                        value={formData.artDerImmobilieSonstige}
                        onChange={handleInputChange}
                        placeholder="Bitte spezifizieren Sie die Art der Immobilie"
                      />
                      {errors.artDerImmobilieSonstige && <p className="text-red-500">{errors.artDerImmobilieSonstige}</p>}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="heizungsart" className="font-semibold">Heizungsart *</Label>
                    <Select name="heizungsart" onValueChange={handleSelectChange('heizungsart')} value={formData.heizungsart}>
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
                    {errors.heizungsart && <p className="text-red-500">{errors.heizungsart}</p>}
                  </div>
                  {formData.heizungsart === 'Sonstige' && (
                    <div>
                      <Label htmlFor="heizungsartSonstige" className="font-semibold">Sonstige Heizungsart *</Label>
                      <Input
                        id="heizungsartSonstige"
                        name="heizungsartSonstige"
                        value={formData.heizungsartSonstige}
                        onChange={handleInputChange}
                        placeholder="Bitte spezifizieren Sie die Heizungsart"
                      />
                      {errors.heizungsartSonstige && <p className="text-red-500">{errors.heizungsartSonstige}</p>}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="email" className="font-semibold">E-Mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ihre E-Mail-Adresse"
                      type="email"
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CreditCard className="mr-2 text-blue-600" />
                  Bezahlung
                </h2>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="mr-2 text-blue-600" />
                    Adresse der Immobilie
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-5 w-5 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Die Adresse der Immobilie ist ein Pflichtfeld, weil die Heizungsplakette für eine spezifische Heizung an diesem einen Standort, also der von Ihnen angegebenen Immobilie, erstellt wird. Bitte geben Sie die Adressdaten daher vollständig und korrekt an.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strasse" className="font-semibold">Straße *</Label>
                    <Input
                      id="strasse"
                      name="strasse"
                      value={formData.strasse}
                      onChange={handleInputChange}
                      placeholder="Straßenname"
                    />
                    {errors.strasse && <p className="text-red-500">{errors.strasse}</p>}
                  </div>
                  <div>
                    <Label htmlFor="hausnummer" className="font-semibold">Hausnummer *</Label>
                    <Input
                      id="hausnummer"
                      name="hausnummer"
                      value={formData.hausnummer}
                      onChange={handleInputChange}
                      placeholder="Hausnummer"
                    />
                    {errors.hausnummer && <p className="text-red-500">{errors.hausnummer}</p>}
                  </div>
                  <div>
                    <Label htmlFor="postleitzahl" className="font-semibold">Postleitzahl *</Label>
                    <Input
                      id="postleitzahl"
                      name="postleitzahl"
                      value={formData.postleitzahl}
                      onChange={handleInputChange}
                      placeholder="PLZ"
                    />
                    {errors.postleitzahl && <p className="text-red-500">{errors.postleitzahl}</p>}
                  </div>
                  <div>
                    <Label htmlFor="ort" className="font-semibold">Ort *</Label>
                    <Input
                      id="ort"
                      name="ort"
                      value={formData.ort}
                      onChange={handleInputChange}
                      placeholder="Ort"
                    />
                    {errors.ort && <p className="text-red-500">{errors.ort}</p>}
                  </div>
                  {addressValidationMessage && (
                    <Alert variant={addressValidationMessage.includes("erfolgreich") ? "default" : "destructive"}>
                      <AlertTitle>Adressvalidierung</AlertTitle>
                      <AlertDescription>{addressValidationMessage}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Thermometer className="mr-2 text-blue-600" />
                    Angaben zur Heizung
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-5 w-5 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Wir benötigen die folgenden Angaben zur Heizung, damit die vielfältigen Möglichkeiten aus dem Heizungsgesetz so auf Ihre Heizung abgleichen können, dass wir Ihnen am Ende eine aussagekräftige Heizungsplkatte ausstellen können. Das Baujahr der Heizung kann z.B. Einfluss darauf haben, ob die Heizung weiter betrieben werden darf oder nicht. Auch die Heizungstechnik ist in diesem Zusammenhang sehr wichtig. Bitte geben Sie idealerweise auch den Gerätetypen zusätzlich zum Hersteller an. Sollten Sie das Baujahr nicht eindeutig herausfinden, werden wir versuchen, das Baujahr über die Typenbezeichnung direkt beim Hersteller für Sie herauszufinden. Dann wäre die Übertragung der vollständigen Typenbezeichnung für uns sehr wichtig.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Building className="mr-2 text-blue-600" />
                      Heizungssystem
                    </h3>
                    <Label htmlFor="heizsystem" className="font-semibold">Heizsystem *</Label>
                    <Select name="heizsystem" onValueChange={handleSelectChange('heizsystem')} value={formData.heizsystem}>
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
                    {errors.heizsystem && <p className="text-red-500">{errors.heizsystem}</p>}
                  </div>
                  {formData.heizsystem === 'Sonstige' && (
                    <div>
                      <Label htmlFor="heizsystemSonstige" className="font-semibold">Sonstiges Heizsystem *</Label>
                      <Input
                        id="heizsystemSonstige"
                        name="heizsystemSonstige"
                        value={formData.heizsystemSonstige}
                        onChange={handleInputChange}
                        placeholder="Bitte spezifizieren Sie das Heizsystem"
                      />
                      {errors.heizsystemSonstige && <p className="text-red-500">{errors.heizsystemSonstige}</p>}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Factory className="mr-2 text-blue-600" />
                      Heizungshersteller
                    </h3>
                    <Label htmlFor="heizungshersteller" className="font-semibold">Heizungshersteller *</Label>
                    {formData.heizungsart === 'Sonstige' ? (
                      <Input
                        id="heizungshersteller"
                        name="heizungshersteller"
                        value={formData.heizungshersteller}
                        onChange={handleInputChange}
                        placeholder="Geben Sie den Hersteller an"
                      />
                    ) : (
                      <Select name="heizungshersteller" onValueChange={handleSelectChange('heizungshersteller')} value={formData.heizungshersteller}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Wählen Sie den Heizungshersteller" />
                        </SelectTrigger>
                        <SelectContent>
                          {(formData.heizungsart === 'Wärmepumpe' ? herstellerListeWaermepumpen : herstellerListeOelGas).map((hersteller) => (
                            <SelectItem key={hersteller} value={hersteller}>{hersteller}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.heizungshersteller && <p className="text-red-500">{errors.heizungshersteller}</p>}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Calendar className="mr-2 text-blue-600" />
                      Baujahr der Heizung
                    </h3>
                    <Label htmlFor="baujahr" className="font-semibold">Baujahr der Heizung *</Label>
                    <Input
                      id="baujahr"
                      name="baujahr"
                      value={formData.baujahr}
                      onChange={handleInputChange}
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                    {errors.baujahr && <p className="text-red-500">{errors.baujahr}</p>}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="mr-2 text-blue-600" />
                      Typenbezeichnung
                    </h3>
                    <Label htmlFor="typenbezeichnung" className="font-semibold">Typenbezeichnung *</Label>
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
                          onCheckedChange={handleCheckboxChange('typenbezeichnungUnbekannt')}
                        />
                        <Label htmlFor="typenbezeichnungUnbekannt" className="ml-2">
                          Unbekannt
                        </Label>
                      </div>
                    </div>
                    {errors.typenbezeichnung && <p className="text-red-500">{errors.typenbezeichnung}</p>}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Thermometer className="mr-2 text-blue-600" />
                      Heizungstechnik
                    </h3>
                    <Label htmlFor="heizungstechnik" className="font-semibold">Heizungstechnik *</Label>
                    <Select name="heizungstechnik" onValueChange={handleSelectChange('heizungstechnik')} value={formData.heizungstechnik}>
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
                    {errors.heizungstechnik && <p className="text-red-500">{errors.heizungstechnik}</p>}
                  </div>
                  {formData.heizungstechnik === 'Sonstige' && (
                    <div>
                      <Label htmlFor="heizungstechnikSonstige" className="font-semibold">Sonstige Heizungstechnik *</Label>
                      <Input
                        id="heizungstechnikSonstige"
                        name="heizungstechnikSonstige"
                        value={formData.heizungstechnikSonstige}
                        onChange={handleInputChange}
                        placeholder="Bitte spezifizieren Sie die Heizungstechnik"
                      />
                      {errors.heizungstechnikSonstige && <p className="text-red-500">{errors.heizungstechnikSonstige}</p>}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Thermometer className="mr-2 text-blue-600" />
                      Energieträger
                    </h3>
                    <Label htmlFor="energietraeger" className="font-semibold">Energieträger *</Label>
                    <Select name="energietraeger" onValueChange={handleSelectChange('energietraeger')} value={formData.energietraeger}>
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
                    {errors.energietraeger && <p className="text-red-500">{errors.energietraeger}</p>}
                  </div>
                  {formData.energietraeger === 'Sonstige' && (
                    <div>
                      <Label htmlFor="energietraeger Sonstige" className="font-semibold">Sonstiger Energieträger *</Label>
                      <Input
                        id="energietraegerSonstige"
                        name="energietraegerSonstige"
                        value={formData.energietraegerSonstige}
                        onChange={handleInputChange}
                        placeholder="Bitte spezifizieren Sie den Energieträger"
                      />
                      {errors.energietraegerSonstige && <p className="text-red-500">{errors.energietraegerSonstige}</p>}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="mr-2 text-blue-600" />
                      Energieausweis
                    </h3>
                    <Label htmlFor="energieausweis" className="font-semibold">Liegt ein Energieausweis vor? *</Label>
                    <RadioGroup onValueChange={handleSelectChange('energieausweis')} value={formData.energieausweis}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Ja" id="energieausweisJa" />
                        <Label htmlFor="energieausweisJa">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Nein" id="energieausweisNein" />
                        <Label htmlFor="energieausweisNein">Nein</Label>
                      </div>
                    </RadioGroup>
                    {errors.energieausweis && <p className="text-red-500">{errors.energieausweis}</p>}
                  </div>
                  
                  {formData.energieausweis === 'Ja' && (
                    <div>
                      <Label htmlFor="energieausweisDate" className="font-semibold">Datum des Energieausweises</Label>
                      <Input
                        id="energieausweisDate"
                        name="energieausweisDate"
                        type="date"
                        value={formData.energieausweisDate}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      {errors.energieausweisDate && <p className="text-red-500">{errors.energieausweisDate}</p>}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <User className="mr-2 text-blue-600" />
                      Persönliche Informationen
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vorname" className="font-semibold">Vorname *</Label>
                        <Input
                          id="vorname"
                          name="vorname"
                          value={formData.vorname}
                          onChange={handleInputChange}
                          placeholder="Ihr Vorname"
                        />
                        {errors.vorname && <p className="text-red-500">{errors.vorname}</p>}
                      </div>
                      <div>
                        <Label htmlFor="nachname" className="font-semibold">Nachname *</Label>
                        <Input
                          id="nachname"
                          name="nachname"
                          value={formData.nachname}
                          onChange={handleInputChange}
                          placeholder="Ihr Nachname"
                        />
                        {errors.nachname && <p className="text-red-500">{errors.nachname}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="personStrasse" className="font-semibold">Straße *</Label>
                      <Input
                        id="personStrasse"
                        name="personStrasse"
                        value={formData.personStrasse}
                        onChange={handleInputChange}
                        placeholder="Ihre Straße"
                      />
                      {errors.personStrasse && <p className="text-red-500">{errors.personStrasse}</p>}
                    </div>
                    <div>
                      <Label htmlFor="personHausnummer" className="font-semibold">Hausnummer *</Label>
                      <Input
                        id="personHausnummer"
                        name="personHausnummer"
                        value={formData.personHausnummer}
                        onChange={handleInputChange}
                        placeholder="Ihre Hausnummer"
                      />
                      {errors.personHausnummer && <p className="text-red-500">{errors.personHausnummer}</p>}
                    </div>
                    <div>
                      <Label htmlFor="personPostleitzahl" className="font-semibold">Postleitzahl *</Label>
                      <Input
                        id="personPostleitzahl"
                        name="personPostleitzahl"
                        value={formData.personPostleitzahl}
                        onChange={handleInputChange}
                        placeholder="Ihre Postleitzahl"
                      />
                      {errors.personPostleitzahl && <p className="text-red-500">{errors.personPostleitzahl}</p>}
                    </div>
                    <div>
                      <Label htmlFor="personOrt" className="font-semibold">Ort *</Label>
                      <Input
                        id="personOrt"
                        name="personOrt"
                        value={formData.personOrt}
                        onChange={handleInputChange}
                        placeholder="Ihr Ort"
                      />
                      {errors.personOrt && <p className="text-red-500">{errors.personOrt}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      <Key className="mr-2 text-blue-600" />
                      Eigentümer
                    </h3>
                    <Label htmlFor="istEigentuemer" className="font-semibold">Sind Sie der Eigentümer? *</Label>
                    <RadioGroup onValueChange={handleSelectChange('istEigentuemer')} value={formData.istEigentuemer}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Ja" id="istEigentuemerJa" />
                        <Label htmlFor="istEigentuemerJa">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Nein" id="istEigentuemerNein" />
                        <Label htmlFor="istEigentuemerNein">Nein</Label>
                      </div>
                    </RadioGroup>
                    {errors.istEigentuemer && <p className="text-red-500">{errors.istEigentuemer}</p>}
                  </div>
                </div>
              </>
            )}

            {currentStep === 6 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Camera className="mr-2 text-blue-600" />
                    Foto-Upload
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-5 w-5 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Mit der Bereitstellung der Fotos erleichtern Sie uns die Ausstellung der Heizungsplakette. Zugleich signalisieren Sie mit den Fotos der Betriebsanleitungen, dass Sie die Unterlagen auch für etwaige Kaufinteressenten vollständig haben und diese übergeben können. Das kann sehr hilfreich sein, wenn Sie planen, Ihre Immobilie zu verkaufen. Sollten Sie kein Heizungslabel an Ihrer Heizung finden, ist das kein Problem. Das Typenschild finden Sie oft an der Seite der Heizung. Vielleicht ergibt sich aus einem der Schilder auch, ob es sich um &quot;Brennwert-&quot; oder Niedertemperatur&quot;-Technik handelt. Dann fotografieren Sie doch dies auch und stellen das Foto ebenfalls bereit. 
                        </p>
                        <p></p>
                        <p>Sollten Sie sich dazu enstcheiden, kein Foto bereit zu stellen, vermerken Sie dies bitte. Wir tragen dies dann so in die Heizungsplakette ein.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Heizungsanlage</h3>
                    {!formData.verzichtAufHeizungsanlageFotos && (
                      <div className="space-y-2">
                        <Input type="file" onChange={handleFileChange('heizungsanlageFotos')} accept="image/*,.heic" multiple />
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="verzichtAufHeizungsanlageFotos"
                        checked={formData.verzichtAufHeizungsanlageFotos}
                        onCheckedChange={handleCheckboxChange('verzichtAufHeizungsanlageFotos')}
                      />
                      <Label htmlFor="verzichtAufHeizungsanlageFotos">
                        Ich verzichte ausdrücklich auf das Bereitstellen von Fotos der Heizungsanlage
                      </Label>
                    </div>
                    {errors.heizungsanlageFotos && <p className="text-red-500">{errors.heizungsanlageFotos}</p>}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Heizungsetikett</h3>
                    {!formData.verzichtAufHeizungsetiketteFotos && (
                      <div className="space-y-2">
                        <Input type="file" onChange={handleFileChange('heizungsetiketteFotos')} accept="image/*,.heic" multiple />
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="verzichtAufHeizungsetiketteFotos"
                        checked={formData.verzichtAufHeizungsetiketteFotos}
                        onCheckedChange={handleCheckboxChange('verzichtAufHeizungsetiketteFotos')}
                      />
                      <Label htmlFor="verzichtAufHeizungsetiketteFotos">
                        Ich verzichte ausdrücklich auf das Bereitstellen von Fotos des Heizungsetiketts
                      </Label>
                    </div>
                    {errors.heizungsetiketteFotos && <p className="text-red-500">{errors.heizungsetiketteFotos}</p>}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Heizungslabel</h3>
                    {!formData.verzichtAufHeizungslabelFotos && (
                      <div className="space-y-2">
                        <Input type="file" onChange={handleFileChange('heizungslabelFotos')} accept="image/*,.heic" multiple />
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="verzichtAufHeizungslabelFotos"
                        checked={formData.verzichtAufHeizungslabelFotos}
                        onCheckedChange={handleCheckboxChange('verzichtAufHeizungslabelFotos')}
                      />
                      <Label htmlFor="verzichtAufHeizungslabelFotos">
                        Ich verzichte ausdrücklich auf das Bereitstellen von Fotos des Heizungslabels
                      </Label>
                    </div>
                    {errors.heizungslabelFotos && <p className="text-red-500">{errors.heizungslabelFotos}</p>}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Bedienungsanleitung</h3>
                    {!formData.verzichtAufBedienungsanleitungFotos && (
                      <div className="space-y-2">
                        <Input type="file" onChange={handleFileChange('bedienungsanleitungFotos')} accept="image/*,.heic" multiple />
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="verzichtAufBedienungsanleitungFotos"
                        checked={formData.verzichtAufBedienungsanleitungFotos}
                        onCheckedChange={handleCheckboxChange('verzichtAufBedienungsanleitungFotos')}
                      />
                      <Label htmlFor="verzichtAufBedienungsanleitungFotos">
                        Ich verzichte ausdrücklich auf das Bereitstellen von Fotos der Bedienungsanleitung
                      </Label>
                    </div>
                    {errors.bedienungsanleitungFotos && <p className="text-red-500">{errors.bedienungsanleitungFotos}</p>}
                  </div>
                </div>
              </>
            )}

            {currentStep === 7 && (
              <>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="mr-2 text-blue-600" />
                  Bestätigung
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="confirmAccuracy"
                      checked={formData.confirmAccuracy}
                      onCheckedChange={handleCheckboxChange('confirmAccuracy')}
                    />
                    <Label htmlFor="confirmAccuracy">
                      Ich bestätige, dass alle von mir gemachten Angaben korrekt und vollständig sind.
                    </Label>
                  </div>
                  {errors.confirmAccuracy && <p className="text-red-500">{errors.confirmAccuracy}</p>}
                </div>
              </>
            )}

            <div className="flex justify-between mt-6">
              <Button type="button" onClick={handleBack} variant="outline">
                Zurück
              </Button>
              <Button type="submit">
                {currentStep < 7 ? 'Weiter' : 'Absenden'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}