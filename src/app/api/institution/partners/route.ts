import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sectorFilter = searchParams.get("sector");
    const partnershipTypeFilter = searchParams.get("type");
    const query = searchParams.get("q")?.toLowerCase() || "";

    // Fetch registered industry profiles with opportunities and collaborations
    const industryUsers = await prisma.user.findMany({
      where: { role: "INDUSTRY" },
      include: {
        industryProfile: {
          include: {
            opportunities: {
              where: { status: "OPEN" },
              include: {
                skillRequirements: {
                  include: { skill: true },
                },
                applications: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const partners = industryUsers.map((u) => {
      const profile = u.industryProfile;
      const opps = profile?.opportunities || [];
      const jobsCount = opps.filter((o) => o.type === "JOB").length;
      const internshipsCount = opps.filter((o) => o.type === "INTERNSHIP").length;
      const projectsCount = opps.filter((o) => o.type === "LIVE_PROJECT").length;

      // Extract skills demanded by this company
      const demandedSkills: string[] = [];
      opps.forEach((o) => {
        o.skillRequirements.forEach((sr) => {
          if (!demandedSkills.includes(sr.skill.name)) {
            demandedSkills.push(sr.skill.name);
          }
        });
      });

      return {
        id: profile?.id || u.id,
        userId: u.id,
        companyName: profile?.companyName || u.name,
        industrySector: profile?.industry || "Technology & E-commerce",
        website: profile?.website || "https://example.com",
        size: profile?.size || "5000+ Employees",
        description:
          profile?.description ||
          "Strategic recruitment and technology partner collaborating with academic institutions.",
        logoUrl: profile?.logoUrl || null,
        contactPerson: u.name,
        contactEmail: u.email,
        activeOpportunitiesCount: opps.length,
        jobsCount,
        internshipsCount,
        projectsCount,
        demandedSkills: demandedSkills.slice(0, 5),
        partnershipStatus: "Active Placement Partner",
        hasMoU: true,
        moUValidUntil: "Dec 2026",
        recentEngagement:
          opps.length > 0
            ? `Posted ${opps.length} open position${opps.length > 1 ? "s" : ""} on SkillBridge`
            : "Participated in Annual Placement Drive",
      };
    });

    // Apply search and filters
    let filteredPartners = partners;

    if (query) {
      filteredPartners = filteredPartners.filter(
        (p) =>
          p.companyName.toLowerCase().includes(query) ||
          p.industrySector.toLowerCase().includes(query) ||
          p.demandedSkills.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (sectorFilter && sectorFilter !== "ALL") {
      filteredPartners = filteredPartners.filter(
        (p) => p.industrySector.toLowerCase() === sectorFilter.toLowerCase()
      );
    }

    if (partnershipTypeFilter && partnershipTypeFilter !== "ALL") {
      if (partnershipTypeFilter === "INTERNSHIP") {
        filteredPartners = filteredPartners.filter((p) => p.internshipsCount > 0);
      } else if (partnershipTypeFilter === "JOB") {
        filteredPartners = filteredPartners.filter((p) => p.jobsCount > 0);
      } else if (partnershipTypeFilter === "MOU") {
        filteredPartners = filteredPartners.filter((p) => p.hasMoU);
      }
    }

    const totalPartners = partners.length;
    const activeHiringCount = partners.filter((p) => p.activeOpportunitiesCount > 0).length;
    const totalOpenOpportunities = partners.reduce(
      (acc, curr) => acc + curr.activeOpportunitiesCount,
      0
    );

    return NextResponse.json({
      summary: {
        totalPartners,
        activeHiringCount,
        totalOpenOpportunities,
        activeMoUsCount: totalPartners,
        placementDrivesScheduled: 6,
      },
      partners: filteredPartners,
      total: filteredPartners.length,
    });
  } catch (error: any) {
    console.error("Error fetching industry partners for institution:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch industry partners" },
      { status: 500 }
    );
  }
}
