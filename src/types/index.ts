export type UserRole = "STUDENT" | "INDUSTRY" | "INSTITUTION" | "ACADEMICIAN";

export type OpportunityType =
  | "INTERNSHIP"
  | "JOB"
  | "APPRENTICESHIP"
  | "LIVE_PROJECT"
  | "TRAINING"
  | "WORKSHOP"
  | "MENTORSHIP"
  | "FDP"
  | "FACULTY_INTERNSHIP"
  | "RESEARCH"
  | "CONSULTANCY";

export type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED";

export type OpportunityStatus = "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED";

export type CollaborationStatus = "OPEN" | "APPLIED" | "ACTIVE" | "COMPLETED" | "REJECTED";

export type MentorshipStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type SkillCategory = "TECHNICAL" | "APTITUDE" | "SOFT_SKILL" | "DOMAIN";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string | null;
}

export interface UserSkillItem {
  id: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  score: number; // 0-100
  verified: boolean;
  source?: string | null;
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  currentLevel: number; // 0-100
  requiredLevel: number; // 0-100
  gap: number; // required - current
  status: "READY" | "DEVELOPING" | "NEEDS_IMPROVEMENT" | "CRITICAL";
  priority: number; // 1 = highest
}

export interface OpportunityItem {
  id: string;
  industryId: string;
  companyName: string;
  companyLogo?: string | null;
  type: OpportunityType;
  title: string;
  description: string | null;
  location: string | null;
  remote: boolean;
  duration: string | null;
  stipend: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  eligibility: string | null;
  deadline: string | null;
  status: OpportunityStatus;
  createdAt: string;
  requiredSkills: {
    skillId: string;
    skillName: string;
    category: SkillCategory;
    requiredLevel: number;
    weight: number;
  }[];
  compatibilityScore?: number;
  matchReasons?: {
    matched: string[];
    partial: string[];
    missing: string[];
  };
}

export interface ApplicationItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment?: string | null;
  studentInstitution?: string | null;
  studentCgpa?: number | null;
  studentAvatar?: string | null;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: OpportunityType;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  notes?: string | null;
  matchScore?: number;
}

export interface CareerRoleItem {
  id: string;
  title: string;
  description: string | null;
  domain: string | null;
  skills: {
    skillId: string;
    skillName: string;
    category: SkillCategory;
    requiredLevel: number;
    weight: number;
    priority: number;
  }[];
}

export interface AssessmentQuestionItem {
  id: string;
  question: string;
  questionType: "MCQ" | "RATING" | "SCENARIO" | "SHORT_ANSWER";
  category: SkillCategory;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  options: string[] | null;
  skillId?: string | null;
  skillName?: string | null;
  marks: number;
  orderIndex: number;
}

export interface LearningResourceItem {
  id: string;
  title: string;
  provider: string | null;
  url: string | null;
  type: string | null;
  skillId?: string | null;
  skillName?: string | null;
  description: string | null;
  duration: string | null;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string | null;
  issueDate: string | null;
  expiryDate?: string | null;
  credentialUrl: string | null;
  verified: boolean;
}

export interface CollaborationItem {
  id: string;
  industryId: string;
  companyName: string;
  institutionId: string;
  institutionName: string;
  type: string;
  title: string;
  description: string | null;
  status: CollaborationStatus;
  createdAt: string;
}
