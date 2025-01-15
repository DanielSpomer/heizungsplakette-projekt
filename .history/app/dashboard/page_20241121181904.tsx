'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Edit, Eye, Check, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

type HeizungsplaketteItem = {
  id: number;
  datenschutz: boolean;
  gesetzlicheRichtlinien: boolean;
  agb: boolean;
  artDerImmobilie: string;
  artDerImmobilieSonstige?: string;
  heizungsart: string;
  heizungsartSonstige?: string;
  email: string;
  strasse: string;
  hausnummer: string;
  postleitzahl: string;
  ort: string;
  heizsystem: string;
  heizsystemSonstige?: string;
  heizungshersteller: string;
  heizungsherstellerSonstige?: string;
  baujahr: string;
  typenbezeichnung: string;
  energieausweis: string;
  energieausweisDate: string;
  vorname: string;
  nachname: string;
  personStrasse: string;
  personHausnummer: string;
  personPostleitzahl: string;
  personOrt: string;
  istEigentuemer: string;
  status: string;
  heizungstechnik: string;
  heizungstechnikSonstige?: string;
  energietraeger: string;
  energietraegerSonstige?: string;
  fotoHeizungslabel: File | null;
  fotoHeizung: File | null;
  fotoBedienungsanleitung: File | null;
  verzichtFotos: boolean;
}

