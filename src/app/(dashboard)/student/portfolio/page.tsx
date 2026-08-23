"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_STUDENT_SKILLS } from "@/lib/mock-data";
import {
  FileUser,
  Plus,
  Github,
  ExternalLink,
  ShieldCheck,
  Award,
  GraduationCap,
  FileText,
  Upload,
  Copy,
  Check,
  FolderGit2,
} from "lucide-react";

export default function StudentPortfolioPage() {
  const { data: session } = useSession();
  const studentName = session?.user?.name || "Student";
  const studentEmail = session?.user?.email?.toLowerCase() || "";
  const isDemoStudent =
    studentEmail === "aditya.sharma@iitd.ac.in" ||
    studentEmail === "priya.patel@nitt.ac.in";

  const [copied, setCopied] = useState(false);

  interface LocalProject {
    id: string;
    title: string;
    description: string;
    githubUrl?: string;
    skills: string[];
  }

  const demoProjects: LocalProject[] = [
    {
      id: "p1",
      title: "Movie Recommendation Engine",
      description:
        "Collaborative filtering-based recommendation system using matrix factorization. Trained on the MovieLens 25M dataset achieving 0.87 RMSE.",
      githubUrl: "https://github.com/aditya-sharma/movie-recommender",
      skills: ["Python", "Machine Learning", "Git"],
    },
    {
      id: "p2",
      title: "Sentiment Analysis Pipeline",
      description:
        "End-to-end NLP pipeline for analyzing product reviews using BERT fine-tuning. Deployed as a REST API using FastAPI and Docker.",
      githubUrl: "https://github.com/aditya-sharma/sentiment-pipeline",
      skills: ["Python", "NLP", "REST API", "Docker"],
    },
  ];

  const demoCertifications = [
    {
      id: "c1",
      name: "Machine Learning Specialization",
      issuer: "Stanford Online (Coursera)",
      issueDate: "Aug 2025",
      credentialUrl: "https://coursera.org/verify/specialization/ABC123",
      verified: true,
    },
    {
      id: "c2",
      name: "TensorFlow Developer Certificate",
      issuer: "DeepLearning.AI",
      issueDate: "Jan 2026",
      credentialUrl: "https://coursera.org/verify/TF-987654",
      verified: true,
    },
  ];

  const [projects, setProjects] = useState<LocalProject[]>(isDemoStudent ? demoProjects : []);
  const [certifications, setCertifications] = useState(isDemoStudent ? demoCertifications : []);
  const [userSkills, setUserSkills] = useState(isDemoStudent ? MOCK_STUDENT_SKILLS : []);

  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectGit, setNewProjectGit] = useState("");
  const [newProjectSkills, setNewProjectSkills] = useState("Python, React");

  useEffect(() => {
    if (!isDemoStudent && studentEmail) {
      const storedSkills = localStorage.getItem(`assessed_skills_${studentEmail}`);
      if (storedSkills) {
        try {
          setUserSkills(JSON.parse(storedSkills));
        } catch (e) {}
      }
      const storedProjects = localStorage.getItem(`projects_${studentEmail}`);
      if (storedProjects) {
        try {
          setProjects(JSON.parse(storedProjects));
        } catch (e) {}
      }
      const storedCerts = localStorage.getItem(`certs_${studentEmail}`);
      if (storedCerts) {
        try {
          setCertifications(JSON.parse(storedCerts));
        } catch (e) {}
      }
    }
  }, [isDemoStudent, studentEmail]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://skillbridge.edu.in/portfolio/${studentName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newP = {
      id: `p-${Date.now()}`,
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim(),
      githubUrl: newProjectGit.trim() || undefined,
      skills: newProjectSkills.split(",").map((s) => s.trim()).filter(Boolean),
    };

    const updated = [newP, ...projects];
    setProjects(updated);
    if (!isDemoStudent && studentEmail) {
      localStorage.setItem(`projects_${studentEmail}`, JSON.stringify(updated));
    }
    setShowProjectModal(false);
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewProjectGit("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {studentName} — Verified Digital Portfolio
              </h1>
              <Badge variant="success" className="gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Publicly shareable profile backed by objective skill assessments and verified credentials
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Link Copied!" : "Copy Public Link"}
            </Button>
            <Button
              size="sm"
              onClick={() => setShowProjectModal(true)}
              className="gap-1.5 text-xs bg-navy-800 dark:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Verified Competencies Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Verified Skills Matrix</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified scores backed by standardized evaluation rubrics
            </p>
          </CardHeader>
          <CardContent>
            {userSkills.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {userSkills.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-center space-y-1"
                  >
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate">
                      {s.skillName}
                    </span>
                    <div className="text-lg font-extrabold text-navy-800 dark:text-blue-400 font-mono">
                      {s.score}%
                    </div>
                    <Badge variant="success" size="sm" className="text-[10px]">
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                <p>No verified skills yet.</p>
                <Link href="/student/assessment" className="text-navy-800 dark:text-blue-400 font-semibold underline mt-1 inline-block">
                  Take assessment to verify skills
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Technical Projects</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Proof of hands-on competency & implementation experience
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowProjectModal(true)}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Project
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{proj.title}</h4>
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{proj.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {proj.skills.map((s) => (
                        <Badge key={s} variant="secondary" size="sm">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FolderGit2 className="h-8 w-8 text-slate-400" />}
                title="No Projects Added"
                description="Highlight your practical engineering implementations, GitHub repositories, and capstone work."
                action={
                  <Button size="sm" onClick={() => setShowProjectModal(true)} className="bg-navy-800 dark:bg-blue-600 text-white">
                    Add First Project
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Certifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Industry & Academic Certifications</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified certifications from accredited institutions and MOOC platforms
            </p>
          </CardHeader>
          <CardContent>
            {certifications.length > 0 ? (
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-400 flex items-center justify-center font-bold">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{cert.name}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {cert.issuer} • Issued {cert.issueDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="success">Verified</Badge>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                <Award className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                <p>No verified certifications added yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Project to Portfolio</h3>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="label-text">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="e.g., Real-time Sentiment Classifier"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Briefly describe the architecture, datasets, and results achieved..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">GitHub URL (Optional)</label>
                <input
                  type="url"
                  value={newProjectGit}
                  onChange={(e) => setNewProjectGit(e.target.value)}
                  placeholder="https://github.com/your-username/repo"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Technologies (Comma-separated)</label>
                <input
                  type="text"
                  value={newProjectSkills}
                  onChange={(e) => setNewProjectSkills(e.target.value)}
                  placeholder="e.g., Python, PyTorch, Docker"
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowProjectModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-800 dark:bg-blue-600 text-white">
                  Save Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
