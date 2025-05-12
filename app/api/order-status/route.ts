import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required as a query parameter' }, { status: 400 });
  }

  try {
    const order = await prisma.heizungsplakette.findUnique({
      where: { id: orderId },
      select: { 
        paymentStatus: true,
        id: true 
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      orderId: order.id,
      paymentStatus: order.paymentStatus 
    });
  } catch (error) {
    console.error(`Error fetching order status for ${orderId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch order status' }, { status: 500 });
  }
} 