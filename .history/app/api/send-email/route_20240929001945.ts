import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { promises as fs } from 'fs'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export async function POST(request: Request) {
  console.log('API route called')
  try {
    const formData = await request.json()
    console.log('Received form data:', formData)

    // Generieren der PDF
    const phpScript = path.join(process.cwd(), 'php', 'generate_pdf.php')
    console.log('PHP script path:', phpScript)
    
    // Überprüfen Sie, ob das PHP-Skript existiert
    try {
      await fs.access(phpScript)
      console.log('PHP script exists')
    } catch (error) {
      console.error('PHP script does not exist:', error)
      throw new Error('PHP script not found')
    }

    // Escape special characters in JSON string
    const escapedJson = JSON.stringify(formData).replace(/'/g, "'\\''")

    console.log('Executing PHP script...')
    const { stdout, stderr } = await execPromise(`php "${phpScript}" '${escapedJson}'`)
    console.log('PHP Output:', stdout)
    if (stderr) {
      console.error('PHP Error:', stderr)
      throw new Error('PHP script execution failed')
    }

    // Pfad zur generierten PDF-Datei
    const pdfPath = path.join(process.cwd(), 'php', 'Heizungsplakette_Ausgefuellt.pdf')
    console.log('PDF path:', pdfPath)

    // Überprüfen Sie, ob die PDF-Datei existiert
    try {
      await fs.access(pdfPath)
      console.log('PDF file exists')
    } catch (error) {
      console.error('PDF file does not exist:', error)
      throw new Error('PDF file not found')
    }

    console.log('Creating email transporter...')
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'jaxnaid@gmail.com',
        pass: 'hqwy bhrh jzdi nmiz'
      }
    })

    // Erstellen der Zusammenfassung als separate Datei
    const summaryPath = path.join(process.cwd(), 'php', 'Zusammenfassung.txt')
    const summaryContent = `
Zusammenfassung Ihrer Heizungsplakette Anfrage:

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
    `
    await fs.writeFile(summaryPath, summaryContent)

    console.log('Preparing email options...')
    const mailOptions = {
      from: 'jaxnaid@gmail.com',
      to: formData.email,
      subject: 'Ihre Heizungsplakette Anfrage',
      text: `
        Sehr geehrte(r) ${formData.vorname} ${formData.nachname},

        vielen Dank für Ihre Heizungsplakette Anfrage. Im Anhang finden Sie eine Zusammenfassung Ihrer Angaben sowie die generierte Heizungsplakette als PDF.

        Wir werden Ihre Anfrage so schnell wie möglich bearbeiten. Sollten wir weitere Informationen benötigen, werden wir uns mit Ihnen in Verbindung setzen.

        Mit freundlichen Grüßen,
        Ihr Heizungsplakette-Team
      `,
      attachments: [
        {
          filename: 'Heizungsplakette.pdf',
          path: pdfPath
        },
        {
          filename: 'Zusammenfassung.txt',
          path: summaryPath
        }
      ]
    }

    console.log('Attempting to send email...')
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully')

    // Löschen der temporären Zusammenfassungsdatei
    await fs.unlink(summaryPath)

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error in API route:', error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: 'Failed to process request', details: 'An unknown error occurred' }, { status: 500 })
    }
  }
}