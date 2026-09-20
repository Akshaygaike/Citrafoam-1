const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const akshay = await prisma.user.findUnique({ where: { email: 'akshaygaike2090@gmail.com' } });
  const matches = await bcrypt.compare('Akshaygaike2090', akshay.passwordHash);
  console.log('Password Akshaygaike2090 matches:', matches);
  if (!matches) {
    const hash = await bcrypt.hash('Akshaygaike2090', 10);
    await prisma.user.update({
      where: { email: 'akshaygaike2090@gmail.com' },
      data: { passwordHash: hash }
    });
    console.log('Updated password hash for Akshaygaike2090@gmail.com to Akshaygaike2090');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
