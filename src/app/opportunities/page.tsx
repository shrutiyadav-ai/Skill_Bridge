"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MOCK_OPPORTUNITIES, MOCK_STUDENT_SKILLS } from "@/lib/mock-data";
import { OpportunityItem, OpportunityType } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

export default function OpportunitiesMarketplacePage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"MATCH" | "LATEST" | "DEADLINE">("MATCH");

  const types: { id: string; label: string }[] = [
    { id: "ALL", label: "All Opportunities" },
    { id: "INTERNSHIP", label: "Internships" },
    { id: "JOB", label: "Jobs" },
    { id: "LIVE_PROJECT", label: "Live Projects" },
    { id: "TRAINING", label: "Training Programs" },
    { id: "WORKSHOP", label: "Workshops" },
    { id: "FDP", label: "FDPs" },
    { id: "FACULTY_INTERNSHIP", label: "Faculty Internships" },
    { id: "RESEARCH", label: "Research Collaboration" },
    { id: "CONSULTANCY", label: "Consultancy" },
  ];

  let filtered = MOCK_OPPORTUNITIES.filter((opp) => {
    const matchesType = selectedType === "ALL" || opp.type === selectedType;
    const matchesRemote = !remoteOnly || opp.remote;
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.companyName.toLowerCase().includes(search.toLowerCase()) ||
      opp.requiredSkills.some((s) => s.skillName.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesRemote && matchesSearch;
  });

  // Sorting
  if (sortBy === "MATCH") {
    filtered.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
  } else if (sortBy === "DEADLINE") {
    filtered.sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""));
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-150">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-colors duration-150">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded bg-navy-800 dark:bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
            SB
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">SkillBridge</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session ? (
            <Link
              href={
                (session.user as any)?.role === "INDUSTRY"
                  ? "/industry/dashboard"
                  : (session.user as any)?.role === "INSTITUTION"
                  ? "/institution/dashboard"
                  : (session.user as any)?.role === "ACADEMICIAN"
                  ? "/academician/dashboard"
                  : "/student/dashboard"
              }
            >
              <Button size="sm" variant="outline">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Opportunity Discovery Marketplace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Internships, jobs, live projects, FDPs, and collaborative research with verified skill compatibility
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field py-1.5 text-xs font-medium w-auto"
            >
              <option value="MATCH">Best Skill Match</option>
              <option value="DEADLINE">Approaching Deadline</option>
              <option value="LATEST">Latest Postings</option>
            </select>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role, company, or skill (e.g. Machine Learning, Python, Flipkart)..."
                className="input-field pl-9 py-2.5 text-xs sm:text-sm"
              />
            </div>

            <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="rounded text-navy-800 dark:text-blue-600 focus:ring-navy-800"
              />
              <span>Remote Only</span>
            </label>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                  selectedType === t.id
                    ? "bg-navy-800 dark:bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((opp) => (
            <Card
              key={opp.id}
              className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <Badge variant="secondary">{opp.type}</Badge>
                    <CardTitle className="text-base leading-snug line-clamp-1">
                      <Link href={`/opportunities/${opp.id}`} className="hover:underline">
                        {opp.title}
                      </Link>
                    </CardTitle>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {opp.companyName}
                    </p>
                  </div>

                  {opp.compatibilityScore && (
                    <div className="text-right shrink-0 bg-navy-50 dark:bg-navy-950/80 px-2.5 py-1 rounded border border-navy-100 dark:border-blue-900/60">
                      <span className="text-[10px] text-navy-600 dark:text-blue-400 font-bold block uppercase">
                        Vector Match
                      </span>
                      <span className="text-sm font-extrabold text-navy-900 dark:text-blue-300 font-mono">
                        {opp.compatibilityScore}%
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Deadline: {formatDate(opp.deadline)}</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Required Vector
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {opp.requiredSkills.slice(0, 4).map((s) => (
                      <span
                        key={s.skillName}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {s.skillName} ({s.requiredLevel}%)
                      </span>
                    ))}
                    {opp.requiredSkills.length > 4 && (
                      <span className="text-[10px] text-slate-400">+{opp.requiredSkills.length - 4} more</span>
                    )}
                  </div>
                </div>
              </CardContent>

              <div className="px-5 py-3.5 bg-slate-50/75 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {opp.stipend ? `${formatCurrency(opp.stipend)}/mo` : "Standard Norms"}
                </span>

                <Link href={`/opportunities/${opp.id}`}>
                  <Button size="sm" variant="outline" className="text-xs gap-1">
                    Apply & Evaluate
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
