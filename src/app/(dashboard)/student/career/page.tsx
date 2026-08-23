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
import {
  MOCK_CAREER_ROLES,
  MOCK_STUDENT_SKILLS,
  MOCK_OPPORTUNITIES,
  MOCK_LEARNING_RESOURCES,
} from "@/lib/mock-data";
import { calculateCareerReadiness } from "@/lib/matching";
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
} from "lucide-react";

export default function CareerRoadmapPage() {
  const { data: session } = useSession();
  const studentEmail = session?.user?.email?.toLowerCase() || "";
  const isDemoStudent =
    studentEmail === "aditya.sharma@iitd.ac.in" ||
    studentEmail === "priya.patel@nitt.ac.in";

  const [skills, setSkills] = useState(isDemoStudent ? MOCK_STUDENT_SKILLS : []);
  const [selectedRole, setSelectedRole] = useState(MOCK_CAREER_ROLES[0]);

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

  const hasSkills = skills.length > 0;

  const { readinessPercentage, roadmapSteps, matchResult } = calculateCareerReadiness(
    skills,
    selectedRole.skills
  );

  const displayReadiness = hasSkills ? readinessPercentage : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header & Target Role Selector */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Career Recommendation & Roadmap Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Deterministic skill-gap mapping and step-by-step career path preparation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Target Role:</span>
            <select
              value={selectedRole.id}
              onChange={(e) => {
                const found = MOCK_CAREER_ROLES.find((r) => r.id === e.target.value);
                if (found) setSelectedRole(found);
              }}
              className="input-field py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100"
            >
              {MOCK_CAREER_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.domain})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Readiness Overview Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="metric-card md:col-span-2 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-850 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Target Pathway Readiness
                </span>
                <span className="text-xs font-bold text-navy-800 dark:text-blue-400 bg-navy-50 dark:bg-navy-950/80 px-2 py-0.5 rounded border border-navy-200 dark:border-blue-900/60">
                  {selectedRole.title}
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-3">
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {displayReadiness}%
                </div>
                <Badge variant={displayReadiness >= 75 ? "success" : "warning"}>
                  {hasSkills ? (displayReadiness >= 75 ? "Placement Ready" : "Developing Profile") : "Assessment Pending"}
                </Badge>
              </div>
              <Progress value={displayReadiness} color="emerald" className="mt-4" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              {hasSkills
                ? `You meet industry readiness criteria for ${matchResult.strongSkills.length} of ${selectedRole.skills.length} core competencies. Follow the curated milestones below to close remaining gaps.`
                : "Complete your initial skill assessment to generate your personalized readiness score and custom milestone roadmap."}
            </p>
          </div>

          <div className="metric-card flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Priority Action
              </span>
              <div className="mt-2 space-y-2 text-xs">
                {hasSkills ? (
                  matchResult.priorityGaps.length > 0 ? (
                    matchResult.priorityGaps.slice(0, 2).map((g) => (
                      <div
                        key={g.skillName}
                        className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{g.skillName}</span>
                        <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">-{g.gap}%</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-md">
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
              <Button size="sm" variant="outline" className="w-full text-xs mt-3">
                {hasSkills ? "View Gap Details" : "Start Assessment"}
              </Button>
            </Link>
          </div>
        </div>

        {/* 5-Step Curated Learning & Milestone Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized 5-Step Career Preparation Pipeline</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Structured sequence designed to take your skill vector from current levels to verified placement readiness
            </p>
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
                      isFirst
                        ? "bg-navy-800 dark:bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {step.step}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{step.title}</h3>
                      <Badge variant={isFirst ? "secondary" : "default"}>
                        {isFirst ? "Active Milestone" : "Upcoming"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
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
