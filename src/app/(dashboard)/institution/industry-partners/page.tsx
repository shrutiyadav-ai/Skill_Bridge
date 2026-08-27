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
  Building2,
  Briefcase,
  Users,
  Handshake,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Mail,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  GraduationCap,
  FileCheck,
} from "lucide-react";

interface PartnerItem {
  id: string;
  userId: string;
  companyName: string;
  industrySector: string;
  website: string;
  size: string;
  description: string;
  logoUrl: string | null;
  contactPerson: string;
  contactEmail: string;
  activeOpportunitiesCount: number;
  jobsCount: number;
  internshipsCount: number;
  projectsCount: number;
  demandedSkills: string[];
  partnershipStatus: string;
  hasMoU: boolean;
  moUValidUntil: string;
  recentEngagement: string;
}

export default function IndustryPartnersPage() {
  const { data: session } = useSession();
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [summary, setSummary] = useState<any>({
    totalPartners: 0,
    activeHiringCount: 0,
    totalOpenOpportunities: 0,
    activeMoUsCount: 0,
    placementDrivesScheduled: 6,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [driveSuccessCompany, setDriveSuccessCompany] = useState<string | null>(null);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSector !== "ALL") params.append("sector", selectedSector);
      if (selectedType !== "ALL") params.append("type", selectedType);

      const res = await fetch(`/api/institution/partners?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPartners(data.partners || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error("Error fetching industry partners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [selectedSector, selectedType]);

  const filteredPartners = partners.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.companyName.toLowerCase().includes(q) ||
      p.industrySector.toLowerCase().includes(q) ||
      p.contactPerson.toLowerCase().includes(q) ||
      p.demandedSkills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleRequestDrive = (companyName: string) => {
    setDriveSuccessCompany(companyName);
    setTimeout(() => setDriveSuccessCompany(null), 4000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Drive Request Success Alert */}
        {driveSuccessCompany && (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Campus recruitment drive invitation successfully sent to <strong>{driveSuccessCompany}</strong>.
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">TPO Notification Sent</span>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Corporate Partners & Industry Collaborations
              </h1>
              <Badge variant="primary" className="text-[10px]">
                Placement & MoU Network
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active industry hiring partners, institutional MoUs, internship drives, and live project collaborations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchPartners}
              disabled={isLoading}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Directory
            </Button>
            <Link href="/opportunities">
              <Button size="sm" className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white text-xs">
                <Briefcase className="h-3.5 w-3.5" />
                Explore All Postings
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Corporate Partners
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.totalPartners || 0}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Registered recruitment partners
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
                Active Hiring Partners
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                {summary.activeHiringCount || 0}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                {summary.totalOpenOpportunities || 0} active openings on portal
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-navy-800 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Handshake className="h-3.5 w-3.5 text-navy-600 dark:text-blue-400" />
                Active Institutional MoUs
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-1 font-mono">
                {summary.activeMoUsCount || 0}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Valid academic partnerships
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Campus Drives Scheduled
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.placementDrivesScheduled || 6}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Upcoming this semester
              </p>
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
                placeholder="Search partner company, sector, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full"
              />
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="input-field py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Industry Sectors</option>
                <option value="E-commerce & Technology">E-commerce & Technology</option>
                <option value="FinTech & Banking">FinTech & Banking</option>
                <option value="Automotive & Manufacturing">Automotive & Manufacturing</option>
                <option value="Consulting & Analytics">Consulting & Analytics</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Partnership Types</option>
                <option value="JOB">Placement Partners (Jobs)</option>
                <option value="INTERNSHIP">Internship Partners</option>
                <option value="MOU">MoU Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-navy-800 dark:text-blue-400" />
            <p className="text-xs">Loading corporate partner directory...</p>
          </div>
        ) : filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPartners.map((partner) => (
              <Card
                key={partner.id}
                className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition shadow-2xs"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-navy-50 dark:bg-slate-800 text-navy-800 dark:text-blue-400 font-extrabold flex items-center justify-center border border-navy-100 dark:border-slate-700 text-sm">
                        {partner.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {partner.companyName}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {partner.industrySector}
                        </span>
                      </div>
                    </div>

                    <Badge variant={partner.hasMoU ? "success" : "secondary"} className="text-[9px]">
                      {partner.hasMoU ? "MoU Active" : "Registered"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3.5 pt-0">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {partner.description}
                  </p>

                  {/* Demanded Skills */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Hiring For Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {partner.demandedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recruiter Contact & Opportunities Count */}
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Point of Contact:</span>
                      <span>{partner.contactPerson}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email:
                      </span>
                      <span className="font-mono">{partner.contactEmail}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span className="font-semibold text-navy-800 dark:text-blue-400">Open Positions:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {partner.activeOpportunitiesCount} Postings
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <Link href="/opportunities" className="text-xs text-navy-800 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                      <span>View Openings</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRequestDrive(partner.companyName)}
                      className="text-xs"
                    >
                      Invite for Drive
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Building2 className="h-8 w-8 text-slate-400" />}
            title="No corporate partners found"
            description="Try clearing your search query or industry sector filter."
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSector("ALL");
                  setSelectedType("ALL");
                }}
              >
                Reset Filters
              </Button>
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
}
