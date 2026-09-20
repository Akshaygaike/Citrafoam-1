const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`Found ${orders.length} order(s):`);
  orders.forEach((o, i) => {
    console.log(`[${i+1}] #${o.orderNumber} - ${o.productName} - Total: ₹${o.totalAmount} - Status: ${o.fulfillmentStatus} - Email: ${o.guestEmail} - Items: ${o.items.length}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
