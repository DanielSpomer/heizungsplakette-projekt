import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { pdfUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID ist erforderlich' }, { status: 400 });
    }

    if (typeof pdfUrl !== 'string') {
      return NextResponse.json({ error: 'pdfUrl muss ein String sein' }, { status: 400 });
    }

    // Validate that the id from the route is a string, as Prisma expects it for cuid()
    // Prisma's default CUID is a string. The frontend might be sending it as a number.
    // The dashboard page.tsx defines HeizungsplaketteItem id as number.
    // The prisma schema defines id as String @id @default(cuid())
    // This needs to be reconciled. For now, assuming the DB uses string IDs
    // and the frontend will provide a string or it needs conversion if it's truly a number.
    // However, the frontend is already calling other /api/heizungsplakette/${id}/* routes
    // Let's assume for now the 'id' from params is the correct string CUID.

    const updatedPlakette = await prisma.heizungsplakette.update({
      where: { id: id }, // Prisma expects string for CUID
      data: {
        pdfUrl: pdfUrl,
        updatedAt: new Date(), // Explicitly update updatedAt
      },
    });

    return NextResponse.json(updatedPlakette);
  } catch (error: any) {
    console.error('Fehler beim Test-Update der PDF-URL:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ error: 'Eintrag nicht gefunden' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Fehler beim Aktualisieren der PDF-URL', details: error.message }, { status: 500 });
  }
} 