const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const email = 'jeevanasapavath@gmail.com';
  const owner = await prisma.owner.findUnique({ where: { email } });
  
  if (owner) {
    const offers = await prisma.offer.findMany({ where: { ownerId: owner.id } });
    console.log('Found offers:', offers.length);
    for (const o of offers) {
      console.log('Deleting offer:', o.id, o.title);
      await prisma.offer.delete({ where: { id: o.id } });
    }
    console.log('Done deleting offers.');
  } else {
    console.log('Owner not found');
  }
}

check().then(() => process.exit(0)).catch(e => console.error(e));
