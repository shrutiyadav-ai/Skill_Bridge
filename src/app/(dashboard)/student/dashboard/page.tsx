"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  MOCK_STUDENT_SKILLS,
  MOCK_CAREER_ROLES,
  MOCK_OPPORTUNITIES,
  MOCK_APPLICATIONS,
} from "@/lib/mock-data";
import { calculateCareerReadiness } from "@/lib/matching";
import { formatCurrency, getStatusBadge } from "@/lib/utils";
import {
  TrendingUp,
  Briefcase,
  BookOpen,
  ArrowRight,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Send,
  Sparkles,
  ExternalLink,
  Clock,
  FolderOpen,
  Flame,
  Zap,
  Award,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const studentName = session?.user?.name || "Student";
  const studentEmail = session?.user?.email?.toLowerCase() || "";

  const isDemoStudent =
    studentEmail === "aditya.sharma@iitd.ac.in" ||
    studentEmail === "priya.patel@nitt.ac.in" ||
    studentEmail === "rohit.verma@srcc.du.ac.in";

  const [careerRoles, setCareerRoles] = useState<any[]>(MOCK_CAREER_ROLES);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [userApplications, setUserApplications] = useState<any[]>(isDemoStudent ? MOCK_APPLICATIONS : []);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      // 1. Fetch live user profile & skills
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.skills && data.skills.length > 0) {
            setUserSkills(
              data.skills.map((s: any) => ({
                id: s.id,
                skillId: s.skillId,
                skillName: s.name,
                category: s.category || "TECHNICAL",
                score: s.score || 0,
                verified: s.verified || false,
                source: s.source || "assessment",
              }))
            );
          }
        }
      } catch (e) {}

      // 2. Fetch dynamic student career roles
      try {
        const res = await fetch("/api/student/career-roles");
        if (res.ok) {
          const data = await res.json();
          if (data.careerRoles && data.careerRoles.length > 0) {
            setCareerRoles(data.careerRoles);
          }
        }
      } catch (e) {}

      // 3. Fetch intelligent online course recommendations
      try {
        const res = await fetch("/api/student/courses/recommendations");
        if (res.ok) {
          const data = await res.json();
          if (data.recommendations && data.recommendations.length > 0) {
            setRecommendedCourses(data.recommendations);
          }
        }
      } catch (e) {}

      // Check local storage for skills and applications
      if (studentEmail) {
        const stored = localStorage.getItem(`assessed_skills_${studentEmail}`);
        if (stored && userSkills.length === 0) {
          try {
            setUserSkills(JSON.parse(stored));
          } catch (e) {}
        }
        const storedApps = localStorage.getItem(`applications_${studentEmail}`);
        if (storedApps) {
          try {
            setUserApplications(JSON.parse(storedApps));
          } catch (e) {}
        }
      }
    }

    if (studentEmail) {
      loadDashboardData();
    }
  }, [studentEmail]);

  // Dynamic Course-Specific Target Role
  const targetRole = careerRoles[selectedRoleIndex] || MOCK_CAREER_ROLES[0];
  const hasSkills = userSkills.length > 0;
  const { readinessPercentage, roadmapSteps, matchResult } = calculateCareerReadiness(
    userSkills,
    targetRole.skills || [],
    {
      roleTitle: targetRole.title,
      domain: targetRole.domain,
      certifications: targetRole.certifications,
      toolsAndTechnologies: targetRole.toolsAndTechnologies,
    }
  );

  const displayReadiness = hasSkills ? readinessPercentage : 0;
  const displayIndustryMatch = hasSkills ? Math.min(95, Math.max(60, displayReadiness + 8)) : 0;

  // AI Assistant Widget State
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "assistant"; text: string; time: string }[]
  >([
    {
      sender: "assistant",
      text: hasSkills
        ? `Hello ${studentName}! I have analyzed your verified skill vector. You are ${displayReadiness}% ready for the ${targetRole.title} role. How can I help with your roadmap today?`
        : `Hello ${studentName}! Welcome to SkillBridge. Take your initial skill assessment to generate your personalized skill vector and career readiness score.`,
      time: "Just now",
    },
  ]);
  const [query, setQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskAssistant = async (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim()) return;

    const newMsg = { sender: "user" as const, text: q, time: "Just now" };
    setMessages((prev) => [...prev, newMsg]);
    setQuery("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          studentName,
          targetRole: targetRole.title,
          readiness: displayReadiness,
          strongSkills: matchResult.strongSkills,
          gaps: matchResult.priorityGaps.map((g) => `${g.skillName} (gap: ${g.gap}%)`),
        }),
      });

      const data = await res.json();
      const aiReply =
        data.answer ||
        "Focus on building hands-on projects and completing your skill assessments to elevate your industry match score.";

      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: aiReply, time: "Just now" },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "Start with technical foundation assessments to establish your verified skill vector on SkillBridge.",
          time: "Just now",
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getPlatformBadgeStyle = (platform: string) => {
    switch (platform.toUpperCase()) {
      case "NPTEL":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
      case "COURSERA":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
      case "SWAYAM":
        return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
      case "GOOGLE":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
      case "MICROSOFT":
        return "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800";
      case "AWS":
        return "bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Welcome back, {studentName}
              </h1>
              <Badge variant={hasSkills ? "secondary" : "outline"}>
                {hasSkills ? "Active Profile" : "New Student"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Target Track: <span className="font-semibold text-slate-700 dark:text-slate-300">{targetRole.title}</span> •
              Assessment Status: <span className={hasSkills ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-amber-600 dark:text-amber-400 font-medium"}>{hasSkills ? "Verified" : "Pending Initial Assessment"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/student/assessment">
              <Button size="sm" variant="outline" className="gap-1.5">
                <ClipboardCheck className="h-4 w-4 text-navy-800 dark:text-blue-400" />
                {hasSkills ? "Retake Assessment" : "Begin Assessment"}
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setAssistantOpen(true)}
              className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white"
            >
              <Bot className="h-4 w-4 text-amber-400" />
              Career Assistant
            </Button>
          </div>
        </div>

        {/* 3 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Readiness */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Career Readiness
                </span>
                <Badge variant={displayReadiness >= 70 ? "success" : "warning"}>
                  {displayReadiness >= 70 ? "Placement Ready" : "Developing"}
                </Badge>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {displayReadiness}%
              </div>
              <Progress value={displayReadiness} color="emerald" className="mt-3" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {hasSkills ? "Benchmark: 70% threshold" : "Complete assessment to score"}
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Industry Match */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Industry Match
                </span>
                <Badge variant="primary">Target Track</Badge>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {displayIndustryMatch}%
              </div>
              <Progress value={displayIndustryMatch} color="blue" className="mt-3" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                Role: {targetRole.title}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Skills Verified */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Verified Skills
                </span>
                <Badge variant="outline">{userSkills.filter((s) => s.verified).length} Verified</Badge>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {userSkills.length}
              </div>
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {userSkills.slice(0, 3).map((s) => (
                  <span
                    key={s.skillName}
                    className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {s.skillName} ({s.score}%)
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {hasSkills ? "Assessed across core curriculum" : "Zero verified skills"}
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Action Status */}
          <Card className="bg-gradient-to-br from-navy-800 to-navy-950 text-white dark:border-slate-800">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                  Recommended Action
                </span>
                <h4 className="text-sm font-bold mt-1 text-white">
                  {matchResult.priorityGaps.length > 0
                    ? `Close Gap in ${matchResult.priorityGaps[0].skillName}`
                    : "Apply for Opportunities"}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  {matchResult.priorityGaps.length > 0
                    ? `Bridge deficit (-${matchResult.priorityGaps[0].gap}%) with recommended online courses.`
                    : "Your skill profile qualifies for premium internships and placement drives."}
                </p>
              </div>
              <Link href="/student/courses" className="mt-3">
                <Button size="sm" className="w-full bg-white text-navy-900 hover:bg-slate-100 text-xs font-bold">
                  Browse Online Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Target Role Selector Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Selected Target Track:
            </span>
            <span className="text-xs font-extrabold text-navy-900 dark:text-blue-400 bg-navy-50 dark:bg-slate-800 px-2.5 py-1 rounded border border-navy-200 dark:border-slate-700">
              {targetRole.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Switch Target:</span>
            <select
              value={selectedRoleIndex}
              onChange={(e) => setSelectedRoleIndex(Number(e.target.value))}
              className="input-field py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            >
              {careerRoles.map((role, idx) => (
                <option key={role.id || role.title} value={idx}>
                  {role.title} ({role.domain || "Technology"})
                </option>
              ))}
            </select>
            <Link href="/student/skills">
              <Button size="sm" variant="ghost" className="text-xs text-navy-800 dark:text-blue-400">
                Detailed Matrix
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            FEATURED: RECOMMENDED FOR YOU — ONLINE COURSE RECOMMENDATIONS
        ══════════════════════════════════════════════════════════════════════════ */}
        <Card className="border-navy-200 dark:border-slate-800 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                  <GraduationCap className="h-5 w-5 text-navy-800 dark:text-blue-400" />
                  Recommended for You: Online Courses
                </CardTitle>
                <Badge variant="primary" className="text-[10px]">
                  Curriculum & Gap Driven
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Targeted upskilling from NPTEL, Coursera, SWAYAM, Google, Microsoft, and AWS based on your identified assessment gaps
              </p>
            </div>

            <Link href="/student/courses">
              <Button variant="outline" size="sm" className="text-xs gap-1 text-navy-800 dark:text-blue-400">
                View All Courses
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-3">
            {recommendedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedCourses.slice(0, 3).map((item) => {
                  const { course, priority, priorityBadge, priorityIcon, recommendationReason } = item;

                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between gap-3 shadow-2xs group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPlatformBadgeStyle(course.platform)}`}>
                            {course.platform}
                          </span>
                          <Badge variant={priorityBadge} className="text-[10px] gap-1 font-bold">
                            <span>{priorityIcon}</span>
                            {priority === "HIGH_PRIORITY" ? "High Priority" : priority === "RECOMMENDED" ? "Recommended" : "Optional"}
                          </Badge>
                        </div>

                        <div>
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-navy-800 dark:hover:text-blue-400 transition flex items-start justify-between gap-1.5"
                          >
                            <span className="line-clamp-2">{course.title}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-navy-800 dark:group-hover:text-blue-400 shrink-0 mt-0.5" />
                          </a>
                          {course.provider && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {course.provider}
                            </p>
                          )}
                        </div>

                        <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {recommendationReason}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {course.skillsCovered.slice(0, 3).map((s: string) => (
                            <span
                              key={s}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-medium">{course.duration || "Self-Paced"}</span>
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-navy-800 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          View Course
                          <ChevronRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Course recommendations ready
                </p>
                <p className="text-[11px] mt-0.5">
                  Complete your skill assessment or visit the Online Courses hub.
                </p>
                <Link href="/student/courses" className="mt-3 inline-block">
                  <Button size="sm" variant="outline" className="text-xs">
                    Open Learning Hub
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Skill Assessment & Recommended Opportunities (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skill Matrix Breakdown */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Core Competency Verification Matrix</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Target Role: <span className="font-semibold text-slate-800 dark:text-slate-200">{targetRole.title}</span>
                  </p>
                </div>
                <Link href="/student/skills">
                  <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                    Full Diagnostic
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {hasSkills ? (
                  <div className="space-y-4">
                    {targetRole.skills && targetRole.skills.length > 0 ? (
                      targetRole.skills.slice(0, 5).map((req: any) => {
                        const userSkill = userSkills.find(
                          (s) => s.skillName.toLowerCase() === req.skillName.toLowerCase()
                        );
                        const current = userSkill ? userSkill.score : 0;
                        const reqLevel = req.requiredLevel || 75;
                        const gap = reqLevel - current;

                        return (
                          <div key={req.skillName} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                {req.skillName}
                                {userSkill?.verified && (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                )}
                              </span>
                              <span className="font-mono text-slate-600 dark:text-slate-400">
                                {current}% / {reqLevel}%
                                {gap > 0 ? (
                                  <span className="text-rose-600 dark:text-rose-400 ml-1.5 font-bold">
                                    (-{gap}%)
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 font-bold">
                                    (Ready)
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                              <div
                                className={`h-full rounded-full ${
                                  gap <= 0
                                    ? "bg-emerald-600 dark:bg-emerald-400"
                                    : current >= 50
                                    ? "bg-amber-500 dark:bg-amber-400"
                                    : "bg-rose-500 dark:bg-rose-400"
                                }`}
                                style={{ width: `${Math.min(100, current)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      userSkills.slice(0, 5).map((s) => (
                        <div key={s.skillName} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              {s.skillName}
                              {s.verified && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              )}
                            </span>
                            <span className="font-mono text-slate-600 dark:text-slate-400">
                              {s.score}%
                            </span>
                          </div>
                          <Progress
                            value={s.score}
                            color={s.score >= 75 ? "emerald" : s.score >= 60 ? "amber" : "rose"}
                          />
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <EmptyState
                    icon={<ClipboardCheck className="h-8 w-8 text-slate-400" />}
                    title="No skill assessment on file"
                    description="Take your personalized curriculum assessment to calculate verified proficiency scores and identify priority action gaps."
                    action={
                      <Link href="/student/assessment">
                        <Button size="sm" className="bg-navy-800 dark:bg-blue-600 text-white">
                          Start Assessment Now
                        </Button>
                      </Link>
                    }
                  />
                )}
              </CardContent>
            </Card>

            {/* Recommended Opportunities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Top Recommended Opportunities</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ranked by compatibility score with your verified skill vector
                  </p>
                </div>
                <Link href="/opportunities">
                  <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_OPPORTUNITIES.slice(0, 3).map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{opp.title}</h4>
                        <Badge variant="secondary">{opp.type}</Badge>
                        {opp.remote && <Badge variant="outline">Remote</Badge>}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {opp.companyName} • {opp.location}
                        {opp.stipend ? ` • ${formatCurrency(opp.stipend)}/mo` : ""}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {opp.requiredSkills.slice(0, 4).map((s) => (
                          <span
                            key={s.skillName}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {s.skillName} ({s.requiredLevel}%)
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Match</span>
                        <span className="text-sm font-bold text-navy-800 dark:text-blue-400 font-mono">
                          {opp.compatibilityScore ? `${opp.compatibilityScore}%` : "88%"}
                        </span>
                      </div>
                      <Link href={`/opportunities/${opp.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Applications & Curated Upskilling (1 col) */}
          <div className="space-y-6">
            {/* Active Applications */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle>Recent Applications</CardTitle>
                <Link href="/student/applications">
                  <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400">
                    Track All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {userApplications.length > 0 ? (
                  userApplications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{app.opportunityTitle}</span>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{app.companyName}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
                    <FolderOpen className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                    <p className="font-medium text-slate-800 dark:text-slate-200">No active applications</p>
                    <p className="text-[11px] mt-0.5">Explore open positions in the marketplace</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Online Courses Summary */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle>Curated Learning Hub</CardTitle>
                <Link href="/student/courses">
                  <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400">
                    All Courses
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedCourses.slice(0, 3).map((item) => {
                  const { course, priority, priorityIcon } = item;

                  return (
                    <a
                      key={course.id}
                      href={course.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-xs flex items-start justify-between gap-2 transition group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getPlatformBadgeStyle(course.platform)}`}>
                            {course.platform}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">{priorityIcon}</span>
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-navy-800 dark:group-hover:text-blue-400 transition block line-clamp-1">
                          {course.title}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {course.provider || "Official Partner"} • {course.duration || "Self-Paced"}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-navy-800 dark:group-hover:text-blue-400 shrink-0 mt-0.5" />
                    </a>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Career Assistant Modal */}
      {assistantOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">SkillBridge AI Career Assistant</h3>
                  <p className="text-[11px] text-slate-400">Personalized career pathway advice</p>
                </div>
              </div>
              <button
                onClick={() => setAssistantOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      m.sender === "user"
                        ? "bg-navy-800 dark:bg-blue-600 text-white"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-2xs"
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    <span
                      className={`text-[9px] block mt-1 ${
                        m.sender === "user" ? "text-blue-200" : "text-slate-400"
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin" />
                    <span>Analyzing your skill vector and roadmaps...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
              <input
                type="text"
                placeholder="Ask about your skill gaps, courses, or roadmaps..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAssistant()}
                className="input-field py-1.5 text-xs flex-1"
              />
              <Button
                size="sm"
                onClick={() => handleAskAssistant()}
                disabled={isAiLoading || !query.trim()}
                className="bg-navy-800 dark:bg-blue-600 text-white"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
