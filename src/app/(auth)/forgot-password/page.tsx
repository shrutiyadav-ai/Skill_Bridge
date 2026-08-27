"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex flex-col items-center justify-center gap-2.5 group">
          <Logo size="lg" showBorder className="group-hover:scale-105 transition-transform shadow-sm" />
          <span className="font-bold text-slate-900 tracking-tight text-2xl">SkillBridge</span>
        </Link>
        <h2 className="mt-3 text-center text-xl font-bold tracking-tight text-slate-900">
          Reset your password
        </h2>
        <p className="mt-1 text-center text-xs text-slate-600">
          Enter your registered email address to receive password reset instructions
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10">
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Password Reset Email Sent</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-700">{email}</span>,
                you will receive a link to reset your password.
              </p>
              <Link href="/login" className="inline-block mt-6">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text">Registered Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu.in"
                  className="input-field"
                />
              </div>

              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
