const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Current users:');
  for (const u of users) {
    console.log(`- ${u.name} | ${u.email} | id: ${u.id} | hasPassword: ${!!u.passwordHash}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
