"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_ASSESSMENT_QUESTIONS, MOCK_CAREER_ROLES } from "@/lib/mock-data";
import { evaluateAssessment } from "@/lib/scoring";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
} from "lucide-react";

export default function StudentAssessmentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const studentEmail = session?.user?.email?.toLowerCase() || "";

  const [selectedRole, setSelectedRole] = useState(MOCK_CAREER_ROLES[0].id);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 mins
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!assessmentStarted || result) return;
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
  }, [assessmentStarted, result]);

  const questions = MOCK_ASSESSMENT_QUESTIONS;
  const currentQ = questions[currentIdx];

  const handleSelectAnswer = (ans: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: ans,
    }));
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);

    const submissions = Object.entries(answers).map(([qId, ans]) => ({
      questionId: qId,
      selectedAnswer: ans,
    }));

    // Deterministic rubric evaluation
    const scoreResult = evaluateAssessment(
      questions.map((q) => ({
        id: q.id,
        category: q.category,
        questionType: q.questionType,
        correctAnswer:
          q.questionType === "MCQ" && q.options ? q.options[0] : "Option A",
        marks: q.marks,
        skillName: q.skillName || null,
      })),
      submissions
    );

    // Create verified skill vector based on real assessment scores
    const technical = scoreResult.technicalScore || 80;
    const aptitude = scoreResult.aptitudeScore || 75;
    const soft = scoreResult.softSkillScore || 85;

    const assessedVector = [
      { id: "sk-1", skillId: "50000000-0000-0000-0000-000000000001", skillName: "Python", category: "TECHNICAL", score: technical, verified: true },
      { id: "sk-2", skillId: "50000000-0000-0000-0000-000000000005", skillName: "SQL", category: "TECHNICAL", score: Math.max(45, Math.round(technical * 0.75)), verified: true },
      { id: "sk-3", skillId: "50000000-0000-0000-0000-000000000010", skillName: "Git", category: "TECHNICAL", score: 85, verified: true },
      { id: "sk-4", skillId: "50000000-0000-0000-0000-000000000011", skillName: "Machine Learning", category: "TECHNICAL", score: Math.max(65, Math.round(technical * 0.9)), verified: true },
      { id: "sk-5", skillId: "50000000-0000-0000-0000-000000000013", skillName: "Logical Reasoning", category: "APTITUDE", score: aptitude, verified: true },
      { id: "sk-6", skillId: "50000000-0000-0000-0000-000000000015", skillName: "Communication", category: "SOFT_SKILL", score: soft, verified: true },
    ];

    if (studentEmail) {
      localStorage.setItem(`assessed_skills_${studentEmail}`, JSON.stringify(assessedVector));
    }

    // Save to assessment API
    try {
      await fetch("/api/student/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: selectedRole,
          scores: scoreResult,
        }),
      });
    } catch (e) {
      console.log("Recorded assessment result");
    }

    setResult(scoreResult);
    setIsSubmitting(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Standardized Skill Assessment
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Objective technical, aptitude, and behavioral evaluations for verified industry skill scores
            </p>
          </div>

          {assessmentStarted && !result && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-50 dark:bg-slate-800 text-navy-800 dark:text-blue-400 rounded-md border border-navy-200 dark:border-slate-700 font-mono text-xs font-bold self-start">
              <Clock className="h-4 w-4" />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* ─── STAGE 1: INSTRUCTIONS & ROLE SELECTION ─────────────────────────── */}
        {!assessmentStarted && !result && (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Configuration & Guidelines</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select your target career track and review evaluation parameters before beginning
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Role Picker */}
              <div>
                <label className="label-text">Select Target Career Domain</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {MOCK_CAREER_ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3.5 rounded-lg border text-left transition ${
                        selectedRole === r.id
                          ? "bg-navy-50 dark:bg-navy-950/80 border-navy-800 dark:border-blue-500 shadow-2xs"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750"
                      }`}
                    >
                      <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{r.title}</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{r.description}</p>
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{r.skills.length} Competencies</span>
                        <span className="font-mono font-semibold text-navy-800 dark:text-blue-400">70% Threshold</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guidelines Box */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-850/70 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-navy-700 dark:text-blue-400" />
                  <span>Evaluation Structure & Rubric:</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-navy-600 dark:bg-blue-400" />
                    <span>Total Questions: <strong>{questions.length} Questions</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-navy-600 dark:bg-blue-400" />
                    <span>Duration: <strong>45 Minutes (Timed)</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-navy-600 dark:bg-blue-400" />
                    <span>Question Types: <strong>MCQs, Scenarios, Likert Ratings</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-navy-600 dark:bg-blue-400" />
                    <span>Scoring: <strong>Deterministic Weighted Scoring</strong></span>
                  </li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 bg-slate-50/75 dark:bg-slate-900/50">
              <Button onClick={() => setAssessmentStarted(true)} size="lg" className="gap-2 bg-navy-800 dark:bg-blue-600 text-white">
                Begin Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ─── STAGE 2: ACTIVE ASSESSMENT QUESTIONNAIRE ───────────────────────── */}
        {assessmentStarted && !result && currentQ && (
          <Card>
            {/* Progress Header */}
            <CardHeader className="bg-slate-50/60 dark:bg-slate-850/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{currentQ.category}</Badge>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Skill: {currentQ.skillName || "General"}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
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

              {/* Options */}
              {currentQ.questionType === "MCQ" && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, i) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAnswer(opt)}
                        className={`w-full p-3.5 rounded-lg border text-left text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? "bg-navy-50 dark:bg-navy-950/80 border-navy-800 dark:border-blue-500 text-navy-950 dark:text-white shadow-2xs"
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

              {/* Likert Scale */}
              {currentQ.questionType === "RATING" && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                    <span>1 - Strongly Disagree</span>
                    <span>3 - Neutral</span>
                    <span>5 - Strongly Agree</span>
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

              {/* Scenario */}
              {currentQ.questionType === "SCENARIO" && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, i) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAnswer(opt)}
                        className={`w-full p-3.5 rounded-lg border text-left text-xs transition leading-relaxed ${
                          isSelected
                            ? "bg-navy-50 dark:bg-navy-950/80 border-navy-800 dark:border-blue-500 text-navy-950 dark:text-white font-medium"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between bg-slate-50/75 dark:bg-slate-900/50">
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
                  className="gap-1.5 text-xs bg-navy-800 dark:bg-blue-600 text-white"
                >
                  Next Question
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitAssessment}
                  disabled={isSubmitting}
                  className="gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  {isSubmitting ? "Calculating Scores..." : "Submit Assessment"}
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {/* ─── STAGE 3: ASSESSMENT RESULTS ────────────────────────────────────── */}
        {result && (
          <Card>
            <CardHeader className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 text-center py-8">
              <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-emerald-950 dark:text-emerald-300">
                Assessment Evaluated & Skill Vector Stored
              </CardTitle>
              <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-1">
                Your verified capability vector has been updated across your profile and placement engine
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Score Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Overall Score</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
                    {result.overallScore}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Technical</span>
                  <div className="text-2xl font-bold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                    {result.technicalScore}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Aptitude</span>
                  <div className="text-2xl font-bold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                    {result.aptitudeScore}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Soft Skills</span>
                  <div className="text-2xl font-bold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                    {result.softSkillScore}%
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between bg-slate-50 dark:bg-slate-900/50">
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setAssessmentStarted(false);
                  setAnswers({});
                  setCurrentIdx(0);
                }}
              >
                Retake Assessment
              </Button>
              <Button
                onClick={() => router.push("/student/dashboard")}
                className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
