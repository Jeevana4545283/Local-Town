const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAuth() {
  console.log('Starting safe auth cleanup...');

  // 1. Clean Owners
  const owners = await prisma.owner.findMany({
    include: {
      rentals: true, bookings: true,
      services: true, serviceBookings: true,
      workers: true, workerBookings: true,
      offers: true, offerOrders: true,
      events: true, eventRegistrations: true,
      marketplaceItems: true, marketplaceOrders: true
    }
  });

  let deletedOwners = 0;
  for (const owner of owners) {
    const hasData = 
      owner.rentals.length > 0 || owner.bookings.length > 0 ||
      owner.services.length > 0 || owner.serviceBookings.length > 0 ||
      owner.workers.length > 0 || owner.workerBookings.length > 0 ||
      owner.offers.length > 0 || owner.offerOrders.length > 0 ||
      owner.events.length > 0 || owner.eventRegistrations.length > 0 ||
      owner.marketplaceItems.length > 0 || owner.marketplaceOrders.length > 0;

    if (!hasData) {
      await prisma.conversation.deleteMany({ where: { ownerId: owner.id } }); 
      await prisma.notification.deleteMany({ where: { userId: owner.id } }); 
      await prisma.owner.delete({ where: { id: owner.id } });
      deletedOwners++;
    }
  }

  // 2. Clean Users
  const users = await prisma.user.findMany({
    include: {
      offerLikes: true,
      savedOffers: true,
      offerComments: true
    }
  });

  let deletedUsers = 0;
  for (const user of users) {
    const rentals = await prisma.booking.count({ where: { userId: user.id } });
    const services = await prisma.serviceBooking.count({ where: { userId: user.id } });
    const workers = await prisma.workerBooking.count({ where: { userId: user.id } });
    const offers = await prisma.offerOrder.count({ where: { userId: user.id } });
    const events = await prisma.eventRegistration.count({ where: { userId: user.id } });
    const market = await prisma.marketplaceOrder.count({ where: { userId: user.id } });

    const hasData = 
      user.offerLikes.length > 0 || user.savedOffers.length > 0 || user.offerComments.length > 0 ||
      rentals > 0 || services > 0 || workers > 0 || offers > 0 || events > 0 || market > 0;

    if (!hasData) {
      await prisma.notification.deleteMany({ where: { userId: user.id } }); 
      await prisma.conversation.deleteMany({ where: { userId: user.id } }); 
      await prisma.user.delete({ where: { id: user.id } });
      deletedUsers++;
    }
  }

  console.log(`Cleanup complete! Deleted ${deletedOwners} isolated Owners and ${deletedUsers} isolated Users.`);
  process.exit(0);
}

cleanAuth().catch(e => {
  console.error('Error during cleanup:', e);
  process.exit(1);
});
