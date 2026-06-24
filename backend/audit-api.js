const http = require('http');

function request(path, method, headers, payload) {
  return new Promise((resolve, reject) => {
    const data = payload ? JSON.stringify(payload) : '';
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        ...headers
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
  const email = 'jeevanasapavath@gmail.com';
  const password = 'Jee@123';
  
  console.log('1. Logging in as User...');
  const loginRes = await request('/api/auth/login', 'POST', {}, { email, password, type: 'user' });
  if (loginRes.status !== 200) {
    console.log('Login failed:', loginRes.data);
    return;
  }
  const token = loginRes.data.token;
  console.log('Got user token.');

  console.log('2. Hitting /auth/switch-role...');
  const switchRes = await request('/api/auth/switch-role', 'POST', { 'Authorization': `Bearer ${token}` });
  console.log('Response Status:', switchRes.status);
  console.log('Response Data:', JSON.stringify(switchRes.data, null, 2));
}

run().then(() => process.exit(0)).catch(e => console.error(e));
