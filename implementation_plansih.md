# SkillBridge — Implementation Plan

> **Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement**

## Background

Build a production-quality web application connecting Students, Academicians, Industries, and Institutions. The platform enables skill assessment, gap analysis, personalized learning, opportunity matching, and placement tracking. The UI must feel like a real product designed by an experienced team — no AI-generated template aesthetics.

---

## Architecture Decision

Given the scope and the requirement for a realistic, self-contained demo that runs locally for SIH presentation, I recommend:

### Simplified Architecture (Recommended for SIH Demo)

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend/API | Next.js API Routes + Server Actions |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js (credentials provider with bcrypt) |
| AI/ML Engine | Python FastAPI microservice |
| LLM | Gemini API (for career assistant) |

> [!IMPORTANT]
> **Why NextAuth.js instead of Supabase Auth?** For a self-contained SIH demo that runs locally without requiring external Supabase project setup, NextAuth.js with a credentials provider gives us full control, simpler setup, and no external dependency. The auth system is still production-grade with JWT sessions, bcrypt password hashing, and role-based middleware.

> [!IMPORTANT]
> **Why not a separate backend?** Next.js API routes provide a clean API layer with TypeScript type sharing. The FastAPI service handles only the ML/AI components (skill scoring, matching, career assistant). This keeps the architecture clean without unnecessary complexity for a demo.

---

## User Review Required

> [!WARNING]
> **Database Setup Required**: You'll need PostgreSQL running locally (or a connection string to a cloud instance). I'll include Docker Compose for easy local setup.

> [!IMPORTANT]
> **LLM API Key**: The career assistant requires a Gemini API key. The app will function fully without it — the assistant will show a "configure API key" message. All other features (skill matching, scoring, recommendations) use deterministic algorithms, not LLM.

---

## Open Questions

1. **PostgreSQL**: Do you have PostgreSQL installed locally, or should I include a Docker Compose setup?
2. **Gemini API Key**: Do you have a Gemini API key for the career assistant feature?
3. **Python Environment**: Do you have Python 3.10+ installed for the FastAPI ML service?

---

## Proposed Changes

### Project Structure

```
Skill_Bridge/
├── docker-compose.yml           # PostgreSQL + optional services
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
│
├── prisma/
│   ├── schema.prisma            # Full relational schema
│   └── seed.ts                  # Realistic demo data
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with Inter font
│   │   ├── page.tsx             # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/
│   │   │   ├── student/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── assessment/
│   │   │   │   ├── skills/
│   │   │   │   ├── career/
│   │   │   │   ├── applications/
│   │   │   │   └── portfolio/
│   │   │   ├── industry/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── opportunities/
│   │   │   │   └── candidates/
│   │   │   ├── institution/
│   │   │   │   └── dashboard/
│   │   │   └── academician/
│   │   │       └── dashboard/
│   │   ├── opportunities/       # Public marketplace
│   │   ├── profile/[slug]/      # Public portfolio
│   │   └── api/
│   │       ├── auth/
│   │       ├── student/
│   │       ├── industry/
│   │       ├── institution/
│   │       ├── opportunities/
│   │       ├── assessment/
│   │       ├── matching/
│   │       └── notifications/
│   │
│   ├── components/
│   │   ├── ui/                  # Design system primitives
│   │   ├── layout/              # Sidebar, TopNav, Breadcrumbs
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── forms/               # Form components
│   │   └── charts/              # Chart components
│   │
│   ├── lib/
│   │   ├── auth.ts              # NextAuth config
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── matching.ts          # Skill matching algorithms
│   │   ├── scoring.ts           # Assessment scoring
│   │   └── utils.ts             # Shared utilities
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript type definitions
│   └── styles/
│       └── globals.css          # Design tokens + base styles
│
├── ml-service/                  # Python FastAPI
│   ├── main.py
│   ├── requirements.txt
│   ├── scoring/
│   │   ├── skill_matcher.py     # Weighted similarity scoring
│   │   ├── gap_analyzer.py      # Skill gap analysis
│   │   └── career_recommender.py
│   └── assistant/
│       └── career_assistant.py  # LLM-powered assistant
│
└── public/
    └── ...
```

---

### Phase 1: Foundation (Auth + Database + Design System)

#### [NEW] `prisma/schema.prisma`
Full relational schema with 20+ models:
- `User` (id, email, passwordHash, role, name, avatar, createdAt)
- `StudentProfile` (userId, institution, course, department, year, bio, resume, cgpa)
- `IndustryProfile` (userId, companyName, industry, website, size, description, logo)
- `AcademicianProfile` (userId, institution, department, designation, specialization, experience)
- `InstitutionProfile` (userId, name, type, location, accreditation)
- `Skill` (id, name, category, description)
- `UserSkill` (userId, skillId, score, verified, source)
- `Assessment` (id, title, targetRole, domain, questions, duration)
- `AssessmentResult` (userId, assessmentId, scores, overallScore, completedAt)
- `SkillRequirement` (opportunityId, skillId, requiredLevel, weight)
- `Opportunity` (id, industryId, type, title, description, location, remote, duration, stipend, deadline, status)
- `Application` (id, studentId, opportunityId, status, appliedAt, notes)
- `Notification` (id, userId, type, title, message, read, link)
- `Project` (id, studentId, title, description, skills, url)
- `Certification` (id, studentId, name, issuer, date, verified, document)
- `Mentorship` (id, mentorId, menteeId, opportunityId, status, feedback)
- `Collaboration` (id, industryId, institutionId, type, title, description, status)

