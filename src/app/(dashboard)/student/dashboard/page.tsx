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
  MOCK_LEARNING_RESOURCES,
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
} from "lucide-react";

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const studentName = session?.user?.name || "Student";
  const studentEmail = session?.user?.email?.toLowerCase() || "";

  const isDemoStudent =
    studentEmail === "aditya.sharma@iitd.ac.in" ||
    studentEmail === "priya.patel@nitt.ac.in";

  // Check for local assessed skills if newly registered user took the assessment
  const [userSkills, setUserSkills] = useState(isDemoStudent ? MOCK_STUDENT_SKILLS : []);
  const [userApplications, setUserApplications] = useState(isDemoStudent ? MOCK_APPLICATIONS : []);

  useEffect(() => {
    if (!isDemoStudent) {
      const stored = localStorage.getItem(`assessed_skills_${studentEmail}`);
      if (stored) {
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
  }, [isDemoStudent, studentEmail]);

  // Compute live match metrics
  const targetRole = MOCK_CAREER_ROLES[0]; // Machine Learning Engineer
  const hasSkills = userSkills.length > 0;
  const { readinessPercentage, roadmapSteps, matchResult } = calculateCareerReadiness(
    userSkills,
    targetRole.skills
  );

  const displayReadiness = hasSkills ? readinessPercentage : 0;
  const displayIndustryMatch = hasSkills ? 86 : 0;

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

    const userMsg = { sender: "user" as const, text: q, time: "Just now" };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/student/career-assist", {
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
                  Avg. Industry Match
                </span>
                <span className="text-xs text-navy-800 dark:text-blue-400 font-bold font-mono">
                  {hasSkills ? "14 Roles" : "0 Roles"}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {displayIndustryMatch}%
              </div>
              <Progress value={displayIndustryMatch} color="navy" className="mt-3" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {hasSkills ? "Highest: Flipkart ML Intern (91%)" : "Calculated from skill vector"}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Priority Gaps */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Priority Skill Gaps
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold font-mono">
                  {hasSkills ? `${matchResult.priorityGaps.length} Identified` : "None"}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {hasSkills ? matchResult.priorityGaps.length : 0}
              </div>
              <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                {hasSkills ? (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    Top Gap: {matchResult.priorityGaps[0]?.skillName || "SQL"} (-{matchResult.priorityGaps[0]?.gap || 22}%)
                  </span>
                ) : (
                  <span>Take assessment to identify gaps</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Weighted against job requirements</p>
            </CardContent>
          </Card>

          {/* Card 4: Applications */}
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active Applications
                </span>
                <span className="text-xs text-navy-800 dark:text-blue-400 font-semibold font-mono">
                  {userApplications.length} Submissions
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {userApplications.length}
              </div>
              <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                {userApplications.length > 0 ? (
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Latest: {userApplications[0]?.companyName}
                  </span>
                ) : (
                  <span>No active submissions</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Live recruitment pipeline</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Banner for New Students */}
        {!hasSkills && (
          <div className="p-4 bg-navy-50 dark:bg-navy-950/60 border border-navy-200 dark:border-blue-900/60 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-navy-800 dark:bg-blue-600 text-white flex items-center justify-center shrink-0">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-950 dark:text-white">Initial Assessment Required</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Take the 15-minute standardized assessment to evaluate your technical, aptitude, and soft skills.
                </p>
              </div>
            </div>
            <Link href="/student/assessment">
              <Button size="sm" className="shrink-0 bg-navy-800 dark:bg-blue-600 text-white">
                Start Assessment Now
              </Button>
            </Link>
          </div>
        )}

        {/* 2-Column Section: Gaps & Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Skill Gap Breakdown (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Skill Gap Diagnostic</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Target Role: <span className="font-semibold text-slate-700 dark:text-slate-300">{targetRole.title}</span>
                  </p>
                </div>
                <Link href="/student/skills">
                  <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                    Full Profile
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {hasSkills ? (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Skill Competency</th>
                          <th>Category</th>
                          <th>Current Score</th>
                          <th>Required Level</th>
                          <th>Status / Gap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {targetRole.skills.map((req) => {
                          const userSkill = userSkills.find(
                            (s) => s.skillName.toLowerCase() === req.skillName.toLowerCase()
                          );
                          const currentScore = userSkill ? userSkill.score : 0;
                          const gap = req.requiredLevel - currentScore;

                          return (
                            <tr key={req.skillName}>
                              <td className="font-semibold text-slate-900 dark:text-slate-100">{req.skillName}</td>
                              <td>
                                <Badge variant="default">{req.category}</Badge>
                              </td>
                              <td className="font-mono font-semibold">{currentScore}%</td>
                              <td className="font-mono text-slate-500 dark:text-slate-400">{req.requiredLevel}%</td>
                              <td>
                                {gap <= 0 ? (
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
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <EmptyState
                      title="No Verified Skills Yet"
                      description="Complete your initial skill assessment to generate your personalized skill vector and compare your competency against industry standards."
                      action={
                        <Link href="/student/assessment">
                          <Button size="sm" className="bg-navy-800 dark:bg-blue-600 text-white">
                            Take Skill Assessment
                          </Button>
                        </Link>
                      }
                    />
                  </div>
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

          {/* Right Column: Applications & Roadmaps (1 col) */}
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

            {/* Quick Learning Roadmaps */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle>Curated Learning</CardTitle>
                <Badge variant="default">NPTEL / Coursera</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_LEARNING_RESOURCES.slice(0, 3).map((res) => (
                  <a
                    key={res.id}
                    href={res.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-xs flex items-start justify-between gap-2 transition group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-navy-800 dark:group-hover:text-blue-400 transition">
                        {res.title}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {res.provider} • {res.skillName} • {res.duration}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-navy-800 dark:group-hover:text-blue-400 shrink-0 mt-0.5" />
                  </a>
                ))}
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
                  <p className="text-[11px] text-slate-300">Intelligent career counseling & gap diagnostics</p>
                </div>
              </div>
              <button
                onClick={() => setAssistantOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      m.sender === "user"
                        ? "bg-navy-800 dark:bg-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-2xs"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <span
                      className={`text-[9px] mt-1 block ${
                        m.sender === "user" ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 text-xs flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-navy-600 dark:bg-blue-500 animate-pulse" />
                    Analyzing skill vector with Gemini...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleAskAssistant("What are my top missing skills for ML Engineer?")}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Missing skills for ML?
              </button>
              <button
                type="button"
                onClick={() => handleAskAssistant("Which internship matches my verified vector best?")}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Best matched internship?
              </button>
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAssistant();
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about skill gaps, internships, or courses..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-navy-800 dark:focus:ring-blue-500"
              />
              <Button type="submit" size="sm" disabled={isAiLoading} className="bg-navy-800 dark:bg-blue-600 text-white">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
