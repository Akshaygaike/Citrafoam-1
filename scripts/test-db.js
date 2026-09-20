const { Client } = require('pg');

async function testConnection(url) {
  console.log('Testing connection to:', url.replace(/:[^:@]+@/, ':****@'));
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0]);
    await client.end();
    return true;
  } catch (err) {
    console.error('Connection error:', err.message);
    try { await client.end(); } catch (e) {}
    return false;
  }
}

async function main() {
  const pw = 'Akshaygaike2090';
  const id = 'mvkwvtqpxzdjwljeadmg';

  // 1. Direct connection
  const directUrl = `postgresql://postgres:${encodeURIComponent(pw)}@db.${id}.supabase.co:5432/postgres`;
  const success1 = await testConnection(directUrl);
  if (success1) {
    console.log('Direct URL works!');
    return;
  }

  // 2. Try pooler in common regions (ap-south-1, us-east-1, eu-west-1, etc.)
  const regions = ['ap-south-1', 'us-east-1', 'eu-central-1', 'ap-southeast-1'];
  for (const reg of regions) {
    const poolerUrl = `postgresql://postgres.${id}:${encodeURIComponent(pw)}@aws-0-${reg}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    console.log(`Trying pooler region ${reg}...`);
    const success = await testConnection(poolerUrl);
    if (success) {
      console.log(`Pooler URL works with region ${reg}!`);
      return;
    }
  }
}

main().catch(console.error);
