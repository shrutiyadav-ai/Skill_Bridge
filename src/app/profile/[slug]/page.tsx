import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MOCK_STUDENT_SKILLS } from "@/lib/mock-data";
import {
  ShieldCheck,
  Github,
  ExternalLink,
  GraduationCap,
  Award,
  ArrowLeft,
  Mail,
} from "lucide-react";

export default function PublicPortfolioPage({ params }: { params: { slug: string } }) {
  const studentName = params.slug === "aditya-sharma" ? "Aditya Sharma" : "Candidate Profile";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top bar back navigation */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            SkillBridge Portal
          </Link>
          <Badge variant="success" className="gap-1">
            <ShieldCheck className="h-3 w-3" />
            Verified SkillBridge Digital Profile
          </Badge>
        </div>

        {/* Header Summary Card */}
        <Card>
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-navy-800 text-white font-bold text-3xl flex items-center justify-center shrink-0 shadow-md">
              AS
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{studentName}</h1>
                  <p className="text-xs text-slate-500 font-medium">
                    B.Tech in Computer Science • IIT Delhi (Class of 2027)
                  </p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <a href="mailto:aditya.sharma@iitd.ac.in">
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      <Mail className="h-3.5 w-3.5" /> Contact
                    </Button>
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl pt-1">
                Passionate about machine learning and building intelligent systems. Experienced with Python, TensorFlow, and automated data pipelines. Target Role: Machine Learning Engineer.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-600">
                <span className="font-semibold text-navy-800">CGPA: 8.72 / 10</span>
                <span>•</span>
                <span>Placement Ready: <strong className="text-emerald-700">78% Index</strong></span>
                <span>•</span>
                <span>Status: <strong className="text-blue-700">Available for 6-Month Internships</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verified Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Verified Competency Vector (Assessment-Backed)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MOCK_STUDENT_SKILLS.map((sk) => (
                <div
                  key={sk.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-slate-800 text-xs">{sk.skillName}</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between text-xs">
                    <span className="text-slate-400 text-[10px]">{sk.category}</span>
                    <span className="font-bold text-navy-800">{sk.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Featured Projects</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">
                  Movie Recommendation Engine
                </h3>
                <a
                  href="https://github.com/aditya-sharma/movie-recommender"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Collaborative filtering-based recommendation system using matrix factorization. Trained on the MovieLens 25M dataset achieving 0.87 RMSE.
              </p>
              <div className="flex gap-1.5 pt-1">
                {["Python", "Machine Learning", "Git"].map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Verified Credentials</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="font-semibold text-slate-900">Machine Learning Specialization</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Stanford Online (Coursera) • Verified</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="font-semibold text-slate-900">TensorFlow Developer Certificate</div>
              <div className="text-slate-500 text-[11px] mt-0.5">Google • Verified</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
