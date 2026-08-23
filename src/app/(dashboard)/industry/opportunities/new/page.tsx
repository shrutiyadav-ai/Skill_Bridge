"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { MOCK_SKILLS } from "@/lib/mock-data";
import { OpportunityType } from "@/types";
import { Briefcase, Plus, Trash2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewOpportunityPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email?.toLowerCase() || "";
  const companyName = session?.user?.name || "Corporate Partner";

  const [type, setType] = useState<OpportunityType>("INTERNSHIP");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Bangalore, Karnataka");
  const [remote, setRemote] = useState(false);
  const [duration, setDuration] = useState("6 months");
  const [stipend, setStipend] = useState("40000");
  const [eligibility, setEligibility] = useState("B.Tech/M.Tech in CS/IT, 3rd year or above");
  const [deadline, setDeadline] = useState("2026-09-30");

  const [requiredSkills, setRequiredSkills] = useState<
    { skillName: string; requiredLevel: number; weight: number }[]
  >([
    { skillName: "Python", requiredLevel: 80, weight: 1.0 },
    { skillName: "Machine Learning", requiredLevel: 85, weight: 1.0 },
    { skillName: "SQL", requiredLevel: 70, weight: 0.8 },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleAddSkillRow = () => {
    setRequiredSkills((prev) => [
      ...prev,
      { skillName: MOCK_SKILLS[0].name, requiredLevel: 75, weight: 0.8 },
    ]);
  };

  const handleRemoveSkillRow = (idx: number) => {
    setRequiredSkills((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newPosting = {
      id: `opp-${Date.now()}`,
      title,
      type,
      companyName,
      description,
      location,
      remote,
      duration,
      stipend: stipend ? parseInt(stipend, 10) : null,
      eligibility,
      deadline,
      requiredSkills,
      compatibilityScore: 92,
      maxPositions: 5,
    };

    if (userEmail) {
      const stored = localStorage.getItem(`postings_${userEmail}`);
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem(`postings_${userEmail}`, JSON.stringify([newPosting, ...list]));
    }

    try {
      await fetch("/api/industry/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPosting),
      });
    } catch (err) {
      console.log("Recorded opportunity locally");
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push("/industry/dashboard");
    }, 400);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/industry/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post New Opportunity with Skill Vectors</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specify required technical competencies and weightings for automated candidate ranking
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Type & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label-text">Opportunity Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as OpportunityType)}
                    className="input-field"
                  >
                    <option value="INTERNSHIP">Internship</option>
                    <option value="JOB">Full-Time Job</option>
                    <option value="LIVE_PROJECT">Industry Live Project</option>
                    <option value="TRAINING">Training / BootCamp</option>
                    <option value="FDP">Faculty Development Program (FDP)</option>
                    <option value="FACULTY_INTERNSHIP">Faculty Internship</option>
                    <option value="RESEARCH">Research Collaboration</option>
                    <option value="CONSULTANCY">Consultancy Call</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="label-text">Position Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Machine Learning Engineering Intern"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label-text">Detailed Description & Responsibilities</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the responsibilities, project goals, deliverables, and team context..."
                  className="input-field"
                />
              </div>

              {/* Location, Remote, Duration, Stipend */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="label-text">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Bangalore, Remote"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 6 months"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Monthly Stipend (₹)</label>
                  <input
                    type="number"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    placeholder="40000"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text">Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remoteCheck"
                  checked={remote}
                  onChange={(e) => setRemote(e.target.checked)}
                  className="rounded text-navy-800 dark:text-blue-600 focus:ring-navy-800"
                />
                <label htmlFor="remoteCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Remote Work Option Available
                </label>
              </div>

              {/* Required Skills Matrix */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="label-text mb-0">Required Skill Vectors & Weights</label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Candidates will be matched and ranked by their verified scores against these benchmarks
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSkillRow}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Skill Vector
                  </Button>
                </div>

                <div className="space-y-2">
                  {requiredSkills.map((req, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-5">
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                          Skill
                        </label>
                        <select
                          value={req.skillName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRequiredSkills((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, skillName: val } : item))
                            );
                          }}
                          className="input-field text-xs py-1.5"
                        >
                          {MOCK_SKILLS.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name} ({s.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                          Required Score: {req.requiredLevel}%
                        </label>
                        <input
                          type="range"
                          min={50}
                          max={100}
                          value={req.requiredLevel}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setRequiredSkills((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, requiredLevel: val } : item))
                            );
                          }}
                          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                          Importance Weight: {req.weight}x
                        </label>
                        <select
                          value={req.weight}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setRequiredSkills((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, weight: val } : item))
                            );
                          }}
                          className="input-field text-xs py-1.5"
                        >
                          <option value="1.0">1.0x (Core Essential)</option>
                          <option value="0.8">0.8x (High Importance)</option>
                          <option value="0.5">0.5x (Desirable)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        {requiredSkills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillRow(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 bg-slate-50/75 dark:bg-slate-900/50">
              <Link href="/industry/dashboard">
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                size="sm"
                className="bg-navy-800 dark:bg-blue-600 text-white"
              >
                {isLoading ? "Publishing Opportunity..." : "Publish Opportunity"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
