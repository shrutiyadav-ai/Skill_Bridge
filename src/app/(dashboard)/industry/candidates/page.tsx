"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_OPPORTUNITIES } from "@/lib/mock-data";
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";

export default function IndustryCandidatesPage() {
  const [selectedOppId, setSelectedOppId] = useState(MOCK_OPPORTUNITIES[0].id);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(["cand-1"]);

  const selectedOpp =
    MOCK_OPPORTUNITIES.find((o) => o.id === selectedOppId) || MOCK_OPPORTUNITIES[0];

  // Ranked candidates list based on deterministic skill matching
  const candidates = [
    {
      id: "cand-1",
      name: "Arjun Nair",
      email: "arjun.nair@iitd.ac.in",
      institution: "IIT Delhi",
      department: "Artificial Intelligence (M.Tech)",
      cgpa: 9.35,
      matchScore: 96,
      slug: "arjun-nair",
      skillsBreakdown: [
        { name: "Python", status: "MATCH", score: 90 },
        { name: "Machine Learning", status: "MATCH", score: 85 },
        { name: "Deep Learning", status: "MATCH", score: 82 },
        { name: "SQL", status: "PARTIAL", score: 60 },
        { name: "Git", status: "MATCH", score: 78 },
      ],
    },
    {
      id: "cand-2",
      name: "Sneha Gupta",
      email: "sneha.gupta@bitspilani.ac.in",
      institution: "BITS Pilani",
      department: "Computer Science (B.Tech)",
      cgpa: 9.12,
      matchScore: 94,
      slug: "sneha-gupta",
      skillsBreakdown: [
        { name: "Python", status: "MATCH", score: 88 },
        { name: "Machine Learning", status: "MATCH", score: 78 },
        { name: "Deep Learning", status: "MATCH", score: 80 },
        { name: "SQL", status: "MATCH", score: 74 },
        { name: "Git", status: "MATCH", score: 85 },
      ],
    },
    {
      id: "cand-3",
      name: "Aditya Sharma",
      email: "aditya.sharma@iitd.ac.in",
      institution: "IIT Delhi",
      department: "Computer Science (B.Tech)",
      cgpa: 8.85,
      matchScore: 91,
      slug: "aditya-sharma",
      skillsBreakdown: [
        { name: "Python", status: "MATCH", score: 85 },
        { name: "Machine Learning", status: "MATCH", score: 80 },
        { name: "Deep Learning", status: "PARTIAL", score: 65 },
        { name: "SQL", status: "GAP", score: 48 },
        { name: "Git", status: "MATCH", score: 80 },
      ],
    },
    {
      id: "cand-4",
      name: "Priya Patel",
      email: "priya.patel@nitt.ac.in",
      institution: "NIT Trichy",
      department: "Information Technology (B.Tech)",
      cgpa: 8.92,
      matchScore: 89,
      slug: "priya-patel",
      skillsBreakdown: [
        { name: "Python", status: "MATCH", score: 80 },
        { name: "Machine Learning", status: "MATCH", score: 75 },
        { name: "Deep Learning", status: "GAP", score: 55 },
        { name: "SQL", status: "MATCH", score: 70 },
        { name: "Git", status: "MATCH", score: 75 },
      ],
    },
  ];

  const handleToggleShortlist = (id: string) => {
    setShortlistedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI-Powered Candidate Matching
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Deterministic skill-vector ranking connecting posted job requirements directly to verified student abilities
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Target Posting:
            </span>
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="input-field py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100"
            >
              {MOCK_OPPORTUNITIES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title} ({o.companyName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Role Criteria Banner */}
        <Card className="bg-gradient-to-r from-navy-50/60 via-white to-slate-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-navy-800 dark:text-blue-400 uppercase tracking-wider">
                Matching Algorithm Criteria
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedOpp.title}</h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedOpp.requiredSkills.map((s) => (
                  <span
                    key={s.skillName}
                    className="text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {s.skillName}: {s.requiredLevel}% (wt: {s.weight}x)
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right shrink-0 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Top Candidates Pool
              </span>
              <span className="text-lg font-extrabold text-navy-900 dark:text-blue-300 font-mono">
                {candidates.length} Profiles Ranked
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Ranked Candidate List */}
        <div className="space-y-4">
          {candidates.map((cand, idx) => {
            const isShortlisted = shortlistedIds.includes(cand.id);
            return (
              <Card key={cand.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition">
                <CardContent className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Candidate Info & Breakdown */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="h-7 w-7 rounded bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                        #{idx + 1}
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{cand.name}</h3>
                      <Badge variant="success" className="gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Verified Vector
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">CGPA: {cand.cgpa}</span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{cand.institution}</span>
                      <span>•</span>
                      <span>{cand.department}</span>
                      <span>•</span>
                      <span>{cand.email}</span>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                      {cand.skillsBreakdown.map((s) => (
                        <div
                          key={s.name}
                          className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs"
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
                          <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                            {s.score}%
                          </span>
                          {s.status === "MATCH" && (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          )}
                          {s.status === "PARTIAL" && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">~</span>
                          )}
                          {s.status === "GAP" && (
                            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">!</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Match Score & Action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Compatibility Score
                      </span>
                      <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 font-mono">
                        {cand.matchScore}%
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                        Top 5% Candidate
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isShortlisted ? "secondary" : "primary"}
                        onClick={() => handleToggleShortlist(cand.id)}
                        className={`text-xs ${!isShortlisted ? "bg-navy-800 dark:bg-blue-600 text-white" : ""}`}
                      >
                        {isShortlisted ? "Shortlisted ✓" : "Shortlist Candidate"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
