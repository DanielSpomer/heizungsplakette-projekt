<?php
require('fpdf/fpdf.php');
require('fpdi/src/autoload.php');
require('PHPMailer/src/PHPMailer.php');
require('PHPMailer/src/SMTP.php');
require('PHPMailer/src/Exception.php');

use setasign\Fpdi\Fpdi;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Formular-Daten sammeln
$heizungsart = utf8_decode($_POST['heizungsart']);
$immobilie = utf8_decode($_POST['immobilie']);
$hersteller = utf8_decode($_POST['hersteller']);
$baujahr = utf8_decode($_POST['baujahr']);
$heiztechnik = utf8_decode($_POST['heiztechnik']);
$energietraeger = utf8_decode($_POST['energietraeger']);
$weiterbetrieb = utf8_decode($_POST['weiterbetrieb']);
$angaben = utf8_decode($_POST['angaben']);

// PDF-Objekt erstellen
$pdf = new FPDI();
$pdf->AddPage();
$pageCount = $pdf->setSourceFile('Heizungsplakette.pdf');
$templateId = $pdf->importPage(1);
$pdf->useTemplate($templateId, 0, 0, 210);

// Benutzerdefinierte Schriftart einbinden
$pdf->AddFont('DejaVu','','DejaVuSans.php');
$pdf->SetFont('DejaVu','',12);

// UTF-8 Text direkt verwenden

// Heizungsart
$pdf->SetXY(90, 96);
$pdf->Write(0, $heizungsart);

// Immobilie
$pdf->SetXY(60, 155);
$pdf->Write(0, $immobilie);

// Hersteller der Heizung
$pdf->SetXY(90, 170);
$pdf->Write(0, $hersteller);

// Baujahr der Heizung
$pdf->SetXY(170, 170);
$pdf->Write(0, $baujahr);

// Heiztechnik
$pdf->SetXY(70, 180);
$pdf->Write(0, $heiztechnik);

// Energieträger
$pdf->SetXY(70, 190);
$pdf->Write(0, $energietraeger);

// Weiterbetrieb möglich bis
$pdf->SetXY(95, 200);
$pdf->Write(0, $weiterbetrieb);

// Angaben gemacht von
$pdf->SetXY(90, 210);
$pdf->Write(0, $angaben);

// PDF speichern
$filename = "Heizungsplakette_$immobilie.pdf";
$pdf->Output('F', $filename);

// E-Mail versenden
$mail = new PHPMailer(true);
try {
    // Server-Einstellungen
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com'; // SMTP-Server deines Providers
    $mail->SMTPAuth = true;
    $mail->Username = 'dein-email@example.com'; // Deine E-Mail-Adresse
    $mail->Password = 'dein-passwort'; // Dein E-Mail-Passwort
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Empfänger
    $mail->setFrom('dein-email@example.com', 'Zertifikat System');
    $mail->addAddress('empfaenger@example.com'); // Empfänger-E-Mail-Adresse

    // Inhalt der E-Mail
    $mail->isHTML(true);
    $mail->Subject = 'Ihre Heizungsplakette';
    $mail->Body = 'Bitte finden Sie Ihre Heizungsplakette im Anhang.';
    $mail->addAttachment($filename);

    $mail->send();
    echo 'Zertifikat erfolgreich versendet.';
} catch (Exception $e) {
    echo "Fehler beim Versand: {$mail->ErrorInfo}";
}

// PDF zum Download anbieten
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $filename . '"');
readfile($filename);

// Temporäre Datei löschen
unlink($filename);
?>
