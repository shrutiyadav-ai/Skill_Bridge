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
  BookOpen,
  FlaskConical,
  Award,
  Upload,
  Link as LinkIcon,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  Loader2,
  Network,
} from "lucide-react";

interface AcademicianProfileViewProps {
  user: any;
  onRefresh: () => void;
}

export function AcademicianProfileView({ user, onRefresh }: AcademicianProfileViewProps) {
  const ap = user.academicianProfile || {};

  const [editingBasic, setEditingBasic] = useState(false);
  const [editingAcademic, setEditingAcademic] = useState(false);
  const [editingExpertise, setEditingExpertise] = useState(false);
  const [editingCollab, setEditingCollab] = useState(false);
  const [editingLinks, setEditingLinks] = useState(false);

  const [basicForm, setBasicForm] = useState({
    name: user.name || "",
    phone: user.phone || ap.phone || "",
    location: user.location || ap.location || "",
    bio: user.bio || ap.bio || "",
  });

  const [academicForm, setAcademicForm] = useState({
    institutionName: ap.institutionName || "IIT Delhi",
    department: ap.department || "Computer Science & Engineering",
    designation: ap.designation || "Professor & Head of Department",
    specialization: ap.specialization || "Distributed Systems, Cloud & AI Infrastructure",
    highestQualification: ap.highestQualification || "Ph.D. (Computer Science), IISc Bangalore",
    experience: ap.experience || 18,
  });

  const [expertiseForm, setExpertiseForm] = useState({
    areasOfExpertise: Array.isArray(ap.areasOfExpertise) ? ap.areasOfExpertise.join(", ") : ap.areasOfExpertise || "Distributed Systems, Big Data Architectures, Machine Learning Systems",
    researchInterests: Array.isArray(ap.researchInterests) ? ap.researchInterests.join(", ") : ap.researchInterests || "Edge Computing, Federated Learning, Energy-Efficient Data Centers",
    subjectsTaught: Array.isArray(ap.subjectsTaught) ? ap.subjectsTaught.join(", ") : ap.subjectsTaught || "Advanced Operating Systems, Cloud Computing, Distributed Algorithms",
    technicalSkills: Array.isArray(ap.technicalSkills) ? ap.technicalSkills.join(", ") : ap.technicalSkills || "C++, Python, Kubernetes, Go, Linux Kernel Architecture",
  });

  const [collabForm, setCollabForm] = useState({
    openForConsultancy: ap.openForConsultancy ?? true,
    openForResearch: ap.openForResearch ?? true,
    openForFDP: ap.openForFDP ?? true,
    openForMentorship: ap.openForMentorship ?? true,
    openForFacultyInternship: ap.openForFacultyInternship ?? true,
  });

  const [linksForm, setLinksForm] = useState({
    googleScholarUrl: ap.googleScholarUrl || "",
    orcidUrl: ap.orcidUrl || "",
    linkedinUrl: ap.linkedinUrl || "",
    researchGateUrl: ap.researchGateUrl || "",
    personalWebsiteUrl: ap.personalWebsiteUrl || "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<SubRecordType>("publication");
  const [editingSubRecord, setEditingSubRecord] = useState<any>(null);

  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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

      showFeedback("Profile section updated successfully");
      if (section === "basic") setEditingBasic(false);
      if (section === "academic") setEditingAcademic(false);
      if (section === "expertise") setEditingExpertise(false);
      if (section === "collab") setEditingCollab(false);
      if (section === "links") setEditingLinks(false);
      onRefresh();
    } catch (err: any) {
      showFeedback(err.message || "Failed to save", "error");
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveSubRecord = async (type: SubRecordType, data: any, id?: string) => {
    const method = id ? "PUT" : "POST";
    const res = await fetch("/api/profile/sub-records", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, data }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to save record");
    }

    showFeedback("Record saved successfully");
    onRefresh();
  };

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", "avatar");

    setUploadingAvatar(true);
    try {
      const res = await fetch("/api/profile/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      showFeedback("Profile photo updated");
      onRefresh();
    } catch (err: any) {
      showFeedback(err.message, "error");
    } finally {
      setUploadingAvatar(false);
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
              <div className="h-24 w-24 rounded-full bg-navy-100 dark:bg-navy-900 text-navy-700 dark:text-blue-300 flex items-center justify-center font-bold text-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name?.charAt(0) || "F"
                )}
              </div>
              <label
                htmlFor="fac-avatar-upload"
                className="absolute inset-0 rounded-full bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-semibold"
              >
                <Upload className="h-4 w-4 mb-0.5" />
                <span>{uploadingAvatar ? "..." : "Change"}</span>
              </label>
              <input
                id="fac-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingAvatar}
                onChange={handleAvatarUpload}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.name}
                </h2>
                <Badge variant="info">Faculty & Academician</Badge>
                <Badge variant="success">Verified Researcher</Badge>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {ap.designation || "Faculty"} • {ap.department || "Department"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>{user.email}</span>
                {ap.institutionName && <span>• {ap.institutionName}</span>}
                {ap.experience && <span>• {ap.experience} Yrs Experience</span>}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  setModalType("publication");
                  setEditingSubRecord(null);
                  setModalOpen(true);
                }}
                className="btn-primary text-xs py-2 px-4 text-center flex items-center justify-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Publication
              </button>
              <button
                onClick={() => {
                  setModalType("researchProject");
                  setEditingSubRecord(null);
                  setModalOpen(true);
                }}
                className="btn-outline text-xs py-1.5 text-center flex items-center justify-center gap-1.5"
              >
                <FlaskConical className="h-3.5 w-3.5" /> Add Research Grant
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Academic Credentials Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Academic Credentials & Designation</CardTitle>
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
                    academicianData: { ...academicForm },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Affiliated Institution</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                  {ap.institutionName || "IIT Delhi"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Designation</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ap.designation || "Professor"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Department</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ap.department || "Computer Science"}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Highest Qualification</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ap.highestQualification || "Ph.D."}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Teaching & Research Experience</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ap.experience || "15"}+ Years
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Specialization</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-1 block">
                  {ap.specialization || "Distributed Systems"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Affiliated Institution
                  </label>
                  <input
                    type="text"
                    value={academicForm.institutionName}
                    onChange={(e) => setAcademicForm({ ...academicForm, institutionName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={academicForm.designation}
                    onChange={(e) => setAcademicForm({ ...academicForm, designation: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={academicForm.department}
                    onChange={(e) => setAcademicForm({ ...academicForm, department: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    value={academicForm.highestQualification}
                    onChange={(e) => setAcademicForm({ ...academicForm, highestQualification: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={academicForm.experience}
                    onChange={(e) => setAcademicForm({ ...academicForm, experience: parseInt(e.target.value, 10) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Core Specialization
                  </label>
                  <input
                    type="text"
                    value={academicForm.specialization}
                    onChange={(e) => setAcademicForm({ ...academicForm, specialization: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Research Publications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Research Publications ({ap.publications?.length || 0})</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setModalType("publication");
              setEditingSubRecord(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Publication
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {ap.publications && ap.publications.length > 0 ? (
            ap.publications.map((pub: any) => (
              <div
                key={pub.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{pub.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {pub.journalOrConf} {pub.year ? `(${pub.year})` : ""}
                  </p>
                  {pub.authors && <p className="text-[11px] text-slate-400 mt-0.5">Authors: {pub.authors}</p>}
                  {pub.doi && (
                    <span className="font-mono text-[10px] text-navy-600 dark:text-blue-400 block mt-1">
                      DOI: {pub.doi}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setModalType("publication");
                      setEditingSubRecord(pub);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubRecord("publication", pub.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No publications recorded yet.</p>
          )}
        </CardContent>
      </Card>

      {/* 4. Funded Research Projects & Grants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Funded Research Projects & Grants ({ap.researchProjects?.length || 0})</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setModalType("researchProject");
              setEditingSubRecord(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {ap.researchProjects && ap.researchProjects.length > 0 ? (
            ap.researchProjects.map((rp: any) => (
              <div
                key={rp.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rp.title}</h4>
                    <Badge variant={rp.status === "ONGOING" ? "success" : "default"}>{rp.status}</Badge>
                  </div>
                  <p className="text-xs font-medium text-navy-700 dark:text-blue-300 mt-0.5">
                    Funding Agency: {rp.fundingAgency || "Govt. of India"} • Grant: ₹{rp.grantAmount ? parseFloat(rp.grantAmount).toLocaleString() : "25,00,000"}
                  </p>
                  {rp.duration && <p className="text-[11px] text-slate-400 mt-0.5">Duration: {rp.duration}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setModalType("researchProject");
                      setEditingSubRecord(rp);
                      setModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubRecord("researchProject", rp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No funded research projects added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* 5. Industry Collaboration Preferences */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-navy-600 dark:text-blue-400" />
            <CardTitle>Industry Collaboration & Engagement</CardTitle>
          </div>
          {!editingCollab ? (
            <Button variant="outline" size="sm" onClick={() => setEditingCollab(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingCollab(false)} disabled={savingSection === "collab"}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={savingSection === "collab"}
                onClick={() =>
                  saveSection("collab", {
                    academicianData: { ...collabForm },
                  })
                }
              >
                {savingSection === "collab" && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                Save Changes
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!editingCollab ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Industry Consultancy</span>
                <Badge variant={ap.openForConsultancy !== false ? "success" : "default"}>
                  {ap.openForConsultancy !== false ? "Available" : "No"}
                </Badge>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Joint Research</span>
                <Badge variant={ap.openForResearch !== false ? "success" : "default"}>
                  {ap.openForResearch !== false ? "Available" : "No"}
                </Badge>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">FDPs & Workshops</span>
                <Badge variant={ap.openForFDP !== false ? "success" : "default"}>
                  {ap.openForFDP !== false ? "Available" : "No"}
                </Badge>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Mentorship</span>
                <Badge variant={ap.openForMentorship !== false ? "success" : "default"}>
                  {ap.openForMentorship !== false ? "Available" : "No"}
                </Badge>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Faculty Internships</span>
                <Badge variant={ap.openForFacultyInternship !== false ? "success" : "default"}>
                  {ap.openForFacultyInternship !== false ? "Available" : "No"}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collabForm.openForConsultancy}
                  onChange={(e) => setCollabForm({ ...collabForm, openForConsultancy: e.target.checked })}
                  className="rounded text-navy-600 focus:ring-navy-500"
                />
                Open for Industry Consultancy
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collabForm.openForResearch}
                  onChange={(e) => setCollabForm({ ...collabForm, openForResearch: e.target.checked })}
                  className="rounded text-navy-600 focus:ring-navy-500"
                />
                Open for Joint Research Collaborations
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collabForm.openForFDP}
                  onChange={(e) => setCollabForm({ ...collabForm, openForFDP: e.target.checked })}
                  className="rounded text-navy-600 focus:ring-navy-500"
                />
                Open for Faculty Development Programs (FDPs)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={collabForm.openForMentorship}
                  onChange={(e) => setCollabForm({ ...collabForm, openForMentorship: e.target.checked })}
                  className="rounded text-navy-600 focus:ring-navy-500"
                />
                Open for Student Project Mentorship
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SubRecord Modal */}
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
