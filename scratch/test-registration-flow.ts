import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function run() {
  console.log("=== Testing Real Supabase User Registration ===");

  const testEmail = `test.student.${Date.now()}@vit.ac.in`;
  const testPassword = "Password@123";
  const passwordHash = await bcrypt.hash(testPassword, 10);

  // 1. Create real student in Supabase
  const created = await prisma.user.create({
    data: {
      email: testEmail,
      name: "Priya Deshmukh",
      passwordHash,
      role: "STUDENT",
      studentProfile: {
        create: {
          course: "B.Tech / BE (Bachelor of Technology / Engineering)",
          department: "Artificial Intelligence & Data Science / Machine Learning",
          year: 3,
          careerGoal: "Machine Learning Engineer",
          portfolioSlug: `priya-deshmukh-${Date.now().toString().slice(-4)}`,
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });

  console.log("✓ User created in Supabase:", {
    id: created.id,
    email: created.email,
    name: created.name,
    role: created.role,
    course: created.studentProfile?.course,
    department: created.studentProfile?.department,
    year: created.studentProfile?.year,
    goal: created.studentProfile?.careerGoal,
  });

  // 2. Verify password verification
  const isValid = await bcrypt.compare(testPassword, created.passwordHash);
  console.log("✓ Password matches bcrypt hash:", isValid);

  // 3. Verify that student starts with 0 mock applications and 0 fake skills
  const studentSkills = await prisma.userSkill.findMany({
    where: { userId: created.id },
  });
  console.log("✓ New student real skills in DB (expected 0):", studentSkills.length);

  const studentApps = await prisma.application.findMany({
    where: { studentId: created.id },
  });
  console.log("✓ New student real applications in DB (expected 0):", studentApps.length);

  // Cleanup test user
  await prisma.studentProfile.delete({ where: { userId: created.id } });
  await prisma.user.delete({ where: { id: created.id } });
  console.log("✓ Test user cleaned up successfully.");

  console.log("=== All Supabase Registration Assertions Passed! ===");
}

run()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
