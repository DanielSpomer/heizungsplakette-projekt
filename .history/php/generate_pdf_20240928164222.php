<?php
require_once(__DIR__ . '/vendor/autoload.php');

use setasign\Fpdi\Tcpdf\Fpdi;

// Funktion zum Zeichnen eines ausgefüllten Rechtecks
function drawFilledRectangle($pdf, $x, $y, $w, $h) {
    $pdf->SetFillColor(0, 0, 0);
    $pdf->Rect($x, $y, $w, $h, 'F');
}

// Testdaten
$testData = [
    'heizungsart' => 'Gas',
    'hersteller' => 'Viessmann',
    'baujahr' => '2020',
    'heizsystem' => 'Brennwertkessel',
    'energieausweis' => 'Ja',
    'energietraeger' => 'Erdgas',
    'vorname' => 'Max',
    'nachname' => 'Mustermann',
    'energieausweisDate' => '2023-01-01'
];

// Erstellen eines neuen PDF-Dokuments
$pdf = new Fpdi();

// Vorhandenes PDF importieren
$pdf->setSourceFile(__DIR__ . '/HeizungsplaketteFinal_grid.pdf');
$tplIdx = $pdf->importPage(1);

// Neue Seite hinzufügen
$pdf->AddPage();
$pdf->useTemplate($tplIdx);

// Schriftart setzen
$pdf->SetFont('helvetica', '', 10);

// Daten aus den Testdaten
$data = [
    'heizungsart' => $testData['heizungsart'],
    'hersteller' => $testData['hersteller'],
    'baujahr' => $testData['baujahr'],
    'heiztechnik' => $testData['heizsystem'],
    'efh' => $testData['energieausweis'] === 'Ja',
    'energietraeger' => $testData['energietraeger'],
    'zentralheizung' => true, // Annahme basierend auf der tsx-Datei
    'angaben_von' => $testData['vorname'] . ' ' . $testData['nachname'],
    'energieausweis_datum' => $testData['energieausweisDate'],
    'weiterbetrieb_bis' => '31.12.2044', // Fester Wert basierend auf dem Bild
];

// Positionen und Größen für die Felder (angepasst an das Raster)
$positions = [
    'heizungsart' => [100, 90, 200, 20],        // Moved slightly right for better centering
    'hersteller' => [20, 170, 80, 7],          // Moved down slightly to align with the label
    'baujahr' => [120, 170, 70, 7],            // Moved down to match the 'hersteller'
    'heiztechnik' => [20, 180, 80, 7],         // Slight downward adjustment to align
    'efh' => [150, 180, 5, 5],                 // Slightly moved right for checkbox alignment
    'energietraeger' => [20, 190, 80, 7],      // Moved slightly down
    'zentralheizung' => [150, 190, 5, 5],      // Adjusted right to align checkboxes
    'angaben_von' => [20, 200, 80, 7],         // Adjusted downwards to align under 'Energieträger'
    'energieausweis_datum' => [120, 200, 70, 7], // Moved down slightly to match 'angaben_von'
    'weiterbetrieb_bis' => [70, 210, 70, 7],   // Slight downward adjustment for consistency
];


// Daten in die PDF eintragen
foreach ($positions as $key => $pos) {
    if ($key === 'efh' || $key === 'zentralheizung') {
        if ($data[$key]) {
            drawFilledRectangle($pdf, $pos[0], $pos[1], $pos[2], $pos[3]);
        }
    } else {
        $pdf->SetXY($pos[0], $pos[1]);
        $pdf->Cell($pos[2], $pos[3], $data[$key], 0, 0, 'L');
    }
}

// PDF speichern
$pdf_path = __DIR__ . '/Heizungsplakette_ausgefuellt_' . time() . '.pdf';
$pdf->Output($pdf_path, 'F');

echo "PDF erfolgreich generiert: $pdf_path\n";

// Debug-Informationen
echo "Debug-Informationen:\n";
echo "Verwendete Daten:\n";
print_r($data);
echo "\nPDF-Pfad: $pdf_path\n";
echo "PDF existiert: " . (file_exists($pdf_path) ? "Ja" : "Nein") . "\n";
?>