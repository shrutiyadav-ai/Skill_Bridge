import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MOCK_COLLABORATIONS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const typeFilter = searchParams.get("type"); // JOINT_PROJECT, GUEST_LECTURE, CAPSTONE, CHALLENGE

    // Fetch relevant collaborative opportunities from database
    const oppCollaborations = await prisma.opportunity.findMany({
      where: {
        type: { in: ["LIVE_PROJECT", "WORKSHOP", "MENTORSHIP"] },
        status: "OPEN",
      },
      include: {
        industry: true,
        skillRequirements: { include: { skill: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedOppCollabs = oppCollaborations.map((o) => ({
      id: o.id,
      title: o.title,
      type:
        o.type === "LIVE_PROJECT"
          ? "Live Industry Capstone"
          : o.type === "WORKSHOP"
          ? "Joint Workshop"
          : "Student Mentorship Drive",
      description: o.description || "Active collaboration bridge between academia and industry teams.",
      companyName: o.industry.companyName,
      companyLogo: o.industry.logoUrl || null,
      industrySector: o.industry.industry || "Technology & Engineering",
      institutionName: "IIT Delhi & Partner Institutions",
      status: "ACTIVE",
      duration: o.duration || "1 Semester",
      skills: o.skillRequirements.map((sr) => sr.skill.name),
      isMoUActive: true,
    }));

    // Combine with institutional collaborations
    const staticCollabs = MOCK_COLLABORATIONS.map((c) => ({
      id: c.id,
      title: c.title,
      type: c.type,
      description: c.description,
      companyName: c.companyName,
      companyLogo: null,
      industrySector: "Technology & Software",
      institutionName: c.institutionName,
      status: c.status,
      duration: "Ongoing Partnership",
      skills: ["System Design", "Cloud", "Agile"],
      isMoUActive: true,
    }));

    let allCollabs = [...mappedOppCollabs, ...staticCollabs];

    if (query) {
      allCollabs = allCollabs.filter(
        (c) =>
          c.title?.toLowerCase().includes(query) ||
          c.companyName?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    if (typeFilter && typeFilter !== "ALL") {
      allCollabs = allCollabs.filter((c) =>
        c.type.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    const liveCapstonesCount = allCollabs.filter((c) =>
      c.type.includes("Capstone") || c.type.includes("Live")
    ).length;
    const guestLecturesCount = allCollabs.filter((c) =>
      c.type.includes("Lecture") || c.type.includes("Workshop")
    ).length;
    const jointProjectsCount = allCollabs.filter((c) =>
      c.type.includes("Project") || c.type.includes("Research")
    ).length;

    return NextResponse.json({
      summary: {
        totalCollaborations: allCollabs.length,
        liveCapstonesCount,
        guestLecturesCount,
        jointProjectsCount,
        activeMoUs: allCollabs.length,
      },
      collaborations: allCollabs,
      total: allCollabs.length,
    });
  } catch (error: any) {
    console.error("Error fetching academia collaborations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch collaborations" },
      { status: 500 }
    );
  }
}
