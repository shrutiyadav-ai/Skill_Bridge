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
  Handshake,
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
  FileCheck,
  Award,
} from "lucide-react";

interface CollabItem {
  id: string;
  title: string;
  type: string;
  description: string;
  companyName: string;
  companyLogo: string | null;
  industrySector: string;
  institutionName: string;
  status: string;
  duration: string;
  skills: string[];
  isMoUActive: boolean;
}

export default function AcademiaCollaborationPage() {
  const { data: session } = useSession();
  const [collaborations, setCollaborations] = useState<CollabItem[]>([]);
  const [summary, setSummary] = useState<any>({
    totalCollaborations: 0,
    liveCapstonesCount: 0,
    guestLecturesCount: 0,
    jointProjectsCount: 0,
    activeMoUs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  // Interaction State
  const [selectedCollab, setSelectedCollab] = useState<CollabItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facultyRoleNotes, setFacultyRoleNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCollaborations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedType !== "ALL") params.append("type", selectedType);

      const res = await fetch(`/api/academician/collaboration?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCollaborations(data.collaborations || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error("Error fetching collaborations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, [selectedType]);

  const handleJoinClick = (collab: CollabItem) => {
    setSelectedCollab(collab);
    setFacultyRoleNotes("");
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollab) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/academician/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: selectedCollab.id,
          opportunityTitle: selectedCollab.title,
          organization: selectedCollab.companyName,
          type: selectedCollab.type,
          proposalNotes: facultyRoleNotes,
        }),
      });

      if (res.ok) {
        setJoinedIds((prev) => [...prev, selectedCollab.id]);
        setSuccessMessage(`Expression of interest for "${selectedCollab.title}" successfully submitted to ${selectedCollab.companyName}!`);
        setIsModalOpen(false);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error("Error expressing interest in collaboration:", err);
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
            <span className="text-[11px] font-semibold text-emerald-600">Engagement Confirmed</span>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Academia–Industry Collaboration & Partnerships
              </h1>
              <Badge variant="primary" className="text-[10px]">
                Strategic MoUs & Joint Programs
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Live student capstones, corporate guest lecture series, joint innovation challenges, and institutional MoUs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchCollaborations}
              disabled={isLoading}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/opportunities">
              <Button size="sm" className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white text-xs">
                <Building2 className="h-3.5 w-3.5" />
                Explore Corporate Network
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Collaborations
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.totalCollaborations || 0}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Active partnership bridges</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-navy-800 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-navy-600 dark:text-blue-400" />
                Live Industry Capstones
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                {summary.liveCapstonesCount || 0}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Mentored student projects</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
                Guest Lecture Drives
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                {summary.guestLecturesCount || 0}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                Industry expert sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Institutional MoUs
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.activeMoUs || 6}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Formal partner agreements</p>
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
                placeholder="Search partner, initiative, or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchCollaborations()}
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
                <option value="ALL">All Collaboration Types</option>
                <option value="Capstone">Live Capstones & Projects</option>
                <option value="Lecture">Guest Lectures & Workshops</option>
                <option value="Challenge">Innovation Challenges</option>
                <option value="Research">Joint Research Initiatives</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collaboration Cards Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-navy-800 dark:text-blue-400" />
            <p className="text-xs">Loading collaboration initiatives...</p>
          </div>
        ) : collaborations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {collaborations.map((collab) => {
              const isJoined = joinedIds.includes(collab.id);

              return (
                <Card
                  key={collab.id}
                  className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition shadow-2xs"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-navy-50 dark:bg-slate-800 text-navy-800 dark:text-blue-400 font-extrabold flex items-center justify-center border border-navy-100 dark:border-slate-700 text-sm">
                          {collab.companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {collab.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {collab.companyName} ⇄ {collab.institutionName}
                          </span>
                        </div>
                      </div>

                      <Badge variant="primary" className="text-[9px] shrink-0">
                        {collab.type}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pt-0">
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {collab.description}
                    </p>

                    {/* Partnership Scope */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Duration: <strong>{collab.duration}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>MoU Status: <strong className="text-emerald-700 dark:text-emerald-400">Active</strong></span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Handshake className="h-3 w-3" />
                        Partnership Active
                      </span>

                      <Button
                        size="sm"
                        disabled={isJoined}
                        onClick={() => handleJoinClick(collab)}
                        className={`text-xs gap-1.5 ${
                          isJoined
                            ? "bg-emerald-600 text-white cursor-default"
                            : "bg-navy-800 dark:bg-blue-600 text-white"
                        }`}
                      >
                        {isJoined ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Interest Registered
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Participate / Express Interest
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
            icon={<Handshake className="h-8 w-8 text-slate-400" />}
            title="No collaboration initiatives match your criteria"
            description="Try changing your search query or collaboration type filter."
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
            COLLABORATION PARTICIPATION MODAL
        ══════════════════════════════════════════════════════════════════════════ */}
        {isModalOpen && selectedCollab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Participate in {selectedCollab.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Corporate Partner: {selectedCollab.companyName} • {selectedCollab.type}
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
                    Faculty Lead & Designation
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${session?.user?.name || "Dr. S. Raghavan"}, Professor of Computer Science`}
                    className="input-field py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Collaboration Role & Student Cohort Involvement
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe how your department or student cohort plans to engage with this initiative (e.g. capstone mentorship, hosting sessions)..."
                    value={facultyRoleNotes}
                    onChange={(e) => setFacultyRoleNotes(e.target.value)}
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
                    {isSubmitting ? "Submitting..." : "Confirm Engagement"}
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
