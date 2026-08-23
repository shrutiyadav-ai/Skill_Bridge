-- =============================================================================
-- SkillBridge — Complete Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================================================
-- This script creates all tables, enums, indexes, RLS policies, and storage
-- buckets required by the SkillBridge application.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'INDUSTRY', 'INSTITUTION', 'ACADEMICIAN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OpportunityType" AS ENUM (
    'INTERNSHIP', 'JOB', 'APPRENTICESHIP', 'LIVE_PROJECT',
    'TRAINING', 'WORKSHOP', 'MENTORSHIP', 'FDP',
    'FACULTY_INTERNSHIP', 'RESEARCH', 'CONSULTANCY'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ApplicationStatus" AS ENUM (
    'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OpportunityStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "CollaborationStatus" AS ENUM ('OPEN', 'APPLIED', 'ACTIVE', 'COMPLETED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "MentorshipStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'RATING', 'SCENARIO', 'SHORT_ANSWER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "SkillCategory" AS ENUM ('TECHNICAL', 'APTITUDE', 'SOFT_SKILL', 'DOMAIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "DocumentType" AS ENUM ('RESUME', 'CERTIFICATE', 'INTERNSHIP_REPORT', 'ACADEMIC_DOCUMENT', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ═════════════════════════════════════════════════════════════════════════════
-- TABLES
-- ═════════════════════════════════════════════════════════════════════════════

-- ─── Users ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          "UserRole" NOT NULL,
  name          TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT users_email_key UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);


-- ─── Institution Profiles ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS institution_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL,
  name          TEXT NOT NULL,
  type          TEXT,
  location      TEXT,
  accreditation TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT institution_profiles_user_id_key UNIQUE (user_id),
  CONSTRAINT institution_profiles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ─── Student Profiles ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS student_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  institution_id  UUID,
  course          TEXT,
  department      TEXT,
  year            INTEGER,
  bio             TEXT,
  resume_url      TEXT,
  cgpa            DECIMAL(4,2),
  career_goal     TEXT,
  portfolio_slug  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT student_profiles_user_id_key UNIQUE (user_id),
  CONSTRAINT student_profiles_portfolio_slug_key UNIQUE (portfolio_slug),
  CONSTRAINT student_profiles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT student_profiles_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES institution_profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_institution ON student_profiles (institution_id);


-- ─── Industry Profiles ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS industry_profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL,
  company_name TEXT NOT NULL,
  industry     TEXT,
  website      TEXT,
  size         TEXT,
  description  TEXT,
  logo_url     TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT industry_profiles_user_id_key UNIQUE (user_id),
  CONSTRAINT industry_profiles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ─── Academician Profiles ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS academician_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  institution_id  UUID,
  department      TEXT,
  designation     TEXT,
  specialization  TEXT,
  experience      INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT academician_profiles_user_id_key UNIQUE (user_id),
  CONSTRAINT academician_profiles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT academician_profiles_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES institution_profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_academician_profiles_institution ON academician_profiles (institution_id);


-- ─── Skills ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    "SkillCategory" NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT skills_name_key UNIQUE (name)
);

