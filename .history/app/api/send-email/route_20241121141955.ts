import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Counter for the running number
let runningNumber = 1;

export async function POST(req: Request) {
  const formData = await req.json();

  const transporter = nodemailer.createTransport({
    host: "smtps.udag.de",
    port: 465,
    secure: true,
    auth: {
      user: "service@heizungsplakette.de",
      pass: "!BesterHelpdesk2024!!"
    }
  });

  const currentYear = new Date().getFullYear().toString().slice(-1);
  const lastName = formData.nachname.slice(0, 3).toUpperCase();
  const processingNumber = `${lastName}-${currentYear}-${runningNumber.toString().padStart(3, '0')}`;
  runningNumber++;

  const userEmailHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #0066cc; }
        </style>
      </head>
      <body>
        <h1>Vielen Dank für Ihren Erwerb der Heizungsplakette</h1>
        <p>Sehr geehrte(r) ${formData.vorname} ${formData.nachname},</p>
        <p>vielen Dank, dass Sie sich für den Erwerb einer Heizungsplakette entschieden haben. Wir möchten Sie darüber informieren, dass Ihre Anfrage bei uns eingegangen ist und sich derzeit in Bearbeitung befindet.</p>
        <p>Die nächsten Schritte sind:</p>
        <ol>
          <li>Wir prüfen Ihre eingereichten Daten</li>
          <li>Wir erstellen Ihre individuelle Heizungsplakette</li>
          <li>Wir senden Ihnen die Heizungsplakette per Mail zu</li>
        </ol>
        ${formData.datenschutzUndNutzungsbedingungen ? '<p>Sie haben den Datenschutzhinweisen, der Widerrufsbelehrung und den Nutzungsbedingungen zugestimmt.</p>' : ''}
        ${formData.einwilligungDatenverarbeitung ? '<p>Sie erklärten sich mit der Verarbeitung Ihrer personenbezogenen Daten zum Zweck der Übermittlung weiterer Informationen rund um die Heizungsplakette, das GEG sowie weiterer fachlicher und/oder technischer Informationen und der Kontaktaufnahme per Telefon und/oder E-Mail einverstanden und können diese Einwilligungserklärung gegenüber der heizungsplakette.de GmbH jederzeit widerrufen.</p>' : ''}
        ${formData.aufforderungSofortigeTaetigkeit ? '<p>Sie verlangen ausdrücklich, dass Sie mit Ihrer Leistung vor Ablauf der Widerrufsfrist beginnen. Ihnen ist bekannt, dass ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch Sie erlischt (§ 356 Abs. 4 BGB). Ihnen ist ebenfalls bekannt, dass ich Wertersatz für die bis zum Widerruf erbrachten Leistungen gem. § 357 a Abs. 2 BGB schulde, wenn Sie den Vertrag fristgemäß widerrufen.</p>' : ''}
        <p>Sollten Sie zwischenzeitlich Fragen haben, können Sie sich jederzeit an uns unter <a href="mailto:service@heizungsplakette.de">service@heizungsplakette.de</a> wenden.</p>
        <p>Wir bedanken uns für Ihr Vertrauen und wünschen Ihnen einen schönen Tag!</p>
        <p>Mit freundlichen Grüßen,<br>Ihr Team von Heizungsplakette.de</p>
      </body>
    </html>
  `;

  const serviceEmailHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #0066cc; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Neue Heizungsplakette Anfrage</h1>
        <table>
          <tr><th>Feld</th><th>Wert</th></tr>
          ${Object.entries(formData).map(([key, value]) => `
            <tr>
              <td>${key}</td>
              <td>${Array.isArray(value) ? value.join(', ') : value}</td>
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `;

  const datenschutzhinweisPath = path.join(process.cwd(), 'public', 'Datenschutzhinweis.pdf');
  const nutzungsbedingungenPath = path.join(process.cwd(), 'public', 'Nutzungsbedingungen.pdf');

  try {
    // E-Mail an den Benutzer
    await transporter.sendMail({
      from: '"Heizungsplakette Service" <service@heizungsplakette.de>',
      to: formData.email,
      subject: `Ihre Heizungsplakette Anfrage - ${processingNumber}`,
      text: `Vielen Dank für Ihren Erwerb der Heizungsplakette, ${formData.vorname} ${formData.nachname}. Ihre Anfrage befindet sich in Bearbeitung. Bei Fragen wenden Sie sich bitte an service@heizungsplakette.de.`,
      html: userEmailHtml,
      attachments: [
        {
          filename: 'Datenschutzhinweis.pdf',
          content: fs.createReadStream(datenschutzhinweisPath)
        },
        {
          filename: 'Nutzungsbedingungen.pdf',
          content: fs.createReadStream(nutzungsbedingungenPath)
        }
      ]
    });

    // E-Mail an den Service
    await transporter.sendMail({
      from: '"Heizungsplakette Service" <service@heizungsplakette.de>',
      to: "service@heizungsplakette.de",
      subject: `Neue Heizungsplakette Anfrage - ${processingNumber}`,
      text: JSON.stringify(formData, null, 2),
      html: serviceEmailHtml
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Senden der E-Mails:", error);
    return NextResponse.json({ success: false, error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 });
  }
}