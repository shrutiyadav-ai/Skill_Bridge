"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Layers,
  HelpCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  History,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function StudentAssessmentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const studentEmail = session?.user?.email?.toLowerCase() || "";

  // ─── PAGE & PROFILE STATE ────────────────────────────────────────────────
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  // ─── ASSESSMENT LIFECYCLE ────────────────────────────────────────────────
  const [stage, setStage] = useState<"CONFIG" | "ACTIVE" | "RESULTS">("CONFIG");
  const [attemptLoading, setAttemptLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─── ACTIVE TEST STATE ───────────────────────────────────────────────────
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [startTime, setStartTime] = useState<number | null>(null);

  // ─── RESULT & REVIEW STATE ───────────────────────────────────────────────
  const [result, setResult] = useState<any | null>(null);
  const [resultTab, setResultTab] = useState<"SUMMARY" | "REVIEW" | "GAPS">("SUMMARY");

  // Fetch student profile and assessment configuration from backend
  const fetchAssessmentProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const res = await fetch("/api/student/assessment/profile");
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
      }
    } catch (err) {
      console.error("Failed to load assessment profile", err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchAssessmentProfile();
    }
  }, [session, fetchAssessmentProfile]);

  // Timer countdown
  useEffect(() => {
    if (stage !== "ACTIVE" || result) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, result]);

  // Start / Retake New Assessment Attempt
  const handleStartAssessment = async () => {
    setAttemptLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/student/assessment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to start assessment.");
        setAttemptLoading(false);
        return;
      }

      setQuestions(data.questions || []);
      setTimeLeft((data.durationMinutes || 40) * 60);
      setAnswers({});
      setCurrentIdx(0);
      setResult(null);
      setStartTime(Date.now());
      setStage("ACTIVE");
    } catch (err: any) {
      setErrorMessage("Network error starting assessment. Please try again.");
    } finally {
      setAttemptLoading(false);
    }
  };

  const handleSelectAnswer = (ans: string | number) => {
    if (!questions[currentIdx]) return;
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIdx].id]: ans,
    }));
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const elapsedSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    try {
      const res = await fetch("/api/student/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          durationSeconds: elapsedSeconds,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit assessment.");
        setIsSubmitting(false);
        return;
      }

      // Sync verified skills in localStorage for instant client-side responsiveness
      if (studentEmail && data.assessedSkillVector) {
        localStorage.setItem(
          `assessed_skills_${studentEmail}`,
          JSON.stringify(data.assessedSkillVector)
        );
      }

      setResult(data);
      setStage("RESULTS");
      fetchAssessmentProfile(); // Refresh history
    } catch (err) {
      setErrorMessage("Error submitting answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentIdx];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Personalized Skill Assessment
              </h1>
              <Badge variant="primary" className="text-[10px] tracking-wide">
                Course-Driven
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Dynamic academic competency evaluation tailored specifically to your degree curriculum
            </p>
          </div>

          {stage === "ACTIVE" && !result && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-navy-50 dark:bg-slate-800 text-navy-800 dark:text-blue-400 rounded-md border border-navy-200 dark:border-slate-700 font-mono text-xs font-bold self-start shadow-2xs">
              <Clock className="h-4 w-4" />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            STAGE 1: PERSONALIZED COURSE ASSESSMENT HUB
        ══════════════════════════════════════════════════════════════════════════ */}
        {stage === "CONFIG" && (
          <div className="space-y-6">
            {/* Academic Profile Hero Card */}
            <Card className="border-navy-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-navy-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-lg bg-navy-800 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-navy-800 dark:text-blue-400 uppercase tracking-wider">
                        Registered Academic Profile
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {profileData?.student?.course || "Degree Program"} — {profileData?.student?.department || "Department"}
                      </h2>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {profileData?.student?.year ? `Year ${profileData.student.year} (Semester ${profileData.student.semester || 5})` : "Undergraduate Curriculum"}
                      </span>
                    </div>
                  </div>

                  <div className="self-start sm:self-center">
                    <Badge variant="default" className="text-xs font-mono font-semibold">
                      {profileData?.config?.adaptiveTrack === "ADVANCED"
                        ? "⚡ Advanced Challenge"
                        : profileData?.config?.adaptiveTrack === "FOUNDATIONAL"
                        ? "🌱 Foundational Review"
                        : "⚖️ Standard Benchmark"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-2">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {profileData?.config?.description ||
                    "This standardized evaluation dynamically selects verified question pools matching your department and course requirements."}
                </p>

                {/* Domains Covered Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Layers className="h-3.5 w-3.5 text-navy-700 dark:text-blue-400" />
                    <span>Academic Domains Covered in Your Assessment:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(profileData?.config?.domainsCovered || [
                      "Programming & Algorithms",
                      "Database Management Systems & SQL",
                      "Operating Systems & Architecture",
                      "Analytical Problem Solving",
                    ]).map((domain: string, i: number) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-2xs"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-navy-600 dark:bg-blue-400 shrink-0" />
                        <span className="truncate">{domain}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Test Specs Box */}
                <div className="p-4 rounded-lg bg-slate-100/70 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-750 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Questions
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                      {profileData?.config?.totalQuestions || 15} Questions
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Duration
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                      {profileData?.config?.durationMinutes || 40} Mins (Timed)
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Passing Score
                    </span>
                    <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block">
                      {profileData?.config?.passingScore || 70}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Attempts Made
                    </span>
                    <span className="text-base font-bold text-navy-800 dark:text-blue-400 font-mono mt-0.5 block">
                      {profileData?.attemptCount || 0}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/80 dark:bg-slate-900/60 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Every new attempt draws a freshly randomized combination from your department pool.
                </span>

                <Button
                  onClick={handleStartAssessment}
                  disabled={attemptLoading || profileLoading}
                  size="lg"
                  className="gap-2 bg-navy-800 hover:bg-navy-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white w-full sm:w-auto shadow-sm"
                >
                  {attemptLoading ? (
                    <span>Generating Question Set...</span>
                  ) : (
                    <>
                      <span>{profileData?.attemptCount > 0 ? "Start New Attempt" : "Start Assessment"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Attempt History Card */}
            {profileData?.attempts && profileData.attempts.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-navy-800 dark:text-blue-400" />
                    <CardTitle className="text-sm sm:text-base">Assessment Attempt History</CardTitle>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Track your competency mastery and score progression across evaluations
                  </p>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Attempt</th>
                          <th>Date</th>
                          <th>Score</th>
                          <th>Status</th>
                          <th>Technical</th>
                          <th>Aptitude</th>
                          <th>Soft Skills</th>
                          <th>Questions Correct</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profileData.attempts.map((att: any) => (
                          <tr key={att.id}>
                            <td className="font-semibold text-slate-900 dark:text-slate-100">
                              Attempt #{att.attemptNumber}
                            </td>
                            <td className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(att.completedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                              {att.overallScore}%
                            </td>
                            <td>
                              {att.passed ? (
                                <Badge variant="success" className="gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Passed
                                </Badge>
                              ) : (
                                <Badge variant="warning" className="gap-1">
                                  Developing
                                </Badge>
                              )}
                            </td>
                            <td className="font-mono text-xs text-slate-600 dark:text-slate-300">
                              {att.technicalScore ?? "--"}%
                            </td>
                            <td className="font-mono text-xs text-slate-600 dark:text-slate-300">
                              {att.aptitudeScore ?? "--"}%
                            </td>
                            <td className="font-mono text-xs text-slate-600 dark:text-slate-300">
                              {att.softSkillScore ?? "--"}%
                            </td>
                            <td className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {att.correctAnswers} / {att.totalQuestions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            STAGE 2: ACTIVE QUESTIONNAIRE
        ══════════════════════════════════════════════════════════════════════════ */}
        {stage === "ACTIVE" && currentQ && (
          <Card className="shadow-md border-slate-200 dark:border-slate-800">
            {/* Progress Header */}
            <CardHeader className="bg-slate-50/75 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{currentQ.category}</Badge>
                  <Badge variant="default" className="text-[10px]">
                    {currentQ.difficulty}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Subject: <strong>{currentQ.subject || "Course Core"}</strong> ({currentQ.skillName})
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-navy-800 dark:text-blue-400 self-start sm:self-auto">
                  {currentQ.marks} Marks
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-navy-800 dark:bg-blue-600 h-full rounded-full transition-all duration-200"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* MCQ Options */}
              {currentQ.questionType === "MCQ" && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt: string, i: number) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAnswer(opt)}
                        className={`w-full p-3.5 rounded-lg border text-left text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? "bg-navy-50 dark:bg-navy-950/80 border-navy-800 dark:border-blue-500 text-navy-950 dark:text-white shadow-2xs ring-1 ring-navy-800/20"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-5 w-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-navy-800 dark:text-blue-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Scenario Questions */}
              {currentQ.questionType === "SCENARIO" && currentQ.options && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Choose the most appropriate professional action:
                  </span>
                  {currentQ.options.map((opt: string, i: number) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAnswer(opt)}
                        className={`w-full p-3.5 rounded-lg border text-left text-xs leading-relaxed transition ${
                          isSelected
                            ? "bg-navy-50 dark:bg-navy-950/80 border-navy-800 dark:border-blue-500 text-navy-950 dark:text-white font-medium shadow-2xs"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Rating Scale */}
              {currentQ.questionType === "RATING" && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                    <span>1 - Novice / Disagree</span>
                    <span>3 - Competent</span>
                    <span>5 - Expert / Strongly Agree</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectAnswer(val)}
                        className={`py-3 rounded-lg border text-center font-bold text-sm transition ${
                          answers[currentQ.id] === val
                            ? "bg-navy-800 dark:bg-blue-600 text-white border-navy-800 dark:border-blue-600"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                className="gap-1.5 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </Button>

              {currentIdx < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="gap-1.5 text-xs bg-navy-800 hover:bg-navy-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                >
                  Next Question
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitAssessment}
                  disabled={isSubmitting}
                  className="gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                >
                  {isSubmitting ? "Scoring Assessment..." : "Submit Assessment"}
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            STAGE 3: ASSESSMENT RESULTS & DIAGNOSTIC REPORT
        ══════════════════════════════════════════════════════════════════════════ */}
        {stage === "RESULTS" && result && (
          <div className="space-y-6">
            {/* Header Result Banner */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div
                className={`py-8 px-6 text-center text-white ${
                  result.passed
                    ? "bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700"
                    : "bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700"
                }`}
              >
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {result.passed
                    ? "Assessment Passed — Course Competency Verified!"
                    : "Assessment Completed — Capability Gaps Identified"}
                </h2>
                <p className="text-xs text-white/90 mt-1 max-w-xl mx-auto">
                  {result.passed
                    ? "Your verified skill scores have been recorded into your academic capability vector and synced with the placement matching engine."
                    : "Targeted skill development recommendations have been generated to strengthen your profile."}
                </p>
              </div>

              {/* 4 KPI Score Breakdown Cards */}
              <CardContent className="p-6 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                      Overall Score
                    </span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                      {result.overallScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Threshold: {result.passingScore}%
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                      Technical / Domain
                    </span>
                    <div className="text-2xl font-extrabold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                      {result.technicalScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">50% Weight</span>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                      Analytical Aptitude
                    </span>
                    <div className="text-2xl font-extrabold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                      {result.aptitudeScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">30% Weight</span>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                      Soft Skills & Ethics
                    </span>
                    <div className="text-2xl font-extrabold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                      {result.softSkillScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">20% Weight</span>
                  </div>
                </div>

                {/* Sub-Tab Selector */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mt-6 pt-2 gap-4">
                  <button
                    onClick={() => setResultTab("SUMMARY")}
                    className={`pb-2.5 text-xs font-bold transition border-b-2 ${
                      resultTab === "SUMMARY"
                        ? "border-navy-800 dark:border-blue-500 text-navy-800 dark:text-blue-400"
                        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800"
                    }`}
                  >
                    Competency Breakdown & Gaps
                  </button>

                  <button
                    onClick={() => setResultTab("REVIEW")}
                    className={`pb-2.5 text-xs font-bold transition border-b-2 ${
                      resultTab === "REVIEW"
                        ? "border-navy-800 dark:border-blue-500 text-navy-800 dark:text-blue-400"
                        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800"
                    }`}
                  >
                    Question-by-Question Review ({result.questionReviews?.length || 0})
                  </button>
                </div>

                {/* TAB 1: COMPETENCY BREAKDOWN */}
                {resultTab === "SUMMARY" && (
                  <div className="space-y-6 pt-4">
                    {/* Skill Scores Progress */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        Assessed Competency Scores:
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.skillBreakdown?.map((s: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 space-y-1.5"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                {s.skillName}
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              </span>
                              <Badge
                                variant={s.score >= 75 ? "success" : s.score >= 60 ? "warning" : "danger"}
                                className="text-[10px]"
                              >
                                {s.score >= 75 ? "Strong" : s.score >= 60 ? "Developing" : "Needs Work"}
                              </Badge>
                            </div>

                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
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

                            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              <span>Category: {s.category}</span>
                              <span className="font-bold">{s.score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Identified Skill Gaps Box */}
                    {result.skillGaps && result.skillGaps.length > 0 && (
                      <div className="p-4 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                          <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <span>Identified Skill Gaps & Recommended Actions:</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200/90 pl-5 list-disc">
                          {result.skillGaps
                            .filter((g: any) => g.gap > 0)
                            .map((g: any, i: number) => (
                              <li key={i}>
                                <strong>{g.skillName} ({g.currentScore}%)</strong>: Deficit of {g.gap}% from target standard. Complete practice modules in this domain.
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: DETAILED QUESTION REVIEW */}
                {resultTab === "REVIEW" && (
                  <div className="space-y-4 pt-4">
                    {result.questionReviews?.map((q: any, i: number) => (
                      <div
                        key={q.id || i}
                        className={`p-4 rounded-lg border text-xs space-y-2.5 transition ${
                          q.isCorrect
                            ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50"
                            : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              Q{i + 1}. {q.question}
                            </span>
                          </div>
                          <Badge variant={q.isCorrect ? "success" : "danger"} className="shrink-0 gap-1 text-[10px]">
                            {q.isCorrect ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                +{q.marksEarned} Marks
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                0 Marks
                              </>
                            )}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="p-2 rounded bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-500 dark:text-slate-400 block font-semibold">Your Answer:</span>
                            <span className={q.isCorrect ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-rose-700 dark:text-rose-400 font-medium"}>
                              {q.selectedAnswer !== null ? String(q.selectedAnswer) : "No answer selected"}
                            </span>
                          </div>

                          <div className="p-2 rounded bg-white/75 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <span className="text-slate-500 dark:text-slate-400 block font-semibold">Correct Answer:</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                              {q.correctAnswer}
                            </span>
                          </div>
                        </div>

                        {q.explanation && (
                          <div className="p-2.5 rounded bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                            <strong>Explanation: </strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              {/* Bottom Actions */}
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-6 border-t border-slate-200 dark:border-slate-800">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStage("CONFIG");
                    setResult(null);
                  }}
                  className="gap-1.5 w-full sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4" />
                  Take Another Attempt
                </Button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Link href="/student/skills" className="w-full sm:w-auto">
                    <Button variant="secondary" className="gap-1.5 w-full sm:w-auto text-xs">
                      View Skill Profile & Gaps
                    </Button>
                  </Link>

                  <Link href="/student/dashboard" className="w-full sm:w-auto">
                    <Button className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white w-full sm:w-auto text-xs">
                      Go to Dashboard
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
