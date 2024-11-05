import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { promises as fs } from 'fs'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export async function POST(request: Request) {
  const formData = await request.json()

  // Generieren der PDF
  try {
    const { stdout, stderr } = await execPromise(`php php/generate_pdf.php '${JSON.stringify(formData)}'`)
    console.log('PHP Output:', stdout)
    if (stderr) {
      console.error('PHP Error:', stderr)
    }
  } catch (error) {
    console.error('Error executing PHP script:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }

  // Finden der generierten PDF-Datei
  const phpDir = path.join(process.cwd(), 'php')
  const files = await fs.readdir(phpDir)
  const pdfFile = files.find(file => file.startsWith('Heizungsplakette_') && file.endsWith('.pdf'))

  if (!pdfFile) {
    return NextResponse.json({ error: 'Generated PDF not found' }, { status: 500 })
  }

  const pdfPath = path.join(phpDir, pdfFile)

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

  try {
    await transporter.sendMail(mailOptions)
    await fs.unlink(pdfPath) // Löschen der temporären PDF-Datei
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}