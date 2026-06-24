const axios = require('axios');

async function testAuth() {
  const email = `test.e2e.${Date.now()}@example.com`;
  const password = 'Password123!';
  
  console.log('1. Signing up user...');
  let res;
  try {
    res = await axios.post('http://localhost:4000/api/auth/signup', {
      name: 'E2E Tester',
      email,
      password,
      phone: '1234567890',
      country: 'India',
      state: 'Delhi',
      village: 'New Delhi',
      pincode: '110001'
    });
    console.log('Signup success:', res.data.user.email);
  } catch (e) {
    console.error('Signup failed:', e.response?.data || e.message);
    return;
  }

  const token = res.data.token;

  console.log('2. Switching to Owner...');
  try {
    res = await axios.post('http://localhost:4000/api/auth/switch-role', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const ownerToken = res.data.token;
    console.log('Switch to Owner success. Role:', res.data.user.role, 'Categories:', res.data.user.categories);
    
    console.log('3. Switching back to User...');
    res = await axios.post('http://localhost:4000/api/auth/switch-role', {}, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    console.log('Switch to User success. Role:', res.data.user.role, 'Email:', res.data.user.email);
  } catch (e) {
    console.error('Switch failed:', e.response?.data || e.message);
  }
}

testAuth();
