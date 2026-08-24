import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadToStorage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        industryProfile: true,
        institutionProfile: true,
        academicianProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = (formData.get("type") as string) || "avatar"; // "avatar", "resume", "certificate", "document", "logo"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validation: Max 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // MIME type validation
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ];

    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Only JPEG, PNG, WEBP, SVG, and PDF are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "bin";
    const filename = `${user.id}/${uploadType}-${Date.now()}.${ext}`;

    // Target bucket selection
    let bucket: "resumes" | "certificates" | "internship-documents" | "academic-documents" | "profile-images" = "profile-images";
    if (uploadType === "resume") bucket = "resumes";
    else if (uploadType === "certificate") bucket = "certificates";
    else if (uploadType === "document") bucket = "academic-documents";

    // Attempt storage upload
    const { data: uploadResult, error: uploadError } = await uploadToStorage(
      bucket,
      filename,
      buffer,
      file.type
    );

    // Construct URL or fallback URL
    const fileUrl = uploadResult?.path
      ? `${process.env.SUPABASE_URL || "https://example.supabase.co"}/storage/v1/object/public/${bucket}/${uploadResult.path}`
      : `data:${file.type};base64,${buffer.toString("base64")}`;

    // Save document record in UserDocument
    await prisma.userDocument.create({
      data: {
        userId: user.id,
        name: file.name,
        type: uploadType === "resume" ? "RESUME" : uploadType === "certificate" ? "CERTIFICATE" : "OTHER",
        storagePath: filename,
        mimeType: file.type,
        size: file.size,
        verified: false,
      },
    });

    // Automatically update the profile record with the new URL
    if (uploadType === "avatar") {
      await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: fileUrl },
      });
    } else if (uploadType === "resume" && user.studentProfile) {
      await prisma.studentProfile.update({
        where: { id: user.studentProfile.id },
        data: { resumeUrl: fileUrl },
      });
    } else if (uploadType === "logo") {
      if (user.industryProfile) {
        await prisma.industryProfile.update({
          where: { id: user.industryProfile.id },
          data: { logoUrl: fileUrl },
        });
      } else if (user.institutionProfile) {
        await prisma.institutionProfile.update({
          where: { id: user.institutionProfile.id },
          data: { logoUrl: fileUrl },
        });
      }
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      url: fileUrl,
      filename: file.name,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
