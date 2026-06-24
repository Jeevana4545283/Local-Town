const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function check() {
  const email = 'jeevanasapavath@gmail.com';
  const owner = await prisma.owner.findUnique({ where: { email } });
  
  if (!owner) {
    console.log('Result: Owner record missing');
    return;
  }
  console.log('Result: Owner exists!');
  console.log('Owner password hash:', owner.password);

  const match = await bcrypt.compare('Jee@123', owner.password);
  console.log('Result: Password match:', match);
}

check().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
