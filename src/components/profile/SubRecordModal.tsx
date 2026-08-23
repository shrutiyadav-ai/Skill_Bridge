"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { X, Loader2 } from "lucide-react";

export type SubRecordType =
  | "education"
  | "experience"
  | "project"
  | "certification"
  | "achievement"
  | "publication"
  | "researchProject"
  | "patent"
  | "skill";

interface SubRecordModalProps {
  isOpen: boolean;
  type: SubRecordType;
  initialData?: any;
  onClose: () => void;
  onSave: (type: SubRecordType, data: any, id?: string) => Promise<void>;
}

export function SubRecordModal({
  isOpen,
  type,
  initialData,
  onClose,
  onSave,
}: SubRecordModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({});
    }
    setError(null);
  }, [initialData, type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(type, formData, initialData?.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save record");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    const isEdit = !!initialData?.id;
    const prefix = isEdit ? "Edit" : "Add";
    switch (type) {
      case "education":
        return `${prefix} Education`;
      case "experience":
        return `${prefix} Experience / Internship`;
      case "project":
        return `${prefix} Project`;
      case "certification":
        return `${prefix} Certification`;
      case "achievement":
        return `${prefix} Achievement / Award`;
      case "publication":
        return `${prefix} Publication`;
      case "researchProject":
        return `${prefix} Research Project`;
      case "patent":
        return `${prefix} Patent`;
      case "skill":
        return `${prefix} Competency / Skill`;
      default:
        return `${prefix} Entry`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {getTitle()}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-md">
              {error}
            </div>
          )}

          {/* Education Form */}
          {type === "education" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indian Institute of Technology Delhi"
                  value={formData.institution || ""}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree / Course *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech"
                    value={formData.degree || ""}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
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
                    value={formData.department || ""}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Year *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2022"
                    value={formData.startYear || ""}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Year
                  </label>
                  <input
                    type="number"
                    placeholder="2026"
                    disabled={formData.isCurrent}
                    value={formData.endYear || ""}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                    className="input-field disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grade / CGPA
                  </label>
                  <input
                    type="text"
                    placeholder="8.9 CGPA"
                    value={formData.grade || ""}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={!!formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="rounded text-navy-600 focus:ring-navy-500"
                />
                Currently Pursuing
              </label>
            </>
          )}

          {/* Experience Form */}
          {type === "experience" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / Company *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flipkart, Microsoft"
                  value={formData.organization || ""}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Machine Learning Intern"
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate ? formData.startDate.slice(0, 10) : ""}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    disabled={formData.isCurrent}
                    value={formData.endDate ? formData.endDate.slice(0, 10) : ""}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field disabled:opacity-50"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="rounded text-navy-600 focus:ring-navy-500"
                />
                Currently Working Here
              </label>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Impact
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your responsibilities, tools used, and key outcomes..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>
            </>
          )}

          {/* Project Form */}
          {type === "project" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Powered Recommendation Engine"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly explain what the project does, key algorithms, dataset, and impact..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/project"
                    value={formData.githubUrl || ""}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://myproject.vercel.app"
                    value={formData.projectUrl || ""}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </>
          )}

          {/* Certification Form */}
          {type === "certification" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Certification Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect, DeepLearning.AI"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amazon Web Services, Stanford Online, Coursera"
                  value={formData.issuer || ""}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate ? formData.issueDate.slice(0, 10) : ""}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate ? formData.expiryDate.slice(0, 10) : ""}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Credential / Verification Link
                </label>
                <input
                  type="url"
                  placeholder="https://coursera.org/verify/..."
                  value={formData.credentialUrl || ""}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  className="input-field"
                />
              </div>
            </>
          )}

          {/* Achievement Form */}
          {type === "achievement" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title / Award Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1st Place - National Hackathon 2025"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category || "AWARDS"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="AWARDS">Award & Recognition</option>
                    <option value="HACKATHONS">Hackathon</option>
                    <option value="COMPETITIONS">Competition / Coding Contest</option>
                    <option value="PUBLICATIONS">Paper / Article</option>
                    <option value="OTHER">Other Achievement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issuer / Organizer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IEEE, NASSCOM, University"
                    value={formData.issuer || ""}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe the context or winning contribution..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>
            </>
          )}

          {/* Publication Form */}
          {type === "publication" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Publication Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Performance Distributed Graph Processing on Hybrid Clouds"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Journal / Conference Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IEEE Trans. on Cloud Computing"
                    value={formData.journalOrConf || ""}
                    onChange={(e) => setFormData({ ...formData, journalOrConf: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    placeholder="2025"
                    value={formData.year || ""}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    DOI
                  </label>
                  <input
                    type="text"
                    placeholder="10.1109/TCC.2025.12345"
                    value={formData.doi || ""}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Authors
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Raghavan, A. Sharma, et al."
                    value={formData.authors || ""}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </>
          )}

          {/* Research Project Form */}
          {type === "researchProject" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Grid AI Forecasting Initiative"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Funding Agency
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DST / SERB / AICTE"
                    value={formData.fundingAgency || ""}
                    onChange={(e) => setFormData({ ...formData, fundingAgency: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grant Amount (INR)
                  </label>
                  <input
                    type="number"
                    placeholder="2500000"
                    value={formData.grantAmount || ""}
                    onChange={(e) => setFormData({ ...formData, grantAmount: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || "ONGOING"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PROPOSED">Proposed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024 - 2027 (3 Years)"
                    value={formData.duration || ""}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </>
          )}

          {/* Skill Form */}
          {type === "skill" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skill / Competency Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, PyTorch, React, Cloud Computing"
                  value={formData.skillName || ""}
                  onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category || "TECHNICAL"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="TECHNICAL">Technical</option>
                    <option value="APTITUDE">Aptitude & Problem Solving</option>
                    <option value="SOFT_SKILL">Soft Skill & Communication</option>
                    <option value="DOMAIN">Domain Knowledge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Proficiency Score ({formData.score || 75}%)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={formData.score || 75}
                    onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value, 10) })}
                    className="w-full accent-navy-600 mt-2"
                  />
                </div>
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading}>
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
