"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import { calculateCareerReadiness } from "@/lib/matching";
import { UserSkillItem } from "@/types";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  FolderGit2,
  Briefcase,
  Layers,
  Sparkles,
  ClipboardCheck,
  GraduationCap,
  Wrench,
  Award,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function CareerRoadmapPage() {
  const { data: session } = useSession();
  const studentEmail = session?.user?.email?.toLowerCase() || "";

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────
  const [skills, setSkills] = useState<UserSkillItem[]>([]);
  const [careerRoles, setCareerRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ─── LOAD STUDENT PROFILE, VERIFIED SKILLS & DYNAMIC CAREER ROLES ──────
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

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
        console.error("Failed to load career roadmap data", e);
      } finally {
        setLoading(false);
      }
    }

    if (studentEmail) {
      loadData();
    }
  }, [studentEmail]);

  // Selected Career Role
  const selectedRole =
    careerRoles.find((r) => r.id === selectedRoleId) || careerRoles[0] || null;

  const hasSkills = skills.length > 0;

  // Dynamic Career Readiness & Tailored Roadmap Generation
  const { readinessPercentage, roadmapSteps, matchResult } = selectedRole
    ? calculateCareerReadiness(skills, selectedRole.skills || [], {
        roleTitle: selectedRole.title,
        domain: selectedRole.domain,
        certifications: selectedRole.certifications,
        toolsAndTechnologies: selectedRole.toolsAndTechnologies,
      })
    : {
        readinessPercentage: 0,
        roadmapSteps: [],
        matchResult: {
          compatibilityScore: 0,
          strongSkills: [],
          partialSkills: [],
          missingSkills: [],
          priorityGaps: [],
          explanation: "",
        },
      };

  const displayReadiness = hasSkills ? readinessPercentage : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header & Dynamic Target Role Dropdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Career Recommendation & Roadmap Engine
              </h1>
              <Badge variant="primary" className="text-[10px]">
                Curriculum-Driven
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Dynamic readiness index, gap diagnostic, and milestone roadmap tailored to your academic discipline
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase shrink-0">
              Target Role:
            </span>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="input-field py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 min-w-[240px]"
            >
              {careerRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.domain})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Readiness & Priority Gaps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main Readiness Gauge Card */}
          <div className="metric-card md:col-span-2 bg-gradient-to-r from-white via-slate-50/50 to-navy-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 flex flex-col justify-between border-navy-100 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  Target Pathway Readiness
                </span>
                {selectedRole && (
                  <span className="text-xs font-bold text-navy-800 dark:text-blue-400 bg-navy-50 dark:bg-navy-950/80 px-2 py-0.5 rounded border border-navy-200 dark:border-blue-900/60">
                    {selectedRole.title}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3 mt-3">
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {displayReadiness}%
                </div>
                <Badge variant={displayReadiness >= 75 ? "success" : displayReadiness >= 50 ? "warning" : "danger"}>
                  {hasSkills
                    ? displayReadiness >= 75
                      ? "Placement Ready"
                      : "Developing Profile"
                    : "Assessment Pending"}
                </Badge>
              </div>

              <Progress value={displayReadiness} color="emerald" className="mt-4" />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {hasSkills && selectedRole
                  ? `You satisfy industry placement criteria for ${matchResult.strongSkills.length} of ${selectedRole.skills?.length || 0} core competencies. Follow your personalized preparation pipeline below.`
                  : "Complete your course skill assessment to generate your verified readiness score and custom milestone roadmap."}
              </p>

              {/* Role Benchmark Specs Badges */}
              {selectedRole && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedRole.salaryRange && (
                    <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {selectedRole.salaryRange}
                    </span>
                  )}
                  {selectedRole.experienceLevel && (
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {selectedRole.experienceLevel}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Priority Gap Action Box */}
          <div className="metric-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-navy-800 dark:text-blue-400" />
                Priority Action Gaps
              </span>

              <div className="mt-3 space-y-2 text-xs">
                {hasSkills ? (
                  matchResult.priorityGaps.length > 0 ? (
                    matchResult.priorityGaps.slice(0, 2).map((g) => (
                      <div
                        key={g.skillName}
                        className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {g.skillName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Current: {g.currentLevel}% • Target: {g.requiredLevel}%
                          </span>
                        </div>
                        <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">
                          -{g.gap}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-md text-xs font-medium">
                      All competencies meet placement benchmarks!
                    </div>
                  )
                ) : (
                  <div className="p-3 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-md text-xs">
                    Take your assessment to identify gap priorities.
                  </div>
                )}
              </div>
            </div>

            <Link href={hasSkills ? "/student/skills" : "/student/assessment"}>
              <Button size="sm" variant="outline" className="w-full text-xs mt-3 gap-1">
                {hasSkills ? "View Detailed Gap Matrix" : "Start Assessment"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            DYNAMIC PERSONALIZED CAREER PREPARATION ROADMAP
        ══════════════════════════════════════════════════════════════════════════ */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base sm:text-lg">
                  Personalized Preparation Pipeline for {selectedRole?.title || "Target Career"}
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sequential milestone sequence dynamically generated from your specific competency deficits and industry toolchains
                </p>
              </div>

              {selectedRole?.domain && (
                <Badge variant="secondary" className="self-start sm:self-auto font-mono text-[10px]">
                  {selectedRole.domain}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {roadmapSteps.map((step, idx) => {
              const isFirst = idx === 0;
              return (
                <div key={step.step} className="flex gap-4 items-start relative group">
                  {/* Timeline connector */}
                  {idx < roadmapSteps.length - 1 && (
                    <div className="absolute top-10 left-4 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
                  )}

                  {/* Step circle indicator */}
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 z-10 ${
                      step.status === "COMPLETED"
                        ? "bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs"
                        : isFirst
                        ? "bg-navy-800 dark:bg-blue-600 text-white shadow-xs ring-4 ring-navy-100 dark:ring-blue-950"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {step.step}
                  </div>

                  {/* Step content box */}
                  <div className="flex-1 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        {step.title}
                        {step.type === "CERTIFICATION" && (
                          <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        )}
                        {step.type === "PROJECT" && (
                          <FolderGit2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        )}
                      </h3>
                      <Badge
                        variant={
                          step.status === "COMPLETED"
                            ? "success"
                            : isFirst
                            ? "secondary"
                            : "default"
                        }
                        className="text-[10px]"
                      >
                        {step.status === "COMPLETED"
                          ? "Benchmark Met"
                          : isFirst
                          ? "Active Milestone"
                          : "Upcoming Milestone"}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
