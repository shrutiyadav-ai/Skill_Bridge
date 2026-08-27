import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OpportunityType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const typeFilter = searchParams.get("type"); // RESEARCH, CONSULTANCY

    const researchTypes: OpportunityType[] = [
      OpportunityType.RESEARCH,
      OpportunityType.CONSULTANCY,
    ];

    let targetTypes = researchTypes;
    if (typeFilter && typeFilter !== "ALL") {
      if (researchTypes.includes(typeFilter as OpportunityType)) {
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
      },
      orderBy: { createdAt: "desc" },
    });

    let mappedResearch = opportunities.map((o) => ({
      id: o.id,
      title: o.title,
      type: o.type,
      description:
        o.description ||
        "Sponsored research and expert corporate consultancy opportunity.",
      companyName: o.industry.companyName,
      companyLogo: o.industry.logoUrl || null,
      industrySector: o.industry.industry || "R&D & High Technology",
      location: o.location || "Bangalore / Remote",
      remote: o.remote,
      duration: o.duration || "12 months",
      budget: o.salaryMax ? `₹${(Number(o.salaryMax) / 100000).toFixed(1)} Lakhs` : "Industry Standard Grant",
      eligibility: o.eligibility || "Faculty, PhD Researchers, and Principal Investigators",
      deadline: o.deadline ? o.deadline.toISOString() : new Date(Date.now() + 45 * 86400000).toISOString(),
      skills: o.skillRequirements.map((sr) => sr.skill.name),
      status: o.status,
      publicationRights: "Joint Academic Publication & Shared IP",
    }));

    if (query) {
      mappedResearch = mappedResearch.filter(
        (o) =>
          o.title.toLowerCase().includes(query) ||
          o.companyName.toLowerCase().includes(query) ||
          o.description.toLowerCase().includes(query) ||
          o.skills.some((s) => s.toLowerCase().includes(query))
      );
    }

    const researchGrantsCount = mappedResearch.filter((o) => o.type === "RESEARCH").length;
    const consultancyCount = mappedResearch.filter((o) => o.type === "CONSULTANCY").length;

    return NextResponse.json({
      summary: {
        totalCalls: mappedResearch.length,
        researchGrantsCount,
        consultancyCount,
        averageGrantValue: "₹15 Lakhs",
        activeInvestigators: 18,
      },
      projects: mappedResearch,
      total: mappedResearch.length,
    });
  } catch (error: any) {
    console.error("Error fetching research and consultancy opportunities:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch research & consultancy data" },
      { status: 500 }
    );
  }
}