const getHeizungshersteller = (heizungsart: string): string[] => {
  switch (heizungsart) {
    case 'Gasheizung':
    case 'Ölheizung':
      return [
        'Viessmann', 'Bosch Thermotechnik (Buderus)', 'Vaillant', 'Wolf Heiztechnik', 'Weishaupt',
        'Brötje', 'Junkers (Teil von Bosch Thermotechnik)', 'De Dietrich', 'Kermi', 'Hoval',
        'Rotex (Teil von Daikin)', 'Remeha (Teil von BDR Thermea Group)', 'SenerTec', 'MHG Heiztechnik',
        'Elco', 'Giersch (Teil von Enertech Group)', 'Heizomat', 'Oertli', 'Viadrus', 'Ferroli',
        'Timmermann', 'Rapido (Franco Belge)', 'Heimeier', 'Celsius Heiztechnik', 'Zehnder',
        'Guntamatic', 'Glen Dimplex', 'Sime', 'Riello', 'Oranier Heiztechnik'
      ];
    case 'Wärmepumpe':
      return [
        'Viessmann', 'Bosch Thermotechnik (Buderus und Junkers)', 'Vaillant', 'Stiebel Eltron',
        'Daikin', 'Mitsubishi Electric', 'Wolf Heiztechnik', 'NIBE', 'Glen Dimplex', 'Toshiba',
        'Alpha Innotec (Teil der NIBE Gruppe)', 'Panasonic', 'LG Electronics', 'Hoval',
        'Rotex (Teil von Daikin)'
      ];
    default:
      return [];
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Ausstehend':
      return 'bg-yellow-200 text-yellow-800'
    case 'Genehmigt':
      return 'bg-green-200 text-green-800'
    case 'Abgelehnt':
      return 'bg-red-200 text-red-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [heizungsplaketten, setHeizungsplaketten] = useState<HeizungsplaketteItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState<HeizungsplaketteItem | null>(null)
  const [watchingItem, setWatchingItem] = useState<HeizungsplaketteItem | null>(null)
  const [availableHeizungshersteller, setAvailableHeizungshersteller] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const updateAvailableHeizungshersteller = useCallback((heizungsart: string) => {
    setAvailableHeizungshersteller(getHeizungshersteller(heizungsart))
  }, [])

  useEffect(() => {
    if (editingItem) {
      updateAvailableHeizungshersteller(editingItem.heizungsart)
    }
  }, [editingItem, updateAvailableHeizungshersteller])

  useEffect(() => {
    const fetchHeizungsplaketten = async () => {
      try {
        const response = await fetch('/api/heizungsplaketten/route.ts')
        if (response.ok) {
          const data = await response.json()
          setHeizungsplaketten(data)
        } else {
          console.error('Fehler beim Abrufen der Heizungsplaketten')
          toast({
            title: "Fehler",
            description: "Die Heizungsplaketten konnten nicht geladen werden.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Heizungsplaketten:', error)
        toast({
          title: "Fehler",
          description: "Es gab ein Problem beim Laden der Heizungsplaketten.",
          variant: "destructive",
        })
      }
    }

    fetchHeizungsplaketten()
  }, [toast])

  const filteredHeizungsplaketten = heizungsplaketten.filter(item =>
    Object.values(item).some(value => 
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleEdit = (item: HeizungsplaketteItem) => {
    setEditingItem({ ...item })
  }

  const handleSave = async () => {
    if (editingItem) {
      try {
        const response = await fetch(`/api/heizungsplaketten/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        })

        if (response.ok) {
          setHeizungsplaketten(prevHeizungsplaketten => 
            prevHeizungsplaketten.map(item => 
              item.id === editingItem.id ? editingItem : item
            )
          )
          setEditingItem(null)
          toast({
            title: "Gespeichert",
            description: "Die Änderungen wurden erfolgreich gespeichert.",
          })
        } else {
          throw new Error('Fehler beim Speichern der Änderungen')
        }
      } catch (error) {
        console.error('Fehler beim Speichern der Änderungen:', error)
        toast({
          title: "Fehler",
          description: "Die Änderungen konnten nicht gespeichert werden.",
          variant: "destructive",
        })
      }
    }
  }

  const handleWatch = (item: HeizungsplaketteItem) => {
    setWatchingItem(item)
  }

  const handleApprove = async (id: number) => {
    setIsApproving(true)
    try {
      const response = await fetch(`/api/heizungsplaketten/${id}/approve`, {
        method: 'POST',
      })

      if (response.ok) {
        setHeizungsplaketten(prevHeizungsplaketten => 
          prevHeizungsplaketten.map(item => 
            item.id === id ? { ...item, status: 'Genehmigt' } : item
          )
        )
        toast({
          title: "Genehmigt",
          description: "Die Heizungsplakette wurde erfolgreich genehmigt.",
        })
      } else {
        throw new Error('Fehler bei der Genehmigung der Heizungsplakette')
      }
    } catch (error) {
      console.error('Fehler bei der Genehmigung der Heizungsplakette:', error)
      toast({
        title: "Fehler",
        description: "Die Heizungsplakette konnte nicht genehmigt werden.",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`/api/heizungsplaketten/${id}/reject`, {
        method: 'POST',
      })

      if (response.ok) {
        setHeizungsplaketten(prevHeizungsplaketten => 
          prevHeizungsplaketten.map(item => 
            item.id === id ? { ...item, status: 'Abgelehnt' } : item
          )
        )
        toast({
          title: "Abgelehnt",
          description: "Die Heizungsplakette wurde abgelehnt.",
        })
      } else {
        throw new Error('Fehler bei der Ablehnung der Heizungsplakette')
      }
    } catch (error) {
      console.error('Fehler bei der Ablehnung der Heizungsplakette:', error)
      toast({
        title: "Fehler",
        description: "Die Heizungsplakette konnte nicht abgelehnt werden.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Heizungsplaketten Dashboard</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Suche..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-details"
              checked={showDetails}
              onCheckedChange={setShowDetails}
            />
            <Label htmlFor="show-details">Details anzeigen</Label>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Art der Immobilie</TableHead>
              <TableHead>Heizungsart</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>E-Mail</TableHead>
              {showDetails && (
                <>
                  <TableHead>Vorname</TableHead>
                  <TableHead>Nachname</TableHead>
                  <TableHead>Straße</TableHead>
                  <TableHead>Hausnummer</TableHead>
                  <TableHead>PLZ</TableHead>
                  <TableHead>Ort</TableHead>
                  <TableHead>Heizungshersteller</TableHead>
                  <TableHead>Baujahr</TableHead>
                  <TableHead>Heizsystem</TableHead>
                  <TableHead>Heizungstechnik</TableHead>
                  <TableHead>Energieträger</TableHead>
                </>
              )}
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHeizungsplaketten.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.artDerImmobilie}</TableCell>
                <TableCell>{item.heizungsart}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                {showDetails && (
                  <>
                    <TableCell>{item.vorname}</TableCell>
                    <TableCell>{item.nachname}</TableCell>
                    <TableCell>{item.strasse}</TableCell>
                    <TableCell>{item.hausnummer}</TableCell>
                    <TableCell>{item.postleitzahl}</TableCell>
                    <TableCell>{item.ort}</TableCell>
                    <TableCell>{item.heizungshersteller}</TableCell>
                    <TableCell>{item.baujahr}</TableCell>
                    <TableCell>{item.heizsystem}</TableCell>
                    <TableCell>{item.heizungstechnik}</TableCell>
                    <TableCell>{item.energietraeger}</TableCell>
                  </>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menü öffnen</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleWatch(item)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Beobachten
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleApprove(item.id)} disabled={isApproving || item.status === 'Genehmigt'}>
                        <Check className="mr-2 h-4 w-4" />
                        {isApproving ? 'Wird genehmigt...' : 'Genehmigen'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReject(item.id)} disabled={item.status === 'Abgelehnt'}>
                        <X className="mr-2 h-4 w-4" />
                        Ablehnen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editingItem !== null} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Heizungsplakette bearbeiten</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="artDerImmobilie">Art der Immobilie</Label>
                  <Select
                    value={editingItem.artDerImmobilie}
                    onValueChange={(value) => setEditingItem({...editingItem, artDerImmobilie: value})}
                  >
                    <SelectTrigger>
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
                </div>
                <div>
                  <Label htmlFor="heizungsart">Heizungsart</Label>
                  <Select
                    value={editingItem.heizungsart}
                    onValueChange={(value) => {
                      setEditingItem({...editingItem, heizungsart: value});
                      updateAvailableHeizungshersteller(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie die Heizungsart" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasheizung">Gasheizung</SelectItem>
                      <SelectItem value="Ölheizung">Ölheizung</SelectItem>
                      <SelectItem value="Wärmepumpe">Wärmepumpe</SelectItem>
                      <SelectItem value="Sonstige">Sonstige</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="heizungshersteller">Heizungshersteller</Label>
                  <Select
                    value={editingItem.heizungshersteller}
                    onValueChange={(value) => setEditingItem({...editingItem, heizungshersteller: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie den Heizungshersteller" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableHeizungshersteller.map((hersteller: string) => (
                        <SelectItem key={hersteller} value={hersteller}>{hersteller}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    value={editingItem.email}
                    onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingItem.status}
                    onValueChange={(value) => setEditingItem({...editingItem, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie den Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ausstehend">Ausstehend</SelectItem>
                      <SelectItem value="Genehmigt">Genehmigt</SelectItem>
                      <SelectItem value="Abgelehnt">Abgelehnt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Fügen Sie hier weitere Felder hinzu */}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSave}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={watchingItem !== null} onOpenChange={() => setWatchingItem(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Heizungsplakette Details</DialogTitle>
          </DialogHeader>
          {watchingItem && (
            <Tabs defaultValue="seite1" className="w-full">
              <TabsList>
                <TabsTrigger value="seite1">Seite 1</TabsTrigger>
                <TabsTrigger value="seite2">Seite 2</TabsTrigger>
                <TabsTrigger value="seite3">Seite 3</TabsTrigger>
              </TabsList>
              <TabsContent value="seite1">
                <div className="grid gap-4 py-4">
                  <div><strong>Art der Immobilie:</strong> {watchingItem.artDerImmobilie}</div>
                  <div><strong>Heizungsart:</strong> {watchingItem.heizungsart}</div>
                  <div><strong>E-Mail:</strong> {watchingItem.email}</div>
                  <div><strong>Status:</strong> {watchingItem.status}</div>
                  <div><strong>Vorname:</strong> {watchingItem.vorname}</div>
                  <div><strong>Nachname:</strong> {watchingItem.nachname}</div>
                  <div><strong>Straße:</strong> {watchingItem.strasse}</div>
                  <div><strong>Hausnummer:</strong> {watchingItem.hausnummer}</div>
                  <div><strong>PLZ:</strong> {watchingItem.postleitzahl}</div>
                  <div><strong>Ort:</strong> {watchingItem.ort}</div>
                  <div><strong>Heizungshersteller:</strong> {watchingItem.heizungshersteller}</div>
                  <div><strong>Baujahr:</strong> {watchingItem.baujahr}</div>
                  <div><strong>Heizsystem:</strong> {watchingItem.heizsystem}</div>
                  <div><strong>Heizungstechnik:</strong> {watchingItem.heizungstechnik}</div>
                  <div><strong>Energieträger:</strong> {watchingItem.energietraeger}</div>
                </div>
              </TabsContent>
              <TabsContent value="seite2">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">DIE AUSGESTELLTE HEIZUNGSPLAKETTE</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>basiert auf den Angaben der Person, die auf der Vorderseite genannt ist</li>
                    <li>ist von den Ausstellern nicht vor Ort kontrolliert worden</li>
                    <li>basiert auf den gesetzlichen Vorgaben des GEG in der Fassung ab 01.01.2024</li>
                    <li>geht davon aus, dass fossile Energieträger nach dem bei Ausstellung der Heizungsplakette geltenden GEG 2024 bis zum 31.12.2044 weitergenutzt werden können</li>
                    <li>geht davon aus, dass die Heizung funktionstüchtig ist bzw. repariert werden kann. Sollte die Heizung irreparabel defekt sein oder werden, muss eine neue Heizung nach den Vorgaben des GEG eingebaut werden</li>
                    <li>geht davon aus, dass keine zusätzlichen Betriebs- oder anderen Verbote für Heizkessel nach der Fassung GEG 2024 eingeführt worden sind und auch keine anderen Betriebsverbote nach anderen Gesetzen bestehen</li>
                    <li>gilt nur für die genannte Immobilie mit der genannten Heizung</li>
                    <li>hat aufgrund der zu erwartenden gesetzlichen Neuregelungen des GEG in 2026 eine beschränkte Gültigkeitsdauer bis 31.12.2026</li>
                    <li>dient ausschließlich der Information von Eigentümern, Kaufinteressenten, Immobilienexperten über die gesetzlichen Vorgaben im Hinblick auf die Angaben, die zur Ausstellung dieser Heizungsplakette geführt haben. Eine Haftung für die Richtigkeit der Angaben wird von den Ausstellern nicht übernommen.</li>
                  </ul>
                  <p>{`${watchingItem.strasse} ${watchingItem.hausnummer}, ${watchingItem.postleitzahl} ${watchingItem.ort}`}</p>
                  <p>{`hinweise zur heizungsplakette zur immobilie`}</p>
                </div>
              </TabsContent>
              <TabsContent value="seite3">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">DIE FOTOS ZUR HEIZUNGSPLAKETTE</h2>
                  {watchingItem.verzichtFotos ? (
                    <p>Der Eigentümer hat ausdrücklich auf die Bereitstellung von Fotos verzichtet.</p>
                  ) : (
                    <>
                      {watchingItem.fotoHeizungslabel && (
                        <Image 
                          src={URL.createObjectURL(watchingItem.fotoHeizungslabel)} 
                          alt="Heizungslabel" 
                          width={500} 
                          height={300} 
                          className="max-w-full h-auto" 
                        />
                      )}
                      {watchingItem.fotoHeizung && (
                        <Image 
                          src={URL.createObjectURL(watchingItem.fotoHeizung)} 
                          alt="Heizung" 
                          width={500} 
                          height={300} 
                          className="max-w-full h-auto" 
                        />
                      )}
                      {watchingItem.fotoBedienungsanleitung && (
                        <Image 
                          src={URL.createObjectURL(watchingItem.fotoBedienungsanleitung)} 
                          alt="Erste Seite der Bedienungsanleitung" 
                          width={500} 
                          height={300} 
                          className="max-w-full h-auto" 
                        />
                      )}
                    </>
                  )}
                  <p>{`${watchingItem.strasse} ${watchingItem.hausnummer}, ${watchingItem.postleitzahl} ${watchingItem.ort}`}</p>
                  <p>{`hinweise zur heizungsplakette zur immobilie ${watchingItem.strasse} ${watchingItem.hausnummer}, ${watchingItem.postleitzahl} ${watchingItem.ort}, mit dem Ausstellungsdatum vom ${new Date().toLocaleDateString()} und den Angaben, die von ${watchingItem.vorname} ${watchingItem.nachname} stammen.`}</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}