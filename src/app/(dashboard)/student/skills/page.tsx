"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MOCK_STUDENT_SKILLS,
  MOCK_CAREER_ROLES,
  MOCK_SKILLS,
} from "@/lib/mock-data";
import { calculateSkillMatch } from "@/lib/matching";
import { UserSkillItem } from "@/types";
import {
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Filter,
  Info,
  ClipboardCheck,
} from "lucide-react";

export default function StudentSkillsPage() {
  const { data: session } = useSession();
  const studentEmail = session?.user?.email?.toLowerCase() || "";
  const isDemoStudent =
    studentEmail === "aditya.sharma@iitd.ac.in" ||
    studentEmail === "priya.patel@nitt.ac.in";

  const [skills, setSkills] = useState<UserSkillItem[]>(isDemoStudent ? MOCK_STUDENT_SKILLS : []);
  const [selectedRole, setSelectedRole] = useState(MOCK_CAREER_ROLES[0]);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState(MOCK_SKILLS[1].name);
  const [newSkillScore, setNewSkillScore] = useState(75);

  useEffect(() => {
    if (!isDemoStudent && studentEmail) {
      const stored = localStorage.getItem(`assessed_skills_${studentEmail}`);
      if (stored) {
        try {
          setSkills(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, [isDemoStudent, studentEmail]);

  // Compute skill gap against target role requirements
  const matchResult = calculateSkillMatch(skills, selectedRole.skills);

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
    if (!isDemoStudent && studentEmail) {
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Skill Profile & Gap Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Deterministic vector comparison between your verified abilities and target industry job benchmarks
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
              className="gap-1.5 text-xs bg-navy-800 dark:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </div>

        {/* Target Role Selector & Match Summary */}
        <Card className="bg-gradient-to-r from-navy-50/50 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-bold text-navy-800 dark:text-blue-400 uppercase tracking-wider">
                  Target Industry Benchmark
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {MOCK_CAREER_ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRole(r)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        selectedRole.id === r.id
                          ? "bg-navy-800 dark:bg-blue-600 text-white shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750"
                      }`}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{selectedRole.description}</p>
              </div>

              {/* Match Metrics Summary */}
              <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
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
                    Status
                  </span>
                  <div className="mt-1">
                    {skills.length === 0 ? (
                      <Badge variant="warning">Assessment Required</Badge>
                    ) : matchResult.compatibilityScore >= 75 ? (
                      <Badge variant="success">Placement Ready</Badge>
                    ) : (
                      <Badge variant="warning">Developing</Badge>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {skills.length > 0 ? `${matchResult.strongSkills.length} of ${selectedRole.skills.length} Met` : "0 Met"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Gap Comparison Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Competency Matrix & Industry Gap Diagnostic</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparing your current capability scores against {selectedRole.title} requirements
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
                <option value="SOFT_SKILL">Soft Skills</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {skills.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Skill Competency</th>
                      <th>Category</th>
                      <th>Your Score</th>
                      <th>Industry Requirement</th>
                      <th>Weight</th>
                      <th>Diagnostic Status</th>
                      <th>Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRole.skills.map((req) => {
                      const userSkill = skills.find(
                        (s) => s.skillName.toLowerCase() === req.skillName.toLowerCase()
                      );
                      const currentScore = userSkill ? userSkill.score : 0;
                      const gap = req.requiredLevel - currentScore;

                      return (
                        <tr key={req.skillName}>
                          <td className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            {req.skillName}
                            {userSkill?.verified && (
                              <span title="Verified Skill">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              </span>
                            )}
                          </td>
                          <td>
                            <Badge variant="default">{req.category}</Badge>
                          </td>
                          <td className="font-mono font-bold">
                            {currentScore > 0 ? (
                              <span className="text-slate-900 dark:text-slate-100">{currentScore}%</span>
                            ) : (
                              <span className="text-slate-400 italic">Not Assessed</span>
                            )}
                          </td>
                          <td className="font-mono text-slate-600 dark:text-slate-400">{req.requiredLevel}%</td>
                          <td className="font-mono text-xs text-slate-500 dark:text-slate-400">{req.weight}x</td>
                          <td>
                            {currentScore === 0 ? (
                              <Badge variant="danger">Missing (-{req.requiredLevel}%)</Badge>
                            ) : gap <= 0 ? (
                              <Badge variant="success" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Ready (+{Math.abs(gap)}%)
                              </Badge>
                            ) : gap <= 20 ? (
                              <Badge variant="warning" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Developing (-{gap}%)
                              </Badge>
                            ) : (
                              <Badge variant="danger" className="gap-1">
                                Needs Work (-{gap}%)
                              </Badge>
                            )}
                          </td>
                          <td className="text-xs text-slate-600 dark:text-slate-400">
                            {gap <= 0 ? (
                              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Eligible for Placement</span>
                            ) : gap <= 20 ? (
                              <span className="text-amber-700 dark:text-amber-400 font-medium">Complete Capstone Project</span>
                            ) : (
                              <span className="text-rose-700 dark:text-rose-400 font-medium">Take Recommended NPTEL Module</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8">
                <EmptyState
                  title="No Verified Skills in Your Vector"
                  description="Take the standardized 15-minute assessment to evaluate your technical and problem-solving abilities against target career benchmarks."
                  action={
                    <Link href="/student/assessment">
                      <Button size="sm" className="bg-navy-800 dark:bg-blue-600 text-white">
                        Take Standardized Assessment
                      </Button>
                    </Link>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add / Verify Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Verified Skill</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
              <div>
                <label className="label-text">Select Skill Competency</label>
                <select
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="input-field"
                >
                  {MOCK_SKILLS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="label-text mb-0">Proficiency Score: {newSkillScore}%</label>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={newSkillScore}
                  onChange={(e) => setNewSkillScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                Skills added manually are marked as self-reported until validated through a course certification or assessment.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-navy-800 dark:bg-blue-600 text-white">
                  Add to Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
