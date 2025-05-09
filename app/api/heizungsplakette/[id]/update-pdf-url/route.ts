import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  let newPdfUrl;

  console.log(`[API UPDATE PDF_URL] Received PUT request for ID: ${id}`);

  try {
    const body = await request.json();
    newPdfUrl = body.pdfUrl;
    console.log(`[API UPDATE PDF_URL] Parsed body, newPdfUrl: ${newPdfUrl}`);
  } catch (parseError: unknown) {
    console.error('[API UPDATE PDF_URL] Error parsing request body:', parseError);
    let message = 'Fehler beim Parsen der Anfrage';
    if (parseError instanceof SyntaxError) {
      message = 'Ungültiger JSON-Body oder leerer Body';
    }
    return NextResponse.json({ error: message, details: (parseError instanceof Error) ? parseError.message : String(parseError) }, { status: 400 });
  }

  if (!id) {
    console.log('[API UPDATE PDF_URL] ID is missing in path');
    return NextResponse.json({ error: 'ID ist in der URL erforderlich' }, { status: 400 });
  }

  if (typeof newPdfUrl !== 'string') {
    console.log(`[API UPDATE PDF_URL] newPdfUrl is not a string or missing: ${newPdfUrl}`);
    return NextResponse.json({ error: 'pdfUrl (String) muss im Body vorhanden sein' }, { status: 400 });
  }

  try {
    console.log(`[API UPDATE PDF_URL] Attempting to update plakette ID: ${id} with newPdfUrl: ${newPdfUrl}`);
    const updatedPlakette = await prisma.heizungsplakette.update({
      where: { id: id }, // Prisma expects string for CUID for the id field
      data: {
        pdfUrl: newPdfUrl,
        updatedAt: new Date(), // Explicitly update updatedAt timestamp
      },
    });
    console.log(`[API UPDATE PDF_URL] Successfully updated plakette ID: ${id}`);
    return NextResponse.json(updatedPlakette);
  } catch (error: unknown) {
    console.error('[API UPDATE PDF_URL] Error during database update:', error);
    let errorMessage = 'Fehler beim Aktualisieren der PDF-URL in der Datenbank';
    let statusCode = 500;

    // Check for Prisma-specific error for record not found
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if ((error as { code: string }).code === 'P2025') {
        errorMessage = 'Eintrag nicht gefunden';
        statusCode = 404;
        console.log(`[API UPDATE PDF_URL] Prisma Error P2025: Record not found for ID: ${id}`);
      }
    }
    
    return NextResponse.json({ error: errorMessage, details: (error instanceof Error) ? error.message : String(error) }, { status: statusCode });
  }
} 