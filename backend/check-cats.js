const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const email = 'jeevanasapavath@gmail.com';
  const owner = await prisma.owner.findUnique({ where: { email } });
  if (owner) {
    console.log('Categories for owner:', owner.categories);
  } else {
    console.log('Owner not found');
  }
}

check().then(() => process.exit(0)).catch(e => console.error(e));
