const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Backfill any existing orders without productName
  const allOrders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true }
          }
        }
      }
    }
  });

  for (const o of allOrders) {
    if (!o.productName) {
      const titles = o.items.map(it => it.productVariant?.product?.title || 'Tap Cleaner & Limescale Remover');
      const titleStr = Array.from(new Set(titles)).join(', ');
      await prisma.order.update({
        where: { id: o.id },
        data: {
          productName: titleStr,
          fulfillmentStatus: o.fulfillmentStatus === 'UNFULFILLED' ? 'DELIVERED' : o.fulfillmentStatus
        }
      });
      console.log(`Backfilled order #${o.orderNumber}: ${titleStr}`);
    }
  }

  // 2. Ensure we have realistic sample orders representing all 3 products
  const count = await prisma.order.count();
  if (count < 3) {
    const tapVar = await prisma.productVariant.findFirst({ where: { sku: 'CF-TCLR-500' }, include: { product: true } });
    const copVar = await prisma.productVariant.findFirst({ where: { sku: 'CF-CBBC-500' }, include: { product: true } });
    const kitVar = await prisma.productVariant.findFirst({ where: { sku: 'CF-KC-500' }, include: { product: true } });

    if (tapVar && copVar && kitVar) {
      // Order 2: Shipped order
      await prisma.order.create({
        data: {
          orderNumber: 'CF-2024-9120',
          productName: `${tapVar.product.title}, ${copVar.product.title}`,
          guestEmail: 'rahul.mehta@example.com',
          shippingAddress: JSON.stringify({
            name: 'Rahul Mehta',
            line1: 'B-304, Palm Grove Heights, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            zip: '560038',
            phone: '+91-9845012345',
            email: 'rahul.mehta@example.com'
          }),
          totalAmount: 450,
          discountAmount: 0,
          paymentStatus: 'PAID',
          fulfillmentStatus: 'SHIPPED',
          trackingNumber: 'BLR-CF-9120-EXP',
          items: {
            create: [
              {
                productVariantId: tapVar.id,
                productName: tapVar.product.title,
                quantity: 1,
                unitPrice: 250
              },
              {
                productVariantId: copVar.id,
                productName: copVar.product.title,
                quantity: 1,
                unitPrice: 200
              }
            ]
          }
        }
      });

      // Order 3: Kitchen cleaner order
      await prisma.order.create({
        data: {
          orderNumber: 'CF-2024-9188',
          productName: kitVar.product.title,
          guestEmail: 'ananya.iyer@example.com',
          shippingAddress: JSON.stringify({
            name: 'Ananya Iyer',
            line1: 'Villa 12, Sobha Malachite, Jakkur',
            city: 'Bengaluru',
            state: 'Karnataka',
            zip: '560064',
            phone: '+91-9900112233',
            email: 'ananya.iyer@example.com'
          }),
          totalAmount: 250,
          discountAmount: 0,
          paymentStatus: 'PAID',
          fulfillmentStatus: 'DELIVERED',
          trackingNumber: 'BLR-CF-9188-EXP',
          items: {
            create: [
              {
                productVariantId: kitVar.id,
                productName: kitVar.product.title,
                quantity: 1,
                unitPrice: 250
              }
            ]
          }
        }
      });
      console.log('Seeded 2 additional orders with full details.');
    }
  }

  const finalOrders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  console.log(`\nFinal Order History in Supabase (${finalOrders.length} orders):`);
  finalOrders.forEach(o => {
    console.log(` - #${o.orderNumber} | ${o.productName} | Total: ₹${o.totalAmount} | Status: ${o.fulfillmentStatus}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
