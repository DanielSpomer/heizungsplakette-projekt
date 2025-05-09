import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(`[API TEST UPDATE PUT] Received request for ID: ${params.id}, Method: ${request.method}`);
  try {
    const { id } = params;
    let pdfUrl;

    try {
      const body = await request.json();
      pdfUrl = body.pdfUrl;
      console.log(`[API TEST UPDATE PUT] Parsed body, pdfUrl: ${pdfUrl}`);
    } catch (parseError: unknown) {
      console.error('[API TEST UPDATE PUT] Error parsing request body:', parseError);
      // Check if it's a SyntaxError which might mean empty or malformed JSON
      if (parseError instanceof SyntaxError) {
           return NextResponse.json({ error: 'Ungültiger JSON-Body oder leerer Body' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Fehler beim Parsen der Anfrage', details: (parseError instanceof Error) ? parseError.message : String(parseError) }, { status: 400 });
    }

    if (!id) {
      console.log('[API TEST UPDATE PUT] ID is missing');
      return NextResponse.json({ error: 'ID ist erforderlich' }, { status: 400 });
    }

    if (typeof pdfUrl !== 'string') {
      console.log(`[API TEST UPDATE PUT] pdfUrl is not a string: ${pdfUrl}`);
      return NextResponse.json({ error: 'pdfUrl muss ein String sein und im Body vorhanden sein' }, { status: 400 });
    }

    console.log(`[API TEST UPDATE PUT] Attempting to update plakette ID: ${id} with pdfUrl: ${pdfUrl}`);
    const updatedPlakette = await prisma.heizungsplakette.update({
      where: { id: id },
      data: {
        pdfUrl: pdfUrl,
        updatedAt: new Date(),
      },
    });
    console.log(`[API TEST UPDATE PUT] Successfully updated plakette ID: ${id}`);
    return NextResponse.json(updatedPlakette);
  } catch (error: unknown) {
    console.error('[API TEST UPDATE PUT] Error during PDF URL update:', error);
    let errorMessage = 'Fehler beim Aktualisieren der PDF-URL';
    let statusCode = 500;

    if (typeof error === 'object' && error !== null && 'code' in error) {
      if ((error as { code: string }).code === 'P2025') {
        errorMessage = 'Eintrag nicht gefunden';
        statusCode = 404;
        console.log(`[API TEST UPDATE PUT] Prisma Error P2025: Record not found for ID: ${params.id}`);
      }
    }
    
    if (error instanceof Error) {
      return NextResponse.json({ error: errorMessage, details: error.message }, { status: statusCode });
    } 
    return NextResponse.json({ error: errorMessage, details: String(error) }, { status: statusCode });
  }
} 