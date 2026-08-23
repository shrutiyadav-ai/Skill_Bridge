"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  SubRecordModal,
  SubRecordType,
} from "@/components/profile/SubRecordModal";
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  FileText,
  Upload,
  Link as LinkIcon,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StudentProfileViewProps {
  user: any;
  onRefresh: () => void;
}

export function StudentProfileView({ user, onRefresh }: StudentProfileViewProps) {
  const sp = user.studentProfile || {};

  // Section editing states
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingAcademic, setEditingAcademic] = useState(false);
  const [editingCareer, setEditingCareer] = useState(false);
  const [editingLinks, setEditingLinks] = useState(false);

  // Form states
  const [basicForm, setBasicForm] = useState({
    name: user.name || "",
    phone: user.phone || sp.phone || "",
    location: user.location || sp.location || "",
    bio: user.bio || sp.bio || "",
    gender: sp.gender || "PREFER_NOT_TO_SAY",
    dob: sp.dob ? sp.dob.slice(0, 10) : "",
  });

  const [academicForm, setAcademicForm] = useState({
    institutionName: sp.institutionName || "",
    course: sp.course || "",
    department: sp.department || "",
    year: sp.year || 3,
    semester: sp.semester || 5,
    cgpa: sp.cgpa || "",
    graduationYear: sp.graduationYear || 2026,
  });

  const [careerForm, setCareerForm] = useState({
    careerGoal: sp.careerGoal || "",
    preferredRoles: Array.isArray(sp.preferredRoles) ? sp.preferredRoles.join(", ") : sp.preferredRoles || "",
    preferredIndustries: Array.isArray(sp.preferredIndustries) ? sp.preferredIndustries.join(", ") : sp.preferredIndustries || "",
    preferredLocations: Array.isArray(sp.preferredLocations) ? sp.preferredLocations.join(", ") : sp.preferredLocations || "",
    workModePreference: sp.workModePreference || "HYBRID",
  });

  const [linksForm, setLinksForm] = useState({
    githubUrl: sp.githubUrl || "",
    linkedinUrl: sp.linkedinUrl || "",
    portfolioUrl: sp.portfolioUrl || "",
  });

  // Modal sub-records state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<SubRecordType>("project");
  const [editingSubRecord, setEditingSubRecord] = useState<any>(null);

  // Loading & feedback states
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showFeedback = (msg: string, type: "success" | "error" = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Section Save handler
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

      showFeedback("Section updated successfully");
      if (section === "basic") setEditingBasic(false);
      if (section === "academic") setEditingAcademic(false);
      if (section === "career") setEditingCareer(false);
      if (section === "links") setEditingLinks(false);
      onRefresh();
    } catch (err: any) {
      showFeedback(err.message || "Failed to save changes", "error");
    } finally {
      setSavingSection(null);
    }
  };

  // Sub-record modal save
  const handleSaveSubRecord = async (type: SubRecordType, data: any, id?: string) => {
    const method = id ? "PUT" : "POST";
    const res = await fetch("/api/profile/sub-records", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, data }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to save sub-record");
    }

    showFeedback("Record saved successfully");
    onRefresh();
  };

  // Sub-record delete
  const handleDeleteSubRecord = async (type: SubRecordType, id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`/api/profile/sub-records?type=${type}&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete record");
      showFeedback("Record deleted");
      onRefresh();
    } catch (err: any) {
      showFeedback(err.message, "error");
    }
  };

  // Resume / Avatar upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "resume") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);

    if (type === "avatar") setUploadingAvatar(true);
    if (type === "resume") setUploadingResume(true);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      showFeedback(`${type === "avatar" ? "Photo" : "Resume"} uploaded successfully`);
      onRefresh();
    } catch (err: any) {
      showFeedback(err.message || "Upload failed", "error");
    } finally {
      setUploadingAvatar(false);
      setUploadingResume(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800"
          }`}
        >
          <Check className="h-4 w-4 shrink-0" />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* 1. Header Card with Photo & Summary */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar with upload */}
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-navy-100 dark:bg-navy-900 text-navy-700 dark:text-blue-300 flex items-center justify-center font-bold text-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name?.charAt(0) || "S"
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 rounded-full bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-semibold"
              >
                <Upload className="h-4 w-4 mb-0.5" />
                <span>{uploadingAvatar ? "..." : "Change"}</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingAvatar}
                onChange={(e) => handleFileUpload(e, "avatar")}
              />
            </div>

            {/* Profile Intro */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.name}
                </h2>
                <Badge variant="info">Student</Badge>
                {sp.portfolioSlug && (
                  <Badge variant="default" className="font-mono text-[10px]">
                    sb/{sp.portfolioSlug}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {sp.course || "Degree not set"} • {sp.department || "Specialization not set"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>{user.email}</span>
                {user.phone && <span>• {user.phone}</span>}
                {user.location && <span>• {user.location}</span>}
              </p>
            </div>

            {/* Resume Action */}
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <label className="btn-primary flex items-center justify-center gap-2 cursor-pointer text-xs py-2 px-4">
                <Upload className="h-3.5 w-3.5" />
                <span>{uploadingResume ? "Uploading..." : sp.resumeUrl ? "Replace Resume" : "Upload Resume"}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  disabled={uploadingResume}
                  onChange={(e) => handleFileUpload(e, "resume")}
                />
              </label>
              {sp.resumeUrl && (
                <a
                  href={sp.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center justify-center gap-1.5 text-xs py-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Resume</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Basic Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Basic Information</CardTitle>
          </div>
          {!editingBasic ? (
            <Button variant="outline" size="sm" onClick={() => setEditingBasic(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingBasic(false)}
                disabled={savingSection === "basic"}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "basic"}
                onClick={() =>
                  saveSection("basic", {
                    name: basicForm.name,
                    phone: basicForm.phone,
                    location: basicForm.location,
                    bio: basicForm.bio,
                    studentData: {
                      gender: basicForm.gender,
                      dob: basicForm.dob,
                    },
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
                <span className="text-xs font-semibold text-slate-400 uppercase block">Full Name</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {user.name || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Email Address</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {user.email || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Phone Number</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {user.phone || sp.phone || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Location</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {user.location || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Gender</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {sp.gender || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Date of Birth</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {sp.dob ? formatDate(sp.dob) : "—"}
                </span>
              </div>
              <div className="sm:col-span-2 md:col-span-3">
                <span className="text-xs font-semibold text-slate-400 uppercase block">About / Bio</span>
                <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                  {user.bio || sp.bio || "No bio added yet. Tell potential recruiters and collaborators about your passion and focus areas."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={basicForm.phone}
                    onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="New Delhi, India"
                    value={basicForm.location}
                    onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={basicForm.gender}
                    onChange={(e) => setBasicForm({ ...basicForm, gender: e.target.value })}
                    className="input-field"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-Binary</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={basicForm.dob}
                    onChange={(e) => setBasicForm({ ...basicForm, dob: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / About Me
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a short summary about your background, career aspirations, and core strengths..."
                  value={basicForm.bio}
                  onChange={(e) => setBasicForm({ ...basicForm, bio: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Academic Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Academic Information</CardTitle>
          </div>
          {!editingAcademic ? (
            <Button variant="outline" size="sm" onClick={() => setEditingAcademic(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingAcademic(false)}
                disabled={savingSection === "academic"}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "academic"}
                onClick={() =>
                  saveSection("academic", {
                    studentData: { ...academicForm },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Institution</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {sp.institutionName || user.institutionProfile?.name || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Degree / Course</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {sp.course || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Department / Branch</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {sp.department || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Academic Year / Sem</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {sp.year ? `Year ${sp.year} (Sem ${sp.semester || (sp.year * 2 - 1)})` : "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">CGPA / Grade</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                  {sp.cgpa ? `${sp.cgpa} / 10.0` : "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Expected Graduation</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {sp.graduationYear || "—"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution / University Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Delhi"
                    value={academicForm.institutionName}
                    onChange={(e) => setAcademicForm({ ...academicForm, institutionName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree / Course
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech"
                    value={academicForm.course}
                    onChange={(e) => setAcademicForm({ ...academicForm, course: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department / Branch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={academicForm.department}
                    onChange={(e) => setAcademicForm({ ...academicForm, department: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Year
                  </label>
                  <select
                    value={academicForm.year}
                    onChange={(e) => setAcademicForm({ ...academicForm, year: parseInt(e.target.value, 10) })}
                    className="input-field"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={academicForm.semester}
                    onChange={(e) => setAcademicForm({ ...academicForm, semester: parseInt(e.target.value, 10) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={10}
                    placeholder="8.85"
                    value={academicForm.cgpa}
                    onChange={(e) => setAcademicForm({ ...academicForm, cgpa: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    placeholder="2026"
                    value={academicForm.graduationYear}
                    onChange={(e) => setAcademicForm({ ...academicForm, graduationYear: parseInt(e.target.value, 10) })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Career Preferences Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Career Goals & Preferences</CardTitle>
          </div>
          {!editingCareer ? (
            <Button variant="outline" size="sm" onClick={() => setEditingCareer(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingCareer(false)}
                disabled={savingSection === "career"}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "career"}
                onClick={() =>
                  saveSection("career", {
                    studentData: {
                      careerGoal: careerForm.careerGoal,
                      preferredRoles: careerForm.preferredRoles ? careerForm.preferredRoles.split(",").map((s: string) => s.trim()) : [],
                      preferredIndustries: careerForm.preferredIndustries ? careerForm.preferredIndustries.split(",").map((s: string) => s.trim()) : [],
                      preferredLocations: careerForm.preferredLocations ? careerForm.preferredLocations.split(",").map((s: string) => s.trim()) : [],
                      workModePreference: careerForm.workModePreference,
                    },
                  })
                }
              >
                {savingSection === "career" && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {!editingCareer ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Target Career Goal</span>
                <span className="font-semibold text-navy-800 dark:text-blue-300 mt-1 block">
                  {sp.careerGoal || "—"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Work Mode Preference</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {sp.workModePreference || "HYBRID"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Preferred Roles</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Array.isArray(sp.preferredRoles) && sp.preferredRoles.length > 0 ? (
                    sp.preferredRoles.map((r: string) => <Badge key={r} variant="default">{r}</Badge>)
                  ) : (
                    <span className="text-slate-400 text-xs italic">Not specified</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Preferred Locations</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Array.isArray(sp.preferredLocations) && sp.preferredLocations.length > 0 ? (
                    sp.preferredLocations.map((loc: string) => <Badge key={loc} variant="info">{loc}</Badge>)
                  ) : (
                    <span className="text-slate-400 text-xs italic">Flexible / Any</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Target Career Goal
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Machine Learning Engineer / Data Scientist"
                    value={careerForm.careerGoal}
                    onChange={(e) => setCareerForm({ ...careerForm, careerGoal: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Mode Preference
                  </label>
                  <select
                    value={careerForm.workModePreference}
                    onChange={(e) => setCareerForm({ ...careerForm, workModePreference: e.target.value })}
                    className="input-field"
                  >
                    <option value="REMOTE">Remote Only</option>
                    <option value="HYBRID">Hybrid (Preferred)</option>
                    <option value="ONSITE">On-Site Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Job Roles (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="AI Engineer, Data Scientist, ML Ops Engineer"
                  value={careerForm.preferredRoles}
                  onChange={(e) => setCareerForm({ ...careerForm, preferredRoles: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Locations (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Bengaluru, Hyderabad, NCR, Pune"
                  value={careerForm.preferredLocations}
                  onChange={(e) => setCareerForm({ ...careerForm, preferredLocations: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Verified Skills Vector */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <CardTitle>Skills & Capability Vector ({user.userSkills?.length || 0})</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setModalType("skill");
              setEditingSubRecord(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Skill
          </Button>
        </CardHeader>
        <CardContent>
          {user.userSkills && user.userSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {user.userSkills.map((us: any) => (
                <div
                  key={us.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {us.skill?.name}
                      </span>
                      {us.verified && (
                        <span title="Verified Skill">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {us.skill?.category?.toLowerCase()} • {us.source || "Self"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-navy-800 dark:text-blue-400">
                      {parseFloat(us.score)}%
                    </span>
                    <button
                      onClick={() => handleDeleteSubRecord("skill", us.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No skills added to your vector yet. Click &quot;Add Skill&quot; or complete a standardized assessment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 6. Education Records */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Education History ({sp.educations?.length || 0})</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setModalType("education");
              setEditingSubRecord(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {sp.educations && sp.educations.length > 0 ? (
            sp.educations.map((edu: any) => (
              <div
                key={edu.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {edu.degree} {edu.department ? `in ${edu.department}` : ""}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{edu.institution}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {edu.startYear} - {edu.isCurrent ? "Present" : edu.endYear || "N/A"}{" "}
                    {edu.grade && `• Grade: ${edu.grade}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setModalType("education");
                      setEditingSubRecord(edu);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubRecord("education", edu.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No formal education entries recorded.</p>
          )}
        </CardContent>
      </Card>

      {/* 7. Experience / Internships */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Experience & Internships ({sp.experiences?.length || 0})</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setModalType("experience");
              setEditingSubRecord(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {sp.experiences && sp.experiences.length > 0 ? (
            sp.experiences.map((exp: any) => (
              <div
                key={exp.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{exp.role}</h4>
                  <p className="text-xs font-medium text-navy-700 dark:text-blue-300">{exp.organization}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {exp.startDate ? formatDate(exp.startDate) : "N/A"} -{" "}
                    {exp.isCurrent ? "Present" : exp.endDate ? formatDate(exp.endDate) : "N/A"}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setModalType("experience");
                      setEditingSubRecord(exp);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubRecord("experience", exp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No internships or work experiences added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* 8. Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Technical Projects ({sp.projects?.length || 0})</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setModalType("project");
              setEditingSubRecord(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {sp.projects && sp.projects.length > 0 ? (
            sp.projects.map((proj: any) => (
              <div
                key={proj.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{proj.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {proj.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-navy-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <LinkIcon className="h-3 w-3" /> GitHub Repo
                      </a>
                    )}
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setModalType("project");
                      setEditingSubRecord(proj);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubRecord("project", proj.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No projects added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* 9. Certifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Certifications ({sp.certifications?.length || 0})</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setModalType("certification");
              setEditingSubRecord(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Certification
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {sp.certifications && sp.certifications.length > 0 ? (
            sp.certifications.map((cert: any) => (
              <div
                key={cert.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cert.name}</h4>
                    {cert.verified && <Badge variant="success">Verified</Badge>}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{cert.issuer}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Issued: {cert.issueDate ? formatDate(cert.issueDate) : "N/A"}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-navy-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="h-3 w-3" /> View Credential
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setModalType("certification");
                      setEditingSubRecord(cert);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubRecord("certification", cert.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No certifications added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* 10. Achievements & Awards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <CardTitle>Achievements & Competitions ({user.achievements?.length || 0})</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setModalType("achievement");
              setEditingSubRecord(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Achievement
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {user.achievements && user.achievements.length > 0 ? (
            user.achievements.map((ach: any) => (
              <div
                key={ach.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ach.title}</h4>
                    <Badge variant="warning">{ach.category || "Award"}</Badge>
                  </div>
                  {ach.issuer && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{ach.issuer}</p>
                  )}
                  {ach.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{ach.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setModalType("achievement");
                      setEditingSubRecord(ach);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubRecord("achievement", ach.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No achievements recorded yet.</p>
          )}
        </CardContent>
      </Card>

      {/* 11. Social & Portfolio Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Portfolio & Social Presence</CardTitle>
          </div>
          {!editingLinks ? (
            <Button variant="outline" size="sm" onClick={() => setEditingLinks(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingLinks(false)}
                disabled={savingSection === "links"}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "links"}
                onClick={() =>
                  saveSection("links", {
                    studentData: { ...linksForm },
                  })
                }
              >
                {savingSection === "links" && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!editingLinks ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">GitHub Profile</span>
                {sp.githubUrl ? (
                  <a
                    href={sp.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-navy-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" /> {sp.githubUrl}
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs italic mt-1 block">Not connected</span>
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">LinkedIn Profile</span>
                {sp.linkedinUrl ? (
                  <a
                    href={sp.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-navy-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" /> {sp.linkedinUrl}
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs italic mt-1 block">Not connected</span>
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Portfolio / Blog</span>
                {sp.portfolioUrl ? (
                  <a
                    href={sp.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-navy-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" /> {sp.portfolioUrl}
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs italic mt-1 block">Not connected</span>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={linksForm.githubUrl}
                  onChange={(e) => setLinksForm({ ...linksForm, githubUrl: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linksForm.linkedinUrl}
                  onChange={(e) => setLinksForm({ ...linksForm, linkedinUrl: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Portfolio / Personal Site URL
                </label>
                <input
                  type="url"
                  placeholder="https://myportfolio.com"
                  value={linksForm.portfolioUrl}
                  onChange={(e) => setLinksForm({ ...linksForm, portfolioUrl: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SubRecord Modal Component */}
      <SubRecordModal
        isOpen={modalOpen}
        type={modalType}
        initialData={editingSubRecord}
        onClose={() => {
          setModalOpen(false);
          setEditingSubRecord(null);
        }}
        onSave={handleSaveSubRecord}
      />
    </div>
  );
}
