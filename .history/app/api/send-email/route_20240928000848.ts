import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { promises as fs } from 'fs'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'
import { error } from 'console'

const execPromise = util.promisify(exec)

export async function POST(request: Request) {
  console.log('API route called')
  try {
    const formData = await request.json()
    console.log('Received form data:', formData)

    // Generieren der PDF
    const phpScript = path.join(process.cwd(), 'php', 'generate_pdf.php')
    console.log('PHP script path:', phpScript)
    
    const { stdout, stderr } = await execPromise(`php "${phpScript}" '${JSON.stringify(formData)}'`)
    console.log('PHP Output:', stdout)
    if (stderr) {
      console.error('PHP Error:', stderr)
      throw new Error('PHP script execution failed')
    }

    // Finden der generierten PDF-Datei
    const phpDir = path.join(process.cwd(), 'php')
    const files = await fs.readdir(phpDir)
    console.log('Files in PHP directory:', files)
    
    const pdfFile = files.find(file => file.startsWith('Heizungsplakette_') && file.endsWith('.pdf'))

    if (!pdfFile) {
      throw new Error('Generated PDF not found')
    }

    const pdfPath = path.join(phpDir, pdfFile)
    console.log('PDF path:', pdfPath)

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
      to: formData.email,
      subject: 'Ihre Heizungsplakette Anfrage',
      text: `
        Sehr geehrte(r) ${formData.vorname} ${formData.nachname},

        vielen Dank für Ihre Heizungsplakette Anfrage. Im Anhang finden Sie Ihre generierte Heizungsplakette.

        Mit freundlichen Grüßen,
        Ihr Heizungsplakette-Team
      `,
      attachments: [
        {
          filename: 'Heizungsplakette.pdf',
          path: pdfPath
        }
      ]
    }

    console.log('Sending email...')
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully')

    await fs.unlink(pdfPath) // Löschen der temporären PDF-Datei
    console.log('Temporary PDF file deleted')

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 })
  }
}