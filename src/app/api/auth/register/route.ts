import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      role,
      institution,
      department,
      course,
      year,
      careerGoal,
      companyName,
      industry,
      website,
      size,
      description,
      designation,
      specialization,
      experience,
      institutionType,
      location,
    } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required registration fields" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in database
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and associated real profile
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        passwordHash,
        role,
        ...(role === "STUDENT" && {
          studentProfile: {
            create: {
              department: department || null,
              course: course || "B.Tech",
              year: year ? parseInt(year.toString(), 10) : null,
              careerGoal: careerGoal || null,
              portfolioSlug: `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`,
            },
          },
        }),
        ...(role === "INDUSTRY" && {
          industryProfile: {
            create: {
              companyName: companyName || name,
              industry: industry || "Technology",
              website: website || null,
              size: size || "100-500",
              description: description || null,
            },
          },
        }),
        ...(role === "INSTITUTION" && {
          institutionProfile: {
            create: {
              name: institution || name,
              type: institutionType || "University",
              location: location || "India",
            },
          },
        }),
        ...(role === "ACADEMICIAN" && {
          academicianProfile: {
            create: {
              department: department || "Computer Science",
              designation: designation || "Assistant Professor",
              specialization: specialization || null,
              experience: experience ? parseInt(experience.toString(), 10) : 0,
            },
          },
        }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Registration successful", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during registration" },
      { status: 500 }
    );
  }
}