CREATE INDEX IF NOT EXISTS idx_skills_name ON skills (name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills (category);


-- ─── User Skills ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_skills (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  skill_id   UUID NOT NULL,
  score      DECIMAL(5,2) NOT NULL,
  verified   BOOLEAN NOT NULL DEFAULT false,
  source     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_skills_user_skill_key UNIQUE (user_id, skill_id),
  CONSTRAINT user_skills_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT user_skills_skill_id_fkey
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills (user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills (skill_id);


-- ─── Skill Scores (assessment-derived) ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS skill_scores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  skill_id   UUID NOT NULL,
  score      DECIMAL(5,2) NOT NULL,
  source     TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT skill_scores_user_skill_key UNIQUE (user_id, skill_id),
  CONSTRAINT skill_scores_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT skill_scores_skill_id_fkey
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skill_scores_user ON skill_scores (user_id);


-- ─── Assessments ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assessments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  target_role      TEXT NOT NULL,
  domain           TEXT,
  duration_minutes INTEGER NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ─── Assessment Questions ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assessment_questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id  UUID NOT NULL,
  question       TEXT NOT NULL,
  question_type  "QuestionType" NOT NULL,
  category       "SkillCategory" NOT NULL,
  difficulty     "DifficultyLevel" NOT NULL,
  options        JSONB,
  correct_answer TEXT,
  rubric         TEXT,
  skill_id       UUID,
  marks          INTEGER NOT NULL DEFAULT 1,
  order_index    INTEGER NOT NULL,
  CONSTRAINT assessment_questions_assessment_id_fkey
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  CONSTRAINT assessment_questions_skill_id_fkey
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment ON assessment_questions (assessment_id);


-- ─── Assessment Results ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assessment_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  assessment_id   UUID NOT NULL,
  technical_score DECIMAL(5,2),
  aptitude_score  DECIMAL(5,2),
  soft_skill_score DECIMAL(5,2),
  overall_score   DECIMAL(5,2) NOT NULL,
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT assessment_results_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT assessment_results_assessment_id_fkey
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON assessment_results (user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment ON assessment_results (assessment_id);


-- ─── Opportunities ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS opportunities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID NOT NULL,
  type        "OpportunityType" NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  location    TEXT,
  remote      BOOLEAN NOT NULL DEFAULT false,
  duration    TEXT,
  stipend     DECIMAL(10,2),
  salary_min  DECIMAL(10,2),
  salary_max  DECIMAL(10,2),
  eligibility TEXT,
  deadline    TIMESTAMPTZ,
  status      "OpportunityStatus" NOT NULL DEFAULT 'OPEN',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT opportunities_industry_id_fkey
    FOREIGN KEY (industry_id) REFERENCES industry_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_opportunities_industry ON opportunities (industry_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities (type);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities (deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_type_status ON opportunities (type, status);


-- ─── Skill Requirements ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS skill_requirements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL,
  skill_id       UUID NOT NULL,
  required_level DECIMAL(5,2) NOT NULL,
  weight         DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  CONSTRAINT skill_requirements_opp_skill_key UNIQUE (opportunity_id, skill_id),
  CONSTRAINT skill_requirements_opportunity_id_fkey
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
  CONSTRAINT skill_requirements_skill_id_fkey
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skill_requirements_opportunity ON skill_requirements (opportunity_id);


-- ─── Applications ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS applications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL,
  opportunity_id UUID NOT NULL,
  status         "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
  applied_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes          TEXT,
  CONSTRAINT applications_student_opportunity_key UNIQUE (student_id, opportunity_id),
  CONSTRAINT applications_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
  CONSTRAINT applications_opportunity_id_fkey
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_applications_student ON applications (student_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON applications (opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);


-- ─── Projects ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  project_url TEXT,
  github_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT projects_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_projects_student ON projects (student_id);


-- ─── Project Skills (many-to-many) ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_skills (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  skill_id   UUID NOT NULL,
  CONSTRAINT project_skills_project_skill_key UNIQUE (project_id, skill_id),
  CONSTRAINT project_skills_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT project_skills_skill_id_fkey
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);


-- ─── Certifications ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS certifications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL,
  name           TEXT NOT NULL,
  issuer         TEXT,
  issue_date     DATE,
  expiry_date    DATE,
  credential_url TEXT,
  document_url   TEXT,
  verified       BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT certifications_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_certifications_student ON certifications (student_id);


-- ─── Mentorships ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mentorships (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id      UUID NOT NULL,
  mentee_id      UUID NOT NULL,
  opportunity_id UUID,
  status         "MentorshipStatus" NOT NULL DEFAULT 'PENDING',
  feedback       TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT mentorships_mentor_id_fkey
    FOREIGN KEY (mentor_id) REFERENCES industry_profiles(id),
  CONSTRAINT mentorships_mentee_id_fkey
    FOREIGN KEY (mentee_id) REFERENCES student_profiles(id),
  CONSTRAINT mentorships_opportunity_id_fkey
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_mentorships_mentor ON mentorships (mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentee ON mentorships (mentee_id);


-- ─── Internship Progress ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS internship_progress (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL,
  opportunity_id UUID NOT NULL,
  week           INTEGER NOT NULL,
  summary        TEXT,
  feedback       TEXT,
  rating         INTEGER,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT internship_progress_student_opp_week_key UNIQUE (student_id, opportunity_id, week),
  CONSTRAINT internship_progress_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
  CONSTRAINT internship_progress_opportunity_id_fkey
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
);


-- ─── Collaborations ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS collaborations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id    UUID NOT NULL,
  institution_id UUID NOT NULL,
  type           TEXT NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT,
  status         "CollaborationStatus" NOT NULL DEFAULT 'OPEN',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT collaborations_industry_id_fkey
    FOREIGN KEY (industry_id) REFERENCES industry_profiles(id),
  CONSTRAINT collaborations_institution_id_fkey
    FOREIGN KEY (institution_id) REFERENCES institution_profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_collaborations_industry ON collaborations (industry_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_institution ON collaborations (institution_id);


-- ─── Career Roles ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS career_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  domain      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT career_roles_title_key UNIQUE (title)
);


-- ─── Career Role Skills ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS career_role_skills (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_role_id UUID NOT NULL,
  skill_id       UUID NOT NULL,
  required_level DECIMAL(5,2) NOT NULL,
  weight         DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  priority       INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT career_role_skills_role_skill_key UNIQUE (career_role_id, skill_id),
  CONSTRAINT career_role_skills_career_role_id_fkey
    FOREIGN KEY (career_role_id) REFERENCES career_roles(id) ON DELETE CASCADE,
  CONSTRAINT career_role_skills_skill_id_fkey
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);


-- ─── Learning Resources ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS learning_resources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  provider    TEXT,
  url         TEXT,
  type        TEXT,
  skill_id    UUID,
  description TEXT,
  duration    TEXT,
  difficulty  "DifficultyLevel",
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT learning_resources_skill_id_fkey
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_learning_resources_skill ON learning_resources (skill_id);


-- ─── Learning Recommendations ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS learning_recommendations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL,
  resource_id UUID NOT NULL,
  priority    INTEGER NOT NULL DEFAULT 0,
  reason      TEXT,
  completed   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT learning_recommendations_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
  CONSTRAINT learning_recommendations_resource_id_fkey
    FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_learning_recommendations_student ON learning_recommendations (student_id);


-- ─── Notifications ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  message    TEXT,
  link       TEXT,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications (user_id, read);


-- ─── Opportunity Bookmarks ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS opportunity_bookmarks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL,
  opportunity_id UUID NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT opportunity_bookmarks_user_opp_key UNIQUE (user_id, opportunity_id),
  CONSTRAINT opportunity_bookmarks_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT opportunity_bookmarks_opportunity_id_fkey
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
);


-- ─── User Documents ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL,
  type         "DocumentType" NOT NULL,
  name         TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type    TEXT,
  size         INTEGER,
  verified     BOOLEAN NOT NULL DEFAULT false,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_documents_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON user_documents (user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON user_documents (type);


-- ─── Updated-at trigger function ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON industry_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON academician_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON institution_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON collaborations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON mentorships
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_skills
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ═════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═════════════════════════════════════════════════════════════════════════════
-- Note: The primary authorization layer is NextAuth middleware + API route
-- checks in the application. RLS provides defense-in-depth for direct
-- database access (e.g., through Supabase client libraries or Dashboard).
--
-- The application connects via Prisma using the service role (bypasses RLS),
-- so RLS mainly protects against direct Supabase client access.
-- ═════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_recommendations ENABLE ROW LEVEL SECURITY;

-- Public read tables (no RLS needed for reads)
-- skills, assessments, assessment_questions, opportunities, skill_requirements,
-- career_roles, career_role_skills, learning_resources, collaborations

-- ─── Users: users can read/update their own record ──────────────────────────

CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- ─── Student Profiles ────────────────────────────────────────────────────────

CREATE POLICY student_profiles_select_own ON student_profiles
  FOR SELECT USING (
    user_id::text = auth.uid()::text
  );

CREATE POLICY student_profiles_insert_own ON student_profiles
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY student_profiles_update_own ON student_profiles
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Institutions can view their students
CREATE POLICY student_profiles_select_institution ON student_profiles
  FOR SELECT USING (
    institution_id IN (
      SELECT id FROM institution_profiles WHERE user_id::text = auth.uid()::text
    )
  );

-- Industry can view student profiles (for candidate matching)
CREATE POLICY student_profiles_select_industry ON student_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'INDUSTRY')
  );

-- ─── Industry Profiles ──────────────────────────────────────────────────────

CREATE POLICY industry_profiles_select_all ON industry_profiles
  FOR SELECT USING (true);

CREATE POLICY industry_profiles_insert_own ON industry_profiles
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY industry_profiles_update_own ON industry_profiles
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- ─── Academician Profiles ───────────────────────────────────────────────────

CREATE POLICY academician_profiles_select_own ON academician_profiles
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY academician_profiles_insert_own ON academician_profiles
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY academician_profiles_update_own ON academician_profiles
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- ─── Institution Profiles ───────────────────────────────────────────────────

CREATE POLICY institution_profiles_select_all ON institution_profiles
  FOR SELECT USING (true);

CREATE POLICY institution_profiles_insert_own ON institution_profiles
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY institution_profiles_update_own ON institution_profiles
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- ─── Notifications: users see only their own ─────────────────────────────────

CREATE POLICY notifications_select_own ON notifications
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- ─── Applications ────────────────────────────────────────────────────────────

-- Students see their own applications
CREATE POLICY applications_select_student ON applications
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM student_profiles WHERE user_id::text = auth.uid()::text
    )
  );

-- Industry sees applications to their opportunities
CREATE POLICY applications_select_industry ON applications
  FOR SELECT USING (
    opportunity_id IN (
      SELECT o.id FROM opportunities o
      JOIN industry_profiles ip ON o.industry_id = ip.id
      WHERE ip.user_id::text = auth.uid()::text
    )
  );

-- Students can insert their own applications
CREATE POLICY applications_insert_student ON applications
  FOR INSERT WITH CHECK (
    student_id IN (
      SELECT id FROM student_profiles WHERE user_id::text = auth.uid()::text
    )
  );

-- Industry can update application status for their opportunities
CREATE POLICY applications_update_industry ON applications
  FOR UPDATE USING (
    opportunity_id IN (
      SELECT o.id FROM opportunities o
      JOIN industry_profiles ip ON o.industry_id = ip.id
      WHERE ip.user_id::text = auth.uid()::text
    )
  );

-- ─── User Skills ─────────────────────────────────────────────────────────────

CREATE POLICY user_skills_select_own ON user_skills
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY user_skills_manage_own ON user_skills
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Industry can view user skills for candidate evaluation
CREATE POLICY user_skills_select_industry ON user_skills
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'INDUSTRY')
  );

-- ─── Assessment Results ──────────────────────────────────────────────────────

CREATE POLICY assessment_results_select_own ON assessment_results
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY assessment_results_insert_own ON assessment_results
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- ─── Skill Scores ────────────────────────────────────────────────────────────

CREATE POLICY skill_scores_select_own ON skill_scores
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY skill_scores_manage_own ON skill_scores
  FOR ALL USING (user_id::text = auth.uid()::text);

-- ─── Projects ────────────────────────────────────────────────────────────────

CREATE POLICY projects_select_own ON projects
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM student_profiles WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY projects_manage_own ON projects
  FOR ALL USING (
    student_id IN (
      SELECT id FROM student_profiles WHERE user_id::text = auth.uid()::text
    )
  );

-- ─── Certifications ──────────────────────────────────────────────────────────

CREATE POLICY certifications_select_own ON certifications
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM student_profiles WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY certifications_manage_own ON certifications
  FOR ALL USING (
    student_id IN (
      SELECT id FROM student_profiles WHERE user_id::text = auth.uid()::text
    )
  );

-- ─── User Documents ──────────────────────────────────────────────────────────

CREATE POLICY user_documents_select_own ON user_documents
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY user_documents_manage_own ON user_documents
  FOR ALL USING (user_id::text = auth.uid()::text);

-- ─── Opportunity Bookmarks ───────────────────────────────────────────────────

CREATE POLICY bookmarks_select_own ON opportunity_bookmarks
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY bookmarks_manage_own ON opportunity_bookmarks
  FOR ALL USING (user_id::text = auth.uid()::text);

-- ─── Internship Progress ─────────────────────────────────────────────────────

CREATE POLICY internship_progress_select_own ON internship_progress
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM student_profiles WHERE user_id::text = auth.uid()::text
    )
  );

-- ─── Learning Recommendations ────────────────────────────────────────────────

CREATE POLICY learning_recs_select_own ON learning_recommendations
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM student_profiles WHERE user_id::text = auth.uid()::text
    )
  );


