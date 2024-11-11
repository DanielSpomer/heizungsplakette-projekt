'use client'

import { useState, useEffect } from 'react'
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
import { Search, MoreHorizontal, Edit, Eye, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const getHeizungshersteller = (heizungsart: string) => {
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

const initialHeizungsplaketten = [
  { 
    id: 1,
    datenschutz: true,
    gesetzlicheRichtlinien: true,
    agb: true,
    artDerImmobilie: "Einfamilienhaus",
    heizungsart: "Gasheizung",
    email: "max@example.com",
    strasse: "Musterstraße",
    hausnummer: "1",
    postleitzahl: "12345",
    ort: "Berlin",
    heizsystem: "Zentralheizung",
    heizungshersteller: "Viessmann",
    heizungsherstellerSonstige: "",
    baujahr: "2010",
    typenbezeichnung: "Vitodens 200-W",
    energieausweis: "Ja",
    energieausweisDate: "2022-05-15",
    vorname: "Max",
    nachname: "Mustermann",
    personStrasse: "Musterstraße",
    personHausnummer: "1",
    personPostleitzahl: "12345",
    personOrt: "Berlin",
    istEigentuemer: "Ja",
    status: "Ausstehend",
    heizungstechnik: "Brennwerttechnik",
    energietraeger: "Gas",
    fotoHeizungslabel: null,
    fotoHeizung: null,
    fotoBedienungsanleitung: null,
    verzichtFotos: false
  },
  { 
    id: 2,
    datenschutz: true,
    gesetzlicheRichtlinien: true,
    agb: true,
    artDerImmobilie: "Mehrfamilienhaus",
    heizungsart: "Wärmepumpe",
    email: "erika@example.com",
    strasse: "Beispielweg",
    hausnummer: "42",
    postleitzahl: "54321",
    ort: "München",
    heizsystem: "Etagenheizung",
    heizungshersteller: "Daikin",
    heizungsherstellerSonstige: "",
    baujahr: "2018",
    typenbezeichnung: "Altherma 3",
    energieausweis: "Nein",
    energieausweisDate: "",
    vorname: "Erika",
    nachname: "Musterfrau",
    personStrasse: "Beispielweg",
    personHausnummer: "42",
    personPostleitzahl: "54321",
    personOrt: "München",
    istEigentuemer: "Nein",
    status: "Ausstehend",
    heizungstechnik: "Wärmepumpentechnik",
    energietraeger: "Strom",
    fotoHeizungslabel: null,
    fotoHeizung: null,
    fotoBedienungsanleitung: null,
    verzichtFotos: true
  },
]

const getStatusColor = (status: string) => {
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
  const [heizungsplaketten, setHeizungsplaketten] = useState(initialHeizungsplaketten)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState<any>(null)
  const [watchingItem, setWatchingItem] = useState<any>(null)
  const [availableHeizungshersteller, setAvailableHeizungshersteller] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setAvailableHeizungshersteller(getHeizungshersteller(editingItem.heizungsart))
    }
  }, [editingItem?.heizungsart])

  const filteredHeizungsplaketten = heizungsplaketten.filter(item =>
    Object.values(item).some(value => 
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleEdit = (item: any) => {
    setEditingItem({ ...item })
  }

  const handleSave = () => {
    if (editingItem) {
      setHeizungsplaketten(heizungsplaketten.map(item => 
        item.id === editingItem.id ? editingItem : item
      ))
      setEditingItem(null)
    }
  }

  const handleWatch = (item: any) => {
    setWatchingItem(item)
  }

  const handleApprove = (id: number) => {
    setHeizungsplaketten(heizungsplaketten.map(item => 
      item.id === id ? { ...item, status: 'Genehmigt' } : item
    ))
  }

  const handleReject = (id: number) => {
    setHeizungsplaketten(heizungsplaketten.map(item => 
      item.id === id ? { ...item, status: 'Abgelehnt' } : item
    ))
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
                      <DropdownMenuItem onClick={() => handleApprove(item.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Genehmigen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReject(item.id)}>
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

      <Dialog open={editingItem !== null} onOpenChange={() => setEditingItem(null)}>
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
                    onValueChange={(value) => setEditingItem({...editingItem, artDerImmobilie: value, artDerImmobilieSonstige: value !== 'Sonstige' ? '' : editingItem.artDerImmobilieSonstige})}
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
                {editingItem.artDerImmobilie === 'Sonstige' && (
                  <div>
                    <Label htmlFor="artDerImmobilieSonstige">Sonstige Art der Immobilie</Label>
                    <Input
                      id="artDerImmobilieSonstige"
                      value={editingItem.artDerImmobilieSonstige}
                      onChange={(e) => setEditingItem({...editingItem, artDerImmobilieSonstige: e.target.value})
                      }
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="heizungsart">Heizungsart</Label>
                  <Select
                    value={editingItem.heizungsart}
                    onValueChange={(value) => {
                      setEditingItem({
                        ...editingItem,
                        heizungsart: value,
                        heizungsartSonstige: value !== 'Sonstige' ? '' : editingItem.heizungsartSonstige,
                        heizungshersteller: '',
                        heizungsherstellerSonstige: ''
                      });
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
                {editingItem.heizungsart === 'Sonstige' && (
                  <div>
                    <Label htmlFor="heizungsartSonstige">Sonstige Heizungsart</Label>
                    <Input
                      id="heizungsartSonstige"
                      value={editingItem.heizungsartSonstige}
                      onChange={(e) => setEditingItem({...editingItem, heizungsartSonstige: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="heizungshersteller">Heizungshersteller</Label>
                  {editingItem.heizungsart === 'Sonstige' ? (
                    <Input
                      id="heizungshersteller"
                      value={editingItem.heizungshersteller}
                      onChange={(e) => setEditingItem({...editingItem, heizungshersteller: e.target.value})}
                    />
                  ) : (
                    <Select
                      value={editingItem.heizungshersteller}
                      onValueChange={(value) => setEditingItem({...editingItem, heizungshersteller: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie den Heizungshersteller" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableHeizungshersteller.map((hersteller) => (
                          <SelectItem key={hersteller} value={hersteller}>{hersteller}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
                  <Label htmlFor="strasse">Straße</Label>
                  <Input
                    id="strasse"
                    value={editingItem.strasse}
                    onChange={(e) => setEditingItem({...editingItem, strasse: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="hausnummer">Hausnummer</Label>
                  <Input
                    id="hausnummer"
                    value={editingItem.hausnummer}
                    onChange={(e) => setEditingItem({...editingItem, hausnummer: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="postleitzahl">Postleitzahl</Label>
                  <Input
                    id="postleitzahl"
                    value={editingItem.postleitzahl}
                    onChange={(e) => setEditingItem({...editingItem, postleitzahl: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ort">Ort</Label>
                  <Input
                    id="ort"
                    value={editingItem.ort}
                    onChange={(e) => setEditingItem({...editingItem, ort: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="heizsystem">Heizsystem</Label>
                  <Select
                    value={editingItem.heizsystem}
                    onValueChange={(value) => setEditingItem({...editingItem, heizsystem: value, heizsystemSonstige: value !== 'Sonstige' ? '' : editingItem.heizsystemSonstige})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie das Heizsystem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zentralheizung">Zentralheizung</SelectItem>
                      <SelectItem value="Etagenheizung">Etagenheizung</SelectItem>
                      <SelectItem value="Einzelraumheizung">Einzelraumheizung</SelectItem>
                      <SelectItem value="Sonstige">Sonstige</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingItem.heizsystem === 'Sonstige' && (
                  <div>
                    <Label htmlFor="heizsystemSonstige">Sonstiges Heizsystem</Label>
                    <Input
                      id="heizsystemSonstige"
                      value={editingItem.heizsystemSonstige}
                      onChange={(e) => setEditingItem({...editingItem, heizsystemSonstige: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="baujahr">Baujahr</Label>
                  <Input
                    id="baujahr"
                    value={editingItem.baujahr}
                    onChange={(e) => setEditingItem({...editingItem, baujahr: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="typenbezeichnung">Typenbezeichnung</Label>
                  <Input
                    id="typenbezeichnung"
                    value={editingItem.typenbezeichnung}
                    onChange={(e) => setEditingItem({...editingItem, typenbezeichnung: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="energieausweis">Energieausweis</Label>
                  <RadioGroup
                    value={editingItem.energieausweis}
                    onValueChange={(value) => setEditingItem({...editingItem, energieausweis: value,
                      energieausweisDate: value === 'Nein' ? '' : editingItem.energieausweisDate
                    })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ja" id="energieausweisJa" />
                      <Label htmlFor="energieausweisJa">Ja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Nein" id="energieausweisNein" />
                      <Label htmlFor="energieausweisNein">Nein</Label>
                    </div>
                  </RadioGroup>
                </div>
                {editingItem.energieausweis === 'Ja' && (
                  <div>
                    <Label htmlFor="energieausweisDate">Datum des Energieausweises</Label>
                    <Input
                      id="energieausweisDate"
                      type="date"
                      value={editingItem.energieausweisDate}
                      onChange={(e) => setEditingItem({...editingItem, energieausweisDate: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="vorname">Vorname</Label>
                  <Input
                    id="vorname"
                    value={editingItem.vorname}
                    onChange={(e) => setEditingItem({...editingItem, vorname: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="nachname">Nachname</Label>
                  <Input
                    id="nachname"
                    value={editingItem.nachname}
                    onChange={(e) => setEditingItem({...editingItem, nachname: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="personStrasse">Straße (Person)</Label>
                  <Input
                    id="personStrasse"
                    value={editingItem.personStrasse}
                    onChange={(e) => setEditingItem({...editingItem, personStrasse: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="personHausnummer">Hausnummer (Person)</Label>
                  <Input
                    id="personHausnummer"
                    value={editingItem.personHausnummer}
                    onChange={(e) => setEditingItem({...editingItem, personHausnummer: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="personPostleitzahl">Postleitzahl (Person)</Label>
                  <Input
                    id="personPostleitzahl"
                    value={editingItem.personPostleitzahl}
                    onChange={(e) => setEditingItem({...editingItem, personPostleitzahl: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="personOrt">Ort (Person)</Label>
                  <Input
                    id="personOrt"
                    value={editingItem.personOrt}
                    onChange={(e) => setEditingItem({...editingItem, personOrt: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="istEigentuemer">Ist Eigentümer</Label>
                  <RadioGroup
                    value={editingItem.istEigentuemer}
                    onValueChange={(value) => setEditingItem({...editingItem, istEigentuemer: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ja" id="istEigentuemerJa" />
                      <Label htmlFor="istEigentuemerJa">Ja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Nein" id="istEigentuemerNein" />
                      <Label htmlFor="istEigentuemerNein">Nein</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="heizungstechnik">Heizungstechnik</Label>
                  <Select
                    value={editingItem.heizungstechnik}
                    onValueChange={(value) => setEditingItem({...editingItem, heizungstechnik: value, heizungstechnikSonstige: value !== 'Sonstige' ? '' : editingItem.heizungstechnikSonstige})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie die Heizungstechnik" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brennwerttechnik">Brennwerttechnik</SelectItem>
                      <SelectItem value="Niedertemperaturkessel">Niedertemperaturkessel</SelectItem>
                      <SelectItem value="Konstanttemperatur">Konstanttemperatur</SelectItem>
                      <SelectItem value="nicht bekannt">nicht bekannt</SelectItem>
                      <SelectItem value="Sonstige">Sonstige</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingItem.heizungstechnik === 'Sonstige' && (
                  <div>
                    <Label htmlFor="heizungstechnikSonstige">Sonstige Heizungstechnik</Label>
                    <Input
                      id="heizungstechnikSonstige"
                      value={editingItem.heizungstechnikSonstige}
                      onChange={(e) => setEditingItem({...editingItem, heizungstechnikSonstige: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="energietraeger">Energieträger</Label>
                  <Select
                    value={editingItem.energietraeger}
                    onValueChange={(value) => setEditingItem({...editingItem, energietraeger: value, energietraegerSonstige: value !== 'Sonstige' ? '' : editingItem.energietraegerSonstige})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie den Energieträger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Strom">Strom</SelectItem>
                      <SelectItem value="Gas">Gas</SelectItem>
                      <SelectItem value="Öl">Öl</SelectItem>
                      <SelectItem value="Kohle">Kohle</SelectItem>
                      <SelectItem value="Holz/Pellet">Holz/Pellet</SelectItem>
                      <SelectItem value="Torf">Torf</SelectItem>
                      <SelectItem value="weiss nicht">weiss nicht</SelectItem>
                      <SelectItem value="Sonstige">Sonstige</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingItem.energietraeger === 'Sonstige' && (
                  <div>
                    <Label htmlFor="energietraegerSonstige">Sonstiger Energieträger</Label>
                    <Input
                      id="energietraegerSonstige"
                      value={editingItem.energietraegerSonstige}
                      onChange={(e) => setEditingItem({...editingItem, energietraegerSonstige: e.target.value})}
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verzichtFotos"
                      checked={editingItem.verzichtFotos}
                      onCheckedChange={(checked) => setEditingItem({...editingItem, verzichtFotos: checked})}
                    />
                    <Label htmlFor="verzichtFotos">
                      Ich verzichte ausdrücklich auf das Bereitstellen von Fotos
                    </Label>
                  </div>
                </div>
                {!editingItem.verzichtFotos && (
                  <>
                    <div>
                      <Label htmlFor="fotoHeizungslabel">Foto des Heizungslabels</Label>
                      <Input
                        id="fotoHeizungslabel"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditingItem({...editingItem, fotoHeizungslabel: e.target.files?.[0] || null})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fotoHeizung">Foto der Heizung</Label>
                      <Input
                        id="fotoHeizung"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditingItem({...editingItem, fotoHeizung: e.target.files?.[0] || null})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fotoBedienungsanleitung">Foto der ersten Seite der Bedienungsanleitung</Label>
                      <Input
                        id="fotoBedienungsanleitung"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditingItem({...editingItem, fotoBedienungsanleitung: e.target.files?.[0] || null})}
                      />
                    </div>
                  </>
                )}
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
            <DialogTitle>Heizungsplakette beobachten</DialogTitle>
          </DialogHeader>
          {watchingItem && (
            <Tabs defaultValue="seite1" className="w-full">
              <TabsList>
                <TabsTrigger value="seite1">Seite 1</TabsTrigger>
                <TabsTrigger value="seite2">Seite 2</TabsTrigger>
                <TabsTrigger value="seite3">Seite 3</TabsTrigger>
              </TabsList>
              <TabsContent value="seite1">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">HEIZUNGSPLAKETTE</h2>
                  <p>für die {watchingItem.heizungsart}</p>
                  <p>in der Immobilie:</p>
                  <p>{`${watchingItem.strasse} ${watchingItem.hausnummer}, ${watchingItem.postleitzahl} ${watchingItem.ort}`}</p>
                  <p>Hersteller der Heizung: {watchingItem.heizungshersteller}</p>
                  <p>Baujahr der Heizung: {watchingItem.baujahr}</p>
                  <p>Heiztechnik: {watchingItem.heizungstechnik}</p>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={watchingItem.artDerImmobilie === 'Einfamilienhaus' || watchingItem.artDerImmobilie === 'Mehrfamilienhaus'} />
                    <Label>EFH</Label>
                  </div>
                  <p>Energieträger: {watchingItem.energietraeger}</p>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={watchingItem.heizsystem === 'Zentralheizung'} />
                    <Label>Zentralheizung</Label>
                  </div>
                  <p>Energieausweis: {watchingItem.energieausweisDate}</p>
                  <p>Angaben gemacht von:</p>
                  <p>Weiterbetrieb der Heizung: {watchingItem.vorname} {watchingItem.nachname}</p>
                  <p>Weiterbetrieb der Heizung: möglich bis: 2044</p>
                  <p>Diese Heizung kann nach den Vorschriften des aktuellen GEG bis Ende 2044 weiterbetrieben werden, wenn die Heizung funktionstüchtig bleibt und nicht irreparabel kaputt geht.</p>
                  <p>
                    {watchingItem.verzichtFotos
                      ? "Der Eigentümer hat ausdrücklich auf die Bereitstellung von Fotos verzichtet."
                      : "Der Eigentümer hat Fotos bereitgestellt."}
                  </p>
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
                      {watchingItem.fotoHeizungslabel && <img src={URL.createObjectURL(watchingItem.fotoHeizungslabel)} alt="Heizungslabel" className="max-w-full h-auto" />}
                      {watchingItem.fotoHeizung && <img src={URL.createObjectURL(watchingItem.fotoHeizung)} alt="Heizung" className="max-w-full h-auto" />}
                      {watchingItem.fotoBedienungsanleitung && <img src={URL.createObjectURL(watchingItem.fotoBedienungsanleitung)} alt="Erste Seite der Bedienungsanleitung" className="max-w-full h-auto" />}
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