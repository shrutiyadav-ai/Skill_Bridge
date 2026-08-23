"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Building2,
  Briefcase,
  Users,
  Globe,
  Upload,
  Link as LinkIcon,
  Edit2,
  Check,
  Loader2,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Plus,
} from "lucide-react";

interface IndustryProfileViewProps {
  user: any;
  onRefresh: () => void;
}

export function IndustryProfileView({ user, onRefresh }: IndustryProfileViewProps) {
  const ip = user.industryProfile || {};

  const [editingBasic, setEditingBasic] = useState(false);
  const [editingRecruitment, setEditingRecruitment] = useState(false);
  const [editingCulture, setEditingCulture] = useState(false);
  const [editingLinks, setEditingLinks] = useState(false);

  const [basicForm, setBasicForm] = useState({
    companyName: ip.companyName || user.name || "",
    industry: ip.industry || "E-Commerce & Technology",
    website: ip.website || "",
    size: ip.size || "10000+ Employees",
    foundedYear: ip.foundedYear || 2007,
    headquarters: ip.headquarters || "Bengaluru, Karnataka",
    phone: ip.phone || user.phone || "",
    email: ip.email || user.email || "",
    description: ip.description || "",
  });

  const [recruitmentForm, setRecruitmentForm] = useState({
    hiringRoles: Array.isArray(ip.hiringRoles) ? ip.hiringRoles.join(", ") : ip.hiringRoles || "",
    preferredSkills: Array.isArray(ip.preferredSkills) ? ip.preferredSkills.join(", ") : ip.preferredSkills || "",
    experienceRequirements: ip.experienceRequirements || "Freshers (0-1 Yrs) & Experienced (1-3 Yrs)",
    preferredDepartments: Array.isArray(ip.preferredDepartments) ? ip.preferredDepartments.join(", ") : ip.preferredDepartments || "",
    workLocations: Array.isArray(ip.workLocations) ? ip.workLocations.join(", ") : ip.workLocations || "",
    workMode: ip.workMode || "HYBRID",
    internshipHiring: ip.internshipHiring ?? true,
    placementHiring: ip.placementHiring ?? true,
  });

  const [cultureForm, setCultureForm] = useState({
    mission: ip.mission || "",
    culture: ip.culture || "",
    areasOfExpertise: Array.isArray(ip.areasOfExpertise) ? ip.areasOfExpertise.join(", ") : ip.areasOfExpertise || "",
    technologies: Array.isArray(ip.technologies) ? ip.technologies.join(", ") : ip.technologies || "",
    benefits: Array.isArray(ip.benefits) ? ip.benefits.join(", ") : ip.benefits || "",
  });

  const [linksForm, setLinksForm] = useState({
    linkedinUrl: ip.linkedinUrl || "",
    twitterUrl: ip.twitterUrl || "",
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
        throw new Error(data.error || "Failed to update profile");
      }

      showFeedback("Company profile updated successfully");
      if (section === "basic") setEditingBasic(false);
      if (section === "recruitment") setEditingRecruitment(false);
      if (section === "culture") setEditingCulture(false);
      if (section === "links") setEditingLinks(false);
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
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Logo upload failed");
      showFeedback("Company logo uploaded");
      onRefresh();
    } catch (err: any) {
      showFeedback(err.message, "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold flex items-center gap-2 bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800">
          <Check className="h-4 w-4 shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* 1. Header Card with Logo & Quick Actions */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Logo */}
            <div className="relative group">
              <div className="h-24 w-24 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                {ip.logoUrl || user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ip.logoUrl || user.avatarUrl} alt={ip.companyName} className="h-full w-full object-cover" />
                ) : (
                  ip.companyName?.charAt(0) || "C"
                )}
              </div>
              <label
                htmlFor="logo-upload"
                className="absolute inset-0 rounded-xl bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-semibold"
              >
                <Upload className="h-4 w-4 mb-0.5" />
                <span>{uploadingLogo ? "..." : "Change"}</span>
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingLogo}
                onChange={handleLogoUpload}
              />
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {ip.companyName || user.name}
                </h2>
                <Badge variant="success" className="gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified Employer
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {ip.industry || "Industry"} • {ip.headquarters || "HQ Location"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>{ip.email || user.email}</span>
                {ip.website && <span>• {ip.website}</span>}
                {ip.size && <span>• {ip.size}</span>}
              </p>
            </div>

            {/* Quick Portal Navigation */}
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <Link href="/industry/opportunities/new" className="btn-primary text-xs py-2 px-4 text-center">
                <Plus className="h-3.5 w-3.5 mr-1" /> Post Opportunity
              </Link>
              <Link href="/industry/candidates" className="btn-outline text-xs py-1.5 text-center">
                <Users className="h-3.5 w-3.5 mr-1" /> Match Candidates
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Basic Company Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Company Overview</CardTitle>
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
                    name: basicForm.companyName,
                    industryData: { ...basicForm },
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
                <span className="text-xs font-semibold text-slate-400 uppercase block">Company Name</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                  {ip.companyName || user.name}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Industry Domain</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ip.industry || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Official Website</span>
                {ip.website ? (
                  <a
                    href={ip.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-navy-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" /> {ip.website}
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs italic mt-1 block">—</span>
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Headquarters</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ip.headquarters || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Company Size</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ip.size || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Founded Year</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ip.foundedYear || "—"}
                </span>
              </div>
              <div className="sm:col-span-2 md:col-span-3">
                <span className="text-xs font-semibold text-slate-400 uppercase block">About Company</span>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                  {ip.description || "No overview provided yet. Tell candidates about your business scale and innovation focus."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={basicForm.companyName}
                    onChange={(e) => setBasicForm({ ...basicForm, companyName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Domain
                  </label>
                  <input
                    type="text"
                    value={basicForm.industry}
                    onChange={(e) => setBasicForm({ ...basicForm, industry: e.target.value })}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    value={basicForm.headquarters}
                    onChange={(e) => setBasicForm({ ...basicForm, headquarters: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Size
                  </label>
                  <input
                    type="text"
                    value={basicForm.size}
                    onChange={(e) => setBasicForm({ ...basicForm, size: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    value={basicForm.foundedYear}
                    onChange={(e) => setBasicForm({ ...basicForm, foundedYear: parseInt(e.target.value, 10) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  About the Company
                </label>
                <textarea
                  rows={3}
                  value={basicForm.description}
                  onChange={(e) => setBasicForm({ ...basicForm, description: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Recruitment & Hiring Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Recruitment & Talent Acquisition Preferences</CardTitle>
          </div>
          {!editingRecruitment ? (
            <Button variant="outline" size="sm" onClick={() => setEditingRecruitment(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingRecruitment(false)} disabled={savingSection === "recruitment"}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "recruitment"}
                onClick={() =>
                  saveSection("recruitment", {
                    industryData: {
                      ...recruitmentForm,
                      hiringRoles: recruitmentForm.hiringRoles ? recruitmentForm.hiringRoles.split(",").map((s: string) => s.trim()) : [],
                      preferredSkills: recruitmentForm.preferredSkills ? recruitmentForm.preferredSkills.split(",").map((s: string) => s.trim()) : [],
                      preferredDepartments: recruitmentForm.preferredDepartments ? recruitmentForm.preferredDepartments.split(",").map((s: string) => s.trim()) : [],
                      workLocations: recruitmentForm.workLocations ? recruitmentForm.workLocations.split(",").map((s: string) => s.trim()) : [],
                    },
                  })
                }
              >
                {savingSection === "recruitment" && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!editingRecruitment ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Active Hiring Roles</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Array.isArray(ip.hiringRoles) && ip.hiringRoles.length > 0 ? (
                    ip.hiringRoles.map((r: string) => <Badge key={r} variant="default">{r}</Badge>)
                  ) : (
                    <span className="text-slate-400 text-xs italic">Not configured</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Preferred Skillsets</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Array.isArray(ip.preferredSkills) && ip.preferredSkills.length > 0 ? (
                    ip.preferredSkills.map((s: string) => <Badge key={s} variant="info">{s}</Badge>)
                  ) : (
                    <span className="text-slate-400 text-xs italic">Not configured</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Work Mode & Locations</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ip.workMode || "HYBRID"} • {Array.isArray(ip.workLocations) ? ip.workLocations.join(", ") : "Bengaluru, NCR, Hyderabad"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Hiring Programs</span>
                <div className="flex items-center gap-2 mt-1">
                  {ip.internshipHiring && <Badge variant="success">Internships Active</Badge>}
                  {ip.placementHiring && <Badge variant="info">Full-Time Placement Active</Badge>}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Hiring Roles (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SDE-1, Machine Learning Engineer, Data Analyst"
                    value={recruitmentForm.hiringRoles}
                    onChange={(e) => setRecruitmentForm({ ...recruitmentForm, hiringRoles: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Python, Java, React, SQL, Cloud Architecture"
                    value={recruitmentForm.preferredSkills}
                    onChange={(e) => setRecruitmentForm({ ...recruitmentForm, preferredSkills: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Mode
                  </label>
                  <select
                    value={recruitmentForm.workMode}
                    onChange={(e) => setRecruitmentForm({ ...recruitmentForm, workMode: e.target.value })}
                    className="input-field"
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">On-Site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Locations (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Bengaluru, Hyderabad, NCR"
                    value={recruitmentForm.workLocations}
                    onChange={(e) => setRecruitmentForm({ ...recruitmentForm, workLocations: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recruitmentForm.internshipHiring}
                    onChange={(e) => setRecruitmentForm({ ...recruitmentForm, internshipHiring: e.target.checked })}
                    className="rounded text-navy-600 focus:ring-navy-500"
                  />
                  Open for Internship Hiring
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recruitmentForm.placementHiring}
                    onChange={(e) => setRecruitmentForm({ ...recruitmentForm, placementHiring: e.target.checked })}
                    className="rounded text-navy-600 focus:ring-navy-500"
                  />
                  Open for Graduate Placement Hiring
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Company Culture, Technologies & Benefits */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <CardTitle>Culture, Mission & Tech Stack</CardTitle>
          </div>
          {!editingCulture ? (
            <Button variant="outline" size="sm" onClick={() => setEditingCulture(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingCulture(false)} disabled={savingSection === "culture"}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "culture"}
                onClick={() =>
                  saveSection("culture", {
                    industryData: {
                      ...cultureForm,
                      technologies: cultureForm.technologies ? cultureForm.technologies.split(",").map((s: string) => s.trim()) : [],
                      benefits: cultureForm.benefits ? cultureForm.benefits.split(",").map((s: string) => s.trim()) : [],
                      areasOfExpertise: cultureForm.areasOfExpertise ? cultureForm.areasOfExpertise.split(",").map((s: string) => s.trim()) : [],
                    },
                  })
                }
              >
                {savingSection === "culture" && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!editingCulture ? (
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Company Mission</span>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                  {ip.mission || "Our mission is to empower digital commerce and career innovation across India."}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Core Tech Stack</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Array.isArray(ip.technologies) && ip.technologies.length > 0 ? (
                    ip.technologies.map((t: string) => <Badge key={t} variant="default">{t}</Badge>)
                  ) : (
                    <span className="text-slate-400 text-xs italic">Python, React, PostgreSQL, Docker, AWS</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Benefits & Perks</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Array.isArray(ip.benefits) && ip.benefits.length > 0 ? (
                    ip.benefits.map((b: string) => <Badge key={b} variant="success">{b}</Badge>)
                  ) : (
                    <span className="text-slate-400 text-xs italic">Comprehensive Health Cover, Learning Stipend, Flexible Hours</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={2}
                  value={cultureForm.mission}
                  onChange={(e) => setCultureForm({ ...cultureForm, mission: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Core Technologies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, React, Next.js, Kubernetes"
                  value={cultureForm.technologies}
                  onChange={(e) => setCultureForm({ ...cultureForm, technologies: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Benefits & Perks (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Health Insurance, Mentorship, High Growth, Learning Allowance"
                  value={cultureForm.benefits}
                  onChange={(e) => setCultureForm({ ...cultureForm, benefits: e.target.value })}
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
