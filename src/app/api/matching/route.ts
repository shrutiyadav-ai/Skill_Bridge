import { NextResponse } from "next/server";
import { calculateSkillMatch, calculateCareerReadiness } from "@/lib/matching";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentSkills, requirements } = body;

    const result = calculateSkillMatch(studentSkills || [], requirements || []);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to calculate skill match" },
      { status: 500 }
    );
  }
}
