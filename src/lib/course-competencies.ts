/**
 * SkillBridge — Academic Competency & Assessment Configuration Engine
 * Maps every student's registered Course + Department to tailored subjects,
 * domains, evaluated competencies, durations, and passing standards.
 */

export interface CourseAssessmentConfig {
  courseCategory: "CSE_IT" | "AIML_DS" | "COMMERCE_FINANCE" | "MANAGEMENT" | "ECE_EEE" | "CORE_ENGINEERING" | "GENERAL";
  courseTitle: string;
  departmentTitle: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number; // Percentage, e.g., 70%
  domainsCovered: string[];
  competencies: {
    name: string;
    category: "TECHNICAL" | "APTITUDE" | "SOFT_SKILL" | "DOMAIN";
    weight: number;
  }[];
}

export function getAssessmentConfigForStudent(
  courseRaw?: string | null,
  departmentRaw?: string | null,
  year?: number | null
): CourseAssessmentConfig {
  const course = (courseRaw || "").toLowerCase().trim();
  const department = (departmentRaw || "").toLowerCase().trim();

  // ─── 1. ARTIFICIAL INTELLIGENCE & DATA SCIENCE ───────────────────────────
  if (
    department.includes("artificial intelligence") ||
    department.includes("ai") ||
    department.includes("machine learning") ||
    department.includes("data science") ||
    department.includes("deep learning")
  ) {
    return {
      courseCategory: "AIML_DS",
      courseTitle: courseRaw || "B.Tech",
      departmentTitle: departmentRaw || "Artificial Intelligence & Machine Learning",
      description: "Comprehensive evaluation in Python programming, ML algorithms, neural networks, mathematical foundations, and analytical reasoning.",
      durationMinutes: 40,
      totalQuestions: 15,
      passingScore: 70,
      domainsCovered: [
        "Python & Scientific Computing",
        "Mathematics & Statistics for ML",
        "Machine Learning Algorithms & Metrics",
        "Deep Learning & Neural Networks",
        "Data Preprocessing & SQL",
        "Analytical Problem Solving",
      ],
      competencies: [
        { name: "Python", category: "TECHNICAL", weight: 1.2 },
        { name: "Machine Learning", category: "TECHNICAL", weight: 1.2 },
        { name: "Deep Learning", category: "TECHNICAL", weight: 1.0 },
        { name: "SQL", category: "TECHNICAL", weight: 0.8 },
        { name: "Analytical Thinking", category: "APTITUDE", weight: 0.8 },
        { name: "Quantitative Aptitude", category: "APTITUDE", weight: 0.7 },
        { name: "Communication", category: "SOFT_SKILL", weight: 0.5 },
      ],
    };
  }

  // ─── 2. COMPUTER SCIENCE, IT, SOFTWARE & COMPUTER APPLICATIONS ──────────
  if (
    course.includes("bca") ||
    course.includes("mca") ||
    course.includes("bsc cs") ||
    course.includes("bsc it") ||
    department.includes("computer") ||
    department.includes("information technology") ||
    department.includes("software") ||
    department.includes("cyber security") ||
    department.includes("cloud") ||
    department.includes("web")
  ) {
    return {
      courseCategory: "CSE_IT",
      courseTitle: courseRaw || "B.Tech",
      departmentTitle: departmentRaw || "Computer Science & Engineering",
      description: "Structured assessment of core programming, algorithms, database architecture, operating systems, and computer networks.",
      durationMinutes: 40,
      totalQuestions: 15,
      passingScore: 70,
      domainsCovered: [
        "Programming & Algorithms",
        "Data Structures (Trees, Graphs, Hash Maps)",
        "Database Management Systems & SQL",
        "Operating Systems & Memory Management",
        "Computer Networks & Protocols",
        "Software Engineering & Version Control",
      ],
      competencies: [
        { name: "Data Structures", category: "TECHNICAL", weight: 1.2 },
        { name: "SQL", category: "TECHNICAL", weight: 1.0 },
        { name: "Python", category: "TECHNICAL", weight: 1.0 },
        { name: "JavaScript", category: "TECHNICAL", weight: 0.9 },
        { name: "Git", category: "TECHNICAL", weight: 0.7 },
        { name: "Logical Reasoning", category: "APTITUDE", weight: 0.8 },
        { name: "Problem Solving", category: "APTITUDE", weight: 0.8 },
        { name: "Communication", category: "SOFT_SKILL", weight: 0.5 },
      ],
    };
  }

  // ─── 3. COMMERCE, FINANCE, ACCOUNTING & TAXATION ─────────────────────────
  if (
    course.includes("b.com") ||
    course.includes("bcom") ||
    course.includes("m.com") ||
    course.includes("mcom") ||
    department.includes("finance") ||
    department.includes("accounting") ||
    department.includes("taxation") ||
    department.includes("banking")
  ) {
    return {
      courseCategory: "COMMERCE_FINANCE",
      courseTitle: courseRaw || "B.Com",
      departmentTitle: departmentRaw || "Accounting & Finance",
      description: "Professional evaluation of financial accounting, corporate finance, taxation regulations, managerial economics, and quantitative finance.",
      durationMinutes: 35,
      totalQuestions: 15,
      passingScore: 70,
      domainsCovered: [
        "Financial Accounting & Standards",
        "Corporate Financial Management & Budgeting",
        "Taxation (Direct & Indirect Tax Laws)",
        "Managerial Economics & Market Structures",
        "Financial Analysis & Ratio Diagnostics",
        "Commercial Ethics & Business Communication",
      ],
      competencies: [
        { name: "Accounting", category: "DOMAIN", weight: 1.2 },
        { name: "Financial Management", category: "DOMAIN", weight: 1.2 },
        { name: "Taxation", category: "DOMAIN", weight: 1.0 },
        { name: "Economics", category: "DOMAIN", weight: 0.9 },
        { name: "Financial Analysis", category: "DOMAIN", weight: 0.9 },
        { name: "Quantitative Aptitude", category: "APTITUDE", weight: 0.8 },
        { name: "Communication", category: "SOFT_SKILL", weight: 0.6 },
      ],
    };
  }

  // ─── 4. MANAGEMENT & BUSINESS ADMINISTRATION ────────────────────────────
  if (
    course.includes("bba") ||
    course.includes("mba") ||
    department.includes("marketing") ||
    department.includes("human resource") ||
    department.includes("management") ||
    department.includes("business")
  ) {
    return {
      courseCategory: "MANAGEMENT",
      courseTitle: courseRaw || "BBA / MBA",
      departmentTitle: departmentRaw || "Business Administration",
      description: "Evaluation of business strategy, organizational behavior, marketing dynamics, business analytics, and executive communication.",
      durationMinutes: 35,
      totalQuestions: 15,
      passingScore: 70,
      domainsCovered: [
        "Strategic Management & Business Planning",
        "Marketing Management & Consumer Insights",
        "Financial Decision Making",
        "Organizational Behavior & Team Leadership",
        "Business Analytics & Data-Driven Strategy",
        "Executive & Crisis Communication",
      ],
      competencies: [
        { name: "Business Analytics", category: "DOMAIN", weight: 1.1 },
        { name: "Financial Analysis", category: "DOMAIN", weight: 1.0 },
        { name: "Leadership", category: "SOFT_SKILL", weight: 1.0 },
        { name: "Communication", category: "SOFT_SKILL", weight: 1.0 },
        { name: "Problem Solving", category: "APTITUDE", weight: 0.9 },
        { name: "Teamwork", category: "SOFT_SKILL", weight: 0.8 },
      ],
    };
  }

  // ─── 5. ELECTRONICS & COMMUNICATION / ELECTRICAL ─────────────────────────
  if (
    department.includes("electronic") ||
    department.includes("electrical") ||
    department.includes("ece") ||
    department.includes("eee") ||
    department.includes("vlsi") ||
    department.includes("embedded")
  ) {
    return {
      courseCategory: "ECE_EEE",
      courseTitle: courseRaw || "B.Tech",
      departmentTitle: departmentRaw || "Electronics & Communication Engineering",
      description: "Core testing in digital systems, embedded microcontrollers, circuit theory, signal processing, and technical problem solving.",
      durationMinutes: 40,
      totalQuestions: 15,
      passingScore: 70,
      domainsCovered: [
        "Digital Logic Design & Microprocessors",
        "Signals & Communication Systems",
        "Circuit Theory & Power Systems",
        "Embedded Systems & C Programming",
        "Quantitative & Logical Reasoning",
      ],
      competencies: [
        { name: "Data Structures", category: "TECHNICAL", weight: 1.0 },
        { name: "Python", category: "TECHNICAL", weight: 0.9 },
        { name: "Logical Reasoning", category: "APTITUDE", weight: 1.0 },
        { name: "Quantitative Aptitude", category: "APTITUDE", weight: 1.0 },
        { name: "Problem Solving", category: "APTITUDE", weight: 0.9 },
        { name: "Communication", category: "SOFT_SKILL", weight: 0.5 },
      ],
    };
  }

  // ─── 6. MECHANICAL / CIVIL / CHEMICAL CORE ENGINEERING ──────────────────
  if (
    department.includes("mechanical") ||
    department.includes("civil") ||
    department.includes("chemical") ||
    department.includes("aerospace") ||
    department.includes("automobile") ||
    department.includes("industrial")
  ) {
    return {
      courseCategory: "CORE_ENGINEERING",
      courseTitle: courseRaw || "B.Tech",
      departmentTitle: departmentRaw || "Core Engineering",
      description: "Engineering analysis covering mechanics, thermo-fluids/structures, materials science, project estimation, and analytical modeling.",
      durationMinutes: 40,
      totalQuestions: 15,
      passingScore: 70,
      domainsCovered: [
        "Engineering Mechanics & Materials",
        "Thermodynamics & Fluid Dynamics / Structural Systems",
        "CAD / Engineering Design Fundamentals",
        "Project Management & Estimation",
        "Quantitative Engineering Math",
      ],
      competencies: [
        { name: "Problem Solving", category: "APTITUDE", weight: 1.2 },
        { name: "Quantitative Aptitude", category: "APTITUDE", weight: 1.1 },
        { name: "Analytical Thinking", category: "APTITUDE", weight: 1.0 },
        { name: "Logical Reasoning", category: "APTITUDE", weight: 0.9 },
        { name: "Communication", category: "SOFT_SKILL", weight: 0.6 },
        { name: "Teamwork", category: "SOFT_SKILL", weight: 0.6 },
      ],
    };
  }

  // ─── 7. GENERAL / INTERDISCIPLINARY FALLBACK ─────────────────────────────
  return {
    courseCategory: "GENERAL",
    courseTitle: courseRaw || "Undergraduate Program",
    departmentTitle: departmentRaw || "General Studies",
    description: "Multidisciplinary foundational evaluation assessing analytical problem solving, digital literacy, critical thinking, and professional communication.",
    durationMinutes: 35,
    totalQuestions: 15,
    passingScore: 70,
    domainsCovered: [
      "Quantitative Problem Solving",
      "Analytical & Logical Reasoning",
      "Digital Technology Fundamentals",
      "Professional Communication & Workplace Ethics",
      "Team Dynamics & Collaborative Execution",
    ],
    competencies: [
      { name: "Problem Solving", category: "APTITUDE", weight: 1.1 },
      { name: "Logical Reasoning", category: "APTITUDE", weight: 1.1 },
      { name: "Quantitative Aptitude", category: "APTITUDE", weight: 1.0 },
      { name: "Analytical Thinking", category: "APTITUDE", weight: 0.9 },
      { name: "Communication", category: "SOFT_SKILL", weight: 0.8 },
      { name: "Teamwork", category: "SOFT_SKILL", weight: 0.7 },
    ],
  };
}