-- ═════════════════════════════════════════════════════════════════════════════
-- SUPABASE STORAGE BUCKETS
-- ═════════════════════════════════════════════════════════════════════════════
-- Run these in a separate SQL Editor execution if bucket creation fails
-- (some Supabase plans require manual bucket creation via the Dashboard).
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('resumes', 'resumes', false, 10485760,
   ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('certificates', 'certificates', false, 10485760,
   ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('internship-documents', 'internship-documents', false, 10485760,
   ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('academic-documents', 'academic-documents', false, 10485760,
   ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('profile-images', 'profile-images', true, 5242880,
   ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can manage their own files
-- Files are stored as: {bucket}/{user_id}/{filename}

CREATE POLICY storage_resumes_select ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_resumes_insert ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_resumes_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_certificates_select ON storage.objects
  FOR SELECT USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_certificates_insert ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_certificates_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_internship_docs_select ON storage.objects
  FOR SELECT USING (bucket_id = 'internship-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_internship_docs_insert ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'internship-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_internship_docs_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'internship-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_academic_docs_select ON storage.objects
  FOR SELECT USING (bucket_id = 'academic-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_academic_docs_insert ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'academic-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_academic_docs_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'academic-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Profile images are public read, owner write
CREATE POLICY storage_profile_images_select ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY storage_profile_images_insert ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY storage_profile_images_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);


-- ═════════════════════════════════════════════════════════════════════════════
-- DONE
-- ═════════════════════════════════════════════════════════════════════════════
-- Schema creation complete. Run supabase/seed.sql next to populate demo data.
