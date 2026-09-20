const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const akshay = await prisma.user.findUnique({ where: { email: 'akshaygaike2090@gmail.com' } });
  const priya = await prisma.user.findUnique({ where: { email: 'test@citrafoam.com' } });

  console.log('Linking orders...');

  // Link CF-2024-9120 to Akshay
  await prisma.order.update({
    where: { orderNumber: 'CF-2024-9120' },
    data: {
      userId: akshay.id,
      guestEmail: akshay.email,
      shippingAddress: JSON.stringify({
        name: 'Akshay Gaike',
        line1: 'B-304, Palm Grove Heights, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560038',
        phone: '+91-9845012345',
        email: akshay.email
      })
    }
  });

  // Link CF-2024-9188 to Akshay
  await prisma.order.update({
    where: { orderNumber: 'CF-2024-9188' },
    data: {
      userId: akshay.id,
      guestEmail: akshay.email,
      shippingAddress: JSON.stringify({
        name: 'Akshay Gaike',
        line1: 'Villa 12, Sobha Malachite, Jakkur',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560064',
        phone: '+91-9845012345',
        email: akshay.email
      })
    }
  });

  // Link CF-MU9R10PD-XHKD to Priya
  await prisma.order.update({
    where: { orderNumber: 'CF-MU9R10PD-XHKD' },
    data: {
      userId: priya.id,
      guestEmail: priya.email,
      shippingAddress: JSON.stringify({
        name: 'Priya Sharma',
        line1: 'Flat 402, Lotus Grand Residences',
        line2: 'Koramangala 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560034',
        phone: '+91-9876543210',
        email: priya.email
      })
    }
  });

  console.log('Successfully linked orders to respective accounts!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
