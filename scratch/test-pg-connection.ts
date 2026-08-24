import { Client } from "pg";

async function testPg(name: string, connectionString: string) {
  console.log(`\n--- Testing ${name} ---`);
  // Mask password for logging
  const masked = connectionString.replace(/:([^:@]+)@/, ":****@");
  console.log(`URL: ${masked}`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log("Connecting...");
    await client.connect();
    console.log("✓ Connected successfully!");
    const res = await client.query("SELECT current_user, current_database(), version();");
    console.log("✓ Query result:", res.rows[0]);
    await client.end();
    return true;
  } catch (err: any) {
    console.error(`❌ ${name} FAILED:`, err.message);
    if (err.code) console.error("Error Code:", err.code);
    if (err.detail) console.error("Detail:", err.detail);
    if (err.hint) console.error("Hint:", err.hint);
    return false;
  }
}

async function run() {
  const passwordEncoded = "SkillBridge%402006";
  const passwordRaw = "SkillBridge@2006";
  const projectRef = "tvssgrnpxdqgpzlcdrjn";

  // Test 1: Pooler 6543 with encoded password
  await testPg(
    "Pooler Port 6543 (Transaction mode, encoded pw)",
    `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`
  );

  // Test 2: Pooler 5432 with encoded password
  await testPg(
    "Pooler Port 5432 (Session mode, encoded pw)",
    `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require`
  );

  // Test 3: Direct db.[ref].supabase.co:5432 with user postgres
  await testPg(
    "Direct db.[ref].supabase.co:5432 (user postgres, encoded pw)",
    `postgresql://postgres:${passwordEncoded}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`
  );

  // Test 4: Direct db.[ref].supabase.co:5432 with user postgres.ref
  await testPg(
    "Direct db.[ref].supabase.co:5432 (user postgres.ref, encoded pw)",
    `postgresql://postgres.${projectRef}:${passwordEncoded}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`
  );
}

run();
