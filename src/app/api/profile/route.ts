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

    const email = session.user.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            educations: { orderBy: { startYear: "desc" } },
            experiences: { orderBy: { startDate: "desc" } },
            projects: {
              include: {
                skills: {
                  include: { skill: true },
                },
              },
              orderBy: { createdAt: "desc" },
            },
            certifications: { orderBy: { createdAt: "desc" } },
          },
        },
        industryProfile: {
          include: {
            opportunities: { orderBy: { createdAt: "desc" } },
          },
        },
        institutionProfile: true,
        academicianProfile: {
          include: {
            publications: { orderBy: { year: "desc" } },
            researchProjects: { orderBy: { createdAt: "desc" } },
            patents: { orderBy: { createdAt: "desc" } },
          },
        },
        userSkills: {
          include: {
            skill: true,
          },
          orderBy: { score: "desc" },
        },
        achievements: { orderBy: { createdAt: "desc" } },
        documents: { orderBy: { uploadedAt: "desc" } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Dynamic Role-Specific Profile Completeness Engine
    let completeness = 0;
    const missingSuggestions: string[] = [];

    if (user.role === "STUDENT") {
      const sp = user.studentProfile;
      const checks = [
        { condition: !!user.name, weight: 10, msg: "Add full name" },
        { condition: !!user.avatarUrl, weight: 10, msg: "Upload profile photo" },
        { condition: !!(user.bio || sp?.bio), weight: 10, msg: "Add your bio" },
        { condition: !!(user.phone || sp?.phone), weight: 5, msg: "Add phone number" },
        { condition: !!(sp?.course && sp?.department), weight: 15, msg: "Complete degree & department" },
        { condition: !!sp?.careerGoal, weight: 10, msg: "Set your target career goal" },
        { condition: user.userSkills.length >= 3, weight: 15, msg: "Add at least 3 skills to your vector" },
        { condition: (sp?.projects?.length || 0) >= 1, weight: 10, msg: "Add your first project" },
        { condition: (sp?.educations?.length || 0) >= 1, weight: 5, msg: "Add education history" },
        { condition: !!sp?.resumeUrl, weight: 10, msg: "Upload your resume" },
      ];

      checks.forEach((c) => {
        if (c.condition) completeness += c.weight;
        else missingSuggestions.push(c.msg);
      });
    } else if (user.role === "INDUSTRY") {
      const ip = user.industryProfile;
      const checks = [
        { condition: !!ip?.companyName, weight: 15, msg: "Set company name" },
        { condition: !!(ip?.logoUrl || user.avatarUrl), weight: 10, msg: "Upload company logo" },
        { condition: !!ip?.website, weight: 10, msg: "Add official website" },
        { condition: !!ip?.description, weight: 15, msg: "Add company overview" },
        { condition: !!ip?.industry, weight: 10, msg: "Select industry domain" },
        { condition: !!ip?.size, weight: 5, msg: "Set company size" },
        { condition: !!ip?.headquarters, weight: 10, msg: "Add headquarters location" },
        { condition: Array.isArray(ip?.hiringRoles) && (ip?.hiringRoles as any[]).length > 0, weight: 15, msg: "List target hiring roles" },
        { condition: !!ip?.mission, weight: 10, msg: "Add company mission & values" },
      ];

      checks.forEach((c) => {
        if (c.condition) completeness += c.weight;
        else missingSuggestions.push(c.msg);
      });
    } else if (user.role === "INSTITUTION") {
      const inst = user.institutionProfile;
      const checks = [
        { condition: !!inst?.name, weight: 15, msg: "Add institution name" },
        { condition: !!(inst?.logoUrl || user.avatarUrl), weight: 10, msg: "Upload institution logo" },
        { condition: !!inst?.type, weight: 10, msg: "Select institution category" },
        { condition: !!inst?.location, weight: 10, msg: "Add campus location" },
        { condition: !!inst?.about, weight: 15, msg: "Add about description" },
        { condition: !!inst?.website, weight: 10, msg: "Add institution portal URL" },
        { condition: !!inst?.accreditation, weight: 10, msg: "Specify accreditation details" },
        { condition: !!inst?.placementOfficerName, weight: 10, msg: "Add placement cell contact" },
        { condition: (inst?.studentCount || 0) > 0, weight: 10, msg: "Update student enrollment count" },
      ];

      checks.forEach((c) => {
        if (c.condition) completeness += c.weight;
        else missingSuggestions.push(c.msg);
      });
    } else if (user.role === "ACADEMICIAN") {
      const ap = user.academicianProfile;
      const checks = [
        { condition: !!user.name, weight: 10, msg: "Add full name" },
        { condition: !!user.avatarUrl, weight: 10, msg: "Upload profile photo" },
        { condition: !!ap?.designation, weight: 10, msg: "Set academic designation" },
        { condition: !!ap?.department, weight: 10, msg: "Set department" },
        { condition: !!ap?.specialization, weight: 10, msg: "Add research specialization" },
        { condition: !!(user.bio || ap?.bio), weight: 10, msg: "Add faculty biography" },
        { condition: (ap?.publications?.length || 0) >= 1, weight: 15, msg: "Add research publications" },
        { condition: (ap?.researchProjects?.length || 0) >= 1, weight: 10, msg: "Add research projects" },
        { condition: !!ap?.googleScholarUrl || !!ap?.orcidUrl, weight: 15, msg: "Link Google Scholar / ORCID" },
      ];

      checks.forEach((c) => {
        if (c.condition) completeness += c.weight;
        else missingSuggestions.push(c.msg);
      });
    }

    completeness = Math.min(100, Math.max(0, completeness));

    return NextResponse.json({
      user,
      completeness,
      missingSuggestions,
    });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();
    const body = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        industryProfile: true,
        institutionProfile: true,
        academicianProfile: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Update Core User Fields
    const {
      name,
      phone,
      location,
      bio,
      avatarUrl,
      // Role-specific payload data
      studentData,
      industryData,
      institutionData,
      academicianData,
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(location !== undefined && { location: location?.trim() || null }),
        ...(bio !== undefined && { bio: bio?.trim() || null }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        // Role updates
        ...(existingUser.role === "STUDENT" && studentData && {
          studentProfile: {
            upsert: {
              create: {
                course: studentData.course || null,
                department: studentData.department || null,
                institutionName: studentData.institutionName || null,
                year: studentData.year ? parseInt(studentData.year.toString(), 10) : null,
                semester: studentData.semester ? parseInt(studentData.semester.toString(), 10) : null,
                graduationYear: studentData.graduationYear ? parseInt(studentData.graduationYear.toString(), 10) : null,
                cgpa: studentData.cgpa ? parseFloat(studentData.cgpa.toString()) : null,
                gender: studentData.gender || null,
                dob: studentData.dob ? new Date(studentData.dob) : null,
                careerGoal: studentData.careerGoal || null,
                preferredRoles: studentData.preferredRoles || null,
                preferredIndustries: studentData.preferredIndustries || null,
                preferredLocations: studentData.preferredLocations || null,
                workModePreference: studentData.workModePreference || "HYBRID",
                githubUrl: studentData.githubUrl || null,
                linkedinUrl: studentData.linkedinUrl || null,
                portfolioUrl: studentData.portfolioUrl || null,
                resumeUrl: studentData.resumeUrl || null,
                isPublic: studentData.isPublic ?? true,
                publicFields: studentData.publicFields || null,
              },
              update: {
                ...(studentData.course !== undefined && { course: studentData.course }),
                ...(studentData.department !== undefined && { department: studentData.department }),
                ...(studentData.institutionName !== undefined && { institutionName: studentData.institutionName }),
                ...(studentData.year !== undefined && { year: studentData.year ? parseInt(studentData.year.toString(), 10) : null }),
                ...(studentData.semester !== undefined && { semester: studentData.semester ? parseInt(studentData.semester.toString(), 10) : null }),
                ...(studentData.graduationYear !== undefined && { graduationYear: studentData.graduationYear ? parseInt(studentData.graduationYear.toString(), 10) : null }),
                ...(studentData.cgpa !== undefined && { cgpa: studentData.cgpa ? parseFloat(studentData.cgpa.toString()) : null }),
                ...(studentData.gender !== undefined && { gender: studentData.gender }),
                ...(studentData.dob !== undefined && { dob: studentData.dob ? new Date(studentData.dob) : null }),
                ...(studentData.careerGoal !== undefined && { careerGoal: studentData.careerGoal }),
                ...(studentData.preferredRoles !== undefined && { preferredRoles: studentData.preferredRoles }),
                ...(studentData.preferredIndustries !== undefined && { preferredIndustries: studentData.preferredIndustries }),
                ...(studentData.preferredLocations !== undefined && { preferredLocations: studentData.preferredLocations }),
                ...(studentData.workModePreference !== undefined && { workModePreference: studentData.workModePreference }),
                ...(studentData.githubUrl !== undefined && { githubUrl: studentData.githubUrl }),
                ...(studentData.linkedinUrl !== undefined && { linkedinUrl: studentData.linkedinUrl }),
                ...(studentData.portfolioUrl !== undefined && { portfolioUrl: studentData.portfolioUrl }),
                ...(studentData.resumeUrl !== undefined && { resumeUrl: studentData.resumeUrl }),
                ...(studentData.isPublic !== undefined && { isPublic: studentData.isPublic }),
                ...(studentData.publicFields !== undefined && { publicFields: studentData.publicFields }),
              },
            },
          },
        }),
        ...(existingUser.role === "INDUSTRY" && industryData && {
          industryProfile: {
            upsert: {
              create: {
                companyName: industryData.companyName || existingUser.name,
                industry: industryData.industry || "Technology",
                website: industryData.website || null,
                size: industryData.size || "100-500",
                foundedYear: industryData.foundedYear ? parseInt(industryData.foundedYear.toString(), 10) : null,
                headquarters: industryData.headquarters || null,
                phone: industryData.phone || null,
                email: industryData.email || null,
                description: industryData.description || null,
                mission: industryData.mission || null,
                culture: industryData.culture || null,
                logoUrl: industryData.logoUrl || null,
                hiringRoles: industryData.hiringRoles || null,
                preferredSkills: industryData.preferredSkills || null,
                experienceRequirements: industryData.experienceRequirements || null,
                preferredDepartments: industryData.preferredDepartments || null,
                workLocations: industryData.workLocations || null,
                workMode: industryData.workMode || "HYBRID",
                internshipHiring: industryData.internshipHiring ?? true,
                placementHiring: industryData.placementHiring ?? true,
                areasOfExpertise: industryData.areasOfExpertise || null,
                technologies: industryData.technologies || null,
                benefits: industryData.benefits || null,
                linkedinUrl: industryData.linkedinUrl || null,
                twitterUrl: industryData.twitterUrl || null,
                otherLinks: industryData.otherLinks || null,
              },
              update: {
                ...(industryData.companyName !== undefined && { companyName: industryData.companyName }),
                ...(industryData.industry !== undefined && { industry: industryData.industry }),
                ...(industryData.website !== undefined && { website: industryData.website }),
                ...(industryData.size !== undefined && { size: industryData.size }),
                ...(industryData.foundedYear !== undefined && { foundedYear: industryData.foundedYear ? parseInt(industryData.foundedYear.toString(), 10) : null }),
                ...(industryData.headquarters !== undefined && { headquarters: industryData.headquarters }),
                ...(industryData.phone !== undefined && { phone: industryData.phone }),
                ...(industryData.email !== undefined && { email: industryData.email }),
                ...(industryData.description !== undefined && { description: industryData.description }),
                ...(industryData.mission !== undefined && { mission: industryData.mission }),
                ...(industryData.culture !== undefined && { culture: industryData.culture }),
                ...(industryData.logoUrl !== undefined && { logoUrl: industryData.logoUrl }),
                ...(industryData.hiringRoles !== undefined && { hiringRoles: industryData.hiringRoles }),
                ...(industryData.preferredSkills !== undefined && { preferredSkills: industryData.preferredSkills }),
                ...(industryData.experienceRequirements !== undefined && { experienceRequirements: industryData.experienceRequirements }),
                ...(industryData.preferredDepartments !== undefined && { preferredDepartments: industryData.preferredDepartments }),
                ...(industryData.workLocations !== undefined && { workLocations: industryData.workLocations }),
                ...(industryData.workMode !== undefined && { workMode: industryData.workMode }),
                ...(industryData.internshipHiring !== undefined && { internshipHiring: industryData.internshipHiring }),
                ...(industryData.placementHiring !== undefined && { placementHiring: industryData.placementHiring }),
                ...(industryData.areasOfExpertise !== undefined && { areasOfExpertise: industryData.areasOfExpertise }),
                ...(industryData.technologies !== undefined && { technologies: industryData.technologies }),
                ...(industryData.benefits !== undefined && { benefits: industryData.benefits }),
                ...(industryData.linkedinUrl !== undefined && { linkedinUrl: industryData.linkedinUrl }),
                ...(industryData.twitterUrl !== undefined && { twitterUrl: industryData.twitterUrl }),
                ...(industryData.otherLinks !== undefined && { otherLinks: industryData.otherLinks }),
              },
            },
          },
        }),
        ...(existingUser.role === "INSTITUTION" && institutionData && {
          institutionProfile: {
            upsert: {
              create: {
                name: institutionData.name || existingUser.name,
                type: institutionData.type || "University",
                location: institutionData.location || null,
                phone: institutionData.phone || null,
                email: institutionData.email || null,
                website: institutionData.website || null,
                about: institutionData.about || null,
                logoUrl: institutionData.logoUrl || null,
                accreditation: institutionData.accreditation || null,
                affiliation: institutionData.affiliation || null,
                establishedYear: institutionData.establishedYear ? parseInt(institutionData.establishedYear.toString(), 10) : null,
                studentCount: institutionData.studentCount ? parseInt(institutionData.studentCount.toString(), 10) : null,
                facultyCount: institutionData.facultyCount ? parseInt(institutionData.facultyCount.toString(), 10) : null,
                departments: institutionData.departments || null,
                programs: institutionData.programs || null,
                placementOfficerName: institutionData.placementOfficerName || null,
                placementOfficerEmail: institutionData.placementOfficerEmail || null,
                placementOfficerPhone: institutionData.placementOfficerPhone || null,
                placementStats: institutionData.placementStats || null,
                internshipStats: institutionData.internshipStats || null,
                industryPartnershipsCount: institutionData.industryPartnershipsCount ? parseInt(institutionData.industryPartnershipsCount.toString(), 10) : 0,
                collabAreas: institutionData.collabAreas || null,
                hasLiveProjects: institutionData.hasLiveProjects ?? true,
                hasWorkshops: institutionData.hasWorkshops ?? true,
                hasMentorship: institutionData.hasMentorship ?? true,
                linkedinUrl: institutionData.linkedinUrl || null,
                twitterUrl: institutionData.twitterUrl || null,
              },
              update: {
                ...(institutionData.name !== undefined && { name: institutionData.name }),
                ...(institutionData.type !== undefined && { type: institutionData.type }),
                ...(institutionData.location !== undefined && { location: institutionData.location }),
                ...(institutionData.phone !== undefined && { phone: institutionData.phone }),
                ...(institutionData.email !== undefined && { email: institutionData.email }),
                ...(institutionData.website !== undefined && { website: institutionData.website }),
                ...(institutionData.about !== undefined && { about: institutionData.about }),
                ...(institutionData.logoUrl !== undefined && { logoUrl: institutionData.logoUrl }),
                ...(institutionData.accreditation !== undefined && { accreditation: institutionData.accreditation }),
                ...(institutionData.affiliation !== undefined && { affiliation: institutionData.affiliation }),
                ...(institutionData.establishedYear !== undefined && { establishedYear: institutionData.establishedYear ? parseInt(institutionData.establishedYear.toString(), 10) : null }),
                ...(institutionData.studentCount !== undefined && { studentCount: institutionData.studentCount ? parseInt(institutionData.studentCount.toString(), 10) : null }),
                ...(institutionData.facultyCount !== undefined && { facultyCount: institutionData.facultyCount ? parseInt(institutionData.facultyCount.toString(), 10) : null }),
                ...(institutionData.departments !== undefined && { departments: institutionData.departments }),
                ...(institutionData.programs !== undefined && { programs: institutionData.programs }),
                ...(institutionData.placementOfficerName !== undefined && { placementOfficerName: institutionData.placementOfficerName }),
                ...(institutionData.placementOfficerEmail !== undefined && { placementOfficerEmail: institutionData.placementOfficerEmail }),
                ...(institutionData.placementOfficerPhone !== undefined && { placementOfficerPhone: institutionData.placementOfficerPhone }),
                ...(institutionData.placementStats !== undefined && { placementStats: institutionData.placementStats }),
                ...(institutionData.internshipStats !== undefined && { internshipStats: institutionData.internshipStats }),
                ...(institutionData.industryPartnershipsCount !== undefined && { industryPartnershipsCount: institutionData.industryPartnershipsCount ? parseInt(institutionData.industryPartnershipsCount.toString(), 10) : 0 }),
                ...(institutionData.collabAreas !== undefined && { collabAreas: institutionData.collabAreas }),
                ...(institutionData.hasLiveProjects !== undefined && { hasLiveProjects: institutionData.hasLiveProjects }),
                ...(institutionData.hasWorkshops !== undefined && { hasWorkshops: institutionData.hasWorkshops }),
                ...(institutionData.hasMentorship !== undefined && { hasMentorship: institutionData.hasMentorship }),
                ...(institutionData.linkedinUrl !== undefined && { linkedinUrl: institutionData.linkedinUrl }),
                ...(institutionData.twitterUrl !== undefined && { twitterUrl: institutionData.twitterUrl }),
              },
            },
          },
        }),
        ...(existingUser.role === "ACADEMICIAN" && academicianData && {
          academicianProfile: {
            upsert: {
              create: {
                department: academicianData.department || "Computer Science",
                designation: academicianData.designation || "Assistant Professor",
                institutionName: academicianData.institutionName || null,
                specialization: academicianData.specialization || null,
                highestQualification: academicianData.highestQualification || null,
                experience: academicianData.experience ? parseInt(academicianData.experience.toString(), 10) : 0,
                phone: academicianData.phone || null,
                location: academicianData.location || null,
                bio: academicianData.bio || null,
                areasOfExpertise: academicianData.areasOfExpertise || null,
                researchInterests: academicianData.researchInterests || null,
                subjectsTaught: academicianData.subjectsTaught || null,
                technicalSkills: academicianData.technicalSkills || null,
                fdpsAttendedCount: academicianData.fdpsAttendedCount ? parseInt(academicianData.fdpsAttendedCount.toString(), 10) : 0,
                fdpsConductedCount: academicianData.fdpsConductedCount ? parseInt(academicianData.fdpsConductedCount.toString(), 10) : 0,
                industryExperienceYears: academicianData.industryExperienceYears ? parseInt(academicianData.industryExperienceYears.toString(), 10) : 0,
                openForConsultancy: academicianData.openForConsultancy ?? true,
                openForResearch: academicianData.openForResearch ?? true,
                openForFDP: academicianData.openForFDP ?? true,
                openForMentorship: academicianData.openForMentorship ?? true,
                openForFacultyInternship: academicianData.openForFacultyInternship ?? true,
                googleScholarUrl: academicianData.googleScholarUrl || null,
                orcidUrl: academicianData.orcidUrl || null,
                linkedinUrl: academicianData.linkedinUrl || null,
                researchGateUrl: academicianData.researchGateUrl || null,
                personalWebsiteUrl: academicianData.personalWebsiteUrl || null,
              },
              update: {
                ...(academicianData.department !== undefined && { department: academicianData.department }),
                ...(academicianData.designation !== undefined && { designation: academicianData.designation }),
                ...(academicianData.institutionName !== undefined && { institutionName: academicianData.institutionName }),
                ...(academicianData.specialization !== undefined && { specialization: academicianData.specialization }),
                ...(academicianData.highestQualification !== undefined && { highestQualification: academicianData.highestQualification }),
                ...(academicianData.experience !== undefined && { experience: academicianData.experience ? parseInt(academicianData.experience.toString(), 10) : 0 }),
                ...(academicianData.phone !== undefined && { phone: academicianData.phone }),
                ...(academicianData.location !== undefined && { location: academicianData.location }),
                ...(academicianData.bio !== undefined && { bio: academicianData.bio }),
                ...(academicianData.areasOfExpertise !== undefined && { areasOfExpertise: academicianData.areasOfExpertise }),
                ...(academicianData.researchInterests !== undefined && { researchInterests: academicianData.researchInterests }),
                ...(academicianData.subjectsTaught !== undefined && { subjectsTaught: academicianData.subjectsTaught }),
                ...(academicianData.technicalSkills !== undefined && { technicalSkills: academicianData.technicalSkills }),
                ...(academicianData.fdpsAttendedCount !== undefined && { fdpsAttendedCount: academicianData.fdpsAttendedCount ? parseInt(academicianData.fdpsAttendedCount.toString(), 10) : 0 }),
                ...(academicianData.fdpsConductedCount !== undefined && { fdpsConductedCount: academicianData.fdpsConductedCount ? parseInt(academicianData.fdpsConductedCount.toString(), 10) : 0 }),
                ...(academicianData.industryExperienceYears !== undefined && { industryExperienceYears: academicianData.industryExperienceYears ? parseInt(academicianData.industryExperienceYears.toString(), 10) : 0 }),
                ...(academicianData.openForConsultancy !== undefined && { openForConsultancy: academicianData.openForConsultancy }),
                ...(academicianData.openForResearch !== undefined && { openForResearch: academicianData.openForResearch }),
                ...(academicianData.openForFDP !== undefined && { openForFDP: academicianData.openForFDP }),
                ...(academicianData.openForMentorship !== undefined && { openForMentorship: academicianData.openForMentorship }),
                ...(academicianData.openForFacultyInternship !== undefined && { openForFacultyInternship: academicianData.openForFacultyInternship }),
                ...(academicianData.googleScholarUrl !== undefined && { googleScholarUrl: academicianData.googleScholarUrl }),
                ...(academicianData.orcidUrl !== undefined && { orcidUrl: academicianData.orcidUrl }),
                ...(academicianData.linkedinUrl !== undefined && { linkedinUrl: academicianData.linkedinUrl }),
                ...(academicianData.researchGateUrl !== undefined && { researchGateUrl: academicianData.researchGateUrl }),
                ...(academicianData.personalWebsiteUrl !== undefined && { personalWebsiteUrl: academicianData.personalWebsiteUrl }),
              },
            },
          },
        }),
      },
      include: {
        studentProfile: true,
        industryProfile: true,
        institutionProfile: true,
        academicianProfile: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
