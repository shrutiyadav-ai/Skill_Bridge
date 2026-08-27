"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  BookOpen,
  ExternalLink,
  Flame,
  Zap,
  GraduationCap,
  Clock,
  Award,
  CheckCircle2,
  Filter,
  Search,
  Check,
  Upload,
  AlertCircle,
  PlayCircle,
  FileCheck2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface RecommendedCourse {
  course: {
    id: string;
    title: string;
    platform: string;
    provider: string | null;
    url: string;
    skillsCovered: string[];
    category: string;
    difficulty: string;
    duration: string | null;
    certificationAvailable: boolean;
    isFree: boolean;
    pricingType: string;
    rating: number | null;
    enrolledCount: number | null;
    description: string | null;
  };
  priority: "HIGH_PRIORITY" | "RECOMMENDED" | "OPTIONAL";
  priorityLabel: string;
  priorityBadge: "danger" | "warning" | "default";
  priorityIcon: string;
  recommendationReason: string;
  targetSkills: string[];
  enrollment: {
    id?: string;
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    progressPercent: number;
    certificateUrl?: string | null;
    certificateDoc?: string | null;
    certificateVerified: boolean;
    completedAt?: string | null;
  };
  relevanceScore: number;
}

export default function StudentCoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<RecommendedCourse[]>([]);
  const [targetRole, setTargetRole] = useState<{ id: string; title: string; domain?: string } | null>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "HIGH_PRIORITY" | "IN_PROGRESS" | "COMPLETED" | "FREE">("ALL");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");

  // Certificate Modal State
  const [certModalCourse, setCertModalCourse] = useState<RecommendedCourse | null>(null);
  const [certUrl, setCertUrl] = useState("");
  const [certDocUrl, setCertDocUrl] = useState("");
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/student/courses/recommendations");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.recommendations || []);
        setTargetRole(data.targetRole || null);
        setStudentInfo(data.student || null);
      }
    } catch (err) {
      console.error("Error fetching course recommendations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleUpdateStatus = async (courseId: string, status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") => {
    if (status === "COMPLETED") {
      const found = courses.find((c) => c.course.id === courseId);
      if (found) {
        setCertModalCourse(found);
        setCertUrl("");
        setCertDocUrl("");
      }
      return;
    }

    setIsUpdating(courseId);
    try {
      const res = await fetch("/api/student/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          status,
          progressPercent: status === "IN_PROGRESS" ? 25 : 0,
        }),
      });

      if (res.ok) {
        setCourses((prev) =>
          prev.map((c) =>
            c.course.id === courseId
              ? {
                  ...c,
                  enrollment: {
                    ...c.enrollment,
                    status,
                    progressPercent: status === "IN_PROGRESS" ? 25 : 0,
                  },
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Error updating enrollment status:", err);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSubmitCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certModalCourse) return;

    setIsSubmittingCert(true);
    try {
      const res = await fetch("/api/student/courses/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: certModalCourse.course.id,
          certificateUrl: certUrl || certModalCourse.course.url,
          certificateDoc: certDocUrl || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessBanner(data.message || "Course completed and skills verified!");
        setCertModalCourse(null);
        fetchRecommendations(); // Refresh state

        setTimeout(() => setSuccessBanner(null), 8000);
      }
    } catch (err) {
      console.error("Error submitting certificate:", err);
    } finally {
      setIsSubmittingCert(false);
    }
  };

  // Filter Logic
  const filteredCourses = courses.filter((item) => {
    const { course, priority, enrollment } = item;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchPlatform = course.platform.toLowerCase().includes(q);
      const matchProvider = (course.provider || "").toLowerCase().includes(q);
      const matchSkills = (course.skillsCovered || []).some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchPlatform && !matchProvider && !matchSkills) {
        return false;
      }
    }

    // Tab filter
    if (activeTab === "HIGH_PRIORITY" && priority !== "HIGH_PRIORITY") return false;
    if (activeTab === "IN_PROGRESS" && enrollment.status !== "IN_PROGRESS") return false;
    if (activeTab === "COMPLETED" && enrollment.status !== "COMPLETED") return false;
    if (activeTab === "FREE" && !course.isFree) return false;

    // Platform filter
    if (platformFilter !== "ALL" && course.platform.toLowerCase() !== platformFilter.toLowerCase()) {
      return false;
    }

    // Difficulty filter
    if (difficultyFilter !== "ALL" && course.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
      return false;
    }

    return true;
  });

  const highPriorityCount = courses.filter((c) => c.priority === "HIGH_PRIORITY").length;
  const inProgressCount = courses.filter((c) => c.enrollment.status === "IN_PROGRESS").length;
  const completedCount = courses.filter((c) => c.enrollment.status === "COMPLETED").length;

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
      case "EDX":
        return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Success Alert Banner */}
        {successBanner && (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-emerald-800 dark:text-emerald-200 text-xs shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Credential Verified & Portfolio Updated!</span>
                <p className="mt-0.5 text-emerald-700 dark:text-emerald-300">{successBanner}</p>
              </div>
            </div>
            <Link href="/student/portfolio">
              <Button size="sm" variant="outline" className="text-xs bg-white dark:bg-slate-900 shrink-0">
                View Portfolio
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {/* Top Header & Curriculum Overview */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Online Course Recommendations & Upskilling Hub
              </h1>
              <Badge variant="primary" className="text-[10px]">
                Gap-Driven
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Curated verified courses from NPTEL, Coursera, SWAYAM, Google, Microsoft, and AWS mapped directly to your assessment skill deficits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchRecommendations}
              disabled={isLoading}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Recommendations
            </Button>
            <Link href="/student/skills">
              <Button size="sm" className="bg-navy-800 dark:bg-blue-600 text-white text-xs gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                View Skill Gaps
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="metric-card">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Recommended
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
              {courses.length}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Target: <span className="font-semibold text-slate-700 dark:text-slate-300">{targetRole?.title || "Career Track"}</span>
            </p>
          </div>

          <div className="metric-card border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-rose-500" />
              High Priority Gaps
            </span>
            <div className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 mt-1 font-mono">
              {highPriorityCount}
            </div>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">
              Critical deficits in assessment
            </p>
          </div>

          <div className="metric-card border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <PlayCircle className="h-3.5 w-3.5 text-amber-500" />
              In Progress
            </span>
            <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 mt-1 font-mono">
              {inProgressCount}
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
              Active learning modules
            </p>
          </div>

          <div className="metric-card border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-500" />
              Completed & Verified
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
              {completedCount}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              Added to verified portfolio
            </p>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-150">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, skills, or platforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full"
              />
            </div>

            {/* Platform & Difficulty Selectors */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="input-field py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Platforms</option>
                <option value="NPTEL">NPTEL</option>
                <option value="Coursera">Coursera</option>
                <option value="SWAYAM">SWAYAM</option>
                <option value="Google">Google Cloud</option>
                <option value="Microsoft">Microsoft Learn</option>
                <option value="AWS">AWS Skill Builder</option>
                <option value="edX">edX / Harvard</option>
                <option value="Udemy">Udemy</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="input-field py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          {/* Quick Tab Filters */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                activeTab === "ALL"
                  ? "bg-navy-800 dark:bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Courses ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab("HIGH_PRIORITY")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                activeTab === "HIGH_PRIORITY"
                  ? "bg-rose-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Flame className="h-3 w-3 text-rose-500" />
              High Priority ({highPriorityCount})
            </button>
            <button
              onClick={() => setActiveTab("IN_PROGRESS")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                activeTab === "IN_PROGRESS"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <PlayCircle className="h-3 w-3 text-amber-500" />
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setActiveTab("COMPLETED")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                activeTab === "COMPLETED"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Check className="h-3 w-3 text-emerald-500" />
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setActiveTab("FREE")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                activeTab === "FREE"
                  ? "bg-navy-800 dark:bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Free / Free Audit
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        {isLoading ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <RefreshCw className="h-8 w-8 text-navy-800 dark:text-blue-400 animate-spin mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Generating Dynamic Recommendations...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Matching assessment results and skill gaps against verified course catalog
            </p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map((item) => {
              const { course, priority, priorityLabel, priorityBadge, priorityIcon, recommendationReason, enrollment } = item;

              return (
                <Card
                  key={course.id}
                  className={`flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                    priority === "HIGH_PRIORITY"
                      ? "border-rose-200 dark:border-rose-900/60"
                      : enrollment.status === "COMPLETED"
                      ? "border-emerald-200 dark:border-emerald-900/60"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <CardHeader className="pb-3">
                    {/* Top Platform & Priority Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getPlatformBadgeStyle(course.platform)}`}>
                          {course.platform}
                        </span>
                        <Badge variant={priorityBadge} className="text-[10px] gap-1 font-bold">
                          <span>{priorityIcon}</span>
                          {priority === "HIGH_PRIORITY" ? "High Priority" : priority === "RECOMMENDED" ? "Recommended" : "Optional"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {course.isFree ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            FREE
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {course.pricingType === "FREE_AUDIT_PAID_CERT" ? "Free Audit" : "Paid"}
                          </span>
                        )}
                        {enrollment.status === "COMPLETED" && (
                          <Badge variant="success" className="text-[10px] gap-1">
                            <Check className="h-3 w-3" />
                            Completed
                          </Badge>
                        )}
                        {enrollment.status === "IN_PROGRESS" && (
                          <Badge variant="warning" className="text-[10px] gap-1">
                            <PlayCircle className="h-3 w-3" />
                            In Progress
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Course Title & Provider */}
                    <div className="mt-2.5">
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-navy-800 dark:hover:text-blue-400 transition flex items-start justify-between gap-2 group"
                      >
                        <span>{course.title}</span>
                        <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-navy-800 dark:group-hover:text-blue-400 shrink-0 mt-1" />
                      </a>
                      {course.provider && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          Offered by {course.provider}
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {/* Transparent Recommendation Reason Box */}
                    <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="font-bold text-navy-900 dark:text-blue-400 block mb-0.5">
                        Why Recommended:
                      </span>
                      {recommendationReason}
                    </div>

                    {/* Skills Covered Tags */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                        Skills You Will Master:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {course.skillsCovered.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                          >
                            <Sparkles className="h-2.5 w-2.5 text-navy-600 dark:text-blue-400" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Course Metadata (Duration, Level, Rating) */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{course.duration || "Self-Paced"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                        <span>{course.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end font-bold text-slate-800 dark:text-slate-200">
                        <span className="text-amber-500">★</span>
                        <span>{course.rating || "4.8"}</span>
                      </div>
                    </div>

                    {/* Interactive Action Controls */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-navy-800 dark:bg-blue-600 text-white text-xs font-semibold hover:bg-navy-900 dark:hover:bg-blue-700 transition"
                      >
                        <span>View Official Course</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <div className="flex items-center gap-2">
                        {enrollment.status !== "COMPLETED" ? (
                          <>
                            {enrollment.status === "NOT_STARTED" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(course.id, "IN_PROGRESS")}
                                disabled={isUpdating === course.id}
                                className="text-xs gap-1 text-slate-700 dark:text-slate-300"
                              >
                                <PlayCircle className="h-3 w-3 text-amber-500" />
                                Start Learning
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(course.id, "COMPLETED")}
                                className="text-xs gap-1 border-emerald-300 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                              >
                                <Award className="h-3.5 w-3.5 text-emerald-600" />
                                Submit Certificate
                              </Button>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                            <FileCheck2 className="h-4 w-4" />
                            <span>Verified in Portfolio</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="h-8 w-8 text-slate-400" />}
            title="No courses found"
            description="Try adjusting your filters or search keywords."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("ALL");
                  setPlatformFilter("ALL");
                  setDifficultyFilter("ALL");
                }}
              >
                Reset All Filters
              </Button>
            }
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            CERTIFICATE SUBMISSION & DIGITAL PORTFOLIO SYNC MODAL
        ══════════════════════════════════════════════════════════════════════════ */}
        {certModalCourse && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-lg max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Verify Completion & Add Certificate
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Attaches verified credentials and adds mastered skills to your Digital Portfolio
                  </p>
                </div>
                <button
                  onClick={() => setCertModalCourse(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitCertificate} className="p-5 space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md text-xs space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                    {certModalCourse.course.title}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">
                    Platform: <span className="font-medium text-slate-700 dark:text-slate-300">{certModalCourse.course.platform}</span> • Provider: <span className="font-medium text-slate-700 dark:text-slate-300">{certModalCourse.course.provider || "Official Partner"}</span>
                  </p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1 mt-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold mr-1">Skills Verified:</span>
                    {certModalCourse.course.skillsCovered.map((s) => (
                      <span key={s} className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">
                        +{s} (85%+)
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Certificate Credential URL (or Course Link)
                  </label>
                  <input
                    type="url"
                    placeholder="https://coursera.org/verify/..."
                    value={certUrl}
                    onChange={(e) => setCertUrl(e.target.value)}
                    className="input-field py-2 text-xs w-full"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Paste your digital certificate verification link or course badge URL
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Certificate PDF / Document Link (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or certificate document URL"
                    value={certDocUrl}
                    onChange={(e) => setCertDocUrl(e.target.value)}
                    className="input-field py-2 text-xs w-full"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCertModalCourse(null)}
                    disabled={isSubmittingCert}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingCert}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
                  >
                    {isSubmittingCert ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Verify & Add to Portfolio
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
