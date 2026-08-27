"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { getRoleDashboardPath } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/brand/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword.trim(),
      });

      if (res?.error) {
        setErrorMessage("Invalid credentials. Please check your email and password.");
        setIsLoading(false);
        return;
      }

      const session = await getSession();
      const role = (session?.user as any)?.role;
      const dashboardUrl = getRoleDashboardPath(role);
      window.location.href = dashboardUrl;
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during sign-in.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    await performLogin(email, password);
  };

  const handleDemoFill = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("SkillBridge@2024");
    await performLogin(demoEmail, "SkillBridge@2024");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-150">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex flex-col items-center justify-center gap-2.5 group">
          <Logo size="lg" showBorder className="group-hover:scale-105 transition-transform shadow-sm" />
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-2xl">SkillBridge</span>
        </Link>
        <h2 className="mt-3 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to your portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400">
          Enter credentials or click any demo persona below
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-sm border border-slate-200 dark:border-slate-800 sm:rounded-lg sm:px-10 transition-colors duration-150">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 rounded-md flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Email Address</label>
              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu.in"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label-text mb-0">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-navy-800 dark:text-blue-400 hover:text-navy-950 dark:hover:text-blue-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-navy-800 dark:bg-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </form>

          {/* 1-Click Evaluation Personas */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Quick Sign-In (Demo Accounts in Supabase):</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill("aditya.sharma@iitd.ac.in")}
                disabled={isLoading}
                className="p-2.5 text-left bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 active:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded text-xs transition disabled:opacity-50"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">👨‍🎓 Student</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">aditya.sharma@iitd.ac.in</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("hr@flipkart.com")}
                disabled={isLoading}
                className="p-2.5 text-left bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 active:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded text-xs transition disabled:opacity-50"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">🏢 Industry</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">hr@flipkart.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("admin@iitdelhi.ac.in")}
                disabled={isLoading}
                className="p-2.5 text-left bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 active:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded text-xs transition disabled:opacity-50"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">🏛️ Institution</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">admin@iitdelhi.ac.in</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill("dr.raghavan@iitd.ac.in")}
                disabled={isLoading}
                className="p-2.5 text-left bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 active:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded text-xs transition disabled:opacity-50"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">👨‍🏫 Academician</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">dr.raghavan@iitd.ac.in</div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
              Password: <span className="font-mono text-slate-600 dark:text-slate-400">SkillBridge@2024</span> (Verified via Prisma + Supabase)
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-navy-800 dark:text-blue-400 hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
