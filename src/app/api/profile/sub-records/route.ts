import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        academicianProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case "education": {
        if (!user.studentProfile) throw new Error("Student profile required");
        result = await prisma.education.create({
          data: {
            studentId: user.studentProfile.id,
            institution: data.institution,
            degree: data.degree,
            department: data.department || null,
            startYear: parseInt(data.startYear, 10),
            endYear: data.endYear ? parseInt(data.endYear, 10) : null,
            grade: data.grade || null,
            isCurrent: !!data.isCurrent,
          },
        });
        break;
      }

      case "experience": {
        if (!user.studentProfile) throw new Error("Student profile required");
        result = await prisma.experience.create({
          data: {
            studentId: user.studentProfile.id,
            organization: data.organization,
            role: data.role,
            description: data.description || null,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            isCurrent: !!data.isCurrent,
            skills: data.skills || null,
          },
        });
        break;
      }

      case "project": {
        if (!user.studentProfile) throw new Error("Student profile required");
        result = await prisma.project.create({
          data: {
            studentId: user.studentProfile.id,
            title: data.title,
            description: data.description || null,
            projectUrl: data.projectUrl || null,
            githubUrl: data.githubUrl || null,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            skillsJson: data.skills || null,
          },
        });
        break;
      }

      case "certification": {
        if (!user.studentProfile) throw new Error("Student profile required");
        result = await prisma.certification.create({
          data: {
            studentId: user.studentProfile.id,
            name: data.name,
            issuer: data.issuer || null,
            issueDate: data.issueDate ? new Date(data.issueDate) : null,
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
            credentialUrl: data.credentialUrl || null,
            documentUrl: data.documentUrl || null,
            verified: false,
          },
        });
        break;
      }

      case "achievement": {
        result = await prisma.achievement.create({
          data: {
            userId: user.id,
            title: data.title,
            category: data.category || "OTHER",
            issuer: data.issuer || null,
            date: data.date ? new Date(data.date) : null,
            description: data.description || null,
            url: data.url || null,
          },
        });
        break;
      }

      case "publication": {
        if (!user.academicianProfile) throw new Error("Academician profile required");
        result = await prisma.publication.create({
          data: {
            academicianId: user.academicianProfile.id,
            title: data.title,
            journalOrConf: data.journalOrConf || null,
            year: data.year ? parseInt(data.year, 10) : null,
            doi: data.doi || null,
            url: data.url || null,
            authors: data.authors || null,
          },
        });
        break;
      }

      case "researchProject": {
        if (!user.academicianProfile) throw new Error("Academician profile required");
        result = await prisma.researchProject.create({
          data: {
            academicianId: user.academicianProfile.id,
            title: data.title,
            fundingAgency: data.fundingAgency || null,
            grantAmount: data.grantAmount ? parseFloat(data.grantAmount) : null,
            duration: data.duration || null,
            status: data.status || "ONGOING",
            description: data.description || null,
          },
        });
        break;
      }

      case "patent": {
        if (!user.academicianProfile) throw new Error("Academician profile required");
        result = await prisma.patent.create({
          data: {
            academicianId: user.academicianProfile.id,
            title: data.title,
            patentNumber: data.patentNumber || null,
            filingDate: data.filingDate ? new Date(data.filingDate) : null,
            status: data.status || "PENDING",
            url: data.url || null,
          },
        });
        break;
      }

      case "skill": {
        // Upsert skill and user_skill
        const skillName = data.skillName.trim();
        let skill = await prisma.skill.findUnique({
          where: { name: skillName },
        });

        if (!skill) {
          skill = await prisma.skill.create({
            data: {
              name: skillName,
              category: data.category || "TECHNICAL",
              description: `Skill: ${skillName}`,
            },
          });
        }

        result = await prisma.userSkill.upsert({
          where: {
            userId_skillId: {
              userId: user.id,
              skillId: skill.id,
            },
          },
          create: {
            userId: user.id,
            skillId: skill.id,
            score: data.score ? parseFloat(data.score.toString()) : 70,
            verified: !!data.verified,
            source: data.source || "SELF_ATTESTED",
          },
          update: {
            score: data.score ? parseFloat(data.score.toString()) : 70,
            verified: data.verified !== undefined ? !!data.verified : undefined,
            source: data.source || undefined,
          },
          include: {
            skill: true,
          },
        });
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown record type: ${type}` }, { status: 400 });
    }

    return NextResponse.json({
      message: `${type} record created successfully`,
      data: result,
    });
  } catch (error: any) {
    console.error("Sub-records POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create record" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true, academicianProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { type, id, data } = body;

    let result;

    switch (type) {
      case "education": {
        const item = await prisma.education.findUnique({ where: { id } });
        if (!item || item.studentId !== user.studentProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        result = await prisma.education.update({
          where: { id },
          data: {
            ...(data.institution && { institution: data.institution }),
            ...(data.degree && { degree: data.degree }),
            ...(data.department !== undefined && { department: data.department }),
            ...(data.startYear && { startYear: parseInt(data.startYear, 10) }),
            ...(data.endYear !== undefined && { endYear: data.endYear ? parseInt(data.endYear, 10) : null }),
            ...(data.grade !== undefined && { grade: data.grade }),
            ...(data.isCurrent !== undefined && { isCurrent: !!data.isCurrent }),
          },
        });
        break;
      }

      case "experience": {
        const item = await prisma.experience.findUnique({ where: { id } });
        if (!item || item.studentId !== user.studentProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        result = await prisma.experience.update({
          where: { id },
          data: {
            ...(data.organization && { organization: data.organization }),
            ...(data.role && { role: data.role }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.startDate !== undefined && { startDate: data.startDate ? new Date(data.startDate) : null }),
            ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
            ...(data.isCurrent !== undefined && { isCurrent: !!data.isCurrent }),
            ...(data.skills !== undefined && { skills: data.skills }),
          },
        });
        break;
      }

      case "project": {
        const item = await prisma.project.findUnique({ where: { id } });
        if (!item || item.studentId !== user.studentProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        result = await prisma.project.update({
          where: { id },
          data: {
            ...(data.title && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.projectUrl !== undefined && { projectUrl: data.projectUrl }),
            ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl }),
            ...(data.startDate !== undefined && { startDate: data.startDate ? new Date(data.startDate) : null }),
            ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
            ...(data.skills !== undefined && { skillsJson: data.skills }),
          },
        });
        break;
      }

      case "certification": {
        const item = await prisma.certification.findUnique({ where: { id } });
        if (!item || item.studentId !== user.studentProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        result = await prisma.certification.update({
          where: { id },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.issuer !== undefined && { issuer: data.issuer }),
            ...(data.issueDate !== undefined && { issueDate: data.issueDate ? new Date(data.issueDate) : null }),
            ...(data.expiryDate !== undefined && { expiryDate: data.expiryDate ? new Date(data.expiryDate) : null }),
            ...(data.credentialUrl !== undefined && { credentialUrl: data.credentialUrl }),
            ...(data.documentUrl !== undefined && { documentUrl: data.documentUrl }),
          },
        });
        break;
      }

      case "achievement": {
        const item = await prisma.achievement.findUnique({ where: { id } });
        if (!item || item.userId !== user.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        result = await prisma.achievement.update({
          where: { id },
          data: {
            ...(data.title && { title: data.title }),
            ...(data.category !== undefined && { category: data.category }),
            ...(data.issuer !== undefined && { issuer: data.issuer }),
            ...(data.date !== undefined && { date: data.date ? new Date(data.date) : null }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.url !== undefined && { url: data.url }),
          },
        });
        break;
      }

      case "publication": {
        const item = await prisma.publication.findUnique({ where: { id } });
        if (!item || item.academicianId !== user.academicianProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        result = await prisma.publication.update({
          where: { id },
          data: {
            ...(data.title && { title: data.title }),
            ...(data.journalOrConf !== undefined && { journalOrConf: data.journalOrConf }),
            ...(data.year !== undefined && { year: data.year ? parseInt(data.year, 10) : null }),
            ...(data.doi !== undefined && { doi: data.doi }),
            ...(data.url !== undefined && { url: data.url }),
            ...(data.authors !== undefined && { authors: data.authors }),
          },
        });
        break;
      }

      case "researchProject": {
        const item = await prisma.researchProject.findUnique({ where: { id } });
        if (!item || item.academicianId !== user.academicianProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        result = await prisma.researchProject.update({
          where: { id },
          data: {
            ...(data.title && { title: data.title }),
            ...(data.fundingAgency !== undefined && { fundingAgency: data.fundingAgency }),
            ...(data.grantAmount !== undefined && { grantAmount: data.grantAmount ? parseFloat(data.grantAmount) : null }),
            ...(data.duration !== undefined && { duration: data.duration }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.description !== undefined && { description: data.description }),
          },
        });
        break;
      }

      case "patent": {
        const item = await prisma.patent.findUnique({ where: { id } });
        if (!item || item.academicianId !== user.academicianProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        result = await prisma.patent.update({
          where: { id },
          data: {
            ...(data.title && { title: data.title }),
            ...(data.patentNumber !== undefined && { patentNumber: data.patentNumber }),
            ...(data.filingDate !== undefined && { filingDate: data.filingDate ? new Date(data.filingDate) : null }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.url !== undefined && { url: data.url }),
          },
        });
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown record type: ${type}` }, { status: 400 });
    }

    return NextResponse.json({
      message: `${type} record updated successfully`,
      data: result,
    });
  } catch (error: any) {
    console.error("Sub-records PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update record" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true, academicianProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
    }

    switch (type) {
      case "education": {
        const item = await prisma.education.findUnique({ where: { id } });
        if (!item || item.studentId !== user.studentProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        await prisma.education.delete({ where: { id } });
        break;
      }

      case "experience": {
        const item = await prisma.experience.findUnique({ where: { id } });
        if (!item || item.studentId !== user.studentProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        await prisma.experience.delete({ where: { id } });
        break;
      }

      case "project": {
        const item = await prisma.project.findUnique({ where: { id } });
        if (!item || item.studentId !== user.studentProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        await prisma.project.delete({ where: { id } });
        break;
      }

      case "certification": {
        const item = await prisma.certification.findUnique({ where: { id } });
        if (!item || item.studentId !== user.studentProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        await prisma.certification.delete({ where: { id } });
        break;
      }

      case "achievement": {
        const item = await prisma.achievement.findUnique({ where: { id } });
        if (!item || item.userId !== user.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        await prisma.achievement.delete({ where: { id } });
        break;
      }

      case "publication": {
        const item = await prisma.publication.findUnique({ where: { id } });
        if (!item || item.academicianId !== user.academicianProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        await prisma.publication.delete({ where: { id } });
        break;
      }

      case "researchProject": {
        const item = await prisma.researchProject.findUnique({ where: { id } });
        if (!item || item.academicianId !== user.academicianProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        await prisma.researchProject.delete({ where: { id } });
        break;
      }

      case "patent": {
        const item = await prisma.patent.findUnique({ where: { id } });
        if (!item || item.academicianId !== user.academicianProfile?.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        await prisma.patent.delete({ where: { id } });
        break;
      }

      case "skill": {
        const item = await prisma.userSkill.findUnique({ where: { id } });
        if (!item || item.userId !== user.id) {
          return NextResponse.json({ error: "Forbidden or not found" }, { status: 403 });
        }
        await prisma.userSkill.delete({ where: { id } });
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown record type: ${type}` }, { status: 400 });
    }

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error: any) {
    console.error("Sub-records DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete record" }, { status: 500 });
  }
}
