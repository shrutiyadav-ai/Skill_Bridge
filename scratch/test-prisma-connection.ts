import { PrismaClient } from "@prisma/client";

async function testUrl(name: string, url: string) {
  console.log(`\n========================================`);
  console.log(`Testing: ${name}`);
  const masked = url.replace(/:([^:@]+)@/, ":****@");
  console.log(`URL: ${masked}`);

  const prisma = new PrismaClient({
    datasources: {
      db: { url },
    },
    log: ["error", "warn"],
  });

  try {
    const userCount = await prisma.user.count();
    console.log(`✅ SUCCESS! Connected and retrieved user count: ${userCount}`);
    await prisma.$disconnect();
    return true;
  } catch (err: any) {
    console.error(`❌ FAILED:`, err.message);
    if (err.code) console.error(`Prisma Error Code:`, err.code);
    await prisma.$disconnect();
    return false;
  }
}

async function run() {
  const projectRef = "tvssgrnpxdqgpzlcdrjn";
  const passwordEncoded = "SkillBridge%402006";
  const passwordRaw = "SkillBridge@2006";

  // Config 1: Port 6543 pooler with pgbouncer=true&connection_limit=1
  await testUrl(
    "1. Pooler 6543 (pgbouncer=true&connection_limit=1, encoded pw)",
    `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
  );

  // Config 2: Port 5432 pooler (session mode, encoded pw)
  await testUrl(
    "2. Pooler 5432 (session mode, encoded pw)",
    `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?connection_limit=1`
  );

  // Config 3: Port 6543 pooler with sslmode=require
  await testUrl(
    "3. Pooler 6543 (pgbouncer=true&sslmode=require, encoded pw)",
    `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require`
  );

  // Config 4: Port 5432 pooler with sslmode=require
  await testUrl(
    "4. Pooler 5432 (sslmode=require, encoded pw)",
    `postgresql://postgres.${projectRef}:${passwordEncoded}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require`
  );

  // Config 5: Direct host db.ref.supabase.co:5432 (user postgres)
  await testUrl(
    "5. Direct db.ref.supabase.co:5432 (user postgres, sslmode=require)",
    `postgresql://postgres:${passwordEncoded}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`
  );

  // Config 6: Direct host db.ref.supabase.co:5432 (user postgres.ref)
  await testUrl(
    "6. Direct db.ref.supabase.co:5432 (user postgres.ref, sslmode=require)",
    `postgresql://postgres.${projectRef}:${passwordEncoded}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`
  );
}

run();
