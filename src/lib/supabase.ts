import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://example.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key";

// Server-side admin client for storage uploads and signed URL generation
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Upload a document to Supabase Storage bucket
 */
export async function uploadToStorage(
  bucket: "resumes" | "certificates" | "internship-documents" | "academic-documents" | "profile-images",
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error("Storage upload error:", err);
    return { data: null, error: err.message };
  }
}

/**
 * Generate a signed URL for private document access (e.g. resume)
 */
export async function getSignedDocumentUrl(
  bucket: string,
  filePath: string,
  expiresInSeconds: number = 3600
) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) throw error;
    return { url: data?.signedUrl || null, error: null };
  } catch (err: any) {
    console.error("Signed URL error:", err);
    return { url: null, error: err.message };
  }
}
