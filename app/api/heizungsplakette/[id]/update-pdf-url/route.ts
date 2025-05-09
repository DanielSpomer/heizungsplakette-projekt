import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client'; // Import Prisma for error types

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { pdfUrl } = await request.json();

    if (!id || typeof pdfUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid request data: id and pdfUrl (string) are required.' }, { status: 400 });
    }

    // Validate if the ID looks like a CUID if that's your default
    // For example: if (!/^[a-z0-9]{25}$/.test(id)) { 
    //   return NextResponse.json({ error: 'Invalid ID format.' }, { status: 400 });
    // }

    const updatedPlakette = await prisma.heizungsplakette.update({
      where: { id: id }, // Prisma CUIDs are strings
      data: { pdfUrl: pdfUrl },
    });

    return NextResponse.json(updatedPlakette);
  } catch (e: unknown) { // Explicitly type e as unknown
    console.error('Error updating pdfUrl:', e);
    let errorMessage = 'Failed to update PDF URL';
    let statusCode = 500;

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Prisma error: ${e.message}`;
      if (e.code === 'P2025') { // Record to update not found
        errorMessage = 'Record not found';
        statusCode = 404;
      }
      // Add other Prisma error codes to handle if needed
    } else if (e instanceof Error) {
        // Standard JavaScript error
        errorMessage = e.message;
    }
    // For other types of e, the generic message is used

    return NextResponse.json({ error: errorMessage, details: e instanceof Error ? e.toString() : String(e) }, { status: statusCode });
  }
} 