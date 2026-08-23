"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileCompletenessCard } from "@/components/profile/ProfileCompletenessCard";
import { StudentProfileView } from "@/components/profile/StudentProfileView";
import { IndustryProfileView } from "@/components/profile/IndustryProfileView";
import { InstitutionProfileView } from "@/components/profile/InstitutionProfileView";
import { AcademicianProfileView } from "@/components/profile/AcademicianProfileView";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to load profile data");
      }
      const data = await res.json();
      setProfileData(data);
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  if (status === "loading" || (loading && !profileData)) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-navy-600 dark:text-blue-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Loading your profile from Supabase...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profileData?.user) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto my-12 p-6 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/40 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-600 dark:text-rose-400 mx-auto" />
          <h3 className="font-bold text-base text-rose-900 dark:text-rose-200">
            Could not load profile
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300">
            {error || "Your user profile could not be located in Supabase."}
          </p>
          <Button variant="outline" size="sm" onClick={fetchProfile}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { user, completeness, missingSuggestions } = profileData;
  const role = user.role || (session?.user as any)?.role || "STUDENT";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage your personal credentials, professional history, and institutional visibility.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchProfile} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Profile Completeness Indicator */}
        <ProfileCompletenessCard
          completeness={completeness}
          missingSuggestions={missingSuggestions}
          updatedAt={user.updatedAt}
        />

        {/* Role-Specific View */}
        {role === "STUDENT" && (
          <StudentProfileView user={user} onRefresh={fetchProfile} />
        )}
        {role === "INDUSTRY" && (
          <IndustryProfileView user={user} onRefresh={fetchProfile} />
        )}
        {role === "INSTITUTION" && (
          <InstitutionProfileView user={user} onRefresh={fetchProfile} />
        )}
        {role === "ACADEMICIAN" && (
          <AcademicianProfileView user={user} onRefresh={fetchProfile} />
        )}
      </div>
    </DashboardLayout>
  );
}
