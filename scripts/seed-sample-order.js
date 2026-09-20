const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.order.findFirst();
  if (existing) {
    console.log('Order already exists:', existing.orderNumber);
    return;
  }

  const tapVariant = await prisma.productVariant.findFirst({
    where: { sku: 'CF-TCLR-500' },
    include: { product: true }
  });

  const copperVariant = await prisma.productVariant.findFirst({
    where: { sku: 'CF-CBBC-500' },
    include: { product: true }
  });

  if (!tapVariant || !copperVariant) {
    console.log('Variants not found');
    return;
  }

  const orderNumber = 'CF-2024-8842';
  const trackingNumber = 'BLR-CF-8842-EXP';

  const order = await prisma.order.create({
    data: {
      orderNumber,
      productName: `${tapVariant.product.title}, ${copperVariant.product.title}`,
      shippingAddress: JSON.stringify({
        name: 'Priya Sharma',
        line1: 'Flat 402, Green Glen Layout, Bellandur',
        line2: 'Near Central Mall',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560103',
        phone: '+91-9876543210',
        email: 'priya.sharma@example.com'
      }),
      guestEmail: 'priya.sharma@example.com',
      totalAmount: 450,
      discountAmount: 0,
      paymentStatus: 'PAID',
      fulfillmentStatus: 'SHIPPED',
      trackingNumber,
      items: {
        create: [
          {
            productVariantId: tapVariant.id,
            productName: tapVariant.product.title,
            quantity: 1,
            unitPrice: 250,
          },
          {
            productVariantId: copperVariant.id,
            productName: copperVariant.product.title,
            quantity: 1,
            unitPrice: 200,
          }
        ]
      }
    }
  });

  console.log('Created sample tracked order in Supabase:', order.orderNumber);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
