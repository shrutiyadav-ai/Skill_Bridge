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
    { name: "C++", category: SkillCategory.TECHNICAL, description: "Systems programming language" },
    { name: "SQL", category: SkillCategory.TECHNICAL, description: "Relational database queries" },
    { name: "React", category: SkillCategory.TECHNICAL, description: "Frontend UI library" },
    { name: "Node.js", category: SkillCategory.TECHNICAL, description: "Backend runtime" },
    { name: "Docker", category: SkillCategory.TECHNICAL, description: "Containerization" },
    { name: "AWS", category: SkillCategory.TECHNICAL, description: "Cloud services" },
    { name: "Git", category: SkillCategory.TECHNICAL, description: "Version control" },
    { name: "Data Structures", category: SkillCategory.TECHNICAL, description: "Core data structures and algorithms" },
    { name: "Machine Learning", category: SkillCategory.TECHNICAL, description: "Predictive modeling and algorithms" },
    { name: "Deep Learning", category: SkillCategory.TECHNICAL, description: "Neural networks and architectures" },
    { name: "Accounting", category: SkillCategory.DOMAIN, description: "Financial and management accounting" },
    { name: "Financial Management", category: SkillCategory.DOMAIN, description: "Capital budgeting and corporate finance" },
    { name: "Taxation", category: SkillCategory.DOMAIN, description: "Direct and indirect taxation laws" },
    { name: "Economics", category: SkillCategory.DOMAIN, description: "Micro and macroeconomic principles" },
    { name: "Financial Analysis", category: SkillCategory.DOMAIN, description: "Financial statement and ratio diagnostics" },
    { name: "Business Analytics", category: SkillCategory.DOMAIN, description: "Data-driven business decision making" },
    { name: "Marketing", category: SkillCategory.DOMAIN, description: "Strategic marketing and brand positioning" },
    { name: "Logical Reasoning", category: SkillCategory.APTITUDE, description: "Analytical problem solving" },
    { name: "Quantitative Aptitude", category: SkillCategory.APTITUDE, description: "Mathematical analysis" },
    { name: "Problem Solving", category: SkillCategory.APTITUDE, description: "Structured technical problem solving" },
    { name: "Analytical Thinking", category: SkillCategory.APTITUDE, description: "Critical data evaluation" },
    { name: "Communication", category: SkillCategory.SOFT_SKILL, description: "Verbal and written communication" },
    { name: "Teamwork", category: SkillCategory.SOFT_SKILL, description: "Collaborative execution" },
    { name: "Leadership", category: SkillCategory.SOFT_SKILL, description: "Team guidance and decision making" },
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

  // 5. Seed Students across different Courses & Departments
  // Student A: B.Tech Computer Science & Engineering
  const studentUser1 = await prisma.user.upsert({
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
          department: "Computer Science & Engineering",
          year: 3,
          bio: "Passionate about computer systems, algorithms, and high-performance engineering.",
          cgpa: 8.72,
          careerGoal: "Software Engineer",
          portfolioSlug: "aditya-sharma",
        },
      },
    },
    include: { studentProfile: true },
  });

  // Student B: B.Tech Artificial Intelligence & Machine Learning
  const studentUser2 = await prisma.user.upsert({
    where: { email: "priya.patel@nitt.ac.in" },
    update: {},
    create: {
      email: "priya.patel@nitt.ac.in",
      name: "Priya Patel",
      passwordHash: defaultPasswordHash,
      role: UserRole.STUDENT,
      studentProfile: {
        create: {
          institutionId: institutionUser.institutionProfile?.id,
          course: "B.Tech",
          department: "Artificial Intelligence & Machine Learning",
          year: 3,
          bio: "Specializing in deep learning, computer vision, and neural network optimization.",
          cgpa: 9.15,
          careerGoal: "Machine Learning Engineer",
          portfolioSlug: "priya-patel",
        },
      },
    },
    include: { studentProfile: true },
  });

  // Student C: B.Com Accounting & Finance
  const studentUser3 = await prisma.user.upsert({
    where: { email: "rohit.verma@srcc.du.ac.in" },
    update: {},
    create: {
      email: "rohit.verma@srcc.du.ac.in",
      name: "Rohit Verma",
      passwordHash: defaultPasswordHash,
      role: UserRole.STUDENT,
      studentProfile: {
        create: {
          institutionId: institutionUser.institutionProfile?.id,
          course: "B.Com",
          department: "Accounting & Finance",
          year: 2,
          bio: "Aspiring financial analyst passionate about corporate finance, capital markets, and valuation.",
          cgpa: 8.90,
          careerGoal: "Financial Analyst",
          portfolioSlug: "rohit-verma",
        },
      },
    },
    include: { studentProfile: true },
  });

  // 6. Seed Question Bank
  const { seedQuestionBank } = await import("./seed-questions");
  const existingQuestions = await prisma.assessmentQuestion.count();
  if (existingQuestions === 0) {
    await seedQuestionBank();
  } else {
    console.log(`ℹ️ Question bank already has ${existingQuestions} questions.`);
  }

  // 7. Seed Dynamic Career Roles & Industry Benchmarks
  const { seedCareerRoles } = await import("./seed-career-roles");
  await seedCareerRoles();

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
