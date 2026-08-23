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

**An end-to-end platform bridging the gap between academic curricula and industry requirements through skill assessments, weighted compatibility matching, personalized career roadmaps, and multi-stakeholder collaboration.**

[Explore Features](#-core-features) • [Architecture](#-system-architecture) • [Getting Started](#-quick-start) • [Database Schema](#-database-architecture) • [Demo Accounts](#-seeded-demo-accounts)

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
 • Assessments    • Job/Intern Postings   • Cohort Readiness• Research & Grants
 • Skill Vectors  • Vector Match Engine   • Demand Gaps     • Consultancies
 • Career Paths   • Candidate CRM         • TPO Management  • FDP Programs
 • Portfolios     • Verification Docs     • MoU Tracking    • Mentorship
```

---

## 🌟 Core Features

### 👨‍🎓 1. Student Portal
- **Standardized Skill Assessment**: Domain, technical, and analytical assessments generating verified capability vectors (0–100%).
- **Competency Matrix & Gap Diagnostic**: Weighted vector matching against target industry roles (e.g., *Machine Learning Engineer*, *Full-Stack Developer*, *Cloud Architect*).
- **Personalized 5-Step Career Roadmap**: Sequential milestones with AI-recommended courses, projects, and interview preparation tasks.
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

The relational database is deployed on **Supabase PostgreSQL** and managed through **Prisma ORM**:

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
       └─ Applications
```

### Core Models:
- **`User`**: Base authentication, roles (`STUDENT`, `INDUSTRY`, `INSTITUTION`, `ACADEMICIAN`), profile avatars, and documents.
- **`StudentProfile`**: Course, department, semester, CGPA, career goals, work mode preferences, social links, resume URL.
- **`IndustryProfile`**: Company overview, hiring roles, preferred skills, locations, tech stack, verification records.
- **`InstitutionProfile`**: Accreditation, student/faculty counts, programs, placement officer contacts.
- **`AcademicianProfile`**: Designation, specialization, experience, research interests, consultancy availability.
- **`Opportunity`**: Type (`JOB`, `INTERNSHIP`, `FDP`, `RESEARCH`), stipend/salary, eligibility, deadline, status.
- **`UserSkill` & `SkillScore`**: Verified student skill capability vectors.
- **`Application`**: Relational junction connecting students to posted opportunities.

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
Create a `.env` file in the project root (or copy `.env.example`):

```env
# Supabase PostgreSQL (Session/Transaction pooler + Direct connection)
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

### 5. Push Database Schema & Generate Client
```bash
# Push Prisma schema to your Supabase PostgreSQL instance
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Seeded Demo Accounts

You can test the application using pre-configured demo credentials or register a new user:

| Role | Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Student** | `aditya.sharma@iitd.ac.in` | `SkillBridge@2024` | `/student/dashboard` |
| **Industry** | `hr@flipkart.com` | `SkillBridge@2024` | `/industry/dashboard` |
| **Institution** | `admin@iitdelhi.ac.in` | `SkillBridge@2024` | `/institution/dashboard` |
| **Academician** | `dr.raghavan@iitd.ac.in` | `SkillBridge@2024` | `/academician/dashboard` |

> 💡 **Tip**: Use the **Switch Role** dropdown in the top navigation bar to quickly switch between demo personas with zero logout friction.

---

## 📂 Project Structure

```
Skill_Bridge/
├── prisma/
│   └── schema.prisma              # Comprehensive Prisma schema (16 models, 8 enums)
├── src/
│   ├── app/
│   │   ├── (auth)/                # Login & Multi-Role Dynamic Registration
│   │   ├── (dashboard)/
│   │   │   ├── student/           # Assessment, Skills, Career, Portfolio, Profile
│   │   │   ├── industry/          # Post Opportunity, Candidate Match, Profile
│   │   │   ├── institution/       # Analytics, Readiness, Demand Gaps, Profile
│   │   │   ├── academician/       # Faculty Portal, Research Grants, Profile
│   │   │   └── profile/           # Unified Dynamic Profile Routing
│   │   ├── api/                   # REST Endpoints (Auth, Profile, Matching, Upload)
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
│   │   ├── auth.ts                # NextAuth Configuration & Password Verifier
│   │   ├── matching.ts            # Deterministic Weighted Skill Matching Engine
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

- **Session Ownership Validation**: All profile and sub-record APIs (`PUT`, `DELETE`, `POST`) enforce server-side user ID verification from authenticated JWT sessions.
- **MIME & Size Enforced Uploads**: Files uploaded to Supabase Storage are validated for MIME types (`image/*`, `application/pdf`) and capped at 5MB.
- **Zero Mock Data Leakage**: Newly registered accounts start with isolated database records and real empty states without inheriting seeded demo analytics.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<div align="center">

Built with ❤️ for **Academia–Industry Collaboration**

</div>
