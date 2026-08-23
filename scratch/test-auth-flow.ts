import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function getRoleDashboardPath(role?: string): string {
  switch (role) {
    case "STUDENT":
      return "/student/dashboard";
    case "INDUSTRY":
      return "/industry/dashboard";
    case "INSTITUTION":
      return "/institution/dashboard";
    case "ACADEMICIAN":
      return "/academician/dashboard";
    default:
      return "/login";
  }
}

const DEMO_TEST_ACCOUNTS = [
  {
    email: "aditya.sharma@iitd.ac.in",
    expectedRole: "STUDENT",
    expectedDashboard: "/student/dashboard",
  },
  {
    email: "hr@flipkart.com",
    expectedRole: "INDUSTRY",
    expectedDashboard: "/industry/dashboard",
  },
  {
    email: "admin@iitdelhi.ac.in",
    expectedRole: "INSTITUTION",
    expectedDashboard: "/institution/dashboard",
  },
  {
    email: "dr.raghavan@iitd.ac.in",
    expectedRole: "ACADEMICIAN",
    expectedDashboard: "/academician/dashboard",
  },
];

async function testAuthPipeline() {
  console.log("==================================================");
  console.log("🔒 SkillBridge Authentication Pipeline Test");
  console.log("==================================================");

  let passed = 0;

  for (const acc of DEMO_TEST_ACCOUNTS) {
    console.log(`\nTesting user: ${acc.email}`);

    // 1. Prisma database query
    const user = await prisma.user.findUnique({
      where: { email: acc.email },
      select: { id: true, email: true, name: true, role: true, passwordHash: true },
    });

    if (!user) {
      console.error(`❌ User not found in Supabase: ${acc.email}`);
      continue;
    }

    // 2. Password verification with bcrypt
    const isPasswordValid = await bcrypt.compare("SkillBridge@2024", user.passwordHash);
    if (!isPasswordValid) {
      console.error(`❌ Password verification failed for: ${acc.email}`);
      continue;
    }

    // 3. Role check
    if (user.role !== acc.expectedRole) {
      console.error(`❌ Role mismatch: expected ${acc.expectedRole}, got ${user.role}`);
      continue;
    }

    // 4. Role-based redirect path
    const dashboardPath = getRoleDashboardPath(user.role);
    if (dashboardPath !== acc.expectedDashboard) {
      console.error(`❌ Dashboard path mismatch: expected ${acc.expectedDashboard}, got ${dashboardPath}`);
      continue;
    }

    console.log(`✅ ID: ${user.id}`);
    console.log(`✅ Name: ${user.name}`);
    console.log(`✅ Database Role: ${user.role}`);
    console.log(`✅ Password Verification (bcrypt): PASS`);
    console.log(`✅ Destination Route: ${dashboardPath}`);
    passed++;
  }

  // 5. Invalid credentials test
  console.log("\nTesting Invalid Credentials...");
  const invalidUser = await prisma.user.findUnique({
    where: { email: "aditya.sharma@iitd.ac.in" },
    select: { passwordHash: true },
  });
  const shouldFail = await bcrypt.compare("WrongPassword123", invalidUser?.passwordHash || "");
  if (!shouldFail) {
    console.log("✅ Invalid credentials correctly rejected (PASS)");
    passed++;
  } else {
    console.error("❌ Invalid credentials accepted!");
  }

  console.log("\n==================================================");
  console.log(`Summary: ${passed} / 5 tests passed successfully!`);
  console.log("==================================================");
}

testAuthPipeline()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
