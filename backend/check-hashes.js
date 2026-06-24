const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const email = 'jeevanasapavath@gmail.com';
  
  const user = await prisma.user.findUnique({ where: { email } });
  const owner = await prisma.owner.findUnique({ where: { email } });
  
  if (user) {
    console.log('USER HASH:', user.passwordHash);
  } else {
    console.log('USER NOT FOUND');
  }
  
  if (owner) {
    console.log('OWNER HASH:', owner.passwordHash);
  } else {
    console.log('OWNER NOT FOUND');
  }
}

check().then(() => process.exit(0)).catch(e => console.error(e));
