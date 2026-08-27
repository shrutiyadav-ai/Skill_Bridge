import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OpportunityType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const typeFilter = searchParams.get("type"); // FDP, FACULTY_INTERNSHIP, TRAINING, WORKSHOP, MENTORSHIP
    const modeFilter = searchParams.get("mode"); // REMOTE, IN_PERSON

    const facultyTypes: OpportunityType[] = [
      OpportunityType.FDP,
      OpportunityType.FACULTY_INTERNSHIP,
      OpportunityType.TRAINING,
      OpportunityType.WORKSHOP,
      OpportunityType.MENTORSHIP,
    ];

    let targetTypes = facultyTypes;
    if (typeFilter && typeFilter !== "ALL") {
      if (facultyTypes.includes(typeFilter as OpportunityType)) {
        targetTypes = [typeFilter as OpportunityType];
      }
    }

    const opportunities = await prisma.opportunity.findMany({
      where: {
        type: { in: targetTypes },
        status: "OPEN",
      },
      include: {
        industry: true,
        skillRequirements: {
          include: { skill: true },
        },
        applications: {
          include: {
            student: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let mappedOpps = opportunities.map((o) => ({
      id: o.id,
      title: o.title,
      type: o.type,
      description: o.description || "Comprehensive faculty upskilling and industry immersion program.",
      companyName: o.industry.companyName,
      companyLogo: o.industry.logoUrl || null,
      industrySector: o.industry.industry || "Technology & Engineering",
      location: o.location || "Bangalore",
      remote: o.remote,
      duration: o.duration || "4 weeks",
      stipend: o.stipend ? Number(o.stipend) : null,
      eligibility: o.eligibility || "Faculty members, Researchers, and Department Heads",
      deadline: o.deadline ? o.deadline.toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      skills: o.skillRequirements.map((sr) => sr.skill.name),
      applicantCount: o.applications.length,
    }));

    if (query) {
      mappedOpps = mappedOpps.filter(
        (o) =>
          o.title.toLowerCase().includes(query) ||
          o.companyName.toLowerCase().includes(query) ||
          o.description.toLowerCase().includes(query) ||
          o.skills.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (modeFilter && modeFilter !== "ALL") {
      if (modeFilter === "REMOTE") {
        mappedOpps = mappedOpps.filter((o) => o.remote);
      } else if (modeFilter === "IN_PERSON") {
        mappedOpps = mappedOpps.filter((o) => !o.remote);
      }
    }

    const fdpCount = mappedOpps.filter((o) => o.type === "FDP").length;
    const internshipCount = mappedOpps.filter((o) => o.type === "FACULTY_INTERNSHIP").length;
    const workshopCount = mappedOpps.filter((o) => o.type === "WORKSHOP" || o.type === "TRAINING").length;
    const mentorshipCount = mappedOpps.filter((o) => o.type === "MENTORSHIP").length;

    return NextResponse.json({
      summary: {
        totalOpportunities: mappedOpps.length,
        fdpCount,
        internshipCount,
        workshopCount,
        mentorshipCount,
      },
      opportunities: mappedOpps,
      total: mappedOpps.length,
    });
  } catch (error: any) {
    console.error("Error fetching faculty opportunities:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch faculty opportunities" },
      { status: 500 }
    );
  }
}
