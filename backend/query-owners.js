const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const owners = await prisma.owner.findMany();
  for (const o of owners) {
    console.log(`Email: ${o.email}, Categories:`, JSON.stringify(o.categories));
  }
}

check().then(() => process.exit(0)).catch(e => console.error(e));
