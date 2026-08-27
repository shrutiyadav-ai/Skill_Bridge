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
import {
  BookOpen,
  Briefcase,
  Users,
  Calendar,
  Building2,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  GraduationCap,
  ChevronRight,
  Send,
  X,
  FileText,
} from "lucide-react";

interface OpportunityItem {
  id: string;
  title: string;
  type: string;
  description: string;
  companyName: string;
  companyLogo: string | null;
  industrySector: string;
  location: string;
  remote: boolean;
  duration: string;
  stipend: number | null;
  eligibility: string;
  deadline: string;
  status: string;
  skills: string[];
  applicantCount: number;
}

export default function FacultyOpportunitiesPage() {
  const { data: session } = useSession();
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [summary, setSummary] = useState<any>({
    totalOpportunities: 0,
    fdpCount: 0,
    internshipCount: 0,
    workshopCount: 0,
    mentorshipCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedMode, setSelectedMode] = useState("ALL");

  // Application Modal State
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statement, setStatement] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedOppIds, setAppliedOppIds] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedType !== "ALL") params.append("type", selectedType);
      if (selectedMode !== "ALL") params.append("mode", selectedMode);

      const res = await fetch(`/api/academician/opportunities?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error("Error fetching faculty opportunities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedType, selectedMode]);

  const handleApplyClick = (opp: OpportunityItem) => {
    setSelectedOpp(opp);
    setStatement("");
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/academician/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: selectedOpp.id,
          opportunityTitle: selectedOpp.title,
          organization: selectedOpp.companyName,
          type: selectedOpp.type,
          proposalNotes: statement,
        }),
      });

      if (res.ok) {
        setAppliedOppIds((prev) => [...prev, selectedOpp.id]);
        setSuccessMessage(`Application for "${selectedOpp.title}" successfully submitted to ${selectedOpp.companyName}!`);
        setIsModalOpen(false);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error("Error submitting faculty application:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "FDP":
        return "primary";
      case "FACULTY_INTERNSHIP":
        return "success";
      case "WORKSHOP":
      case "TRAINING":
        return "secondary";
      case "MENTORSHIP":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">Application Confirmed</span>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Faculty Development & Industrial Upskilling
              </h1>
              <Badge variant="primary" className="text-[10px]">
                Faculty Upskilling Hub
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Industrial internships, FDP programs, technical workshops, and corporate training opportunities for educators
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchOpportunities}
              disabled={isLoading}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/opportunities">
              <Button size="sm" className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white text-xs">
                <Briefcase className="h-3.5 w-3.5" />
                All Marketplace Postings
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Faculty Programs
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.totalOpportunities || 0}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Active corporate offerings</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-navy-800 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-navy-600 dark:text-blue-400" />
                Active FDP Calls
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                {summary.fdpCount || 0}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Faculty Development Programs</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
                Industry Internships
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                {summary.internshipCount || 0}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                4-8 week corporate sabbaticals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Workshops & Mentorship
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {(summary.workshopCount || 0) + (summary.mentorshipCount || 0)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Hands-on technical masterclasses</p>
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
                placeholder="Search by topic, organization, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchOpportunities()}
                className="input-field pl-9 py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full"
              />
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Opportunity Types</option>
                <option value="FDP">Faculty Development (FDP)</option>
                <option value="FACULTY_INTERNSHIP">Faculty Internship</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="TRAINING">Industrial Training</option>
                <option value="MENTORSHIP">Mentorship Program</option>
              </select>

              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="input-field py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Delivery Modes</option>
                <option value="REMOTE">Online / Remote</option>
                <option value="IN_PERSON">In-Person / Campus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunity Cards Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-navy-800 dark:text-blue-400" />
            <p className="text-xs">Loading faculty opportunities...</p>
          </div>
        ) : opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {opportunities.map((opp) => {
              const isApplied = appliedOppIds.includes(opp.id);

              return (
                <Card
                  key={opp.id}
                  className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition shadow-2xs"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-navy-50 dark:bg-slate-800 text-navy-800 dark:text-blue-400 font-extrabold flex items-center justify-center border border-navy-100 dark:border-slate-700 text-sm">
                          {opp.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {opp.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {opp.companyName} • {opp.industrySector}
                          </span>
                        </div>
                      </div>

                      <Badge variant={getTypeBadgeVariant(opp.type)} className="text-[9px] shrink-0">
                        {opp.type.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pt-0">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>

                    {/* Metadata Badges */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Duration: <strong>{opp.duration}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Mode: <strong>{opp.remote ? "Remote" : opp.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Eligibility: {opp.eligibility}</span>
                      </div>
                      {opp.stipend && (
                        <div className="flex items-center gap-1.5 col-span-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>Fellowship Honorarium: ₹{opp.stipend.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills Covered */}
                    {opp.skills.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                          Skills Covered:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {opp.skills.map((skill) => (
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
                        Deadline: {formatDate(opp.deadline)}
                      </span>

                      <Button
                        size="sm"
                        disabled={isApplied}
                        onClick={() => handleApplyClick(opp)}
                        className={`text-xs gap-1.5 ${
                          isApplied
                            ? "bg-emerald-600 text-white cursor-default"
                            : "bg-navy-800 dark:bg-blue-600 text-white"
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Registered
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Register / Apply
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
            icon={<BookOpen className="h-8 w-8 text-slate-400" />}
            title="No faculty opportunities match your filter"
            description="Try changing your search query or opportunity type filter."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("ALL");
                  setSelectedMode("ALL");
                }}
              >
                Reset Filters
              </Button>
            }
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            FACULTY APPLICATION MODAL
        ══════════════════════════════════════════════════════════════════════════ */}
        {isModalOpen && selectedOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Register for {selectedOpp.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Organized by {selectedOpp.companyName} • {selectedOpp.type.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Faculty Name & Department
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${session?.user?.name || "Dr. S. Raghavan"} • Department of Computer Science`}
                    className="input-field py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={session?.user?.email || "dr.raghavan@iitd.ac.in"}
                    className="input-field py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 w-full font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Statement of Purpose / Learning Objectives (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state your academic objectives or curriculum areas you wish to enhance through this program..."
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    className="input-field py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 w-full"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
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
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
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
