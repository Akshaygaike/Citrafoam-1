const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      orders: {
        select: {
          id: true,
          orderNumber: true,
          productName: true,
          totalAmount: true,
          guestEmail: true,
          userId: true
        }
      }
    }
  });

  console.log('Users count:', users.length);
  for (const u of users) {
    console.log(`User: ${u.name} (${u.email}, id: ${u.id}) - Orders: ${u.orders.length}`);
    for (const o of u.orders) {
      console.log(`  -> Order #${o.orderNumber}: ${o.productName} (₹${o.totalAmount})`);
    }
  }

  const allOrders = await prisma.order.findMany({
    select: {
      orderNumber: true,
      guestEmail: true,
      userId: true,
      productName: true
    }
  });
  console.log('\nAll Orders count:', allOrders.length);
  for (const o of allOrders) {
    console.log(`Order #${o.orderNumber}: guestEmail=${o.guestEmail}, userId=${o.userId}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
