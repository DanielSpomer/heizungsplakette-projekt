'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
/*import { Card, CardContent } from "@/components/ui/card"*/
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MoreHorizontal, Edit, Eye, Check, X, Sun, Moon, FileText } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { upload } from '@vercel/blob/client'

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
  pdfUrl?: string | null;
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
  const [heizungsplaketten, setHeizungsplaketten] = useState<HeizungsplaketteItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState<HeizungsplaketteItem | null>(null)
  const [watchingItem, setWatchingItem] = useState<HeizungsplaketteItem | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [pdfGeneratingItemId, setPdfGeneratingItemId] = useState<number | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const fetchHeizungsplaketten = useCallback(async () => {
    try {
      const response = await fetch('/api/heizungsplakette')
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Daten')
      }
      const data: HeizungsplaketteItem[] = await response.json()
      setHeizungsplaketten(data.map(item => ({ ...item, pdfUrl: item.pdfUrl || null })));
    } catch (error) {
      console.error('Fehler beim Abrufen der Heizungsplaketten:', error)
      toast({
        title: "Fehler",
        description: "Die Heizungsplaketten konnten nicht geladen werden.",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const heizungsplaketteResponse = await fetch('/api/heizungsplakette');
        if (!heizungsplaketteResponse.ok) {
          throw new Error('Netzwerkantwort war nicht ok für Heizungsplakette');
        }
        const data: HeizungsplaketteItem[] = await heizungsplaketteResponse.json();
        setHeizungsplaketten(data.map(item => ({ ...item, pdfUrl: item.pdfUrl || null })));
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        toast({
          title: "Fehler",
          description: "Daten konnten nicht geladen werden.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTestUpdatePdfUrl = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/heizungsplakette/${id}/test-update-pdf`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl: 'test.com' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Test-Update der PDF-URL');
      }

      await fetchHeizungsplaketten(); // Refresh data
      toast({
        title: "PDF URL Aktualisiert (Test)",
        description: `PDF URL für ID ${id} auf "test.com" gesetzt.`,
      });
    } catch (error: unknown) {
      console.error('Fehler beim Test-Update der PDF-URL:', error);
      let errorMessage = "Die PDF-URL konnte nicht aktualisiert werden (Test).";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

  const handleGeneratePdf = async (itemId: number) => {
    setPdfGeneratingItemId(itemId);
    setPdfPreviewUrl(null);
    try {
      const apiUrl = `/api/create_pdf?id=${itemId.toString()}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        let errorBody = `HTTP error ${response.status} (${response.statusText}) while fetching PDF from Python backend.`;
        try {
          const errorJson = await response.json(); 
          if (errorJson && errorJson.error) {
            errorBody = `PDF Generation Error (from Python): ${errorJson.error}`;
          } else {
             const text = await response.text(); 
             errorBody = text || errorBody; 
          }
        } catch (parseError) { 
            console.warn("Could not parse error response from /api/create_pdf", parseError);
            try { 
                const text = await response.text();
                errorBody = text || errorBody;
            } catch (textErr) {/* ignore */}
        }
        throw new Error(`${errorBody}`);
      }

      const pdfBlob = await response.blob(); 
      
      // Define the desired path and filename in the blob store
      const blobPathname = `pdfs/heizungsplakette-${itemId}.pdf`;
      // The File object itself can have a simpler name, its blobPathname that matters for storage location
      const localFileNameForFileObject = `heizungsplakette-${itemId}.pdf`;

      const pdfFile = new File([pdfBlob], localFileNameForFileObject, { type: 'application/pdf' });

      // Now upload this PDF file to Vercel Blob using the Next.js handler
      // The first argument to upload() is the full path in the blob store
      const newBlobResult = await upload(blobPathname, pdfFile, {
        access: 'public',
        handleUploadUrl: '/api/blob-upload', 
      });

      // --- Save PDF URL to Database using the new static route ---
      if (newBlobResult && newBlobResult.url) {
        try {
          // Convert itemId to string if it's not already, as the API expects a string ID (CUID)
          const recordIdString = String(itemId); 

          const updateResponse = await fetch('/api/update-record-pdf', { // New static API route
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: recordIdString, pdfUrl: newBlobResult.url }), // Send id in body
          });

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json().catch(() => ({ error: "Failed to parse error response from update-record-pdf" }));
            const errorMessage = errorData.error || updateResponse.statusText || "Unbekannter Fehler beim Speichern der PDF URL";
            console.error('Failed to save PDF URL to database via /api/update-record-pdf:', errorMessage);
            toast({
              title: "Speicherfehler DB",
              description: `PDF URL konnte nicht in DB gespeichert werden: ${errorMessage}`,
              variant: "destructive",
            });
            // Decide if you want to proceed with UI update if DB save fails, 
            // or perhaps revert the blob upload if critical.
            // For now, we will NOT update the UI if DB save fails.
          } else {
            const updatedRecord = await updateResponse.json();
            console.log('PDF URL successfully saved to database via /api/update-record-pdf, record:', updatedRecord);
            
            // Update local state ONLY after successful DB save
            setHeizungsplaketten(prevPlaketten => 
              prevPlaketten.map(p => 
                // Ensure consistent ID type for comparison (string vs number)
                String(p.id) === recordIdString ? { ...p, pdfUrl: newBlobResult.url } : p
              )
            );
            setPdfPreviewUrl(newBlobResult.url); // Show preview
            toast({
              title: "PDF Generiert & Gespeichert",
              description: `PDF erfolgreich erstellt, hochgeladen und URL in DB gespeichert: ${newBlobResult.url}`,
            });
          }
        } catch (dbError: unknown) {
          console.error('Error during API call to /api/update-record-pdf:', dbError);
          let dbErrorMessage = "Unbekannter Fehler beim Speichern der PDF URL via API.";
          if (dbError instanceof Error) {
            dbErrorMessage = dbError.message;
          }
          toast({
              title: "API Fehler DB",
              description: dbErrorMessage,
              variant: "destructive",
            });
        }
      } else {
        throw new Error("Blob upload succeeded but no URL was returned.");
      }
      // --- End Save PDF URL to Database ---

    } catch (error: unknown) {
      let errorMessage = "Fehler bei der PDF-Generierung oder dem Upload.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("PDF Generation/Upload Error:", error);
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPdfGeneratingItemId(null);
    }
  };

  const handlePreviewPdf = (url: string | null | undefined) => {
    if (url) {
      setPdfPreviewUrl(url);
    } else {
      toast({
        title: "Hinweis",
        description: "Für diesen Eintrag wurde noch kein PDF generiert oder gespeichert.",
        variant: "default",
      });
    }
  };

  if (isLoading || !mounted) {
    return <LoadingSpinner />
  }

  const currentLogo = theme === 'dark' ? '/images/heizungsplakette-logo-hell.png' : '/images/heizungsplakette-logo.png';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-52 bg-white dark:bg-gray-800 p-4 flex flex-col justify-between items-center shadow-lg">
        <div>
          <div className="mb-6">
            <Image src={currentLogo} alt="Heizungsplakette Logo" width={220} height={55} className="mb-4" />
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-8 ml-4">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center justify-start">
          <Button onClick={handleLogout} variant="outline" className="px-6 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            Abmelden
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full p-2 flex items-center justify-center dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 ml-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon className="h-7 w-7" /> : <Sun className="h-7 w-7" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Suche..."
              className="pl-8 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
            <Label htmlFor="show-details" className="text-gray-700 dark:text-gray-200">Details anzeigen</Label>
          </div>
        </div>

        {/* PDF Preview Section */} 
        {pdfPreviewUrl && (
          <div className="mt-6 mb-6 p-4 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold dark:text-gray-200">PDF Vorschau</h2>
              <Button variant="outline" onClick={() => setPdfPreviewUrl(null)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                Vorschau schließen
              </Button>
            </div>
            <div style={{ width: '100%', height: '700px', border: '1px solid #ccc' }}>
              <iframe
                src={pdfPreviewUrl}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="PDF Preview"
              ></iframe>
            </div>
          </div>
        )}

        <div className="border rounded-md overflow-x-auto bg-white dark:bg-gray-800 shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="dark:text-gray-300">Art der Immobilie</TableHead>
                <TableHead className="dark:text-gray-300">Heizungsart</TableHead>
                <TableHead className="dark:text-gray-300">Status</TableHead>
                <TableHead className="dark:text-gray-300">E-Mail</TableHead>
                {showDetails && (
                  <>
                    <TableHead className="dark:text-gray-300">Vorname</TableHead>
                    <TableHead className="dark:text-gray-300">Nachname</TableHead>
                    <TableHead className="dark:text-gray-300">Straße</TableHead>
                    <TableHead className="dark:text-gray-300">Hausnummer</TableHead>
                    <TableHead className="dark:text-gray-300">PLZ</TableHead>
                    <TableHead className="dark:text-gray-300">Ort</TableHead>
                    <TableHead className="dark:text-gray-300">Heizungshersteller</TableHead>
                    <TableHead className="dark:text-gray-300">Baujahr</TableHead>
                    <TableHead className="dark:text-gray-300">Heizsystem</TableHead>
                    <TableHead className="dark:text-gray-300">Heizungstechnik</TableHead>
                    <TableHead className="dark:text-gray-300">Energieträger</TableHead>
                  </>
                )}
                <TableHead className="dark:text-gray-300">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHeizungsplaketten.map((item) => (
                <TableRow key={item.id} className="dark:border-gray-700">
                  <TableCell className="dark:text-gray-300">{item.artDerImmobilie}</TableCell>
                  <TableCell className="dark:text-gray-300">{item.heizungsart}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(item.status)} dark:text-opacity-90`}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{item.email}</TableCell>
                  {showDetails && (
                    <>
                      <TableCell className="dark:text-gray-300">{item.vorname}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.nachname}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.strasse}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.hausnummer}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.postleitzahl}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.ort}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.heizungshersteller}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.baujahr}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.heizsystem}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.heizungstechnik}</TableCell>
                      <TableCell className="dark:text-gray-300">{item.energietraeger}</TableCell>
                    </>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 dark:text-gray-300 dark:hover:bg-gray-700">
                          <span className="sr-only">Menü öffnen</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                        <DropdownMenuItem onClick={() => handleEdit(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                          <Edit className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleWatch(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                          <Eye className="mr-2 h-4 w-4" />
                          Beobachten
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleGeneratePdf(item.id)}
                          disabled={pdfGeneratingItemId === item.id}
                          className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-500"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {pdfGeneratingItemId === item.id ? "Generiere PDF..." : "PDF generieren"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handlePreviewPdf(item.pdfUrl)}
                          disabled={!item.pdfUrl || pdfGeneratingItemId === item.id}
                          className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-500"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          PDF Vorschau
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleApprove(item.id)} disabled={isLoading || item.status === 'Genehmigt'} className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-500">
                          <Check className="mr-2 h-4 w-4" />
                          Genehmigen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReject(item.id)} disabled={isLoading || item.status === 'Abgelehnt'} className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-500">
                          <X className="mr-2 h-4 w-4" />
                          Ablehnen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTestUpdatePdfUrl(item.id)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                          Test PDF Update
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
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-200">Heizungsplakette bearbeiten</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="artDerImmobilie" className="dark:text-gray-300">Art der Immobilie</Label>
                    <Select
                      value={editingItem.artDerImmobilie}
                      onValueChange={(value) => setEditingItem({...editingItem, artDerImmobilie: value})}
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <SelectValue placeholder="Wählen Sie die Art der Immobilie" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                        <SelectItem value="Einfamilienhaus" className="dark:hover:bg-gray-700">Einfamilienhaus</SelectItem>
                        <SelectItem value="Mehrfamilienhaus" className="dark:hover:bg-gray-700">Mehrfamilienhaus</SelectItem>
                        <SelectItem value="Doppelhaushälfte" className="dark:hover:bg-gray-700">Doppelhaushälfte</SelectItem>
                        <SelectItem value="Reihenhaus" className="dark:hover:bg-gray-700">Reihenhaus</SelectItem>
                        <SelectItem value="Sonstige" className="dark:hover:bg-gray-700">Sonstige</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="heizungsart" className="dark:text-gray-300">Heizungsart</Label>
                    <Select
                      value={editingItem.heizungsart}
                      onValueChange={(value) => setEditingItem({...editingItem, heizungsart: value})}
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <SelectValue placeholder="Wählen Sie die Heizungsart" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                        <SelectItem value="Gasheizung" className="dark:hover:bg-gray-700">Gasheizung</SelectItem>
                        <SelectItem value="Öl Heizung" className="dark:hover:bg-gray-700">Öl Heizung</SelectItem>
                        <SelectItem value="Wärmepumpe" className="dark:hover:bg-gray-700">Wärmepumpe</SelectItem>
                        <SelectItem value="Fernwärme" className="dark:hover:bg-gray-700">Fernwärme</SelectItem>
                        <SelectItem value="Sonstige" className="dark:hover:bg-gray-700">Sonstige</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="email" className="dark:text-gray-300">E-Mail</Label>
                    <Input
                      id="email"
                      value={editingItem.email}
                      onChange={(e) => setEditingItem({...editingItem, email: e.target.value})}
                      className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vorname" className="dark:text-gray-300">Vorname</Label>
                    <Input
                      id="vorname"
                      value={editingItem.vorname}
                      onChange={(e) => setEditingItem({...editingItem, vorname: e.target.value})}
                      className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
              <Button onClick={handleSave} disabled={isLoading} className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
                {isLoading ? 'Wird gespeichert...' : 'Speichern'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={watchingItem !== null} onOpenChange={() => setWatchingItem(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-200">Heizungsplakette Details</DialogTitle>
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
      </div>
    </div>
  )
}