'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Edit, Eye, Check, X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

type HeizungsplaketteItem = {
  id: number;
  datenschutzUndNutzungsbedingungen: boolean;
  einwilligungDatenverarbeitung: boolean;
  aufforderungSofortigeTaetigkeit: boolean;
  email: string;
  artDerImmobilie: string;
  artDerImmobilieSonstige: string;
  heizungsart: string;
  heizungsartSonstige: string;
  strasse: string;
  hausnummer: string;
  postleitzahl: string;
  ort: string;
  heizsystem: string;
  heizsystemSonstige: string;
  heizungshersteller: string;
  baujahr: number;
  typenbezeichnung: string;
  typenbezeichnungUnbekannt: boolean;
  heizungstechnik: string;
  heizungstechnikSonstige: string;
  energietraeger: string;
  energietraegerSonstige: string;
  energieausweis: string;
  energieausweisDate: string;
  vorname: string;
  nachname: string;
  personStrasse: string;
  personHausnummer: string;
  personPostleitzahl: string;
  personOrt: string;
  istEigentuemer: string;
  heizungsanlageFotos: string[];
  heizungsetiketteFotos: string[];
  heizungslabelFotos: string[];
  bedienungsanleitungFotos: string[];
  verzichtAufHeizungsanlageFotos: boolean;
  verzichtAufHeizungsetiketteFotos: boolean;
  verzichtAufHeizungslabelFotos: boolean;
  verzichtAufBedienungsanleitungFotos: boolean;
  status: string;
}

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

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [heizungsplaketten, setHeizungsplaketten] = useState<HeizungsplaketteItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState<HeizungsplaketteItem | null>(null)
  const [watchingItem, setWatchingItem] = useState<HeizungsplaketteItem | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn')
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true)
      fetchHeizungsplaketten()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'Heizungsplakette' && password === 'Heizungsplakette2025!.!_safe') {
      setIsLoggedIn(true)
      localStorage.setItem('isLoggedIn', 'true')
      toast({
        title: "Erfolgreich eingeloggt",
        description: "Willkommen im Dashboard.",
      })
      fetchHeizungsplaketten()
    } else {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Bitte überprüfen Sie Ihren Benutzernamen und Ihr Passwort.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  }

  const fetchHeizungsplaketten = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/heizungsplakette')
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Daten')
      }
      const data = await response.json()
      setHeizungsplaketten(data)
    } catch (error) {
      console.error('Fehler beim Abrufen der Heizungsplaketten:', error)
      toast({
        title: "Fehler",
        description: "Die Heizungsplaketten konnten nicht geladen werden.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
      setIsLoading(true);
      try {
        const response = await fetch(`/api/heizungsplakette/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });

        if (!response.ok) {
          throw new Error('Fehler beim Speichern der Änderungen');
        }

        await fetchHeizungsplaketten();
        setEditingItem(null);
        toast({
          title: "Gespeichert",
          description: "Die Änderungen wurden erfolgreich gespeichert.",
        });
      } catch (error) {
        console.error('Fehler beim Speichern der Änderungen:', error);
        toast({
          title: "Fehler",
          description: "Die Änderungen konnten nicht gespeichert werden.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleWatch = (item: HeizungsplaketteItem) => {
    setWatchingItem(item)
  }

  const handleApprove = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/heizungsplakette/${id}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Genehmigung der Heizungsplakette');
      }

      await fetchHeizungsplaketten();
      toast({
        title: "Genehmigt",
        description: "Die Heizungsplakette wurde erfolgreich genehmigt.",
      });
    } catch (error) {
      console.error('Fehler bei der Genehmigung der Heizungsplakette:', error);
      toast({
        title: "Fehler",
        description: "Die Heizungsplakette konnte nicht genehmigt werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/heizungsplakette/${id}/reject`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Ablehnung der Heizungsplakette');
      }

      await fetchHeizungsplaketten();
      toast({
        title: "Abgelehnt",
        description: "Die Heizungsplakette wurde abgelehnt.",
      });
    } catch (error) {
      console.error('Fehler bei der Ablehnung der Heizungsplakette:', error);
      toast({
        title: "Fehler",
        description: "Die Heizungsplakette konnte nicht abgelehnt werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[350px]">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Anmelden</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Heizungsplaketten Dashboard</h1>
            <Button onClick={handleLogout}>Abmelden</Button>
          </div>

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
                          <DropdownMenuItem onClick={() => handleApprove(item.id)} disabled={isLoading || item.status === 'Genehmigt'}>
                            <Check className="mr-2 h-4 w-4" />
                            Genehmigen
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReject(item.id)} disabled={isLoading || item.status === 'Abgelehnt'}>
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
                        onValueChange={(value) => setEditingItem({...editingItem, heizungsart: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen Sie die Heizungsart" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gasheizung">Gasheizung</SelectItem>
                          <SelectItem value="Öl Heizung">Öl Heizung</SelectItem>
                          <SelectItem value="Wärmepumpe">Wärmepumpe</SelectItem>
                          <SelectItem value="Fernwärme">Fernwärme</SelectItem>
                          <SelectItem value="Sonstige">Sonstige</SelectItem>
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
                      <Label htmlFor="postleitzahl">PLZ</Label>
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
                      <Label htmlFor="heizungshersteller">Heizungshersteller</Label>
                      <Input
                        id="heizungshersteller"
                        value={editingItem.heizungshersteller}
                        onChange={(e) => setEditingItem({...editingItem, heizungshersteller: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="baujahr">Baujahr</Label>
                      <Input
                        id="baujahr"
                        type="number"
                        value={editingItem.baujahr}
                        onChange={(e) => setEditingItem({...editingItem, baujahr: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="heizsystem">Heizsystem</Label>
                      <Input
                        id="heizsystem"
                        value={editingItem.heizsystem}
                        onChange={(e) => setEditingItem({...editingItem, heizsystem: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="heizungstechnik">Heizungstechnik</Label>
                      <Input
                        id="heizungstechnik"
                        value={editingItem.heizungstechnik}
                        onChange={(e) => setEditingItem({...editingItem, heizungstechnik: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="energietraeger">Energieträger</Label>
                      <Input
                        id="energietraeger"
                        value={editingItem.energietraeger}
                        onChange={(e) => setEditingItem({...editingItem, energietraeger: e.target.value})}
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
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="typenbezeichnungUnbekannt"
                        checked={editingItem.typenbezeichnungUnbekannt}
                        onCheckedChange={(checked) => setEditingItem({...editingItem, typenbezeichnungUnbekannt: checked as boolean})}
                      />
                      <Label htmlFor="typenbezeichnungUnbekannt">Typenbezeichnung unbekannt</Label>
                    </div>
                    <div>
                      <Label htmlFor="energieausweis">Energieausweis</Label>
                      <Input
                        id="energieausweis"
                        value={editingItem.energieausweis}
                        onChange={(e) => setEditingItem({...editingItem, energieausweis: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="energieausweisDate">Energieausweis Datum</Label>
                      <Input
                        id="energieausweisDate"
                        type="date"
                        value={editingItem.energieausweisDate}
                        onChange={(e) => setEditingItem({...editingItem, energieausweisDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="istEigentuemer">Ist Eigentümer</Label>
                      <Select
                        value={editingItem.istEigentuemer}
                        onValueChange={(value) => setEditingItem({...editingItem, istEigentuemer: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen Sie den Eigentümerstatus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ja">Ja</SelectItem>
                          <SelectItem value="Nein">Nein</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="datenschutzUndNutzungsbedingungen"
                        checked={editingItem.datenschutzUndNutzungsbedingungen}
                        onCheckedChange={(checked) => setEditingItem({...editingItem, datenschutzUndNutzungsbedingungen: checked as boolean})}
                      />
                      <Label htmlFor="datenschutzUndNutzungsbedingungen">Datenschutz und Nutzungsbedingungen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="einwilligungDatenverarbeitung"
                        checked={editingItem.einwilligungDatenverarbeitung}
                        onCheckedChange={(checked) => setEditingItem({...editingItem, einwilligungDatenverarbeitung: checked as boolean})}
                      />
                      <Label htmlFor="einwilligungDatenverarbeitung">Einwilligung Datenverarbeitung</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="aufforderungSofortigeTaetigkeit"
                        checked={editingItem.aufforderungSofortigeTaetigkeit}
                        onCheckedChange={(checked) => setEditingItem({...editingItem, aufforderungSofortigeTaetigkeit: checked as boolean})}
                      />
                      <Label htmlFor="aufforderungSofortigeTaetigkeit">Aufforderung sofortige Tätigkeit</Label>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Wird gespeichert...' : 'Speichern'}
                </Button>
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
                    <div className="grid gap-4 py-4">
                      <div><strong>Typenbezeichnung:</strong> {watchingItem.typenbezeichnung}</div>
                      <div><strong>Typenbezeichnung unbekannt:</strong> {watchingItem.typenbezeichnungUnbekannt ? 'Ja' : 'Nein'}</div>
                      <div><strong>Energieausweis:</strong> {watchingItem.energieausweis}</div>
                      <div><strong>Energieausweis Datum:</strong> {watchingItem.energieausweisDate}</div>
                      <div><strong>Ist Eigentümer:</strong> {watchingItem.istEigentuemer}</div>
                      <div><strong>Datenschutz und Nutzungsbedingungen:</strong> {watchingItem.datenschutzUndNutzungsbedingungen ? 'Ja' : 'Nein'}</div>
                      <div><strong>Einwilligung Datenverarbeitung:</strong> {watchingItem.einwilligungDatenverarbeitung ? 'Ja' : 'Nein'}</div>
                      <div><strong>Aufforderung sofortige Tätigkeit:</strong> {watchingItem.aufforderungSofortigeTaetigkeit ? 'Ja' : 'Nein'}</div>
                    </div>
                  </TabsContent>
                  <TabsContent value="seite3">
                    <div className="grid gap-4 py-4">
                      <div><strong>Verzicht auf Heizungsanlage Fotos:</strong> {watchingItem.verzichtAufHeizungsanlageFotos ? 'Ja' : 'Nein'}</div>
                      <div><strong>Verzicht auf Heizungsetikette Fotos:</strong> {watchingItem.verzichtAufHeizungsetiketteFotos ? 'Ja' : 'Nein'}</div>
                      <div><strong>Verzicht auf Heizungslabel Fotos:</strong> {watchingItem.verzichtAufHeizungslabelFotos ? 'Ja' : 'Nein'}</div>
                      <div><strong>Verzicht auf Bedienungsanleitung Fotos:</strong> {watchingItem.verzichtAufBedienungsanleitungFotos ? 'Ja' : 'Nein'}</div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}