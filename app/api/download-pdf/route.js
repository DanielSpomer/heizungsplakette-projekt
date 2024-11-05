import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'php', 'Heizungsplakette_Ausgefuellt.pdf')
  
  try {
    const fileBuffer = await fs.readFile(filePath)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': 'attachment; filename=Heizungsplakette_Ausgefuellt.pdf',
        'Content-Type': 'application/pdf',
      },
    })
  } catch (error) {
    console.error('Fehler beim Lesen der PDF-Datei:', error)
    return new NextResponse('Fehler beim Herunterladen der PDF', { status: 500 })
  }
}