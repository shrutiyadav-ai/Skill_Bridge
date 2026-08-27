"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import { MOCK_OPPORTUNITIES } from "@/lib/mock-data";
import {
  Award,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  GraduationCap,
  Calendar,
  Building2,
  DollarSign,
  Send,
  X,
  ExternalLink,
  ChevronRight,
  FolderKanban,
  TrendingUp,
} from "lucide-react";

interface PlacementItem {
  id: string;
  title: string;
  type: string;
  description: string;
  companyName: string;
  companyLogo: string | null;
  location: string;
  remote: boolean;
  duration: string;
  salaryMin: number | null;
  salaryMax: number | null;
  eligibility: string;
  deadline: string;
  skills: string[];
  compatibilityScore: number;
}

const DEFAULT_PLACEMENTS: PlacementItem[] = MOCK_OPPORTUNITIES
  .filter((o) => o.type === "JOB")
  .map((o) => ({
    id: o.id,
    title: o.title,
    type: o.type,
    description: o.description,
    companyName: o.companyName,
    companyLogo: o.companyLogo,
    location: o.location,
    remote: o.remote,
    duration: o.duration || "Full-Time",
    salaryMin: o.salaryMin,
    salaryMax: o.salaryMax,
    eligibility: o.eligibility,
    deadline: o.deadline,
    skills: o.requiredSkills.map((s) => s.skillName),
    compatibilityScore: o.compatibilityScore || 88,
  }));

