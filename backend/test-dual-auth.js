const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const http = require('http');

const email = 'testuser99' + Date.now() + '@gmail.com';
const password = 'Jee@123';

function request(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log(`Using fresh email: ${email}`);

  console.log('\n--- 1. Signup as User ---');
  let res = await request('/api/auth/signup', {
    type: 'user', name: 'Jeevan User', email, password, phone: '9999999999', country: 'India', state: 'AP', pincode: '123456'
  });
  console.log(`Status: ${res.status}`, res.status === 201 ? 'SUCCESS' : 'FAILED');

  console.log('\n--- 2. Signup as Owner ---');
  res = await request('/api/auth/signup', {
    type: 'owner', name: 'Jeevan Owner', businessName: 'Jeevan Biz', email, password, categories: ['Offers'], phone: '9999999999'
  });
  console.log(`Status: ${res.status}`, res.status === 201 ? 'SUCCESS' : 'FAILED');

  console.log('\n--- 3. Login as User ---');
  res = await request('/api/auth/login', { type: 'user', email, password });
  console.log(`Status: ${res.status}`, res.status === 200 ? 'SUCCESS' : 'FAILED');

  console.log('\n--- 4. Login as Owner ---');
  res = await request('/api/auth/login', { type: 'owner', email, password });
  console.log(`Status: ${res.status}`, res.status === 200 ? 'SUCCESS' : 'FAILED');
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
