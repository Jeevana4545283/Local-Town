const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const email = 'jeevanasapavath@gmail.com';
  const owner = await prisma.owner.findUnique({ where: { email } });
  if (owner) {
    console.log('ID:', owner.id);
    console.log('Categories Type:', typeof owner.categories);
    console.log('Categories IsArray:', Array.isArray(owner.categories));
    console.log('Categories JSON:', JSON.stringify(owner.categories));
    console.log('Raw:', owner.categories);
  } else {
    console.log('Owner not found');
  }
}

check().then(() => process.exit(0)).catch(e => console.error(e));
