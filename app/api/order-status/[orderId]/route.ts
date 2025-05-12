import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest, 
  { params }: { params: { orderId: string } }
) {
  const orderId = params.orderId;

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const order = await prisma.heizungsplakette.findUnique({
      where: { id: orderId },
      select: { // Only select the fields needed
        paymentStatus: true,
        id: true // Good to return the ID for confirmation
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