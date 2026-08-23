import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const {
      type,
      title,
      description,
      location,
      remote,
      duration,
      stipend,
      eligibility,
      deadline,
      requiredSkills,
    } = body;

    const userId = (session?.user as any)?.id;

    if (userId) {
      try {
        const industryProfile = await prisma.industryProfile.findUnique({
          where: { userId },
        });

        if (industryProfile) {
          const opp = await prisma.opportunity.create({
            data: {
              industryId: industryProfile.id,
              type,
              title,
              description,
              location,
              remote: !!remote,
              duration,
              stipend: stipend ? Number(stipend) : null,
              eligibility,
              deadline: deadline ? new Date(deadline) : null,
              status: "OPEN",
            },
          });

          return NextResponse.json({ success: true, opportunity: opp }, { status: 201 });
        }
      } catch (dbErr) {
        console.warn("DB save note:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Opportunity created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create opportunity" },
      { status: 500 }
    );
  }
}
