<?php
require_once(__DIR__ . '/vendor/autoload.php');

use setasign\Fpdi\Tcpdf\Fpdi;

// Funktion zum Zeichnen eines ausgefüllten Rechtecks
function drawFilledRectangle($pdf, $x, $y, $w, $h) {
    $pdf->SetFillColor(0, 0, 0);
    $pdf->Rect($x, $y, $w, $h, 'F');
}

// Empfangen der JSON-Daten aus der Eingabemaske oder Kommandozeilenargumenten
$input = isset($argv[1]) ? $argv[1] : file_get_contents('php://input');
$formData = json_decode($input, true);

// Überprüfen, ob die Daten korrekt empfangen wurden
if ($formData === null && json_last_error() !== JSON_ERROR_NONE) {
    error_log('Fehler beim Empfangen der Formulardaten: ' . json_last_error_msg());
    die('Fehler beim Empfangen der Formulardaten: ' . json_last_error_msg());
}

// Debug: Ausgabe der empfangenen Daten
error_log("Empfangene Formulardaten: " . print_r($formData, true));

// Erstellen eines neuen PDF-Dokuments
$pdf = new Fpdi();

// Vorhandenes PDF importieren
$pdf->setSourceFile(__DIR__ . '/HeizungsplaketteFinal.pdf');
$tplIdx = $pdf->importPage(1);

// Neue Seite hinzufügen
$pdf->AddPage();
$pdf->useTemplate($tplIdx);

// Schriftart setzen
$pdf->SetFont('helvetica', '', 10);

// Daten aus dem Formular
$data = [
    'heizungsart' => $formData['heizungsart'] ?? '',
    'hersteller' => $formData['hersteller'] ?? '',
    'baujahr' => $formData['baujahr'] ?? '',
    'heiztechnik' => $formData['heizsystem'] ?? '',
    'efh' => ($formData['energieausweis'] ?? '') === 'Ja',
    'energietraeger' => $formData['energietraeger'] ?? '',
    'zentralheizung' => true, // Annahme basierend auf der tsx-Datei, anpassen falls nötig
    'angaben_von' => ($formData['vorname'] ?? '') . ' ' . ($formData['nachname'] ?? ''),
    'energieausweis_datum' => $formData['energieausweisDate'] ?? '',
    'weiterbetrieb_bis' => '31.12.2044', // Fester Wert, anpassen falls nötig
];

// Positionen und Größen für die Felder (angepasst an das Raster)
$positions = [
    'heizungsart' => [100, 105, 110, 7],
    'hersteller' => [50, 165, 80, 7],
    'baujahr' => [120, 180, 70, 7],
    'heiztechnik' => [50, 175, 80, 7],
    'efh' => [145, 175, 5, 5],
    'energietraeger' => [160, 180, 80, 7],
    'zentralheizung' => [160, 180, 5, 5],
    'angaben_von' => [50, 195, 80, 7],
    'energieausweis_datum' => [120, 195, 70, 7],
    'weiterbetrieb_bis' => [100, 205, 70, 7],
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

// PDF speichern mit festem Namen
$pdf_path = __DIR__ . '/Heizungsplakette_Ausgefuellt.pdf';
$pdf->Output($pdf_path, 'F');

echo "PDF erfolgreich generiert: $pdf_path\n";

// Debug-Informationen
error_log("Debug-Informationen:");
error_log("Verwendete Daten: " . print_r($data, true));
error_log("PDF-Pfad: $pdf_path");
error_log("PDF existiert: " . (file_exists($pdf_path) ? "Ja" : "Nein"));

// Ausgabe für die Kommandozeile
echo "Debug-Informationen:\n";
echo "Verwendete Daten:\n";
print_r($data);
echo "\nPDF-Pfad: $pdf_path\n";
echo "PDF existiert: " . (file_exists($pdf_path) ? "Ja" : "Nein") . "\n";
?>