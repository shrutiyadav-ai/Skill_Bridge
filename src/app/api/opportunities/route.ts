import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_OPPORTUNITIES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    let dbOpps: any[] = [];
    try {
      dbOpps = await prisma.opportunity.findMany({
        where: {
          status: "OPEN",
          ...(type && type !== "ALL" ? { type: type as any } : {}),
        },
        include: {
          industry: {
            select: {
              companyName: true,
              logoUrl: true,
            },
          },
          skillRequirements: {
            include: {
              skill: {
                select: {
                  name: true,
                  category: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("Database opportunity fetch fallback to demo items:", dbErr);
    }

    // Format DB items
    const formattedDbOpps = dbOpps.map((o) => ({
      id: o.id,
      title: o.title,
      type: o.type,
      description: o.description,
      companyName: o.industry?.companyName || "Industry Partner",
      companyLogo: o.industry?.logoUrl || null,
      location: o.location || "Bangalore",
      remote: o.remote,
      duration: o.duration || (o.type === "JOB" ? "Full-Time" : "3-6 months"),
      stipend: o.stipend ? Number(o.stipend) : null,
      salaryMin: o.salaryMin ? Number(o.salaryMin) : null,
      salaryMax: o.salaryMax ? Number(o.salaryMax) : null,
      eligibility: o.eligibility || "Open for all graduating students",
      deadline: o.deadline ? o.deadline.toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      skills: o.skillRequirements.map((sr: any) => sr.skill.name),
      compatibilityScore: 85,
    }));

    // Filter MOCK_OPPORTUNITIES
    let filteredMocks = MOCK_OPPORTUNITIES.map((o) => ({
      id: o.id,
      title: o.title,
      type: o.type,
      description: o.description,
      companyName: o.companyName,
      companyLogo: o.companyLogo,
      location: o.location,
      remote: o.remote,
      duration: o.duration,
      stipend: o.stipend,
      salaryMin: o.salaryMin,
      salaryMax: o.salaryMax,
      eligibility: o.eligibility,
      deadline: o.deadline,
      skills: o.requiredSkills.map((s) => s.skillName),
      compatibilityScore: o.compatibilityScore || 85,
    }));

    if (type && type !== "ALL") {
      filteredMocks = filteredMocks.filter((o) => o.type === type);
    }

    // Combine unique by ID or Title
    const seenTitles = new Set(formattedDbOpps.map((o) => o.title.toLowerCase()));
    const blended = [
      ...formattedDbOpps,
      ...filteredMocks.filter((m) => !seenTitles.has(m.title.toLowerCase())),
    ];

    if (search) {
      const q = search.toLowerCase();
      return NextResponse.json({
        opportunities: blended.filter(
          (o) =>
            o.title.toLowerCase().includes(q) ||
            o.companyName.toLowerCase().includes(q) ||
            o.description?.toLowerCase().includes(q) ||
            o.skills.some((s: string) => s.toLowerCase().includes(q))
        ),
      });
    }

    return NextResponse.json({ opportunities: blended });
  } catch (error: any) {
    console.error("Opportunities API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunities", opportunities: MOCK_OPPORTUNITIES },
      { status: 500 }
    );
  }
}
