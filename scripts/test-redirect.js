async function main() {
  const r = await fetch('http://localhost:3000/account/orders', { redirect: 'manual' });
  console.log('HTTP Status:', r.status);
  console.log('Redirect Location:', r.headers.get('location'));
}
main().catch(console.error);
