import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  const formData = await request.json()

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'jaxnaid@gmail.com',
      pass: 'hqwy bhrh jzdi nmiz'
    }
  })

  const mailOptions = {
    from: 'jaxnaid@gmail.com',
    to: formData.email, // Senden an die E-Mail-Adresse aus dem Formular
    subject: 'Ihre Heizungsplakette Anfrage',
    text: `
      Sehr geehrte(r) ${formData.vorname} ${formData.nachname},

      vielen Dank für Ihre Heizungsplakette Anfrage. Hier ist eine Zusammenfassung Ihrer Angaben:

      Heizungsart: ${formData.heizungsart}
      ${formData.heizungsart === 'Sonstige' ? `Sonstige Heizungsart: ${formData.heizungsartSonstige}` : ''}

      Adresse der Immobilie:
      Straße: ${formData.strasse}
      Hausnummer: ${formData.hausnummer}
      Postleitzahl: ${formData.postleitzahl}
      Ort: ${formData.ort}

      Immobilientyp: ${formData.immobilientyp}
      ${formData.immobilientyp === 'Sonstige' ? `Sonstiger Immobilientyp: ${formData.immobilientypSonstige}` : ''}

      Heizsystem: ${formData.heizsystem}
      ${formData.heizsystem === 'Sonstige' ? `Sonstiges Heizsystem: ${formData.heizsystemSonstige}` : ''}

      Hersteller: ${formData.hersteller}
      Baujahr: ${formData.baujahr}

      Typenbezeichnung: ${formData.typenbezeichnung}
      ${formData.typenbezeichnung === 'Bekannt' ? `Typenbezeichnung Text: ${formData.typenbezeichnungText}` : ''}

      Energieträger: ${formData.energietraeger}
      ${formData.energietraeger === 'Sonstige' ? `Sonstiger Energieträger: ${formData.energietraegerSonstige}` : ''}

      Energieausweis vorhanden: ${formData.energieausweis}
      ${formData.energieausweis === 'Ja' ? `Ausstellungsdatum Energieausweis: ${formData.energieausweisDate}` : ''}

      Ist Eigentümer: ${formData.istEigentuemer}

      Wir werden Ihre Anfrage so schnell wie möglich bearbeiten. Sollten wir weitere Informationen benötigen, werden wir uns mit Ihnen in Verbindung setzen.

      Mit freundlichen Grüßen,
      Ihr Heizungsplakette-Team
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}