import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
        <p>Sollten Sie zwischenzeitlich Fragen haben, können Sie sich jederzeit an uns unter <a href="mailto:service@heizungsplakette.de">service@heizungsplakette.de</a> wenden.</p>
        <p>Wir bedanken uns für Ihr Vertrauen und wünschen Ihnen einen schönen Tag!</p>
        <p>Mit freundlichen Grüßen,<br>Ihr Team von Heizungsplakette.de</p>
      </body>
    </html>
  `;

  try {
    // E-Mail an den Benutzer
    await transporter.sendMail({
      from: '"Heizungsplakette Service" <service@heizungsplakette.de>',
      to: formData.email,
      subject: "Ihre Heizungsplakette Anfrage",
      text: `Vielen Dank für Ihren Erwerb der Heizungsplakette, ${formData.vorname} ${formData.nachname}. Ihre Anfrage befindet sich in Bearbeitung. Bei Fragen wenden Sie sich bitte an service@heizungsplakette.de.`,
      html: userEmailHtml
    });

    // E-Mail an den Service
    await transporter.sendMail({
      from: '"Heizungsplakette Service" <service@heizungsplakette.de>',
      to: "service@heizungsplakette.de",
      subject: "Neue Heizungsplakette Anfrage",
      text: JSON.stringify(formData, null, 2),
      html: serviceEmailHtml
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Senden der E-Mails:", error);
    return NextResponse.json({ success: false, error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 });
  }
}