#### [NEW] `src/lib/auth.ts`
NextAuth.js configuration with:
- Credentials provider (email/password with bcrypt)
- JWT session strategy with role embedded
- Custom session/JWT callbacks to include userId and role

#### [NEW] `src/middleware.ts`
Route protection middleware:
- Public routes: `/`, `/login`, `/register`, `/opportunities`, `/profile/*`
- Student routes: `/student/*` → require role=STUDENT
- Industry routes: `/industry/*` → require role=INDUSTRY
- Institution routes: `/institution/*` → require role=INSTITUTION
- Academician routes: `/academician/*` → require role=ACADEMICIAN

#### [NEW] `src/styles/globals.css`
Design system tokens:
- Colors: Navy primary (#1e293b), warm background (#f8fafc), muted blue secondary
- Typography: Inter with proper scale
- Spacing system
- Component base styles

#### [NEW] `src/components/ui/*`
Design system primitives:
- Button, Input, Select, Textarea, Badge, Card, Modal, Dropdown, Tabs, Table, Tooltip, Avatar, Progress, Skeleton, EmptyState, ErrorState

#### [NEW] `src/components/layout/*`
- `Sidebar.tsx` — Role-aware navigation sidebar
- `TopNav.tsx` — Top bar with user menu, notifications bell
- `DashboardLayout.tsx` — Composed layout wrapper
- `Breadcrumbs.tsx`

---

### Phase 2: Student Profile + Skills + Assessment

#### [NEW] `src/app/(dashboard)/student/dashboard/page.tsx`
Student dashboard showing:
- Career readiness score (computed from skill data)
- Average industry match (computed from opportunity requirements)
- Skill gaps list (from gap engine)
- Top matched opportunities (from matching engine)
- Recommended learning (from gap priorities)
- Application status summary

#### [NEW] `src/app/(dashboard)/student/assessment/page.tsx`
Assessment system:
- Role/domain selector
- Multi-section assessment (Technical, Aptitude, Soft Skills)
- Question rendering with MCQ/rating/scenario
- Timer
- Scoring calculation on submit (deterministic, rubric-based)
- Store results in database

#### [NEW] `src/app/(dashboard)/student/skills/page.tsx`
Skill profile page:
- Visual comparison table: Current vs Required vs Gap
- Progress bars for each skill
- Ability to manually add verified skills
- Skill category grouping

#### [NEW] `src/lib/scoring.ts`
Deterministic assessment scoring:
- MCQ: binary correct/incorrect with category weighting
- Aptitude: timed scoring with difficulty multiplier
- Soft skills: rubric-based scoring from scenario responses
- Aggregate into per-skill scores (0–100 scale)

---

### Phase 3: Skill Gap Engine + Career Recommendations

#### [NEW] `src/lib/matching.ts`
Core matching algorithm:
- Weighted cosine similarity between student skill vector and role requirement vector
- Configurable weights per skill category
- Returns: compatibility score, strong skills, partial skills, missing skills, priority gaps
- Transparent scoring with explanation

#### [NEW] `src/app/(dashboard)/student/career/page.tsx`
Career recommendation page:
- Target role selector
- Current readiness percentage
- Required skills vs current skills comparison
- Priority improvements list
- Learning roadmap (ordered steps)
- Recommended internships for the role

#### [NEW] `src/app/api/matching/route.ts`
API endpoints:
- `POST /api/matching/student-to-role` — Match student to a career role
- `POST /api/matching/student-to-opportunity` — Match student to specific opportunity
- `POST /api/matching/opportunity-to-candidates` — Find best candidates for opportunity

---

### Phase 4: Opportunity Marketplace + Applications

#### [NEW] `src/app/opportunities/page.tsx`
Public opportunity marketplace:
- Filterable list (type, skill, industry, location, remote, deadline)
- Search
- Each card shows: title, company, type, skills, location, deadline
- Click to detail page

#### [NEW] `src/app/opportunities/[id]/page.tsx`
Opportunity detail:
- Full description
- Required skills with match indicators (if logged in student)
- Eligibility
- Apply button
- Compatibility score (if logged in student)

#### [NEW] `src/app/(dashboard)/student/applications/page.tsx`
Application tracking:
- Table with: opportunity, company, status, applied date, actions
- Status badges (Applied → Under Review → Shortlisted → Interview → Selected/Rejected)
- Filter by status

#### [NEW] `src/app/api/applications/route.ts`
Application API:
- `POST /api/applications` — Submit application
- `PATCH /api/applications/[id]` — Update status (industry only)
- `GET /api/applications` — List applications (filtered by role)

---

### Phase 5: Industry Dashboard + Candidate Matching

#### [NEW] `src/app/(dashboard)/industry/dashboard/page.tsx`
Industry dashboard:
- Active opportunities count
- Total applications
- Shortlisted candidates
- Recent applications
- Candidate match summary

#### [NEW] `src/app/(dashboard)/industry/opportunities/new/page.tsx`
Opportunity creation form:
- Type selector
- Title, description fields
- Skill requirements (multi-select with required level)
- Eligibility, location, duration, stipend, deadline
- Save to database

#### [NEW] `src/app/(dashboard)/industry/candidates/page.tsx`
Candidate matching:
- Select opportunity
- View ranked candidates with match scores
- Each candidate shows: name, skills match breakdown, education
- Actions: View Profile, Shortlist, Contact

---

### Phase 6: Institution Analytics

#### [NEW] `src/app/(dashboard)/institution/dashboard/page.tsx`
Institution analytics dashboard:
- Student skill readiness (aggregate)
- Internship participation rate
- Placement readiness (percentage of students above threshold)
- Most common skill gaps (bar chart)
- Industry demand vs student skills comparison
- Department-level breakdown
- Placement outcomes summary

Uses chart components (lightweight — recharts or chart.js).

---

### Phase 7: Academician Portal + Collaboration

#### [NEW] `src/app/(dashboard)/academician/dashboard/page.tsx`
Academician portal:
- Available opportunities (FDP, Faculty Internship, Research, Consultancy)
- Applied/participated tracking
- Mentorship opportunities
- Collaboration status

#### [NEW] `src/app/(dashboard)/academician/opportunities/page.tsx`
Browse and apply for academician-relevant opportunities.

#### [NEW] Collaboration module
- Mentorship program listing
- Workshop/guest lecture management
- Research collaboration tracking
- Basic status workflow (Open → Applied → Active → Completed)

---

### Phase 8: AI Career Assistant

#### [NEW] `ml-service/main.py`
FastAPI service with endpoints:
- `POST /score` — Calculate skill match score
- `POST /analyze-gaps` — Analyze skill gaps
- `POST /career-assist` — LLM-powered career Q&A

#### [NEW] `ml-service/assistant/career_assistant.py`
Career assistant using Gemini API:
- Receives student profile data + question
- Constructs context-aware prompt with actual skill data
- Returns actionable career advice
- Falls back gracefully when API key not configured

#### [NEW] Career assistant UI component
- Small chat widget accessible from student dashboard
- Sends student's actual stored profile/assessment data as context
- Shows conversation history within session

---

### Phase 9: Notifications + Polish + Security

#### [NEW] Notification system
- Database-backed notifications
- Bell icon with unread count in TopNav
- Notification dropdown
- Types: opportunity match, application status, assessment complete, mentorship, deadline

#### Security hardening
- Input validation on all API routes (zod)
- File upload validation (type, size)
- API authorization checks on every endpoint
- Environment variables for all secrets
- No sensitive data in client responses
- CSRF protection via NextAuth

#### Polish
- Loading skeletons on all pages
- Empty states with helpful CTAs
- Error boundaries
- Form validation with inline errors
- Responsive design verification
- Accessibility (ARIA labels, keyboard nav, focus management)

---

### Phase 10: Seed Data

#### [NEW] `prisma/seed.ts`
Realistic demo data:
- 15+ students across different departments (CS, ECE, Mechanical, etc.)
- 8+ companies (TCS, Infosys, Flipkart, Razorpay, etc. — realistic Indian companies)
- 20+ opportunities (mix of internships, jobs, workshops, etc.)
- 30+ skills with categories
- Assessment questions for 3+ domains
- Pre-computed assessment results for demo students
- Applications in various statuses
- Notifications
- Academician profiles
- Institution data

---

## Verification Plan

### Automated Tests
```bash
# Build check
npm run build

# Type check
npx tsc --noEmit

# Prisma validation
npx prisma validate

# Seed data
npx prisma db seed
```

### Manual Verification
1. **Auth flow**: Register → Login → Redirect to role dashboard → Cannot access other role URLs
2. **Student flow**: Dashboard → Assessment → View Skills → View Gaps → Browse Opportunities → Apply → Track
3. **Industry flow**: Dashboard → Post Opportunity → View Candidates → Shortlist → Update Application
4. **Institution flow**: Dashboard → View Analytics → Skill Gaps → Industry Demand
5. **Academician flow**: Dashboard → Browse Opportunities → Apply
6. **Responsive**: Test on desktop, tablet, mobile viewports
7. **Data integrity**: All actions persist to database, UI reflects real data
