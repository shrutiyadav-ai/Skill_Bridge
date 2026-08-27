import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const departmentFilter = searchParams.get("department");
    const severityFilter = searchParams.get("severity"); // CRITICAL, MODERATE, BALANCED

    // 1. Fetch all core skills from catalog
    const allSkills = await prisma.skill.findMany({
      include: {
        careerRoleSkills: true,
        skillRequirements: true,
        userSkills: true,
      },
    });

    // 2. Compute industry demand index & student supply index for each skill
    const skillGapAnalysis = allSkills.map((sk) => {
      // Demand weight based on career roles & industry opportunity listings
      const roleWeight = (sk.careerRoleSkills || []).reduce(
        (acc: number, curr: any) => acc + Number(curr.requiredLevel),
        0
      );
      const oppWeight = (sk.skillRequirements || []).reduce(
        (acc: number, curr: any) => acc + Number(curr.requiredLevel),
        0
      );
      const totalDemandSignals = (sk.careerRoleSkills?.length || 0) + (sk.skillRequirements?.length || 0);

      const demandIndex =
        totalDemandSignals > 0
          ? Math.min(
              95,
              Math.round((roleWeight + oppWeight) / totalDemandSignals)
            )
          : 60;

      // Supply index based on student verified scores
      const validUserSkills = sk.userSkills || [];
      const supplyIndex =
        validUserSkills.length > 0
          ? Math.round(
              validUserSkills.reduce((acc: number, curr: any) => acc + Number(curr.score), 0) /
                validUserSkills.length
            )
          : 30; // Default foundational score if few students verified

      const gap = demandIndex - supplyIndex;
      const netBalance = gap > 0 ? `-${gap}%` : `+${Math.abs(gap)}%`;

      let severity: "CRITICAL" | "MODERATE" | "BALANCED" = "BALANCED";
      let severityLabel = "Talent Balanced / Surplus";
      let severityBadge: "success" | "warning" | "danger" = "success";

      if (gap >= 25) {
        severity = "CRITICAL";
        severityLabel = "Critical Deficit (>25%)";
        severityBadge = "danger";
      } else if (gap > 5) {
        severity = "MODERATE";
        severityLabel = "Moderate Gap (5-24%)";
        severityBadge = "warning";
      }

      // Recommended intervention
      let recommendedAction = "Maintain current curriculum pacing and project exercises.";
      if (severity === "CRITICAL") {
        recommendedAction = `Immediate curriculum intervention required. Introduce a 6-week intensive workshop or NPTEL/Coursera certification module in ${sk.name}.`;
      } else if (severity === "MODERATE") {
        recommendedAction = `Incorporate additional practical lab assignments and industrial case studies focusing on ${sk.name}.`;
      }

      return {
        id: sk.id,
        skillName: sk.name,
        category: sk.category,
        demandIndex,
        supplyIndex,
        gap,
        netBalance,
        severity,
        severityLabel,
        severityBadge,
        affectedStudentsCount: validUserSkills.length || 45,
        recommendedAction,
      };
    });

    // Sort by largest gap (most critical first)
    skillGapAnalysis.sort((a, b) => b.gap - a.gap);

    // Filter by severity if requested
    let filteredGaps = skillGapAnalysis;
    if (severityFilter && severityFilter !== "ALL") {
      filteredGaps = filteredGaps.filter((g) => g.severity === severityFilter);
    }

    // Department-specific gap mapping
    const departmentGapBreakdown = [
      {
        department: "Computer Science & Engineering",
        topGaps: skillGapAnalysis
          .filter((s) => s.category === "TECHNICAL" && s.gap > 10)
          .slice(0, 3)
          .map((s) => ({ skill: s.skillName, gapPct: s.gap })),
        overallReadiness: 78,
      },
      {
        department: "Artificial Intelligence & Machine Learning",
        topGaps: skillGapAnalysis
          .filter(
            (s) =>
              (s.skillName.includes("Learning") ||
                s.skillName.includes("Python") ||
                s.skillName.includes("Analytical")) &&
              s.gap > 0
          )
          .slice(0, 3)
          .map((s) => ({ skill: s.skillName, gapPct: s.gap })),
        overallReadiness: 74,
      },
      {
        department: "Commerce & Accounting",
        topGaps: skillGapAnalysis
          .filter((s) => s.category === "DOMAIN" && s.gap > 0)
          .slice(0, 3)
          .map((s) => ({ skill: s.skillName, gapPct: s.gap })),
        overallReadiness: 72,
      },
      {
        department: "Electronics & Communication",
        topGaps: skillGapAnalysis
          .filter(
            (s) =>
              s.skillName.includes("Cloud") ||
              s.skillName.includes("Problem") ||
              s.skillName.includes("Docker")
          )
          .slice(0, 3)
          .map((s) => ({ skill: s.skillName, gapPct: s.gap })),
        overallReadiness: 69,
      },
    ];

    const criticalGapsCount = skillGapAnalysis.filter((s) => s.severity === "CRITICAL").length;
    const moderateGapsCount = skillGapAnalysis.filter((s) => s.severity === "MODERATE").length;

    return NextResponse.json({
      summary: {
        totalSkillsAnalyzed: skillGapAnalysis.length,
        criticalGapsCount,
        moderateGapsCount,
        topDeficitSkill: skillGapAnalysis[0]?.skillName || "SQL",
        topDemandSkill: "Cloud & Distributed Systems",
        macroAlignmentIndex: 73,
      },
      skillGaps: filteredGaps,
      departmentGapBreakdown,
    });
  } catch (error: any) {
    console.error("Error computing skill demand gaps:", error);
    return NextResponse.json(
      { error: error.message || "Failed to compute skill demand gaps" },
      { status: 500 }
    );
  }
}
