"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/types";
import { AlertCircle, CheckCircle2, Loader2, Search } from "lucide-react";
import { ACADEMIC_COURSES, getDepartmentsForCourse } from "@/lib/academic-data";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getRoleDashboardPath } from "@/lib/auth";
import { Logo } from "@/components/brand/Logo";

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student specific state
  const [selectedCourseId, setSelectedCourseId] = useState<string>("btech_be");
  const [courseSearch, setCourseSearch] = useState<string>("");
  const [department, setDepartment] = useState<string>("Computer Science & Engineering");
  const [isCustomDepartment, setIsCustomDepartment] = useState<boolean>(false);
  const [customDepartmentName, setCustomDepartmentName] = useState<string>("");
  const [isCustomCourse, setIsCustomCourse] = useState<boolean>(false);
  const [customCourseName, setCustomCourseName] = useState<string>("");
  const [year, setYear] = useState<string>("3");
  const [careerGoal, setCareerGoal] = useState<string>("");

  // Industry specific state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("Technology & Software");
  const [companySize, setCompanySize] = useState("100-500");
  const [website, setWebsite] = useState("");

  // Institution specific state
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("University / Institute of National Importance");
  const [location, setLocation] = useState("");

  // Academician specific state
  const [academicInstitution, setAcademicInstitution] = useState("");
  const [academicDepartment, setAcademicDepartment] = useState("");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [specialization, setSpecialization] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtered courses based on search
  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return ACADEMIC_COURSES;
    const query = courseSearch.toLowerCase();
    return ACADEMIC_COURSES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.departments.some((d) => d.toLowerCase().includes(query))
    );
  }, [courseSearch]);

  // Current department list based on selected course
  const currentDepartments = useMemo(() => {
    return getDepartmentsForCourse(selectedCourseId);
  }, [selectedCourseId]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    if (courseId === "other_degree") {
      setIsCustomCourse(true);
      setIsCustomDepartment(true);
    } else {
      setIsCustomCourse(false);
      const depts = getDepartmentsForCourse(courseId);
      setDepartment(depts[0] || "General");
      setIsCustomDepartment(false);
    }
  };

  const handleDepartmentChange = (deptValue: string) => {
    if (deptValue === "Other" || deptValue === "Other Specialization" || deptValue === "Other Engineering Specialization" || deptValue === "Other Science Discipline" || deptValue === "Other Humanities Discipline" || deptValue === "Other Clinical Branch") {
      setIsCustomDepartment(true);
      setDepartment("Other");
    } else {
      setIsCustomDepartment(false);
      setDepartment(deptValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const selectedCourseObj = ACADEMIC_COURSES.find((c) => c.id === selectedCourseId);
    const finalCourse = isCustomCourse ? customCourseName : selectedCourseObj?.name || "B.Tech";
    const finalDepartment = isCustomDepartment ? customDepartmentName : department;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          course: finalCourse,
          department: finalDepartment,
          year: year ? parseInt(year, 10) : null,
          careerGoal: careerGoal.trim() || undefined,
          companyName: companyName.trim() || undefined,
          industry,
          website: website.trim() || undefined,
          size: companySize,
          institution: (role === "INSTITUTION" ? institutionName : academicInstitution).trim() || undefined,
          institutionType,
          location: location.trim() || undefined,
          designation,
          specialization: specialization.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to register. Please try again.");
        setIsLoading(false);
        return;
      }

      // Auto sign-in with newly registered credentials
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInRes?.ok) {
        const destination = getRoleDashboardPath(role);
        window.location.href = destination;
      } else {
        window.location.href = "/login";
      }
    } catch (err: any) {
      setErrorMessage("An unexpected error occurred during registration. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-150">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <Link href="/" className="flex flex-col items-center justify-center gap-2.5 group">
          <Logo size="lg" showBorder className="group-hover:scale-105 transition-transform shadow-sm" />
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-2xl">SkillBridge</span>
        </Link>
        <h2 className="mt-3 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400">
          Join the unified Academia–Industry network
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-sm border border-slate-200 dark:border-slate-800 sm:rounded-lg sm:px-10 transition-colors duration-150">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 rounded-md flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector Tabs */}
            <div>
              <label className="label-text">Select Stakeholder Role</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "STUDENT", label: "Student" },
                  { id: "INDUSTRY", label: "Industry" },
                  { id: "INSTITUTION", label: "Institution" },
                  { id: "ACADEMICIAN", label: "Academician" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as UserRole)}
                    className={`py-2 px-3 text-xs font-semibold rounded-md border text-center transition ${
                      role === r.id
                        ? "bg-navy-800 dark:bg-blue-600 text-white border-navy-800 dark:border-blue-600 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label-text">
                  {role === "INDUSTRY"
                    ? "Representative Name"
                    : role === "INSTITUTION"
                    ? "Administrator Name"
                    : "Full Name"}
                </label>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "STUDENT" ? "e.g., Priya Deshmukh" : "e.g., Rajesh Kumar"}
                  className="input-field"
                />
              </div>

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
            </div>

            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                required
                minLength={6}
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="input-field"
              />
            </div>

            {/* ─── DYNAMIC ROLE-SPECIFIC FIELDS ────────────────────────────── */}

            {/* 1. STUDENT REGISTRATION */}
            {role === "STUDENT" && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Academic Details
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    35+ Degree Programs
                  </span>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="label-text">Degree / Academic Program</label>
                  <select
                    value={selectedCourseId}
                    disabled={isLoading}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="input-field"
                  >
                    <optgroup label="Undergraduate Degrees (UG)">
                      {ACADEMIC_COURSES.filter((c) => c.category === "UG").map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Postgraduate Degrees (PG)">
                      {ACADEMIC_COURSES.filter((c) => c.category === "PG").map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Diploma & Vocational">
                      {ACADEMIC_COURSES.filter((c) => c.category === "DIPLOMA").map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other">
                      <option value="other_degree">Other Degree / Custom Program</option>
                    </optgroup>
                  </select>
                </div>

                {isCustomCourse && (
                  <div>
                    <label className="label-text">Specify Custom Course Name</label>
                    <input
                      type="text"
                      required
                      value={customCourseName}
                      onChange={(e) => setCustomCourseName(e.target.value)}
                      placeholder="e.g., Dual Degree in Computational Biology"
                      className="input-field"
                    />
                  </div>
                )}

                {/* Department Selection (Dynamically mapped) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label-text">Department / Specialization</label>
                    {!isCustomDepartment ? (
                      <select
                        value={department}
                        disabled={isLoading}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className="input-field"
                      >
                        {currentDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                        <option value="Other">Other (Specify manually)</option>
                      </select>
                    ) : (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          required
                          value={customDepartmentName}
                          onChange={(e) => setCustomDepartmentName(e.target.value)}
                          placeholder="Enter your department"
                          className="input-field"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomDepartment(false);
                            setDepartment(currentDepartments[0] || "General");
                          }}
                          className="text-[11px] text-navy-800 dark:text-blue-400 hover:underline"
                        >
                          ← Choose from standard list
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="label-text">Current Academic Year</label>
                    <select
                      value={year}
                      disabled={isLoading}
                      onChange={(e) => setYear(e.target.value)}
                      className="input-field"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year (Integrated / Dual)</option>
                      <option value="6">Graduated / Recent Alum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-text">Target Career Role or Interest (Optional)</label>
                  <input
                    type="text"
                    value={careerGoal}
                    disabled={isLoading}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    placeholder="e.g., Machine Learning Engineer, Full-Stack Developer, Data Analyst"
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {/* 2. INDUSTRY REGISTRATION */}
            {role === "INDUSTRY" && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Company Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label-text">Company / Organization Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., TechNova Solutions"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label-text">Industry Sector</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="input-field"
                    >
                      <option value="Technology & Software">Technology & Software</option>
                      <option value="Fintech & Banking">Fintech & Banking</option>
                      <option value="E-commerce & Retail">E-commerce & Retail</option>
                      <option value="Healthtech & Bio">Healthcare & Pharma</option>
                      <option value="Consulting & Analytics">Consulting & Analytics</option>
                      <option value="Core Engineering & Manufacturing">Core Engineering</option>
                      <option value="EdTech">EdTech</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label-text">Company Size</label>
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="input-field"
                    >
                      <option value="1-50">1-50 employees (Early Startup)</option>
                      <option value="51-200">51-200 employees (Growth)</option>
                      <option value="201-1000">201-1000 employees (Mid-sized)</option>
                      <option value="1000+">1000+ employees (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="label-text">Company Website (Optional)</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. INSTITUTION REGISTRATION */}
            {role === "INSTITUTION" && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Institution Information
                </span>

                <div>
                  <label className="label-text">Institution / University Name</label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g., Vellore Institute of Technology"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label-text">Institution Type</label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className="input-field"
                    >
                      <option value="University">University</option>
                      <option value="IIT / NIT / IIIT">IIT / NIT / IIIT</option>
                      <option value="Autonomous Engineering College">Autonomous Engineering College</option>
                      <option value="Deemed-to-be-University">Deemed-to-be-University</option>
                      <option value="Affiliated College">Affiliated College</option>
                      <option value="Polytechnic / Vocational">Polytechnic / Vocational</option>
                    </select>
                  </div>

                  <div>
                    <label className="label-text">Location (City, State)</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Vellore, Tamil Nadu"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. ACADEMICIAN REGISTRATION */}
            {role === "ACADEMICIAN" && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Academic Profile
                </span>

                <div>
                  <label className="label-text">Associated University / Institution</label>
                  <input
                    type="text"
                    required
                    value={academicInstitution}
                    onChange={(e) => setAcademicInstitution(e.target.value)}
                    placeholder="e.g., National Institute of Technology, Trichy"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label-text">Academic Department</label>
                    <input
                      type="text"
                      required
                      value={academicDepartment}
                      onChange={(e) => setAcademicDepartment(e.target.value)}
                      placeholder="e.g., Computer Science & Engineering"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="label-text">Designation</label>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="input-field"
                    >
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="Head of Department (HoD)">Head of Department (HoD)</option>
                      <option value="Dean / Director">Dean / Director</option>
                      <option value="Adjunct / Visiting Faculty">Adjunct / Visiting Faculty</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-text">Primary Research Specialization (Optional)</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g., Deep Learning, Distributed Systems, VLSI"
                    className="input-field"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Complete Registration</span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-navy-800 dark:text-blue-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
