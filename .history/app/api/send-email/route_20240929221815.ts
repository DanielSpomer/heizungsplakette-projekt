import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { promises as fs } from 'fs'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`)
}

export async function POST(request: Request) {
  log('API route called')
  try {
    const formData = await request.json()
    log('Received form data: ' + JSON.stringify(formData))

    // Generieren der PDF
    const phpScript = path.join(process.cwd(), 'php', 'generate_pdf.php')
    log('PHP script path: ' + phpScript)
    
    try {
      await fs.access(phpScript)
      log('PHP script exists')
    } catch (error) {
      log('PHP script does not exist: ' + error)
      throw new Error('PHP script not found')
    }

    const escapedJson = JSON.stringify(formData).replace(/'/g, "'\\''")

    log('Executing PHP script...')
    const { stdout, stderr } = await execPromise(`php "${phpScript}" '${escapedJson}'`)
    log('PHP Output: ' + stdout)
    
    // Check if the PDF was generated successfully
    if (!stdout.includes('PDF erfolgreich generiert')) {
      log('PHP Error: PDF generation failed')
      throw new Error('PDF generation failed')
    }

    // Continue with email sending process
    const pdfPath = path.join(process.cwd(), 'php', 'Heizungsplakette_Ausgefuellt.pdf')
    log('PDF path: ' + pdfPath)

    try {
      await fs.access(pdfPath)
      log('PDF file exists')
    } catch (error) {
      log('PDF file does not exist: ' + error)
      throw new Error('PDF file not found')
    }

    log('Creating email transporter...')
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'heizungsplakette@gmail.com',
        pass: 'ockz xybo zspf eddo'
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
    log('Summary file created: ' + summaryPath)

    log('Preparing email options...')
    const mailOptions = {
      from: 'heizungsplakette@gmail.com',
      to: formData.email,
      subject: 'Ihre Heizungsplakette Anfrage',
      text: `
      Sehr geehrte(r) ${formData.vorname} ${formData.nachname},

      vielen Dank, dass Sie sich für den Erwerb der Heizungsplakette entschieden haben. 
      Im Anhang finden Sie eine Zusammenfassung Ihrer Angaben sowie die generierte Heizungsplakette als PDF.
      
      Sollten Sie Fragen haben oder weitere Informationen benötigen, stehen wir Ihnen gerne zur Verfügung. Sie können uns jederzeit unter heizungsplakette@gmail.com erreichen.
      
      Bei Fragen können Sie sich gerne bei uns melden unter der heizungsplakette@gmail.com.
      
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

    log('Attempting to send email...')
    try {
      await transporter.sendMail(mailOptions)
      log('Email sent successfully')
    } catch (error) {
      log('Error sending email: ' + error)
      throw new Error('Failed to send email')
    }

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error: unknown) {
    log('Error in API route: ' + error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: 'Failed to process request', details: 'An unknown error occurred' }, { status: 500 })
    }
  }
}