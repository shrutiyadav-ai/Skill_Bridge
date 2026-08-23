import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function testAllProfileRoles() {
  console.log("=== 1. Testing Student Profile CRUD in Supabase ===");

  const studentEmail = `student.test.${Date.now()}@test.ac.in`;
  const passwordHash = await bcrypt.hash("Pass@123", 10);

  const studentUser = await prisma.user.create({
    data: {
      email: studentEmail,
      name: "Rohit Verma",
      passwordHash,
      role: "STUDENT",
      studentProfile: {
        create: {
          course: "B.Tech / BE",
          department: "Computer Science & Engineering",
          year: 3,
          semester: 5,
          cgpa: 8.92,
          careerGoal: "Full-Stack Cloud Architect",
        },
      },
    },
    include: { studentProfile: true },
  });

  console.log("✓ Student created:", studentUser.id, studentUser.studentProfile?.course);

  // Add Education
  const edu = await prisma.education.create({
    data: {
      studentId: studentUser.studentProfile!.id,
      institution: "Indian Institute of Technology Delhi",
      degree: "B.Tech in Computer Science",
      startYear: 2023,
      endYear: 2027,
      grade: "8.92 CGPA",
      isCurrent: true,
    },
  });
  console.log("✓ Education record created:", edu.id, edu.degree);

  // Add Project
  const proj = await prisma.project.create({
    data: {
      studentId: studentUser.studentProfile!.id,
      title: "Real-Time Collaborative Code Editor",
      description: "WebSocket-powered multi-user editor with syntax highlighting and OT synchronization.",
      githubUrl: "https://github.com/rohit/collab-editor",
      projectUrl: "https://editor.rohit.dev",
    },
  });
  console.log("✓ Project created:", proj.id, proj.title);

  // Add Certification
  const cert = await prisma.certification.create({
    data: {
      studentId: studentUser.studentProfile!.id,
      name: "AWS Certified Developer Associate",
      issuer: "Amazon Web Services",
      credentialUrl: "https://aws.amazon.com/verify/123",
      verified: true,
    },
  });
  console.log("✓ Certification created:", cert.id, cert.name);

  // Update Student Profile
  const updatedStudent = await prisma.studentProfile.update({
    where: { id: studentUser.studentProfile!.id },
    data: {
      careerGoal: "Lead Cloud Infrastructure Engineer",
      phone: "+91 9988776655",
      location: "New Delhi, India",
      workModePreference: "REMOTE",
    },
  });
  console.log("✓ Student profile updated:", updatedStudent.careerGoal, updatedStudent.workModePreference);

  console.log("=== 2. Testing Industry Profile CRUD in Supabase ===");

  const industryEmail = `recruiter.${Date.now()}@techcorp.com`;
  const indUser = await prisma.user.create({
    data: {
      email: industryEmail,
      name: "TechCorp Labs",
      passwordHash,
      role: "INDUSTRY",
      industryProfile: {
        create: {
          companyName: "TechCorp Labs",
          industry: "Cloud & Artificial Intelligence",
          website: "https://techcorp.com",
          size: "500-1000",
          headquarters: "Bengaluru, India",
          internshipHiring: true,
          placementHiring: true,
          hiringRoles: ["Cloud Engineer", "ML Ops Engineer", "Full-Stack Dev"],
        },
      },
    },
    include: { industryProfile: true },
  });
  console.log("✓ Industry created:", indUser.id, indUser.industryProfile?.companyName);

  console.log("=== 3. Testing Institution Profile CRUD in Supabase ===");

  const instEmail = `admin.${Date.now()}@university.edu`;
  const instUser = await prisma.user.create({
    data: {
      email: instEmail,
      name: "Delhi Technological University",
      passwordHash,
      role: "INSTITUTION",
      institutionProfile: {
        create: {
          name: "Delhi Technological University",
          type: "State Technological University",
          location: "Rohini, New Delhi",
          studentCount: 15000,
          facultyCount: 750,
          placementOfficerName: "Prof. S. K. Sharma",
          accreditation: "NAAC A+",
        },
      },
    },
    include: { institutionProfile: true },
  });
  console.log("✓ Institution created:", instUser.id, instUser.institutionProfile?.name);

  console.log("=== 4. Testing Academician Profile CRUD in Supabase ===");

  const facEmail = `dr.faculty.${Date.now()}@iitd.ac.in`;
  const facUser = await prisma.user.create({
    data: {
      email: facEmail,
      name: "Dr. Ananya Sen",
      passwordHash,
      role: "ACADEMICIAN",
      academicianProfile: {
        create: {
          department: "Computer Science & Engineering",
          designation: "Associate Professor",
          specialization: "Quantum Computing & Cryptography",
          highestQualification: "Ph.D. in Theoretical Computer Science",
          experience: 12,
        },
      },
    },
    include: { academicianProfile: true },
  });
  console.log("✓ Academician created:", facUser.id, facUser.academicianProfile?.designation);

  // Add Publication
  const pub = await prisma.publication.create({
    data: {
      academicianId: facUser.academicianProfile!.id,
      title: "Post-Quantum Lattice Cryptography for Decentralized Identities",
      journalOrConf: "IEEE Trans. on Information Forensics and Security",
      year: 2025,
      doi: "10.1109/TIFS.2025.998877",
      authors: "Dr. Ananya Sen, R. Sharma",
    },
  });
  console.log("✓ Publication created:", pub.id, pub.title);

  // Add Research Project
  const rp = await prisma.researchProject.create({
    data: {
      academicianId: facUser.academicianProfile!.id,
      title: "Quantum-Resilient Key Exchange in Edge Networks",
      fundingAgency: "Department of Science and Technology (DST)",
      grantAmount: 3500000,
      duration: "2025 - 2028 (3 Years)",
      status: "ONGOING",
    },
  });
  console.log("✓ Research project created:", rp.id, rp.title, "Grant: ₹" + rp.grantAmount);

  // Clean up test data
  console.log("=== Cleaning up test data from Supabase ===");
  await prisma.education.deleteMany({ where: { studentId: studentUser.studentProfile!.id } });
  await prisma.project.deleteMany({ where: { studentId: studentUser.studentProfile!.id } });
  await prisma.certification.deleteMany({ where: { studentId: studentUser.studentProfile!.id } });
  await prisma.studentProfile.delete({ where: { id: studentUser.studentProfile!.id } });
  await prisma.user.delete({ where: { id: studentUser.id } });

  await prisma.industryProfile.delete({ where: { id: indUser.industryProfile!.id } });
  await prisma.user.delete({ where: { id: indUser.id } });

  await prisma.institutionProfile.delete({ where: { id: instUser.institutionProfile!.id } });
  await prisma.user.delete({ where: { id: instUser.id } });

  await prisma.publication.deleteMany({ where: { academicianId: facUser.academicianProfile!.id } });
  await prisma.researchProject.deleteMany({ where: { academicianId: facUser.academicianProfile!.id } });
  await prisma.academicianProfile.delete({ where: { id: facUser.academicianProfile!.id } });
  await prisma.user.delete({ where: { id: facUser.id } });

  console.log("✓ All test profile records cleaned up.");
  console.log("=== All 4 Role Profile Tests Passed with 100% Success! ===");
}

testAllProfileRoles()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
