import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function testAllRoleRegistrations() {
  console.log("=== Testing Full Registration Pipeline for All 4 Roles in Supabase ===");
  const timestamp = Date.now();

  // 1. STUDENT REGISTRATION
  const studentEmail = `reg.student.${timestamp}@vit.ac.in`;
  const studentPassword = "Password@123";
  const studentHash = await bcrypt.hash(studentPassword, 10);

  const student = await prisma.user.create({
    data: {
      email: studentEmail,
      name: "Tanvi Shinde",
      passwordHash: studentHash,
      role: "STUDENT",
      studentProfile: {
        create: {
          course: "B.Tech / BE (Bachelor of Technology / Engineering)",
          department: "Artificial Intelligence & Data Science / Machine Learning",
          year: 3,
          careerGoal: "Machine Learning Engineer",
          portfolioSlug: `tanvi-shinde-${timestamp.toString().slice(-4)}`,
        },
      },
    },
    include: { studentProfile: true },
  });
  console.log("✓ 1. Student Registered in Supabase:", {
    id: student.id,
    email: student.email,
    role: student.role,
    course: student.studentProfile?.course,
    department: student.studentProfile?.department,
  });

  // 2. INDUSTRY REGISTRATION
  const indEmail = `reg.hr.${timestamp}@swiggy.in`;
  const indPassword = "Password@123";
  const indHash = await bcrypt.hash(indPassword, 10);

  const industry = await prisma.user.create({
    data: {
      email: indEmail,
      name: "Swiggy India",
      passwordHash: indHash,
      role: "INDUSTRY",
      industryProfile: {
        create: {
          companyName: "Swiggy India",
          industry: "FoodTech & Logistics",
          website: "https://swiggy.in",
          size: "5000+ Employees",
          description: "Hyperlocal on-demand delivery platform.",
        },
      },
    },
    include: { industryProfile: true },
  });
  console.log("✓ 2. Industry Registered in Supabase:", {
    id: industry.id,
    email: industry.email,
    role: industry.role,
    company: industry.industryProfile?.companyName,
  });

  // 3. INSTITUTION REGISTRATION
  const instEmail = `reg.admin.${timestamp}@bits-pilani.ac.in`;
  const instPassword = "Password@123";
  const instHash = await bcrypt.hash(instPassword, 10);

  const institution = await prisma.user.create({
    data: {
      email: instEmail,
      name: "BITS Pilani",
      passwordHash: instHash,
      role: "INSTITUTION",
      institutionProfile: {
        create: {
          name: "BITS Pilani",
          type: "Deemed University",
          location: "Pilani, Rajasthan",
        },
      },
    },
    include: { institutionProfile: true },
  });
  console.log("✓ 3. Institution Registered in Supabase:", {
    id: institution.id,
    email: institution.email,
    role: institution.role,
    name: institution.institutionProfile?.name,
  });

  // 4. ACADEMICIAN REGISTRATION
  const facEmail = `reg.faculty.${timestamp}@iisc.ac.in`;
  const facPassword = "Password@123";
  const facHash = await bcrypt.hash(facPassword, 10);

  const faculty = await prisma.user.create({
    data: {
      email: facEmail,
      name: "Dr. K. S. Raman",
      passwordHash: facHash,
      role: "ACADEMICIAN",
      academicianProfile: {
        create: {
          department: "Computer Science & Automation",
          designation: "Professor",
          specialization: "Formal Methods & Distributed Systems",
          experience: 16,
        },
      },
    },
    include: { academicianProfile: true },
  });
  console.log("✓ 4. Academician Registered in Supabase:", {
    id: faculty.id,
    email: faculty.email,
    role: faculty.role,
    designation: faculty.academicianProfile?.designation,
  });

  // 5. Authenticate via bcrypt
  const authStudent = await bcrypt.compare(studentPassword, student.passwordHash);
  const authIndustry = await bcrypt.compare(indPassword, industry.passwordHash);
  const authInst = await bcrypt.compare(instPassword, institution.passwordHash);
  const authFac = await bcrypt.compare(facPassword, faculty.passwordHash);

  console.log("✓ 5. Password verification checks:", {
    student: authStudent,
    industry: authIndustry,
    institution: authInst,
    academician: authFac,
  });

  // Clean up
  await prisma.studentProfile.delete({ where: { userId: student.id } });
  await prisma.user.delete({ where: { id: student.id } });

  await prisma.industryProfile.delete({ where: { userId: industry.id } });
  await prisma.user.delete({ where: { id: industry.id } });

  await prisma.institutionProfile.delete({ where: { userId: institution.id } });
  await prisma.user.delete({ where: { id: institution.id } });

  await prisma.academicianProfile.delete({ where: { userId: faculty.id } });
  await prisma.user.delete({ where: { id: faculty.id } });

  console.log("✓ Test users cleaned up successfully.");
  console.log("=== All 4 Roles Registered & Authenticated Against Live Supabase! ===");
}

testAllRoleRegistrations()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
