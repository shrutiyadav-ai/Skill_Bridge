"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_STUDENT_SKILLS, MOCK_SKILLS } from "@/lib/mock-data";
import { calculateSkillMatch } from "@/lib/matching";
import { UserSkillItem } from "@/types";
import {
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Filter,
  ClipboardCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Layers,
  Wrench,
  Award,
} from "lucide-react";

export default function StudentSkillsPage() {
  const { data: session } = useSession();
  const studentEmail = session?.user?.email?.toLowerCase() || "";

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────
  const [skills, setSkills] = useState<UserSkillItem[]>([]);
  const [careerRoles, setCareerRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState(MOCK_SKILLS[1].name);
  const [newSkillScore, setNewSkillScore] = useState(75);

  // ─── LOAD STUDENT PROFILE, VERIFIED SKILLS & DYNAMIC CAREER ROLES ──────
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingRoles(true);

        // 1. Fetch Student Skills from Database
        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.userSkills && profileData.userSkills.length > 0) {
            const mapped = profileData.userSkills.map((us: any) => ({
              id: us.id,
              skillId: us.skillId,
              skillName: us.skill?.name || us.skillName || "Skill",
              category: us.skill?.category || us.category || "TECHNICAL",
              score: Number(us.score),
              verified: us.verified ?? true,
              source: us.source || "assessment",
            }));
            setSkills(mapped);
          } else {
            // Local storage fallback
            const stored = localStorage.getItem(`assessed_skills_${studentEmail}`);
            if (stored) {
              try {
                setSkills(JSON.parse(stored));
              } catch (e) {}
            }
          }
        }

        // 2. Fetch Dynamic Course-Filtered Career Roles
        const rolesRes = await fetch("/api/student/career-roles");
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          setStudentProfile(rolesData.student);
          setCareerRoles(rolesData.careerRoles || []);
          if (rolesData.careerRoles && rolesData.careerRoles.length > 0) {
            setSelectedRoleId(rolesData.careerRoles[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load skills and career roles", e);
      } finally {
        setLoadingRoles(false);
      }
    }

    if (studentEmail) {
      loadData();
    }
  }, [studentEmail]);

  // Selected Career Role object
  const selectedRole =
    careerRoles.find((r) => r.id === selectedRoleId) || careerRoles[0] || null;

  // Compute live deterministic skill gap against target role requirements
  const matchResult = selectedRole
    ? calculateSkillMatch(skills, selectedRole.skills || [])
    : {
        compatibilityScore: 0,
        strongSkills: [],
        partialSkills: [],
        missingSkills: [],
        priorityGaps: [],
        explanation: "Select a career role to view industry benchmark comparison.",
      };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = skills.find(
      (s) => s.skillName.toLowerCase() === newSkillName.toLowerCase()
    );

    let updatedSkills: UserSkillItem[];

    if (existing) {
      updatedSkills = skills.map((s) =>
        s.skillName.toLowerCase() === newSkillName.toLowerCase()
          ? { ...s, score: newSkillScore, verified: true }
          : s
      );
    } else {
      const skillObj = MOCK_SKILLS.find((s) => s.name === newSkillName);
      const newSkill: UserSkillItem = {
        id: `custom-${Date.now()}`,
        skillId: skillObj?.id || `skill-${Date.now()}`,
        skillName: newSkillName,
        category: skillObj?.category || "TECHNICAL",
        score: newSkillScore,
        verified: true,
      };
      updatedSkills = [...skills, newSkill];
    }

    setSkills(updatedSkills);
    if (studentEmail) {
      localStorage.setItem(`assessed_skills_${studentEmail}`, JSON.stringify(updatedSkills));
    }
    setShowAddModal(false);
  };

  const filteredSkills = skills.filter((s) => {
    if (filterCategory === "ALL") return true;
    return s.category === filterCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Skill Profile & Gap Engine
              </h1>
              <Badge variant="primary" className="text-[10px]">
                Course-Driven Benchmarks
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Dynamic vector comparison between your verified abilities and curriculum-aligned career roles
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/student/assessment">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <ClipboardCheck className="h-4 w-4 text-navy-800 dark:text-blue-400" />
                Take Assessment
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="gap-1.5 text-xs bg-navy-800 hover:bg-navy-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            TARGET INDUSTRY BENCHMARK & ROLE SELECTOR
        ══════════════════════════════════════════════════════════════════════════ */}
        <Card className="bg-gradient-to-r from-navy-50/60 via-white to-slate-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 border-navy-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-navy-800 dark:text-blue-400" />
                    <span className="text-xs font-bold text-navy-900 dark:text-blue-400 uppercase tracking-wider">
                      Target Industry Benchmark
                    </span>
                  </div>

                  {studentProfile && (
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
                      {studentProfile.course} • {studentProfile.department} ({careerRoles.length} Roles)
                    </span>
                  )}
                </div>

                {/* Role Selector: Searchable / Dropdown & Quick Pills */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      Target Role:
                    </label>
                    <select
                      value={selectedRoleId}
                      onChange={(e) => setSelectedRoleId(e.target.value)}
                      className="input-field py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    >
                      {careerRoles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title} — {r.domain} {r.isCrossDisciplinary ? "(Cross-Disciplinary)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Top Role Quick Selection Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {careerRoles.slice(0, 7).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRoleId(r.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                          selectedRoleId === r.id
                            ? "bg-navy-800 dark:bg-blue-600 text-white shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750"
                        }`}
                      >
                        {r.title}
                      </button>
                    ))}
                    {careerRoles.length > 7 && (
                      <span className="text-[10px] text-slate-400 pl-1 font-mono">
                        +{careerRoles.length - 7} more in dropdown
                      </span>
                    )}
                  </div>
                </div>

                {/* Selected Role Meta Specs */}
                {selectedRole && (
                  <div className="pt-2 space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedRole.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {selectedRole.toolsAndTechnologies && selectedRole.toolsAndTechnologies.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          <Wrench className="h-3 w-3 text-slate-500" />
                          <span>Tools: <strong>{selectedRole.toolsAndTechnologies.slice(0, 4).join(", ")}</strong></span>
                        </div>
                      )}

                      {selectedRole.certifications && selectedRole.certifications.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          <Award className="h-3 w-3 text-amber-600" />
                          <span>Cert: <strong>{selectedRole.certifications[0]}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Match Metrics KPI Summary Box */}
              <div className="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-start gap-6 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 shrink-0 min-w-[200px]">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Role Match Score
                  </span>
                  <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 font-mono mt-1">
                    {skills.length > 0 ? `${matchResult.compatibilityScore}%` : "0%"}
                  </div>
                  <span className="text-[10px] text-slate-400">Weighted Vector Match</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Readiness Status
                  </span>
                  <div className="mt-1">
                    {skills.length === 0 ? (
                      <Badge variant="warning">Assessment Required</Badge>
                    ) : matchResult.compatibilityScore >= 75 ? (
                      <Badge variant="success">Placement Ready</Badge>
                    ) : (
                      <Badge variant="warning">Developing Profile</Badge>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                    {skills.length > 0 && selectedRole
                      ? `${matchResult.strongSkills.length} of ${selectedRole.skills?.length || 0} Met`
                      : "0 Met"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════════════
            COMPETENCY MATRIX & INDUSTRY GAP DIAGNOSTIC TABLE
        ══════════════════════════════════════════════════════════════════════════ */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Competency Matrix & Industry Gap Diagnostic</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparing your verified capability scores against {selectedRole?.title || "Target Role"} benchmarks
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="TECHNICAL">Technical Skills</option>
                <option value="APTITUDE">Aptitude & Analytical</option>
                <option value="DOMAIN">Domain & Finance</option>
                <option value="SOFT_SKILL">Soft Skills</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {selectedRole && selectedRole.skills && selectedRole.skills.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Skill Competency</th>
                      <th>Category</th>
                      <th>Your Score</th>
                      <th>Industry Benchmark</th>
                      <th>Gap</th>
                      <th>Diagnostic Status</th>
                      <th>Action Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRole.skills
                      .filter((req: any) => filterCategory === "ALL" || req.category === filterCategory)
                      .map((req: any) => {
                        const userSkill = skills.find(
                          (s) =>
                            s.skillName.toLowerCase() === req.skillName.toLowerCase() ||
                            s.skillId?.toLowerCase() === req.skillId?.toLowerCase()
                        );
                        const currentScore = userSkill ? userSkill.score : 0;
                        const requiredScore = req.requiredLevel;
                        const gap = requiredScore - currentScore;

                        let statusBadge = (
                          <Badge variant="danger" className="text-[10px]">
                            Critical Gap
                          </Badge>
                        );
                        let action = `Complete foundational assessment and practice modules in ${req.skillName}.`;

                        if (gap <= 0) {
                          statusBadge = (
                            <Badge variant="success" className="gap-1 text-[10px]">
                              <CheckCircle2 className="h-3 w-3" />
                              Ready
                            </Badge>
                          );
                          action = "Proficiency verified! Ready for technical interview rounds.";
                        } else if (currentScore >= requiredScore * 0.7) {
                          statusBadge = (
                            <Badge variant="warning" className="text-[10px]">
                              Developing
                            </Badge>
                          );
                          action = `Bridge the remaining ${gap}% gap with intermediate project exercises.`;
                        } else if (currentScore > 0) {
                          statusBadge = (
                            <Badge variant="danger" className="text-[10px]">
                              Needs Work
                            </Badge>
                          );
                          action = `Significant deficit of ${gap}%. Recommended practice questions before applying.`;
                        }

                        return (
                          <tr key={req.id || req.skillName}>
                            <td className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {req.skillName}
                              {userSkill?.verified && (
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                            </td>
                            <td>
                              <Badge variant="default" className="text-[10px]">
                                {req.category || "TECHNICAL"}
                              </Badge>
                            </td>
                            <td className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                              {userSkill ? `${userSkill.score}%` : "Not Assessed"}
                            </td>
                            <td className="font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold">
                              {requiredScore}%
                            </td>
                            <td className="font-mono text-xs">
                              {gap <= 0 ? (
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                                  +{Math.abs(gap)}% (Surplus)
                                </span>
                              ) : (
                                <span className="text-rose-600 dark:text-rose-400 font-bold">
                                  -{gap}%
                                </span>
                              )}
                            </td>
                            <td>{statusBadge}</td>
                            <td className="text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                              {action}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={<AlertCircle className="h-8 w-8 text-slate-400" />}
                title="No role competencies configured"
                description="Please select another career role from your course catalog."
              />
            )}
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════════════
            STUDENT'S ALL REGISTERED / ASSESSED SKILLS REPOSITORY
        ══════════════════════════════════════════════════════════════════════════ */}
        <Card>
          <CardHeader>
            <CardTitle>Your Assessed Competency Vector ({filteredSkills.length})</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified skills persisted in your academic record and shared with placement matching
            </p>
          </CardHeader>

          <CardContent className="p-0">
            {filteredSkills.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Skill Name</th>
                      <th>Category</th>
                      <th>Verified Proficiency</th>
                      <th>Verification Source</th>
                      <th>Readiness Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSkills.map((s) => (
                      <tr key={s.id || s.skillName}>
                        <td className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {s.skillName}
                          {s.verified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                        </td>
                        <td>
                          <Badge variant="default" className="text-[10px]">
                            {s.category}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  s.score >= 75
                                    ? "bg-emerald-600 dark:bg-emerald-400"
                                    : s.score >= 60
                                    ? "bg-amber-500 dark:bg-amber-400"
                                    : "bg-rose-500 dark:bg-rose-400"
                                }`}
                                style={{ width: `${s.score}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {s.score}%
                            </span>
                          </div>
                        </td>
                        <td className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {s.source === "assessment" ? "Standardized Assessment" : "Self-Reported / Coursework"}
                        </td>
                        <td>
                          <Badge
                            variant={s.score >= 75 ? "success" : s.score >= 60 ? "warning" : "danger"}
                            className="text-[10px]"
                          >
                            {s.score >= 75 ? "Advanced" : s.score >= 60 ? "Proficient" : "Foundational"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={<AlertCircle className="h-8 w-8 text-slate-400" />}
                title="No skills verified yet"
                description="Take your personalized course assessment to populate your skill vector."
                action={
                  <Link href="/student/assessment">
                    <Button size="sm" className="bg-navy-800 dark:bg-blue-600 text-white">
                      Take Assessment
                    </Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Add Skill Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add / Update Skill Competency
              </h3>
              <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Skill Name
                  </label>
                  <select
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="input-field py-1.5 text-xs text-slate-900 dark:text-slate-100"
                  >
                    {MOCK_SKILLS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Proficiency Score</span>
                    <span className="font-mono">{newSkillScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={newSkillScore}
                    onChange={(e) => setNewSkillScore(Number(e.target.value))}
                    className="w-full cursor-pointer accent-navy-800 dark:accent-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-navy-800 dark:bg-blue-600 text-white"
                  >
                    Save Skill
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
