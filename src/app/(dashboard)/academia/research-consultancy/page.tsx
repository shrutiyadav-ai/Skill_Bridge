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
  Network,
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
  Send,
  X,
  FileText,
  DollarSign,
  Share2,
} from "lucide-react";

interface ResearchProjectItem {
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
  budget: string;
  eligibility: string;
  deadline: string;
  skills: string[];
  status: string;
  publicationRights: string;
}

export default function ResearchConsultancyPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ResearchProjectItem[]>([]);
  const [summary, setSummary] = useState<any>({
    totalCalls: 0,
    researchGrantsCount: 0,
    consultancyCount: 0,
    averageGrantValue: "₹15 Lakhs",
    activeInvestigators: 18,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  // Proposal Submission Modal State
  const [selectedProject, setSelectedProject] = useState<ResearchProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalAbstract, setProposalAbstract] = useState("");
  const [proposedTimeline, setProposedTimeline] = useState("6-12 Months");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchResearchCalls = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedType !== "ALL") params.append("type", selectedType);

      const res = await fetch(`/api/academician/research?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error("Error fetching research and consultancy calls:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchCalls();
  }, [selectedType]);

  const handleProposalClick = (project: ResearchProjectItem) => {
    setSelectedProject(project);
    setProposalAbstract("");
    setIsModalOpen(true);
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/academician/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: selectedProject.id,
          opportunityTitle: selectedProject.title,
          organization: selectedProject.companyName,
          type: selectedProject.type,
          proposalNotes: proposalAbstract,
        }),
      });

      if (res.ok) {
        setSubmittedIds((prev) => [...prev, selectedProject.id]);
        setSuccessMessage(`Research proposal for "${selectedProject.title}" successfully submitted to ${selectedProject.companyName}!`);
        setIsModalOpen(false);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error("Error submitting research proposal:", err);
    } finally {
      setIsSubmitting(false);
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
            <span className="text-[11px] font-semibold text-emerald-600">Proposal Registered</span>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Funded Research & Corporate Consultancy Hub
              </h1>
              <Badge variant="primary" className="text-[10px]">
                R&D Industry Grants
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Collaborative research grants, sponsored innovation calls, and expert corporate consultancy opportunities
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchResearchCalls}
              disabled={isLoading}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (projects.length > 0) handleProposalClick(projects[0]);
              }}
              className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white text-xs"
            >
              <FileText className="h-3.5 w-3.5" />
              Submit Expression of Interest
            </Button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total R&D Opportunities
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.totalCalls || 0}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Active corporate grant calls</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-navy-800 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Network className="h-3.5 w-3.5 text-navy-600 dark:text-blue-400" />
                Joint Research Calls
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                {summary.researchGrantsCount || 0}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Funded research projects</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
                Consultancy Openings
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                {summary.consultancyCount || 0}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                Corporate advisory engagements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Average Grant Value
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.averageGrantValue || "₹15 Lakhs"}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Plus lab infrastructure access</p>
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
                placeholder="Search research domain, company, or scope..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchResearchCalls()}
                className="input-field pl-9 py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full"
              />
            </div>

            {/* Type Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Opportunities</option>
                <option value="RESEARCH">Sponsored Joint Research</option>
                <option value="CONSULTANCY">Corporate Consultancy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Research Calls Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-navy-800 dark:text-blue-400" />
            <p className="text-xs">Loading research & consultancy opportunities...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((proj) => {
              const isSubmitted = submittedIds.includes(proj.id);

              return (
                <Card
                  key={proj.id}
                  className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition shadow-2xs"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-navy-50 dark:bg-slate-800 text-navy-800 dark:text-blue-400 font-extrabold flex items-center justify-center border border-navy-100 dark:border-slate-700 text-sm">
                          {proj.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {proj.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {proj.companyName} • {proj.industrySector}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={proj.type === "RESEARCH" ? "primary" : "success"}
                        className="text-[9px] shrink-0"
                      >
                        {proj.type === "RESEARCH" ? "Joint Research" : "Consultancy"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pt-0">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Scope & Grant Details */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Duration: <strong>{proj.duration}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Grant / Budget: <strong className="text-emerald-700 dark:text-emerald-400">{proj.budget}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Eligibility: {proj.eligibility}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 text-navy-800 dark:text-blue-400 font-medium">
                        <Share2 className="h-3.5 w-3.5 shrink-0" />
                        <span>IP Terms: {proj.publicationRights}</span>
                      </div>
                    </div>

                    {/* Skills / Domain */}
                    {proj.skills.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                          Research Focus Areas:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {proj.skills.map((skill) => (
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
                        Proposal Due: {formatDate(proj.deadline)}
                      </span>

                      <Button
                        size="sm"
                        disabled={isSubmitted}
                        onClick={() => handleProposalClick(proj)}
                        className={`text-xs gap-1.5 ${
                          isSubmitted
                            ? "bg-emerald-600 text-white cursor-default"
                            : "bg-navy-800 dark:bg-blue-600 text-white"
                        }`}
                      >
                        {isSubmitted ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Proposal Submitted
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Submit Proposal
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
            icon={<Network className="h-8 w-8 text-slate-400" />}
            title="No research or consultancy calls match your criteria"
            description="Try changing your search query or opportunity type filter."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("ALL");
                }}
              >
                Reset Filters
              </Button>
            }
          />
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            RESEARCH PROPOSAL SUBMISSION MODAL
        ══════════════════════════════════════════════════════════════════════════ */}
        {isModalOpen && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Submit Proposal for {selectedProject.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sponsoring Organization: {selectedProject.companyName} • {selectedProject.budget}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleProposalSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Principal Investigator (PI)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${session?.user?.name || "Dr. S. Raghavan"}, Professor & Head of AI Research`}
                    className="input-field py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Proposed Project Timeline
                  </label>
                  <select
                    value={proposedTimeline}
                    onChange={(e) => setProposedTimeline(e.target.value)}
                    className="input-field py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 w-full"
                  >
                    <option value="3-6 Months">3 to 6 Months (Fast Track)</option>
                    <option value="6-12 Months">6 to 12 Months (Standard Grant)</option>
                    <option value="12-24 Months">12 to 24 Months (Multi-Phase R&D)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Research Abstract & Proposed Deliverables
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Outline your research approach, methodology, laboratory facilities, and anticipated industry deliverables..."
                    value={proposalAbstract}
                    onChange={(e) => setProposalAbstract(e.target.value)}
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
                    disabled={isSubmitting || !proposalAbstract.trim()}
                    className="bg-navy-800 dark:bg-blue-600 text-white text-xs gap-1.5"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Proposal"}
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
