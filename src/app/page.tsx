import React from "react";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  GraduationCap,
  Building2,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { Logo } from "@/components/brand/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-150">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between transition-colors duration-150">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo size="md" showBorder className="group-hover:scale-105 transition-transform" />
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-lg">SkillBridge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/opportunities" className="hover:text-navy-900 dark:hover:text-white transition">
            Opportunities
          </Link>
          <Link href="#features" className="hover:text-navy-900 dark:hover:text-white transition">
            Platform Capabilities
          </Link>
          <Link href="#stakeholders" className="hover:text-navy-900 dark:hover:text-white transition">
            Stakeholders
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-8 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 dark:bg-navy-950/80 border border-navy-200 dark:border-blue-900/60 text-xs font-semibold text-navy-800 dark:text-blue-300 mb-6">
          <span className="h-2 w-2 rounded-full bg-navy-700 dark:bg-blue-500 animate-pulse" />
          National Academia–Industry Collaboration Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Bridge the gap between skills and opportunity.
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
          SkillBridge connects students, academia and industry through skill mapping, learning
          opportunities, internships and career pathways.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/opportunities">
            <Button variant="outline" size="lg">
              Explore Opportunities
            </Button>
          </Link>
        </div>

        {/* Realistic Dashboard Preview */}
        <div className="mt-14 max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-left transition-colors duration-150">
          <div className="bg-slate-900 dark:bg-slate-950 text-slate-200 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-slate-400">skillbridge.edu.in/student/dashboard</span>
            </div>
            <span className="bg-slate-800 dark:bg-slate-900 px-2 py-0.5 rounded text-[11px] text-slate-300 font-medium">
              Student Skill Vector Engine
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-slate-950/40">
            {/* Metric 1: Readiness */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Career Readiness</span>
                <Badge variant="success">Placement Ready</Badge>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">78%</div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: "78%" }} />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Target: Machine Learning Engineer</p>
            </div>

            {/* Metric 2: Industry Match */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Industry Match</span>
                <span className="text-xs text-navy-800 dark:text-blue-400 font-bold font-mono">14 Roles</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">86%</div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-navy-800 dark:bg-blue-600 h-full rounded-full" style={{ width: "86%" }} />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Highest: Flipkart ML Intern (91%)</p>
            </div>

            {/* Metric 3: Gaps */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Priority Skill Gaps</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">2 Critical</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">SQL Queries</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">-22%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Docker Containers</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">-18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section id="stakeholders" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Built for the Entire Ecosystem
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Four specialized portals unified into one cohesive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Student */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition">
            <div className="h-10 w-10 rounded bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-400 flex items-center justify-center mb-4">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Students</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed flex-1">
              Take standardized assessments, identify skill gaps, receive personalized learning paths, and apply to compatible internships.
            </p>
          </div>

          {/* Industry */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition">
            <div className="h-10 w-10 rounded bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-400 flex items-center justify-center mb-4">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Industry</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed flex-1">
              Post internships and jobs with skill vectors. Instantly discover ranked candidates based on actual verified capabilities.
            </p>
          </div>

          {/* Institution */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition">
            <div className="h-10 w-10 rounded bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-400 flex items-center justify-center mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Institutions</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed flex-1">
              Monitor student readiness, identify curriculum gaps against market demand, and track placement outcomes with real analytics.
            </p>
          </div>

          {/* Academician */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition">
            <div className="h-10 w-10 rounded bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-400 flex items-center justify-center mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Academicians</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed flex-1">
              Access faculty development programs (FDPs), industry internships, consultancy projects, and collaborative research initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Core Workflow */}
      <section id="features" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            The Verified Career Pathway
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            A transparent 7-step pipeline from self-assessment to industry placement.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { step: "01", title: "Assess", desc: "Technical & Aptitude" },
            { step: "02", title: "Identify Gaps", desc: "Weighted Vector Match" },
            { step: "03", title: "Learn", desc: "Curated Roadmaps" },
            { step: "04", title: "Match", desc: "Compatibility Score" },
            { step: "05", title: "Apply", desc: "Direct Submission" },
            { step: "06", title: "Track", desc: "Application Pipeline" },
            { step: "07", title: "Get Hired", desc: "Placement & Growth" },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs transition">
              <div className="text-xs font-bold text-navy-800 dark:text-blue-400 font-mono mb-1">{item.step}</div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{item.title}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 sm:px-8 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-150">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="xs" showBorder />
            <span className="font-bold text-slate-800 dark:text-slate-200">SkillBridge</span>
            <span>— Connecting skills with opportunity.</span>
          </div>
          <div>© 2026 SkillBridge Platform. Connecting academia and industry through skill-aligned pathways.</div>
        </div>
      </footer>
    </div>
  );
}