export default function StudentPlacementsPage() {
  const { data: session } = useSession();
  const [placements, setPlacements] = useState<PlacementItem[]>(DEFAULT_PLACEMENTS);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCtc, setSelectedCtc] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("ALL");

  // Application State
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [applyingItem, setApplyingItem] = useState<PlacementItem | null>(null);
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  const fetchPlacements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/opportunities?type=JOB");
      if (res.ok) {
        const data = await res.json();
        const rawOpps = data.opportunities || data || [];
        if (rawOpps.length > 0) {
          const jobList = rawOpps
            .filter((o: any) => o.type === "JOB")
            .map((o: any) => ({
              id: o.id,
              title: o.title,
              type: o.type,
              description: o.description || "Graduate software engineering and analyst roles with high growth potential.",
              companyName: o.companyName || o.industry?.companyName || "Corporate Recruiter",
              companyLogo: o.companyLogo || o.industry?.logoUrl || null,
              location: o.location || "Bangalore / Hyderabad / Pune",
              remote: o.remote || false,
              duration: "Full-Time",
              salaryMin: o.salaryMin ? Number(o.salaryMin) : 800000,
              salaryMax: o.salaryMax ? Number(o.salaryMax) : 1400000,
              eligibility: o.eligibility || "B.Tech/BE/B.Com graduating batch (minimum 7.5 CGPA)",
              deadline: o.deadline ? o.deadline : new Date(Date.now() + 30 * 86400000).toISOString(),
              skills: Array.isArray(o.skills) ? o.skills : o.requiredSkills?.map((s: any) => s.skillName || s.name) || ["Software Engineering"],
              compatibilityScore: o.compatibilityScore || 88,
            }));
          setPlacements(jobList);
        }
      }
    } catch (err) {
      console.error("Error fetching placements:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const filteredPlacements = placements.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (selectedCtc !== "ALL") {
      const maxSalary = item.salaryMax || 0;
      if (selectedCtc === "8LPA" && maxSalary < 800000) return false;
      if (selectedCtc === "12LPA" && maxSalary < 1200000) return false;
    }

    return true;
  });

  const handleApplyClick = (item: PlacementItem) => {
    setApplyingItem(item);
    setCoverNote("");
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingItem) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: applyingItem.id,
          notes: coverNote,
        }),
      });

      setAppliedIds((prev) => [...prev, applyingItem.id]);
      setSuccessAlert(`Placement application submitted for ${applyingItem.title} at ${applyingItem.companyName}!`);
      setApplyingItem(null);
      setTimeout(() => setSuccessAlert(null), 5000);
    } catch (err) {
      console.error("Application error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Success Alert Banner */}
        {successAlert && (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successAlert}</span>
            </div>
            <Link href="/student/applications" className="font-semibold underline text-emerald-700 dark:text-emerald-300">
              Track Applications
            </Link>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Graduate Placements & Campus Hiring Drives
              </h1>
              <Badge variant="primary" className="text-[10px]">
                Full-Time Opportunities
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct corporate recruitment drives, software engineering roles, and management positions with verified compensation packages
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchPlacements}
              disabled={isLoading}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/student/applications">
              <Button size="sm" className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white text-xs">
                <FolderKanban className="h-3.5 w-3.5" />
                Track Applications
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Open Placement Roles
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {placements.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Active corporate hiring</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                Avg. Starting CTC
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                ₹11.4 LPA
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                Annual compensation package
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-navy-800 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-navy-600 dark:text-blue-400" />
                High Match (≥85%)
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                {placements.filter((p) => p.compatibilityScore >= 85).length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Optimal skills alignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Campus Drives Active
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                6 Drives
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Scheduled this semester</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-150">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search job title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full"
              />
            </div>

            {/* CTC Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCtc}
                onChange={(e) => setSelectedCtc(e.target.value)}
                className="input-field py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Compensation Ranges</option>
                <option value="8LPA">≥ ₹8 LPA</option>
                <option value="12LPA">≥ ₹12 LPA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Placements Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-navy-800 dark:text-blue-400" />
            <p className="text-xs">Loading placement opportunities...</p>
          </div>
        ) : filteredPlacements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPlacements.map((item) => {
              const isApplied = appliedIds.includes(item.id);
              const ctcText = item.salaryMin && item.salaryMax
                ? `₹${(item.salaryMin / 100000).toFixed(1)} - ${(item.salaryMax / 100000).toFixed(1)} LPA`
                : "Competitive Market CTC";

              return (
                <Card
                  key={item.id}
                  className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition shadow-2xs"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-navy-50 dark:bg-slate-800 text-navy-800 dark:text-blue-400 font-extrabold flex items-center justify-center border border-navy-100 dark:border-slate-700 text-sm">
                          {item.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.companyName} • {item.location}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={item.compatibilityScore >= 85 ? "success" : "primary"}
                        className="text-[9px] shrink-0"
                      >
                        {item.compatibilityScore}% Match
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pt-0">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Type: <strong>Full-Time Job</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Location: <strong>{item.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Compensation: {ctcText}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Eligibility: {item.eligibility}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {item.skills.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                          Required Competencies:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Deadline: {formatDate(item.deadline)}
                      </span>

                      <Button
                        size="sm"
                        disabled={isApplied}
                        onClick={() => handleApplyClick(item)}
                        className={`text-xs gap-1.5 ${
                          isApplied
                            ? "bg-emerald-600 text-white cursor-default"
                            : "bg-navy-800 dark:bg-blue-600 text-white"
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Apply for Placement
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Award className="h-8 w-8 text-slate-400" />}
            title="No placement roles match your filter"
            description="Try changing your search query or CTC criteria."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCtc("ALL");
                }}
              >
                Reset Filters
              </Button>
            }
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            APPLICATION MODAL
        ══════════════════════════════════════════════════════════════════════════ */}
        {applyingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Apply for {applyingItem.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {applyingItem.companyName} • Placement Drive
                  </p>
                </div>
                <button
                  onClick={() => setApplyingItem(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Student Profile Snapshot
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${session?.user?.name || "Aditya Sharma"} • ${session?.user?.email || "student@iitd.ac.in"}`}
                    className="input-field py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Cover Note / Brief Pitch (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly highlight your core technical competencies, projects, and why you are excited about this placement role..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="input-field py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 w-full"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setApplyingItem(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="bg-navy-800 dark:bg-blue-600 text-white text-xs gap-1.5"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Placement Application"}
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
