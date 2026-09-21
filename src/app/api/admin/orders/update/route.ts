import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();

    // Verify authenticated user has ADMIN role
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please sign in' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email || '' },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, fulfillmentStatus, paymentStatus, trackingNumber } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // Build update data
    const updateData: {
      fulfillmentStatus?: string;
      paymentStatus?: string;
      trackingNumber?: string | null;
    } = {};

    if (fulfillmentStatus) updateData.fulfillmentStatus = fulfillmentStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber?.trim() || null;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Order #${updatedOrder.orderNumber} updated successfully`,
      order: updatedOrder,
    });
  } catch (err: any) {
    console.error('Error updating order:', err);
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 });
  }
}
