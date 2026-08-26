import { PrismaClient, SkillCategory, DifficultyLevel, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

export interface SeedQuestion {
  course?: string;
  department?: string;
  subject: string;
  topic: string;
  question: string;
  questionType: QuestionType;
  category: SkillCategory;
  difficulty: DifficultyLevel;
  options: string[];
  correctAnswer: string;
  explanation: string;
  skillName: string;
  marks: number;
}

export const QUESTION_BANK_SEED: SeedQuestion[] = [
  // ═════════════════════════════════════════════════════════════════════════
  // 1. B.TECH / BCA — COMPUTER SCIENCE & ENGINEERING (CSE / IT)
  // ═════════════════════════════════════════════════════════════════════════

  // Data Structures
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Data Structures",
    topic: "Binary Search Trees",
    question: "In a balanced Binary Search Tree (BST) with N nodes, what is the worst-case time complexity to search for a specific key?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: "O(log N)",
    explanation: "A balanced BST guarantees height logarithmic in the number of nodes (h = O(log N)), so search, insertion, and deletion all take O(log N) in the worst case.",
    skillName: "Data Structures",
    marks: 2,
  },
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Data Structures",
    topic: "Hash Tables",
    question: "Which collision resolution technique stores all elements hashing to the same slot in a linked list attached to that slot?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    options: ["Linear Probing", "Separate Chaining", "Quadratic Probing", "Double Hashing"],
    correctAnswer: "Separate Chaining",
    explanation: "Separate chaining handles hash collisions by maintaining a linked list (or other bucket data structure) at each index in the hash table.",
    skillName: "Data Structures",
    marks: 2,
  },
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Data Structures",
    topic: "Graph Traversal",
    question: "Which algorithm is optimal for finding the shortest path in an unweighted graph?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm"],
    correctAnswer: "Breadth First Search (BFS)",
    explanation: "BFS explores vertices level by level, ensuring that the first time a vertex is reached from the source, it is via the shortest path in terms of number of edges.",
    skillName: "Data Structures",
    marks: 3,
  },
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Data Structures",
    topic: "Heap & Priority Queues",
    question: "What is the time complexity to build a binary max-heap from an unsorted array of N elements?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.ADVANCED,
    options: ["O(N)", "O(N log N)", "O(log N)", "O(N^2)"],
    correctAnswer: "O(N)",
    explanation: "Using the bottom-up heapify approach (Floyd's algorithm), building a heap takes linear time O(N) because the sum of heights across all nodes converges to a linear bound.",
    skillName: "Data Structures",
    marks: 4,
  },

  // Database Systems & SQL
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Database Systems",
    topic: "ACID Properties",
    question: "Which ACID property guarantees that once a transaction has committed, its changes survive power loss, crashes, or system failures?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctAnswer: "Durability",
    explanation: "Durability guarantees that committed transactions are permanently recorded in non-volatile storage (such as write-ahead logs) and survive system crashes.",
    skillName: "SQL",
    marks: 2,
  },
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Database Systems",
    topic: "SQL Queries & Aggregations",
    question: "Which SQL clause is used to filter aggregated group results produced by a GROUP BY clause?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
    correctAnswer: "HAVING",
    explanation: "The HAVING clause filters grouped rows after aggregation, whereas the WHERE clause filters individual rows before grouping occurs.",
    skillName: "SQL",
    marks: 2,
  },
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Database Systems",
    topic: "Normalization",
    question: "A relation is in Third Normal Form (3NF) if it is in 2NF and has no:",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: ["Partial dependencies", "Transitive dependencies", "Multi-valued dependencies", "Join dependencies"],
    correctAnswer: "Transitive dependencies",
    explanation: "3NF requires that every non-prime attribute is non-transitively dependent on every candidate key (i.e. no X -> Y -> Z where X is candidate key and Z is non-prime).",
    skillName: "SQL",
    marks: 3,
  },
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Database Systems",
    topic: "Indexing & Query Optimization",
    question: "Why are B+ Trees predominantly preferred over B-Trees for database disk indexes?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.ADVANCED,
    options: [
      "All data pointers reside exclusively in leaf nodes linked sequentially for fast range queries",
      "B+ Trees have lower fanout than B-Trees",
      "B+ Trees allow duplicates in internal nodes",
      "B+ Trees eliminate disk I/O completely",
    ],
    correctAnswer: "All data pointers reside exclusively in leaf nodes linked sequentially for fast range queries",
    explanation: "In B+ Trees, internal nodes only store routing keys, allowing higher fanout and shallower trees, while all records reside in linked leaf nodes, making range scans very efficient.",
    skillName: "SQL",
    marks: 4,
  },

  // Operating Systems
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Operating Systems",
    topic: "Deadlocks",
    question: "Which of the following is NOT one of Coffman's four necessary conditions for a deadlock to occur?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
    correctAnswer: "Preemption Allowed",
    explanation: "The four conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlocks can be broken.",
    skillName: "Data Structures",
    marks: 2,
  },
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Operating Systems",
    topic: "Virtual Memory",
    question: "What phenomenon occurs when excessive page faults cause an operating system to spend more time swapping pages than executing instructions?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: ["Segmentation Fault", "Thrashing", "Deadlock", "Context Inversion"],
    correctAnswer: "Thrashing",
    explanation: "Thrashing occurs when the active working set of running processes exceeds available physical RAM, causing constant page swapping and CPU underutilization.",
    skillName: "Data Structures",
    marks: 3,
  },

  // Computer Networks
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Computer Networks",
    topic: "Transport Layer Protocols",
    question: "What mechanism in TCP establishes a reliable connection before data transfer begins?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    options: ["Two-Way Handshake", "Three-Way Handshake (SYN, SYN-ACK, ACK)", "Sliding Window Protocol", "ARP Resolution"],
    correctAnswer: "Three-Way Handshake (SYN, SYN-ACK, ACK)",
    explanation: "TCP uses a three-way handshake (SYN, SYN+ACK, ACK) to synchronize sequence numbers and establish connection state between client and server.",
    skillName: "Python",
    marks: 2,
  },
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Computer Networks",
    topic: "Application Protocols",
    question: "What is the primary difference between HTTP/1.1 and HTTP/2 regarding request handling?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: [
      "HTTP/2 supports binary multiplexing over a single TCP connection, eliminating head-of-line blocking at application level",
      "HTTP/2 is stateless while HTTP/1.1 is stateful",
      "HTTP/2 only works over UDP",
      "HTTP/2 does not support header compression",
    ],
    correctAnswer: "HTTP/2 supports binary multiplexing over a single TCP connection, eliminating head-of-line blocking at application level",
    explanation: "HTTP/2 introduces binary framing and stream multiplexing over a single TCP connection, resolving HTTP/1.1's pipelining bottlenecks.",
    skillName: "JavaScript",
    marks: 3,
  },

  // Software Development & Git
  {
    course: "B.Tech",
    department: "Computer Science & Engineering",
    subject: "Software Engineering",
    topic: "Version Control",
    question: "Which Git command integrates changes from another branch into the current branch by rewriting commit history linearly?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: ["git merge", "git rebase", "git checkout", "git cherry-pick"],
    correctAnswer: "git rebase",
    explanation: "git rebase moves the entire feature branch to begin on the tip of the target branch, producing a clean, linear commit history.",
    skillName: "Git",
    marks: 2,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 2. B.TECH / M.TECH — ARTIFICIAL INTELLIGENCE & MACHINE LEARNING (AI/ML)
  // ═════════════════════════════════════════════════════════════════════════

  {
    course: "B.Tech",
    department: "Artificial Intelligence & Machine Learning",
    subject: "Python for Data Science",
    topic: "Numpy & Vectorization",
    question: "Why is vectorized array computation in NumPy significantly faster than standard Python loops?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    options: [
      "NumPy delegates contiguous memory execution to optimized pre-compiled C/Fortran SIMD instructions",
      "NumPy interprets Python code line by line",
      "NumPy uses dynamic type checks at each index",
      "NumPy stores elements as Python linked list nodes",
    ],
    correctAnswer: "NumPy delegates contiguous memory execution to optimized pre-compiled C/Fortran SIMD instructions",
    explanation: "NumPy arrays are contiguous blocks of memory typed uniformly, enabling vector processing, CPU caching, and bypassing Python GIL overhead during array ops.",
    skillName: "Python",
    marks: 2,
  },
  {
    course: "B.Tech",
    department: "Artificial Intelligence & Machine Learning",
    subject: "Mathematics for ML",
    topic: "Linear Algebra & PCA",
    question: "In Principal Component Analysis (PCA), what do the eigenvectors of the data covariance matrix represent?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: [
      "The directions of maximum variance in the feature space",
      "The mean of each individual feature",
      "The residual reconstruction error",
      "The cluster centroids of the dataset",
    ],
    correctAnswer: "The directions of maximum variance in the feature space",
    explanation: "Eigenvectors correspond to the orthogonal axes (principal components) along which data variance is maximized, while eigenvalues represent the magnitude of variance.",
    skillName: "Machine Learning",
    marks: 3,
  },
  {
    course: "B.Tech",
    department: "Artificial Intelligence & Machine Learning",
    subject: "Machine Learning",
    topic: "Bias-Variance Tradeoff",
    question: "A machine learning model exhibits very low training error but high test error. What condition is present and what is an appropriate remedy?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.BEGINNER,
    options: [
      "Overfitting (High Variance); apply regularization (L1/L2) or increase training samples",
      "Underfitting (High Bias); increase model complexity",
      "Data drift; lower the learning rate",
      "Class imbalance; change the optimizer to SGD",
    ],
    correctAnswer: "Overfitting (High Variance); apply regularization (L1/L2) or increase training samples",
    explanation: "High training accuracy paired with poor generalization indicates overfitting/high variance. Regularization, dropout, cross-validation, and pruning help mitigate this.",
    skillName: "Machine Learning",
    marks: 2,
  },
  {
    course: "B.Tech",
    department: "Artificial Intelligence & Machine Learning",
    subject: "Machine Learning",
    topic: "Evaluation Metrics",
    question: "In a medical diagnostic system where identifying positive disease cases is critical, which metric should be prioritized over overall accuracy?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: ["Recall (Sensitivity)", "Precision", "Specificity", "Mean Squared Error"],
    correctAnswer: "Recall (Sensitivity)",
    explanation: "Recall measures TP / (TP + FN). In healthcare/fraud, missing a positive case (False Negative) is costly, making high recall paramount.",
    skillName: "Machine Learning",
    marks: 3,
  },
  {
    course: "B.Tech",
    department: "Artificial Intelligence & Machine Learning",
    subject: "Deep Learning",
    topic: "Neural Network Architecture",
    question: "What is the primary function of the backpropagation algorithm in training artificial neural networks?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: [
      "Computing the gradient of the loss function with respect to weights using the chain rule",
      "Normalizing the input features",
      "Initializing layer weights randomly",
      "Selecting the optimal activation function",
    ],
    correctAnswer: "Computing the gradient of the loss function with respect to weights using the chain rule",
    explanation: "Backpropagation applies the calculus chain rule backwards from the loss layer to calculate gradients for weight updates via gradient descent.",
    skillName: "Deep Learning",
    marks: 3,
  },
  {
    course: "B.Tech",
    department: "Artificial Intelligence & Machine Learning",
    subject: "Deep Learning",
    topic: "Convolutional Neural Networks",
    question: "What key advantage do Convolutional Layers have over fully-connected dense layers for computer vision tasks?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.ADVANCED,
    options: [
      "Translation invariance and parameter sharing via local receptive fields",
      "Faster convergence with zero training data",
      "Elimination of all non-linear activation functions",
      "Guaranteed zero gradient vanishing",
    ],
    correctAnswer: "Translation invariance and parameter sharing via local receptive fields",
    explanation: "CNN filters share weights across spatial dimensions and scan locally, drastically reducing parameter count and extracting spatial feature hierarchies invariant to position.",
    skillName: "Deep Learning",
    marks: 4,
  },
  {
    course: "B.Tech",
    department: "Artificial Intelligence & Machine Learning",
    subject: "Machine Learning",
    topic: "Ensemble Methods",
    question: "How does Random Forest reduce model variance compared to an individual Decision Tree?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.TECHNICAL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: [
      "By aggregating predictions from multiple decorrelated trees trained on bootstrap samples with random feature subsets (Bagging)",
      "By sequentially correcting the residuals of previous trees (Boosting)",
      "By pruning all branch nodes completely",
      "By increasing tree depth to infinity",
    ],
    correctAnswer: "By aggregating predictions from multiple decorrelated trees trained on bootstrap samples with random feature subsets (Bagging)",
    explanation: "Random Forest combines bootstrap aggregation (bagging) with random feature sub-sampling, which decorrelates individual trees and lowers ensemble variance.",
    skillName: "Machine Learning",
    marks: 3,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 3. B.COM / M.COM — COMMERCE, FINANCE & ACCOUNTING
  // ═════════════════════════════════════════════════════════════════════════

  {
    course: "B.Com",
    department: "Accounting & Finance",
    subject: "Financial Accounting",
    topic: "Golden Rules of Accounting",
    question: "Under the traditional rules of double-entry bookkeeping, what is the rule for Real Accounts?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.DOMAIN,
    difficulty: DifficultyLevel.BEGINNER,
    options: [
      "Debit what comes in, Credit what goes out",
      "Debit the receiver, Credit the giver",
      "Debit all expenses & losses, Credit all incomes & gains",
      "Debit assets, Credit liabilities",
    ],
    correctAnswer: "Debit what comes in, Credit what goes out",
    explanation: "Real accounts pertain to tangible and intangible assets/property: 'Debit what comes in, Credit what goes out'.",
    skillName: "Accounting",
    marks: 2,
  },
  {
    course: "B.Com",
    department: "Accounting & Finance",
    subject: "Financial Accounting",
    topic: "Financial Statements",
    question: "Which accounting statement discloses a company's financial position at a specific point in time rather than over a reporting period?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.DOMAIN,
    difficulty: DifficultyLevel.BEGINNER,
    options: ["Balance Sheet", "Income Statement (P&L)", "Cash Flow Statement", "Statement of Changes in Equity"],
    correctAnswer: "Balance Sheet",
    explanation: "The Balance Sheet presents a snapshot of assets, liabilities, and equity at a specific calendar date (as of March 31, etc.).",
    skillName: "Accounting",
    marks: 2,
  },
  {
    course: "B.Com",
    department: "Accounting & Finance",
    subject: "Financial Management",
    topic: "Capital Budgeting",
    question: "Why is Net Present Value (NPV) considered superior to the Payback Period method in investment evaluation?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.DOMAIN,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: [
      "NPV accounts for the time value of money and evaluates all cash flows over the entire project lifecycle",
      "NPV ignores risk adjustments",
      "NPV is always positive",
      "NPV calculates profitability in days rather than currency",
    ],
    correctAnswer: "NPV accounts for the time value of money and evaluates all cash flows over the entire project lifecycle",
    explanation: "NPV discounts all expected future cash flows to their present value using the hurdle rate, accurately reflecting value addition to shareholder wealth.",
    skillName: "Financial Management",
    marks: 3,
  },
  {
    course: "B.Com",
    department: "Accounting & Finance",
    subject: "Financial Management",
    topic: "Working Capital",
    question: "How is a firm's Net Working Capital (NWC) calculated?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.DOMAIN,
    difficulty: DifficultyLevel.BEGINNER,
    options: [
      "Current Assets - Current Liabilities",
      "Total Assets - Total Liabilities",
      "Gross Revenue - Operating Expenses",
      "Cash & Bank Balances + Debtors",
    ],
    correctAnswer: "Current Assets - Current Liabilities",
    explanation: "Net Working Capital is defined as Current Assets minus Current Liabilities, measuring short-term liquidity and operational efficiency.",
    skillName: "Financial Management",
    marks: 2,
  },
  {
    course: "B.Com",
    department: "Accounting & Finance",
    subject: "Taxation",
    topic: "Direct & Indirect Tax",
    question: "Under the Goods and Services Tax (GST) framework, what mechanism allows businesses to deduct tax paid on purchases from output tax liability?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.DOMAIN,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: ["Input Tax Credit (ITC)", "Tax Deducted at Source (TDS)", "Advance Tax Rebate", "Capital Gains Allowance"],
    correctAnswer: "Input Tax Credit (ITC)",
    explanation: "Input Tax Credit (ITC) prevents cascading tax effects by allowing registered taxpayers to claim credit for GST paid on business inputs against output tax liability.",
    skillName: "Taxation",
    marks: 3,
  },
  {
    course: "B.Com",
    department: "Accounting & Finance",
    subject: "Financial Analysis",
    topic: "Ratio Diagnostics",
    question: "A company has a Quick Ratio (Acid-Test) of 0.6:1 and Current Ratio of 2.1:1. What does this significant divergence typically signal?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.DOMAIN,
    difficulty: DifficultyLevel.ADVANCED,
    options: [
      "A high proportion of current assets is tied up in slow-moving or illiquid inventory",
      "The firm has zero accounts payable",
      "Cash reserves exceed total assets",
      "The firm is overleveraged on long-term bonds",
    ],
    correctAnswer: "A high proportion of current assets is tied up in slow-moving or illiquid inventory",
    explanation: "Quick Ratio excludes inventory from Current Assets. A high Current Ratio with a low Quick Ratio indicates heavy inventory buildup relative to liquid quick assets.",
    skillName: "Financial Analysis",
    marks: 4,
  },
  {
    course: "B.Com",
    department: "Accounting & Finance",
    subject: "Managerial Economics",
    topic: "Market Structures",
    question: "In a perfectly competitive market in long-run equilibrium, a firm operates at what price relationship?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.DOMAIN,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: [
      "Price = Marginal Revenue = Marginal Cost = Minimum Average Total Cost",
      "Price > Marginal Cost",
      "Price < Average Variable Cost",
      "Marginal Revenue > Average Revenue",
    ],
    correctAnswer: "Price = Marginal Revenue = Marginal Cost = Minimum Average Total Cost",
    explanation: "Free entry and price-taking force long-run economic profits to zero where P = MR = MC = Min ATC.",
    skillName: "Economics",
    marks: 3,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 4. UNIVERSAL APTITUDE & QUANTITATIVE PROBLEM SOLVING
  // ═════════════════════════════════════════════════════════════════════════

  {
    subject: "Quantitative Aptitude",
    topic: "Work & Time",
    question: "Pipe A fills a reservoir in 6 hours, while Pipe B fills it in 8 hours. If both operate simultaneously, how many hours will it take to fill the reservoir?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.APTITUDE,
    difficulty: DifficultyLevel.BEGINNER,
    options: ["3.43 hours (3 hours 26 mins)", "4.0 hours", "7.0 hours", "2.5 hours"],
    correctAnswer: "3.43 hours (3 hours 26 mins)",
    explanation: "Combined rate = 1/6 + 1/8 = 7/24 per hour. Time taken = 24/7 = 3.428 hours (~3 hrs 26 mins).",
    skillName: "Quantitative Aptitude",
    marks: 2,
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Profit & Loss",
    question: "A merchant marks an item 40% above cost price and offers a 20% discount on the marked price. What is the merchant's net profit percentage?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.APTITUDE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: ["12%", "20%", "15%", "18%"],
    correctAnswer: "12%",
    explanation: "Let CP = 100. Marked Price = 140. Selling Price = 140 * 0.80 = 112. Profit % = 12%.",
    skillName: "Quantitative Aptitude",
    marks: 3,
  },
  {
    subject: "Logical Reasoning",
    topic: "Deductive Logic & Syllogisms",
    question: "Statements: All algorithms are programs. Some programs are scalable. Conclusion I: Some algorithms are scalable. Conclusion II: Some programs are algorithms. Which follows?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.APTITUDE,
    difficulty: DifficultyLevel.BEGINNER,
    options: ["Only II follows", "Only I follows", "Both I and II follow", "Neither follows"],
    correctAnswer: "Only II follows",
    explanation: "Since all algorithms are programs, the converse 'some programs are algorithms' is definitively true (II). There is no guaranteed overlap between algorithms and scalable programs (I).",
    skillName: "Logical Reasoning",
    marks: 2,
  },
  {
    subject: "Logical Reasoning",
    topic: "Analytical Series & Puzzles",
    question: "Find the next number in the sequence: 4, 9, 25, 49, 121, 169, ?",
    questionType: QuestionType.MCQ,
    category: SkillCategory.APTITUDE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: ["289", "225", "196", "361"],
    correctAnswer: "289",
    explanation: "The series comprises squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169. Next prime is 17, and 17^2 = 289.",
    skillName: "Logical Reasoning",
    marks: 3,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 5. WORKPLACE SCENARIOS & PROFESSIONAL BEHAVIORAL COMPETENCIES
  // ═════════════════════════════════════════════════════════════════════════

  {
    subject: "Professional Communication",
    topic: "Engineering Conflict Resolution",
    question: "During a critical project milestone, two senior engineers on your team strongly disagree on whether to refactor a core module before deployment. How should you proceed?",
    questionType: QuestionType.SCENARIO,
    category: SkillCategory.SOFT_SKILL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: [
      "Facilitate a structured technical review assessing delivery risk, test coverage metrics, and agreed rollback plans",
      "Overrule both and deploy the oldest existing branch without changes",
      "Delay the milestone indefinitely until unanimous consensus is reached",
      "Allow whoever has longer tenure at the organization to make the sole call",
    ],
    correctAnswer: "Facilitate a structured technical review assessing delivery risk, test coverage metrics, and agreed rollback plans",
    explanation: "Constructive engineering leadership relies on objective evaluation of risks, measurable trade-offs, and contingency planning rather than arbitrary hierarchy or paralysis.",
    skillName: "Communication",
    marks: 3,
  },
  {
    subject: "Team Collaboration & Ethics",
    topic: "Stakeholder Expectation Management",
    question: "You discover a non-trivial edge-case defect 24 hours before a major product release. What is the most ethical and effective professional course of action?",
    questionType: QuestionType.SCENARIO,
    category: SkillCategory.SOFT_SKILL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    options: [
      "Immediately document the bug, assess user impact severity with the lead, and propose clear hotfix/mitigation options to stakeholders",
      "Keep silent and hope users do not encounter the edge case in production",
      "Quietly commit untested code changes directly to main without informing anyone",
      "Blame the junior engineer who submitted the initial PR",
    ],
    correctAnswer: "Immediately document the bug, assess user impact severity with the lead, and propose clear hotfix/mitigation options to stakeholders",
    explanation: "Transparency, immediate impact assessment, and offering actionable solutions uphold engineering integrity and customer trust.",
    skillName: "Communication",
    marks: 3,
  },
];

export async function seedQuestionBank() {
  console.log(`📚 Seeding ${QUESTION_BANK_SEED.length} questions into Dynamic Question Bank...`);

  let count = 0;
  for (const q of QUESTION_BANK_SEED) {
    // Find skill if exists
    const skill = await prisma.skill.findUnique({
      where: { name: q.skillName },
    });

    await prisma.assessmentQuestion.create({
      data: {
        course: q.course || null,
        department: q.department || null,
        subject: q.subject,
        topic: q.topic,
        question: q.question,
        questionType: q.questionType,
        category: q.category,
        difficulty: q.difficulty,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        skillId: skill?.id || null,
        skillName: q.skillName,
        marks: q.marks,
        isActive: true,
      },
    });
    count++;
  }

  console.log(`✅ Successfully seeded ${count} assessment questions!`);
}

if (require.main === module) {
  seedQuestionBank()
    .catch((e) => {
      console.error("Error seeding questions:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
