async function main() {
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfRes.json();
  const csrfCookies = csrfRes.headers.getSetCookie();

  const body = new URLSearchParams({
    csrfToken: csrfData.csrfToken,
    email: 'test@citrafoam.com',
    password: 'citra123',
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

  const ordersRes = await fetch('http://localhost:3000/account/orders', {
    headers: { 'Cookie': allCookies },
    redirect: 'manual'
  });

  console.log('Account Orders HTTP Status for test@citrafoam.com:', ordersRes.status);
  const text = await ordersRes.text();
  console.log('Contains Priya Sharma:', text.includes('Priya Sharma'));
  console.log('Contains test@citrafoam.com:', text.includes('test@citrafoam.com'));
  console.log('Contains CF-MU9R10PD-XHKD:', text.includes('CF-MU9R10PD-XHKD'));
  console.log('Contains Akshay (should NOT be in Priya’s orders):', text.includes('Akshay'));
  console.log('Contains CF-2024-9120 (Akshay’s order):', text.includes('CF-2024-9120'));
  console.log('Contains CF-2024-9188 (Akshay’s order):', text.includes('CF-2024-9188'));
}

main().catch(console.error);
