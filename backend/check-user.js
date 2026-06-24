const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const email = 'jeevanasapavath@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    console.log('User role:', user.role);
  } else {
    console.log('User not found');
  }
}

check().then(() => process.exit(0)).catch(e => console.error(e));
