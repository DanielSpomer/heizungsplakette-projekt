import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  const timestamp = new Date().toISOString();
  console.log(`[API UPDATE RECORD PDF] PUT request received at ${timestamp}`);

  let recordId: string;
  let newPdfUrl: string;

  try {
    const body = await request.json();
    recordId = body.id;
    newPdfUrl = body.pdfUrl;
    console.log(`[API UPDATE RECORD PDF] Parsed body - ID: ${recordId}, New PDF URL: ${newPdfUrl}`);

    if (typeof recordId !== 'string' || !recordId) {
      console.log('[API UPDATE RECORD PDF] Invalid or missing ID in request body');
      return NextResponse.json({ error: 'ID (String) ist im Body erforderlich' }, { status: 400 });
    }
    if (typeof newPdfUrl !== 'string') {
      console.log('[API UPDATE RECORD PDF] Invalid or missing pdfUrl in request body');
      return NextResponse.json({ error: 'pdfUrl (String) muss im Body vorhanden sein' }, { status: 400 });
    }

  } catch (parseError: unknown) {
    console.error('[API UPDATE RECORD PDF] Error parsing request body:', parseError);
    let message = 'Fehler beim Parsen der Anfrage';
    if (parseError instanceof SyntaxError) {
      message = 'Ungültiger JSON-Body oder leerer Body';
    }
    return NextResponse.json({ error: message, details: (parseError instanceof Error) ? parseError.message : String(parseError) }, { status: 400 });
  }

  try {
    console.log(`[API UPDATE RECORD PDF] Attempting to update record ID: ${recordId} with newPdfUrl: ${newPdfUrl}`);
    const updatedPlakette = await prisma.heizungsplakette.update({
      where: { id: recordId },
      data: {
        pdfUrl: newPdfUrl,
        updatedAt: new Date(),
      },
    });
    console.log(`[API UPDATE RECORD PDF] Successfully updated record ID: ${recordId}`);
    return NextResponse.json(updatedPlakette);
  } catch (error: unknown) {
    console.error('[API UPDATE RECORD PDF] Error during database update:', error);
    let errorMessage = 'Fehler beim Aktualisieren der PDF-URL in der Datenbank';
    let statusCode = 500;

    if (typeof error === 'object' && error !== null && 'code' in error) {
      if ((error as { code: string }).code === 'P2025') {
        errorMessage = 'Eintrag nicht gefunden mit der angegebenen ID';
        statusCode = 404;
        console.log(`[API UPDATE RECORD PDF] Prisma Error P2025: Record not found for ID: ${recordId}`);
      }
    }
    return NextResponse.json({ error: errorMessage, details: (error instanceof Error) ? error.message : String(error) }, { status: statusCode });
  }
} 