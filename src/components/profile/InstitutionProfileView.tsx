"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  GraduationCap,
  Building2,
  Users,
  Award,
  Upload,
  Globe,
  Link as LinkIcon,
  Edit2,
  Check,
  Loader2,
  ExternalLink,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

interface InstitutionProfileViewProps {
  user: any;
  onRefresh: () => void;
}

export function InstitutionProfileView({ user, onRefresh }: InstitutionProfileViewProps) {
  const inst = user.institutionProfile || {};

  const [editingBasic, setEditingBasic] = useState(false);
  const [editingAcademic, setEditingAcademic] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(false);

  const [basicForm, setBasicForm] = useState({
    name: inst.name || user.name || "",
    type: inst.type || "Institute of National Importance (INI)",
    location: inst.location || "Hauz Khas, New Delhi",
    phone: inst.phone || user.phone || "+91 11 2659 1000",
    email: inst.email || user.email || "admin@iitdelhi.ac.in",
    website: inst.website || "https://home.iitd.ac.in",
    about: inst.about || "",
    accreditation: inst.accreditation || "NIRF Rank #2 (Engineering), NAAC A++",
    establishedYear: inst.establishedYear || 1961,
  });

  const [academicForm, setAcademicForm] = useState({
    studentCount: inst.studentCount || 12500,
    facultyCount: inst.facultyCount || 680,
    departments: Array.isArray(inst.departments) ? inst.departments.join(", ") : inst.departments || "Computer Science, Electrical, Mechanical, AI School, Mathematics",
    programs: Array.isArray(inst.programs) ? inst.programs.join(", ") : inst.programs || "B.Tech, M.Tech, Dual Degree, PhD, Executive Programs",
    industryPartnershipsCount: inst.industryPartnershipsCount || 145,
  });

  const [placementForm, setPlacementForm] = useState({
    placementOfficerName: inst.placementOfficerName || "Dr. Rajesh Kumar",
    placementOfficerEmail: inst.placementOfficerEmail || "tnp@iitd.ac.in",
    placementOfficerPhone: inst.placementOfficerPhone || "+91 11 2659 7111",
    hasLiveProjects: inst.hasLiveProjects ?? true,
    hasWorkshops: inst.hasWorkshops ?? true,
    hasMentorship: inst.hasMentorship ?? true,
  });

  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showFeedback = (msg: string, type: "success" | "error" = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const saveSection = async (section: string, payload: any) => {
    setSavingSection(section);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update institution profile");
      }

      showFeedback("Institution profile updated successfully");
      if (section === "basic") setEditingBasic(false);
      if (section === "academic") setEditingAcademic(false);
      if (section === "placement") setEditingPlacement(false);
      onRefresh();
    } catch (err: any) {
      showFeedback(err.message || "Failed to save", "error");
    } finally {
      setSavingSection(null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "logo");

    setUploadingLogo(true);
    try {
      const res = await fetch("/api/profile/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Logo upload failed");
      showFeedback("Institution logo uploaded");
      onRefresh();
    } catch (err: any) {
      showFeedback(err.message, "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold flex items-center gap-2 bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800">
          <Check className="h-4 w-4 shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* 1. Header Card */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-xl bg-navy-100 dark:bg-navy-900 text-navy-700 dark:text-blue-300 flex items-center justify-center font-bold text-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                {inst.logoUrl || user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={inst.logoUrl || user.avatarUrl} alt={inst.name} className="h-full w-full object-cover" />
                ) : (
                  inst.name?.charAt(0) || "I"
                )}
              </div>
              <label
                htmlFor="inst-logo-upload"
                className="absolute inset-0 rounded-xl bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-semibold"
              >
                <Upload className="h-4 w-4 mb-0.5" />
                <span>{uploadingLogo ? "..." : "Change"}</span>
              </label>
              <input
                id="inst-logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingLogo}
                onChange={handleLogoUpload}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {inst.name || user.name}
                </h2>
                <Badge variant="info">{inst.type || "Institution"}</Badge>
                <Badge variant="success" className="gap-1">
                  <ShieldCheck className="h-3 w-3" /> Accredited
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {inst.location || "Location"} • Estd. {inst.establishedYear || "1961"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>{inst.email || user.email}</span>
                {inst.phone && <span>• {inst.phone}</span>}
                {inst.website && <span>• {inst.website}</span>}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <Link href="/institution/dashboard" className="btn-primary text-xs py-2 px-4 text-center">
                <BarChart3 className="h-3.5 w-3.5 mr-1" /> Analytics Portal
              </Link>
              {inst.website && (
                <a
                  href={inst.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline text-xs py-1.5 text-center flex items-center justify-center gap-1"
                >
                  <Globe className="h-3.5 w-3.5" /> Campus Portal
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Basic Institution Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Institution Profile</CardTitle>
          </div>
          {!editingBasic ? (
            <Button variant="outline" size="sm" onClick={() => setEditingBasic(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingBasic(false)} disabled={savingSection === "basic"}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "basic"}
                onClick={() =>
                  saveSection("basic", {
                    name: basicForm.name,
                    institutionData: { ...basicForm },
                  })
                }
              >
                {savingSection === "basic" && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!editingBasic ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Institution Name</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                  {inst.name || user.name}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Institution Type</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {inst.type || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Accreditation</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {inst.accreditation || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Campus Location</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {inst.location || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Established Year</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {inst.establishedYear || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Official Website</span>
                {inst.website ? (
                  <a
                    href={inst.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-navy-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" /> {inst.website}
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs italic mt-1 block">—</span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={basicForm.name}
                    onChange={(e) => setBasicForm({ ...basicForm, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution Category
                  </label>
                  <input
                    type="text"
                    value={basicForm.type}
                    onChange={(e) => setBasicForm({ ...basicForm, type: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Accreditation & Ranking
                  </label>
                  <input
                    type="text"
                    value={basicForm.accreditation}
                    onChange={(e) => setBasicForm({ ...basicForm, accreditation: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={basicForm.location}
                    onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    value={basicForm.establishedYear}
                    onChange={(e) => setBasicForm({ ...basicForm, establishedYear: parseInt(e.target.value, 10) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={basicForm.website}
                    onChange={(e) => setBasicForm({ ...basicForm, website: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Academic Departments & Demographics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Academic Demographics & Programs</CardTitle>
          </div>
          {!editingAcademic ? (
            <Button variant="outline" size="sm" onClick={() => setEditingAcademic(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingAcademic(false)} disabled={savingSection === "academic"}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "academic"}
                onClick={() =>
                  saveSection("academic", {
                    institutionData: {
                      studentCount: parseInt(academicForm.studentCount.toString(), 10),
                      facultyCount: parseInt(academicForm.facultyCount.toString(), 10),
                      industryPartnershipsCount: parseInt(academicForm.industryPartnershipsCount.toString(), 10),
                      departments: academicForm.departments ? academicForm.departments.split(",").map((s: string) => s.trim()) : [],
                      programs: academicForm.programs ? academicForm.programs.split(",").map((s: string) => s.trim()) : [],
                    },
                  })
                }
              >
                {savingSection === "academic" && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!editingAcademic ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Student Enrollment</span>
                <span className="font-mono font-bold text-2xl text-navy-900 dark:text-blue-300 mt-1 block">
                  {inst.studentCount?.toLocaleString() || "12,500"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Faculty Members</span>
                <span className="font-mono font-bold text-2xl text-navy-900 dark:text-blue-300 mt-1 block">
                  {inst.facultyCount || "680"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Industry MoUs & Partners</span>
                <span className="font-mono font-bold text-2xl text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {inst.industryPartnershipsCount || "145"}+
                </span>
              </div>
              <div className="sm:col-span-3">
                <span className="text-xs font-semibold text-slate-400 uppercase block">Departments</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Array.isArray(inst.departments) && inst.departments.length > 0 ? (
                    inst.departments.map((d: string) => <Badge key={d} variant="default">{d}</Badge>)
                  ) : (
                    <span className="text-slate-400 text-xs italic">Computer Science, Electrical, Mechanical, AI, Civil</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Enrollment Count
                  </label>
                  <input
                    type="number"
                    value={academicForm.studentCount}
                    onChange={(e) => setAcademicForm({ ...academicForm, studentCount: parseInt(e.target.value, 10) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faculty Count
                  </label>
                  <input
                    type="number"
                    value={academicForm.facultyCount}
                    onChange={(e) => setAcademicForm({ ...academicForm, facultyCount: parseInt(e.target.value, 10) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Partnerships
                  </label>
                  <input
                    type="number"
                    value={academicForm.industryPartnershipsCount}
                    onChange={(e) => setAcademicForm({ ...academicForm, industryPartnershipsCount: parseInt(e.target.value, 10) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Active Departments (comma separated)
                </label>
                <input
                  type="text"
                  value={academicForm.departments}
                  onChange={(e) => setAcademicForm({ ...academicForm, departments: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Placement Cell Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Training & Placement Office (TPO)</CardTitle>
          </div>
          {!editingPlacement ? (
            <Button variant="outline" size="sm" onClick={() => setEditingPlacement(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingPlacement(false)} disabled={savingSection === "placement"}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "placement"}
                onClick={() =>
                  saveSection("placement", {
                    institutionData: { ...placementForm },
                  })
                }
              >
                {savingSection === "placement" && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!editingPlacement ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Head of Placements</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                  {inst.placementOfficerName || "Dr. Rajesh Kumar"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">TPO Official Email</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {inst.placementOfficerEmail || "tnp@iitd.ac.in"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">TPO Phone</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {inst.placementOfficerPhone || "+91 11 2659 7111"}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Placement Officer Name
                </label>
                <input
                  type="text"
                  value={placementForm.placementOfficerName}
                  onChange={(e) => setPlacementForm({ ...placementForm, placementOfficerName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Placement Email
                </label>
                <input
                  type="email"
                  value={placementForm.placementOfficerEmail}
                  onChange={(e) => setPlacementForm({ ...placementForm, placementOfficerEmail: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Placement Contact Phone
                </label>
                <input
                  type="tel"
                  value={placementForm.placementOfficerPhone}
                  onChange={(e) => setPlacementForm({ ...placementForm, placementOfficerPhone: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
