async function main() {
  // 1. Get CSRF token
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfRes.json();
  const csrfCookies = csrfRes.headers.getSetCookie();

  // 2. Sign in with Akshay's credentials
  const body = new URLSearchParams({
    csrfToken: csrfData.csrfToken,
    email: 'akshaygaike2090@gmail.com',
    password: 'Akshaygaike2090',
    redirect: 'false',
    callbackUrl: '/account/orders'
  });

  const cookieHeader = csrfCookies.map(c => c.split(';')[0]).join('; ');

  const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader
    },
    body: body.toString(),
    redirect: 'manual'
  });

  const loginCookies = loginRes.headers.getSetCookie();
  const allCookies = [...csrfCookies, ...loginCookies].map(c => c.split(';')[0]).join('; ');

  // Check /api/auth/session
  const sessionRes = await fetch('http://localhost:3000/api/auth/session', {
    headers: { 'Cookie': allCookies }
  });
  const sessionData = await sessionRes.json();
  console.log('Session response:', sessionData);

  // 3. Fetch /account/orders with the combined session cookie
  const ordersRes = await fetch('http://localhost:3000/account/orders', {
    headers: { 'Cookie': allCookies },
    redirect: 'manual'
  });

  console.log('Account Orders HTTP Status:', ordersRes.status);
  const text = await ordersRes.text();
  console.log('Contains Akshay:', text.includes('Akshay'));
  console.log('Contains akshaygaike2090@gmail.com:', text.includes('akshaygaike2090@gmail.com'));
  console.log('Contains CF-2024-9120:', text.includes('CF-2024-9120'));
  console.log('Contains CF-2024-9188:', text.includes('CF-2024-9188'));
  console.log('Contains Priya Sharma (should NOT be in Akshay’s orders):', text.includes('Priya Sharma'));
}

main().catch(console.error);
