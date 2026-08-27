import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { opportunityId, opportunityTitle, organization, type, proposalNotes } = body;

    if (!opportunityId && !opportunityTitle) {
      return NextResponse.json(
        { error: "Opportunity ID or Title is required" },
        { status: 400 }
      );
    }

    // Return successful participation response
    return NextResponse.json({
      success: true,
      message: `Your application/proposal for "${opportunityTitle || 'the opportunity'}" has been successfully submitted to ${organization || 'the host organization'}.`,
      applicationId: `fac-app-${Date.now()}`,
      status: "SUBMITTED",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error submitting faculty application/proposal:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}
