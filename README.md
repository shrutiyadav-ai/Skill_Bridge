# 🌉 SkillBridge — Academia–Industry Collaboration Platform

<div align="center">

![SkillBridge Banner](https://img.shields.io/badge/SkillBridge-Enterprise%20Portal-003366?style=for-the-badge&logo=bridge&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v4-purple?style=flat-square&logo=auth0)](https://next-auth.js.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Assistant-8E75C2?style=flat-square&logo=google)](https://ai.google.dev/)

**An end-to-end enterprise platform bridging the gap between academic curricula and industry requirements through course-driven skill assessments, database-backed career benchmarks, deterministic gap diagnostics, intelligent online course recommendations, personalized preparation roadmaps, and multi-stakeholder collaboration.**

[Explore Features](#-core-features) • [Course-Driven Engines](#-course-driven-engines--benchmarks) • [Online Courses Engine](#4-intelligent-online-course-recommendations--portfolio-sync) • [Architecture](#-system-architecture) • [Getting Started](#-quick-start) • [Database Schema](#-database-architecture) • [Demo Accounts](#-seeded-demo-accounts)

</div>

---

## 📌 Problem Statement & Vision

Traditional higher education often produces a significant mismatch between academic training and industry expectations. Students lack clarity on required competency vectors, recruiters struggle with manual candidate filtering, institutions lack data-driven curriculum gap diagnostics, and faculty lack centralized bridges for industry research and consultancy.

**SkillBridge** solves this challenge through a centralized, multi-stakeholder platform connecting four essential pillars:

```
                  ┌─────────────────────────────────┐
                  │      SkillBridge Platform       │
                  └─────────────────────────────────┘
                                   │
      ┌────────────────┬───────────┴───────────┬────────────────┐
      ▼                ▼                       ▼                ▼
┌───────────┐    ┌───────────┐           ┌───────────┐    ┌───────────┐
│  Student  │    │ Industry  │           │Institution│    │Academician│
│  Portal   │    │  Portal   │           │ Analytics │    │  Portal   │
└───────────┘    └───────────┘           └───────────┘    └───────────┘
      │                │                       │                │
      ▼                ▼                       ▼                ▼
 • Course-Based   • Job/Intern Postings   • Cohort Readiness• Research & Grants
   Assessments    • Vector Match Engine   • Demand Gaps     • Consultancies
 • Dynamic Roles  • Candidate CRM         • TPO Management  • FDP Programs
 • Gap Diagnostic • Verification Docs     • MoU Tracking    • Mentorship
 • Online Courses • Multi-discipline Hire
 • Smart Roadmaps
```

---

## 🌟 Core Features

### 👨‍🎓 1. Student Portal
- **Course-Driven Skill Assessment**: Automatically configured according to the student's registered Course & Department (e.g. B.Tech CSE, B.Tech AI/ML, B.Com Finance, Mechanical, Civil, BCA).
- **Dynamic Question Bank & Attempt History**: Database-backed questions with randomized selection, difficulty tracking, attempt progression audits, and question-by-question academic explanations.
- **Dynamic Industry Benchmarks**: Real-time evaluation against 35+ database-managed career roles with required skill proficiencies, toolchains, and recommended certifications.
- **Deterministic Gap Engine**: Computes exact capability deficits against target career benchmarks.
- **Intelligent Online Course Recommendations**: Prioritized course recommendations from NPTEL, Coursera, SWAYAM, Google, Microsoft, AWS, and edX directly mapped to assessment deficits.
- **Progress Tracking & Certificate Verification**: Track learning status (`Not Started` → `In Progress` → `Completed`), submit certificate credentials, and automatically elevate verified skills in the Digital Portfolio upon completion.
- **Personalized Milestone Roadmap**: Dynamically generated preparation pipeline targeting specific identified skill gaps and practical portfolio capstones.
- **Unified Profile & Digital Portfolio**: Multi-section profile (Education, Experience, Projects, Certifications, Achievements) with public portfolio links and resume upload.
- **Application Tracker**: Real-time status tracking (`Applied`, `Under Review`, `Shortlisted`, `Interview`, `Selected`).

### 🏢 2. Industry & Recruiter Portal
- **Opportunity Marketplace**: Create and manage listings for Full-Time Jobs, Internships, Apprenticeships, Live Projects, and Faculty Fellowships.
- **Intelligent Candidate Match Engine**: Deterministic weighted matching scoring student skill vectors against posting requirements.
- **Applicant Management**: Filter, review resumes, shortlist, schedule interviews, and issue selection offers.
- **Company Branding**: Showcase company culture, tech stack, hiring benefits, and verification badges.

### 🏛️ 3. Institution Analytics Portal
- **Cohort Readiness Analytics**: Macro and departmental placement readiness metrics across all enrolled student batches.
- **Industry Demand vs. Curriculum Gaps**: Real-time insights highlighting emerging industry skills missing from academic syllabi.
- **Training & Placement Office (TPO) Hub**: Centralized placement statistics, recruiter contacts, and student verification.
- **Industry Partnerships & MoUs**: Track active industry collaborations, workshops, and joint programs.

### 👨‍🏫 4. Academician & Faculty Portal
- **Faculty Development Programs (FDPs)**: Discover and apply for sponsored upskilling and faculty development programs.
- **Research Grants & Consultancy Hub**: Manage funded research projects (DST/SERB/AICTE), publications (with DOI), and patent filings.
- **Industry-Academia Collaboration**: Engagement channels for student project mentorship, guest lectures, and corporate consultancy.

---

## 🎯 Course-Driven Engines & Benchmarks

### 1. Automated Academic Assessment Resolution
The assessment system completely removes manual career picking. The student's registered degree and department dynamically dictate covered subjects and evaluated competencies:
- **B.Tech CSE / IT / BCA / B.Sc CS**: Programming, Data Structures & Algorithms, Database Systems (SQL), Operating Systems, Computer Networks, Software Engineering.
- **B.Tech AI/ML & Data Science**: Python for Data Science, Mathematics & Statistics for ML, Machine Learning Models, Deep Learning & Neural Networks, Data Preprocessing.
- **B.Com / Accounting & Finance**: Financial Accounting, Corporate Financial Management, Taxation (Direct & GST), Managerial Economics, Financial Analysis & Ratio Diagnostics.
- **Core Engineering (Mechanical, Civil, ECE)**: CAD/CAM, Thermodynamics, Structural Engineering, Embedded Systems, IoT.

### 2. Multi-Discipline Dynamic Career Catalog (35+ Database-Driven Roles)
Roles and benchmarks are stored in PostgreSQL and filtered strictly by academic eligibility:
```
B.Tech CSE/IT       → Software Engineer, Full Stack, Backend, Frontend, Cloud, DevOps, DBA, QA...
B.Tech AI/ML        → AI Engineer, ML Engineer, Deep Learning, Data Scientist, MLOps, GenAI...
B.Com / Finance     → Accountant, Financial Analyst, Tax Consultant, Audit Associate, Investment Analyst...
BBA / Management    → Marketing Executive, Digital Marketing, HR Executive, Business Analyst, Product Manager...
Cross-Disciplinary  → Data Analyst, Business Analyst, Product Manager, Cybersecurity Analyst...
```

### 3. Server-Side Security & Attempt Auditing
- **Zero Answer Leakage**: Answer keys and explanations are omitted from the client before test submission.
- **Adaptive Difficulty**: Question difficulty adjusts based on previous attempt benchmarks (Foundational vs Balanced vs Advanced).
- **Persistent Attempt Records**: Every assessment attempt stores duration, accuracy, overall score, category breakdown, and question audits in `AssessmentAttempt` and `AttemptAnswer`.

### 4. Intelligent Online Course Recommendations & Portfolio Sync
- **100% Verified Authentic Catalog**: Over 40+ courses from NPTEL (IIT Madras, IIT Kharagpur, IIT Mandi), Coursera (Stanford, DeepLearning.AI, UC San Diego), SWAYAM, Google Cloud, Microsoft Learn, AWS Skill Builder, and Harvard Online.
- **Priority Tiering**:
  - 🔥 **High Priority**: Identifies and targets critical deficits (<60% proficiency or missing prerequisite skills).
  - ⚡ **Recommended**: Targets core benchmark competencies required by the target role and industry.
  - 📚 **Optional**: Recommends domain elective advancements matching student interests.
- **Transparent Reasoning**: Explains exactly why each course was suggested (e.g. *"Recommended because Python and Machine Learning were identified as skill gaps in your assessment and are essential for Machine Learning Engineer."*).
- **Automated Digital Portfolio Sync**: Marking a course as completed and attaching certificate verification links automatically adds the credential to the student's `Certification` records and elevates their verified `UserSkill` score in the database.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Dynamic Layouts) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Type Safety) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), Custom Design Tokens, Modern Glassmorphism |
| **Theme Engine** | Light / Dark Mode with persistent `localStorage` & anti-flash script |
| **Database & ORM** | [Supabase PostgreSQL](https://supabase.com/) via [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) (Credentials Provider, Role-Based JWT Sessions) |
| **AI Integration** | [Google Gemini 1.5 Flash](https://ai.google.dev/) (Career Assistant & Gap Diagnostics) |
| **Storage Layer** | [Supabase Storage](https://supabase.com/storage) (Resumes, Certificates, Profile Images) |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |

---

## 🗄️ Database Architecture

The relational schema is deployed on **Supabase PostgreSQL** and managed through **Prisma ORM**:

```
                       ┌──────────────┐
                       │     User     │
                       └──────┬───────┘
                              │ 1:1
       ┌──────────────┬───────┴────────┬──────────────┐
       ▼              ▼                ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│StudentProfile││IndustryProfile││InstitutionProfile││AcademicianProfile│
└──────┬───────┘└──────┬───────┘└──────────────┘└──────┬───────┘
       │ 1:N          │ 1:N                            │ 1:N
       ├─ Education   ├─ Opportunities                 ├─ Publications
       ├─ Experience  ├─ Collaborations                ├─ ResearchProjects
       ├─ Projects    └─ Mentorships                   └─ Patents
       ├─ Certifications
       ├─ Applications
       ├─ CourseEnrollments ──▶ OnlineCourses
       ├─ AssessmentAttempts ──▶ AttemptAnswers
       └─ UserSkills ──────────▶ SkillScores
```

### Key Models:
- **`OnlineCourse` & `StudentCourseEnrollment`**: Database-backed verified course catalog with platforms, providers, URLs, skills covered, pricing tiers, and student enrollment/completion tracking.
- **`CareerRole` & `CareerRoleSkill`**: Database-backed role catalog with course/department associations, required skills, benchmark levels, recommended tools, and certifications.
- **`AssessmentQuestion`**: Course- and department-tagged question bank with difficulty tiers, options, answer keys, marks, and explanations.
- **`AssessmentAttempt` & `AttemptAnswer`**: Complete attempt history, category scores, and question audits.
- **`UserSkill` & `SkillScore`**: Verified student capability vectors populated automatically upon assessment completion or verified course certificates.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v18.18.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/shrutiyadav-ai/Skill_Bridge.git
cd Skill_Bridge
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the project root:

```env
# Supabase PostgreSQL (Pooler + Direct)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# NextAuth Configuration
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini API (AI Career Assistant)
GEMINI_API_KEY="your_gemini_api_key"

# Supabase Storage & Public App URL
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Push Database Schema & Seed Data
```bash
# Push Prisma schema to your Supabase PostgreSQL instance
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed complete demo data (users, dynamic questions, 35+ career roles, 40+ authentic online courses)
npx tsx prisma/seed.ts
```

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Seeded Demo Accounts

You can test the application using pre-configured demo credentials or register a new user:

| Persona | Discipline | Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | B.Tech CSE | `aditya.sharma@iitd.ac.in` | `SkillBridge@2024` | `/student/dashboard` |
| **Student** | B.Tech AI/ML | `priya.patel@nitt.ac.in` | `SkillBridge@2024` | `/student/dashboard` |
| **Student** | B.Com Finance | `rohit.verma@srcc.du.ac.in` | `SkillBridge@2024` | `/student/dashboard` |
| **Industry** | Corporate Recruiter | `hr@flipkart.com` | `SkillBridge@2024` | `/industry/dashboard` |
| **Institution** | University TPO | `admin@iitdelhi.ac.in` | `SkillBridge@2024` | `/institution/dashboard` |
| **Academician** | Professor / Faculty | `dr.raghavan@iitd.ac.in` | `SkillBridge@2024` | `/academician/dashboard` |

> 💡 **Tip**: Use the **Switch Role** dropdown in the top navigation bar to quickly switch between demo personas with zero logout friction.

---

## 📂 Project Structure

```
Skill_Bridge/
├── prisma/
│   ├── schema.prisma              # Comprehensive Prisma schema (22 models & relations)
│   ├── seed.ts                    # Master database seeder
│   ├── seed-questions.ts          # Multi-discipline academic question bank
│   ├── seed-career-roles.ts       # 35+ career roles with industry benchmarks
│   └── seed-courses.ts            # 40+ authentic online courses (NPTEL, Coursera, etc.)
├── src/
│   ├── app/
│   │   ├── (auth)/                # Login & Multi-Role Dynamic Registration
│   │   ├── (dashboard)/
│   │   │   ├── student/
│   │   │   │   ├── dashboard/     # Metric cards, Featured Courses, AI Assistant
│   │   │   │   ├── courses/       # Dedicated Online Courses Hub & Progress Tracker
│   │   │   │   ├── assessment/    # Course-Driven Assessment & Review
│   │   │   │   ├── skills/        # Competency Matrix & Gap Diagnostic
│   │   │   │   ├── career/        # Career Recommendations & Roadmaps
│   │   │   │   ├── portfolio/     # Digital Portfolio with verified credentials
│   │   │   │   └── profile/       # Student Academic Profile
│   │   │   ├── industry/          # Post Opportunity, Candidate Match, Profile
│   │   │   ├── institution/       # Analytics, Readiness, Demand Gaps, Profile
│   │   │   └── academician/       # Faculty Portal, Research Grants, Profile
│   │   ├── api/                   # REST Endpoints
│   │   │   ├── student/
│   │   │   │   ├── assessment/    # Assessment Profile, Start, Scoring Engine
│   │   │   │   ├── career-roles/  # Dynamic Course-Filtered Roles API
│   │   │   │   └── courses/       # Recommendations, Progress Tracking & Complete
│   │   │   └── admin/
│   │   │       ├── career-roles/  # Admin Role Management API
│   │   │       └── courses/       # Admin Course Catalog API
│   │   ├── opportunities/         # Public Opportunities Marketplace & Detail View
│   │   ├── layout.tsx             # Root Layout with ThemeProvider & Anti-Flash
│   │   └── page.tsx               # Enterprise Landing Page
│   ├── components/
│   │   ├── layout/                # Sidebar, TopNav, DashboardLayout
│   │   ├── profile/               # Role-Specific Profile Views & SubRecordModal
│   │   ├── providers/             # ThemeProvider, SessionProvider
│   │   └── ui/                    # Button, Card, Badge, EmptyState, ThemeToggle
│   ├── lib/
│   │   ├── academic-data.ts       # 35+ UG/PG/Diploma Degree Taxonomy & Departments
│   │   ├── course-competencies.ts # Academic Competency Resolution Engine
│   │   ├── course-recommendations.ts # Intelligent Course Recommendation Engine
│   │   ├── auth.ts                # NextAuth Configuration & Password Verifier
│   │   ├── matching.ts            # Deterministic Weighted Skill Matching & Roadmap Engine
│   │   ├── prisma.ts              # Global Prisma Client Instance
│   │   ├── supabase.ts            # Supabase Storage Client & Upload Handlers
│   │   └── utils.ts               # Formatting, Badges, Class Merging
│   └── styles/
│       └── globals.css            # Dark/Light CSS Variables & Custom Styles
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Light & Dark Mode Support

SkillBridge features a complete, responsive Light & Dark theme system:
- **Instant Toggle**: Moon and Sun icon buttons in TopNav and Landing headers.
- **Zero Flash Rendering**: Pre-hydration inline script guarantees no theme flashing on reload.
- **Theme Persistence**: Automatically synchronizes with `localStorage` and falls back to system preference (`prefers-color-scheme`).

---

## 🔒 Security & Data Integrity

- **Session Ownership Validation**: All profile, assessment, and career APIs enforce server-side user ID verification from authenticated JWT sessions.
- **Assessment Security**: Answer keys and explanations are validated strictly server-side and never leaked in question payload responses.
- **Certificate Verification**: Submitting course completion credentials validates issuer integrity and synchronizes verified skill proficiency with the student's digital portfolio.
- **MIME & Size Enforced Uploads**: Files uploaded to Supabase Storage are validated for MIME types (`image/*`, `application/pdf`) and capped at 5MB.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<div align="center">

Built with ❤️ for **Academia–Industry Collaboration**

</div>
