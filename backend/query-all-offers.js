const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const offers = await prisma.offer.findMany({ include: { owner: true } });
  if (offers.length > 0) {
    console.log('Offers found in DB:', offers.length);
    for (const o of offers) {
      console.log(`Offer: ${o.title} | Owner Email: ${o.owner.email}`);
    }
  } else {
    console.log('No offers found in entire database.');
  }
}

check().then(() => process.exit(0)).catch(e => console.error(e));
