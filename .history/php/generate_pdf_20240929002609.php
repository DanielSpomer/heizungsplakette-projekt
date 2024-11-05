<?php
require_once(__DIR__ . '/vendor/autoload.php');

use setasign\Fpdi\Tcpdf\Fpdi;

// Aktivieren Sie die Fehlerberichterstattung
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Funktion zum Protokollieren von Nachrichten
function log_message($message) {
    file_put_contents(__DIR__ . '/pdf_generation.log', date('[Y-m-d H:i:s] ') . $message . PHP_EOL, FILE_APPEND);
}

log_message("Skript gestartet");

// Funktion zum Zeichnen eines ausgefüllten Rechtecks
function drawFilledRectangle($pdf, $x, $y, $w, $h) {
    $pdf->SetFillColor(0, 0, 0);
    $pdf->Rect($x, $y, $w, $h, 'F');
}

// Empfangen der JSON-Daten aus der Eingabemaske
$input = file_get_contents('php://input');
if ($input === false) {
    log_message("Fehler beim Lesen der Eingabedaten");
    die("Fehler beim Lesen der Eingabedaten");
}

log_message("Empfangene Daten: " . $input);

$formData = json_decode($input, true);

// Überprüfen, ob die Daten korrekt empfangen wurden
if ($formData === null && json_last_error() !== JSON_ERROR_NONE) {
    log_message("Fehler beim Dekodieren der JSON-Daten: " . json_last_error_msg());
    die('Fehler beim Empfangen der Formulardaten: ' . json_last_error_msg());
}

log_message("Formulardaten erfolgreich dekodiert");

try {
    // Erstellen eines neuen PDF-Dokuments
    $pdf = new Fpdi();

    // Vorhandenes PDF importieren
    $templatePath = __DIR__ . '/HeizungsplaketteFinal_grid.pdf';
    if (!file_exists($templatePath)) {
        log_message("Vorlagendatei nicht gefunden: " . $templatePath);
        die("Vorlagendatei nicht gefunden");
    }

    $pdf->setSourceFile($templatePath);
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

    log_message("Verarbeitete Daten: " . print_r($data, true));

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
    $pdf_path = __DIR__ . '/Heizungsplakette_Ausgefuellt.pdf';
    $pdf->Output($pdf_path, 'F');

    log_message("PDF erfolgreich generiert: $pdf_path");
    echo "PDF erfolgreich generiert: $pdf_path\n";

    // Debug-Informationen
    log_message("Debug-Informationen:");
    log_message("Verwendete Daten: " . print_r($data, true));
    log_message("PDF-Pfad: $pdf_path");
    log_message("PDF existiert: " . (file_exists($pdf_path) ? "Ja" : "Nein"));

} catch (Exception $e) {
    log_message("Fehler bei der PDF-Generierung: " . $e->getMessage());
    die("Fehler bei der PDF-Generierung: " . $e->getMessage());
}
?>