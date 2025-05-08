<?php
require_once(__DIR__ . '/tcpdf/tcpdf.php');

// Erstellen eines neuen PDF-Dokuments
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// Setzen von Dokumenteninformationen
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Ihr Name');
$pdf->SetTitle('TCPDF Test');
$pdf->SetSubject('TCPDF Test');
$pdf->SetKeywords('TCPDF, PDF, test');

// Hinzufügen einer Seite
$pdf->AddPage();

// Setzen von Schriftart und Schriftgröße
$pdf->SetFont('helvetica', '', 12);

// Hinzufügen von Text
$pdf->Cell(0, 10, 'Wenn Sie diesen Text sehen können, funktioniert TCPDF korrekt!', 0, 1);

// Ausgabe des PDF
$pdf->Output(__DIR__ . '/tcpdf_test.pdf', 'F');

echo "PDF erfolgreich generiert!";