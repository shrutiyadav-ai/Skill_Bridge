import { PrismaClient, UserRole, OpportunityType, SkillCategory, ApplicationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SkillBridge database seed...");

  const defaultPasswordHash = await bcrypt.hash("SkillBridge@2024", 10);

  // 1. Seed Core Skills
  const skillsData = [
    { name: "Python", category: SkillCategory.TECHNICAL, description: "General-purpose programming language" },
    { name: "JavaScript", category: SkillCategory.TECHNICAL, description: "Web language" },
    { name: "TypeScript", category: SkillCategory.TECHNICAL, description: "Typed JavaScript" },
    { name: "Java", category: SkillCategory.TECHNICAL, description: "Enterprise backend" },
    { name: "SQL", category: SkillCategory.TECHNICAL, description: "Relational database queries" },
    { name: "React", category: SkillCategory.TECHNICAL, description: "Frontend UI library" },
    { name: "Node.js", category: SkillCategory.TECHNICAL, description: "Backend runtime" },
    { name: "Docker", category: SkillCategory.TECHNICAL, description: "Containerization" },
    { name: "AWS", category: SkillCategory.TECHNICAL, description: "Cloud services" },
    { name: "Git", category: SkillCategory.TECHNICAL, description: "Version control" },
    { name: "Machine Learning", category: SkillCategory.TECHNICAL, description: "Predictive modeling" },
    { name: "Deep Learning", category: SkillCategory.TECHNICAL, description: "Neural networks" },
    { name: "Logical Reasoning", category: SkillCategory.APTITUDE, description: "Analytical problem solving" },
    { name: "Quantitative Aptitude", category: SkillCategory.APTITUDE, description: "Mathematical analysis" },
    { name: "Communication", category: SkillCategory.SOFT_SKILL, description: "Verbal and written communication" },
    { name: "Teamwork", category: SkillCategory.SOFT_SKILL, description: "Collaborative execution" },
  ];

  for (const s of skillsData) {
    await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  // 2. Seed Institution
  const institutionUser = await prisma.user.upsert({
    where: { email: "admin@iitdelhi.ac.in" },
    update: {},
    create: {
      email: "admin@iitdelhi.ac.in",
      name: "IIT Delhi Administration",
      passwordHash: defaultPasswordHash,
      role: UserRole.INSTITUTION,
      institutionProfile: {
        create: {
          name: "Indian Institute of Technology, Delhi",
          type: "IIT",
          location: "New Delhi",
          accreditation: "NAAC A++",
        },
      },
    },
    include: { institutionProfile: true },
  });

  // 3. Seed Industry User
  const industryUser = await prisma.user.upsert({
    where: { email: "hr@flipkart.com" },
    update: {},
    create: {
      email: "hr@flipkart.com",
      name: "Ramesh Iyer",
      passwordHash: defaultPasswordHash,
      role: UserRole.INDUSTRY,
      industryProfile: {
        create: {
          companyName: "Flipkart",
          industry: "E-commerce & Technology",
          website: "https://www.flipkart.com",
          size: "10000+",
          description: "India's leading e-commerce marketplace.",
        },
      },
    },
    include: { industryProfile: true },
  });

  // 4. Seed Academician User
  await prisma.user.upsert({
    where: { email: "dr.raghavan@iitd.ac.in" },
    update: {},
    create: {
      email: "dr.raghavan@iitd.ac.in",
      name: "Dr. S. Raghavan",
      passwordHash: defaultPasswordHash,
      role: UserRole.ACADEMICIAN,
      academicianProfile: {
        create: {
          department: "Computer Science",
          designation: "Professor",
          specialization: "Machine Learning & AI",
          experience: 18,
          institutionId: institutionUser.institutionProfile?.id,
        },
      },
    },
  });

  // 5. Seed Student User
  const studentUser = await prisma.user.upsert({
    where: { email: "aditya.sharma@iitd.ac.in" },
    update: {},
    create: {
      email: "aditya.sharma@iitd.ac.in",
      name: "Aditya Sharma",
      passwordHash: defaultPasswordHash,
      role: UserRole.STUDENT,
      studentProfile: {
        create: {
          institutionId: institutionUser.institutionProfile?.id,
          course: "B.Tech",
          department: "Computer Science",
          year: 3,
          bio: "Passionate about machine learning and building intelligent systems.",
          cgpa: 8.72,
          careerGoal: "Machine Learning Engineer",
          portfolioSlug: "aditya-sharma",
        },
      },
    },
    include: { studentProfile: true },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
