const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const email = 'jeevanasapavath@gmail.com';
  const owner = await prisma.owner.findUnique({ where: { email } });
  
  if (owner) {
    const offers = await prisma.offer.findMany({ where: { ownerId: owner.id } });
    if (offers.length > 0) {
      console.log('Deleting the first offer posted by you:', offers[0].title);
      await prisma.offer.delete({ where: { id: offers[0].id } });
      console.log('Offer deleted successfully.');
    } else {
      console.log('No offers found for this account.');
    }
  } else {
    console.log('Owner not found');
  }
}

check().then(() => process.exit(0)).catch(e => console.error(e));
