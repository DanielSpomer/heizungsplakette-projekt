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
    to: 'jaxnaid@gmail.com', // You can change this to the desired recipient
    subject: 'Neue Heizungsplakette Anfrage',
    text: `
      Neue Heizungsplakette Anfrage:

      Heizungsart: ${formData.heizungsart}
      ${formData.heizungsart === 'Sonstige' ? `Sonstige Heizungsart: ${formData.heizungsartSonstige}` : ''}

      Adresse:
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

      Angaben gemacht von:
      Vorname: ${formData.vorname}
      Nachname: ${formData.nachname}
      E-Mail: ${formData.email}

      Ist Eigentümer: ${formData.istEigentuemer}
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