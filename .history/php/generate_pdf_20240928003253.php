<?php
require_once('tcpdf/tcpdf.php');

class MYPDF extends TCPDF {
    public function Header() {
        $img_file = 'path/to/your/background_image.jpg';
        $this->Image($img_file, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
    }
}

// Funktion zum Zeichnen eines ausgefüllten Rechtecks
function drawFilledRectangle($pdf, $x, $y, $w, $h) {
    $pdf->SetFillColor(0, 0, 0);
    $pdf->Rect($x, $y, $w, $h, 'F');
}

// Erstellen eines neuen PDF-Dokuments
$pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// Seiteneinstellungen
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Your Name');
$pdf->SetTitle('Heizungsplakette');
$pdf->SetMargins(0, 0, 0);
$pdf->SetAutoPageBreak(FALSE, 0);

// Neue Seite hinzufügen
$pdf->AddPage();

// Schriftart setzen
$pdf->SetFont('helvetica', '', 10);

// Daten aus der tsx-Datei (simuliert durch $_POST)
$data = [
    'heizungsart' => $_POST['heizungsart'],
    'hersteller' => $_POST['hersteller'],
    'baujahr' => $_POST['baujahr'],
    'heiztechnik' => $_POST['heizsystem'],
    'efh' => $_POST['energieausweis'] === 'Ja',
    'energietraeger' => $_POST['energietraeger'],
    'zentralheizung' => true, // Annahme basierend auf der tsx-Datei
    'angaben_von' => $_POST['vorname'] . ' ' . $_POST['nachname'],
    'energieausweis_datum' => $_POST['energieausweisDate'],
    'weiterbetrieb_bis' => '31.12.2044', // Fester Wert basierend auf dem Bild
];

// Positionen und Größen für die Felder (angepasst an das Raster)
$positions = [
    'heizungsart' => [50, 105, 110, 7],
    'hersteller' => [20, 165, 80, 7],
    'baujahr' => [120, 165, 70, 7],
    'heiztechnik' => [20, 175, 80, 7],
    'efh' => [145, 175, 5, 5],
    'energietraeger' => [20, 185, 80, 7],
    'zentralheizung' => [145, 185, 5, 5],
    'angaben_von' => [20, 195, 80, 7],
    'energieausweis_datum' => [120, 195, 70, 7],
    'weiterbetrieb_bis' => [70, 205, 70, 7],
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
$pdf->Output('Heizungsplakette.pdf', 'F');

echo "PDF erfolgreich generiert!";
?>