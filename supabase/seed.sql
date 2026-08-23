-- =============================================================================
-- SkillBridge — Seed Data
-- Run this in: Supabase Dashboard → SQL Editor (after schema.sql)
-- =============================================================================
-- Demo password for ALL seed users: SkillBridge@2024
-- Password hash generated via pgcrypto (bcrypt, cost 10)
-- =============================================================================

-- Clear existing seed data (safe re-run)
DELETE FROM learning_recommendations;
DELETE FROM learning_resources;
DELETE FROM internship_progress;
DELETE FROM mentorships;
DELETE FROM collaborations;
DELETE FROM opportunity_bookmarks;
DELETE FROM notifications;
DELETE FROM project_skills;
DELETE FROM projects;
DELETE FROM certifications;
DELETE FROM applications;
DELETE FROM skill_requirements;
DELETE FROM opportunities;
DELETE FROM career_role_skills;
DELETE FROM career_roles;
DELETE FROM assessment_results;
DELETE FROM assessment_questions;
DELETE FROM assessments;
DELETE FROM skill_scores;
DELETE FROM user_skills;
DELETE FROM user_documents;
DELETE FROM student_profiles;
DELETE FROM industry_profiles;
DELETE FROM academician_profiles;
DELETE FROM institution_profiles;
DELETE FROM skills;
DELETE FROM users;


-- ═════════════════════════════════════════════════════════════════════════════
-- SKILLS (35 skills across categories)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO skills (id, name, category, description) VALUES
  -- Technical
  ('50000000-0000-0000-0000-000000000001', 'Python',           'TECHNICAL', 'General-purpose programming language widely used in data science, web development, and automation'),
  ('50000000-0000-0000-0000-000000000002', 'JavaScript',       'TECHNICAL', 'Core language of the web for frontend and backend development'),
  ('50000000-0000-0000-0000-000000000003', 'TypeScript',       'TECHNICAL', 'Typed superset of JavaScript for large-scale application development'),
  ('50000000-0000-0000-0000-000000000004', 'Java',             'TECHNICAL', 'Enterprise programming language for backend systems and Android development'),
  ('50000000-0000-0000-0000-000000000005', 'C++',              'TECHNICAL', 'High-performance language for systems programming and competitive coding'),
  ('50000000-0000-0000-0000-000000000006', 'SQL',              'TECHNICAL', 'Structured Query Language for relational database management'),
  ('50000000-0000-0000-0000-000000000007', 'HTML/CSS',         'TECHNICAL', 'Markup and styling languages for web page structure and design'),
  ('50000000-0000-0000-0000-000000000008', 'React',            'TECHNICAL', 'JavaScript library for building user interfaces'),
  ('50000000-0000-0000-0000-000000000009', 'Node.js',          'TECHNICAL', 'JavaScript runtime for server-side application development'),
  ('50000000-0000-0000-0000-000000000010', 'Django',           'TECHNICAL', 'Python web framework for rapid application development'),
  ('50000000-0000-0000-0000-000000000011', 'Spring Boot',      'TECHNICAL', 'Java framework for building production-grade applications'),
  ('50000000-0000-0000-0000-000000000012', 'Docker',           'TECHNICAL', 'Containerization platform for application deployment'),
  ('50000000-0000-0000-0000-000000000013', 'Kubernetes',       'TECHNICAL', 'Container orchestration system for managing deployments at scale'),
  ('50000000-0000-0000-0000-000000000014', 'AWS',              'TECHNICAL', 'Amazon Web Services cloud computing platform'),
  ('50000000-0000-0000-0000-000000000015', 'Git',              'TECHNICAL', 'Distributed version control system'),
  ('50000000-0000-0000-0000-000000000016', 'Linux',            'TECHNICAL', 'Operating system fundamentals and command-line proficiency'),
  ('50000000-0000-0000-0000-000000000017', 'MongoDB',          'TECHNICAL', 'NoSQL document database for flexible data storage'),
  ('50000000-0000-0000-0000-000000000018', 'PostgreSQL',       'TECHNICAL', 'Advanced open-source relational database'),
  ('50000000-0000-0000-0000-000000000019', 'REST API',         'TECHNICAL', 'Architectural style for designing networked applications'),
  ('50000000-0000-0000-0000-000000000020', 'Machine Learning', 'TECHNICAL', 'Building models that learn from data to make predictions'),
  ('50000000-0000-0000-0000-000000000021', 'Deep Learning',    'TECHNICAL', 'Neural network-based approaches for complex pattern recognition'),
  ('50000000-0000-0000-0000-000000000022', 'NLP',              'TECHNICAL', 'Natural Language Processing for text and speech analysis'),
  ('50000000-0000-0000-0000-000000000023', 'Computer Vision',  'TECHNICAL', 'Image and video analysis using machine learning'),
  ('50000000-0000-0000-0000-000000000024', 'Data Structures',  'TECHNICAL', 'Fundamental data organization and algorithm design'),
  ('50000000-0000-0000-0000-000000000025', 'System Design',    'TECHNICAL', 'Designing scalable and reliable distributed systems'),
  ('50000000-0000-0000-0000-000000000026', 'Cloud Computing',  'TECHNICAL', 'Cloud infrastructure, services, and deployment models'),
  ('50000000-0000-0000-0000-000000000027', 'DevOps',           'TECHNICAL', 'CI/CD pipelines, infrastructure as code, and deployment automation'),
  -- Aptitude
  ('50000000-0000-0000-0000-000000000028', 'Logical Reasoning',    'APTITUDE', 'Ability to analyze and solve logic-based problems'),
  ('50000000-0000-0000-0000-000000000029', 'Quantitative Aptitude', 'APTITUDE', 'Mathematical problem-solving and numerical analysis'),
  ('50000000-0000-0000-0000-000000000030', 'Problem Solving',      'APTITUDE', 'Ability to break down and solve complex problems'),
  ('50000000-0000-0000-0000-000000000031', 'Analytical Thinking',  'APTITUDE', 'Systematic evaluation and interpretation of information'),
  -- Soft Skills
  ('50000000-0000-0000-0000-000000000032', 'Communication',    'SOFT_SKILL', 'Written and verbal communication effectiveness'),
  ('50000000-0000-0000-0000-000000000033', 'Teamwork',         'SOFT_SKILL', 'Collaborative skills and ability to work in teams'),
  ('50000000-0000-0000-0000-000000000034', 'Leadership',       'SOFT_SKILL', 'Ability to guide, motivate, and manage teams'),
  ('50000000-0000-0000-0000-000000000035', 'Adaptability',     'SOFT_SKILL', 'Flexibility and willingness to learn new skills');


-- ═════════════════════════════════════════════════════════════════════════════
-- INSTITUTION USERS + PROFILES (4 institutions)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO users (id, email, password_hash, role, name) VALUES
  ('30000000-0000-0000-0000-000000000001', 'admin@iitdelhi.ac.in',    crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INSTITUTION', 'IIT Delhi Admin'),
  ('30000000-0000-0000-0000-000000000002', 'admin@nittrichy.ac.in',   crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INSTITUTION', 'NIT Trichy Admin'),
  ('30000000-0000-0000-0000-000000000003', 'admin@bitspilani.ac.in',  crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INSTITUTION', 'BITS Pilani Admin'),
  ('30000000-0000-0000-0000-000000000004', 'admin@vitvellore.ac.in',  crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INSTITUTION', 'VIT Vellore Admin');

INSERT INTO institution_profiles (id, user_id, name, type, location, accreditation) VALUES
  ('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Indian Institute of Technology, Delhi',    'IIT',        'New Delhi',  'NAAC A++'),
  ('31000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'National Institute of Technology, Trichy', 'NIT',        'Tiruchirappalli', 'NAAC A+'),
  ('31000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 'BITS Pilani',                             'Deemed Univ','Pilani',     'NAAC A'),
  ('31000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', 'VIT Vellore',                             'Deemed Univ','Vellore',    'NAAC A++');


-- ═════════════════════════════════════════════════════════════════════════════
-- INDUSTRY USERS + PROFILES (9 companies)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO users (id, email, password_hash, role, name) VALUES
  ('20000000-0000-0000-0000-000000000001', 'hr@infosys.com',     crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INDUSTRY', 'Priya Menon'),
  ('20000000-0000-0000-0000-000000000002', 'hr@flipkart.com',    crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INDUSTRY', 'Ramesh Iyer'),
  ('20000000-0000-0000-0000-000000000003', 'hr@razorpay.com',    crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INDUSTRY', 'Neha Kulkarni'),
  ('20000000-0000-0000-0000-000000000004', 'hr@zoho.com',        crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INDUSTRY', 'Venkatesh R'),
  ('20000000-0000-0000-0000-000000000005', 'hr@freshworks.com',  crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INDUSTRY', 'Anjali Reddy'),
  ('20000000-0000-0000-0000-000000000006', 'hr@tcs.com',         crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INDUSTRY', 'Suresh Nair'),
  ('20000000-0000-0000-0000-000000000007', 'hr@phonepe.com',     crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INDUSTRY', 'Kavitha Mohan'),
  ('20000000-0000-0000-0000-000000000008', 'hr@swiggy.com',      crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INDUSTRY', 'Arjun Nambiar'),
  ('20000000-0000-0000-0000-000000000009', 'hr@wipro.com',       crypt('SkillBridge@2024', gen_salt('bf', 10)), 'INDUSTRY', 'Deepa Sharma');

INSERT INTO industry_profiles (id, user_id, company_name, industry, website, size, description) VALUES
  ('21000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Infosys',    'IT Services & Consulting',  'https://www.infosys.com',    '10000+', 'Global leader in next-generation digital services and consulting, enabling clients across 56 countries to navigate their digital transformation.'),
  ('21000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Flipkart',   'E-commerce',                'https://www.flipkart.com',   '10000+', 'India''s leading e-commerce marketplace with a registered customer base of over 450 million.'),
  ('21000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'Razorpay',   'Fintech',                   'https://razorpay.com',       '1000-5000', 'Full-stack financial solutions company providing payment gateway, lending, banking, and business tools.'),
  ('21000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 'Zoho',       'SaaS',                      'https://www.zoho.com',       '5000-10000', 'Provider of an integrated suite of business, collaboration, and productivity applications.'),
  ('21000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', 'Freshworks', 'SaaS',                      'https://www.freshworks.com', '5000-10000', 'Business software company providing SaaS customer engagement solutions for support, sales, and marketing.'),
  ('21000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000006', 'TCS',        'IT Services & Consulting',  'https://www.tcs.com',        '10000+', 'Global IT services, consulting, and business solutions organization with a consulting-led approach.'),
  ('21000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000007', 'PhonePe',    'Fintech',                   'https://www.phonepe.com',    '1000-5000', 'India''s leading digital payments platform, processing over 5 billion monthly transactions.'),
  ('21000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000008', 'Swiggy',     'Food Tech',                 'https://www.swiggy.com',     '5000-10000', 'On-demand delivery platform connecting consumers to restaurants, grocery stores, and more.'),
  ('21000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000009', 'Wipro',      'IT Services & Consulting',  'https://www.wipro.com',      '10000+', 'Leading technology services and consulting company focused on building innovative solutions for digital transformation.');


-- ═════════════════════════════════════════════════════════════════════════════
-- STUDENT USERS + PROFILES (16 students)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO users (id, email, password_hash, role, name) VALUES
  ('10000000-0000-0000-0000-000000000001', 'aditya.sharma@iitd.ac.in',     crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Aditya Sharma'),
  ('10000000-0000-0000-0000-000000000002', 'priya.patel@nitt.ac.in',       crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Priya Patel'),
  ('10000000-0000-0000-0000-000000000003', 'rahul.verma@iitd.ac.in',       crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Rahul Verma'),
  ('10000000-0000-0000-0000-000000000004', 'sneha.gupta@bitspilani.ac.in', crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Sneha Gupta'),
  ('10000000-0000-0000-0000-000000000005', 'arjun.nair@iitd.ac.in',        crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Arjun Nair'),
  ('10000000-0000-0000-0000-000000000006', 'kavitha.s@nitt.ac.in',          crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Kavitha Sundaram'),
  ('10000000-0000-0000-0000-000000000007', 'mohammed.iqbal@vitvellore.ac.in', crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Mohammed Iqbal'),
  ('10000000-0000-0000-0000-000000000008', 'ananya.iyer@bitspilani.ac.in', crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Ananya Iyer'),
  ('10000000-0000-0000-0000-000000000009', 'vikram.singh@iitd.ac.in',      crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Vikram Singh'),
  ('10000000-0000-0000-0000-000000000010', 'deepika.rao@vitvellore.ac.in', crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Deepika Rao'),
  ('10000000-0000-0000-0000-000000000011', 'sarthak.joshi@nitt.ac.in',     crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Sarthak Joshi'),
  ('10000000-0000-0000-0000-000000000012', 'roshni.das@bitspilani.ac.in',  crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Roshni Das'),
  ('10000000-0000-0000-0000-000000000013', 'karthik.menon@nitt.ac.in',     crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Karthik Menon'),
  ('10000000-0000-0000-0000-000000000014', 'shreya.banerjee@iitd.ac.in',   crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Shreya Banerjee'),
  ('10000000-0000-0000-0000-000000000015', 'harish.kumar@vitvellore.ac.in', crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Harish Kumar'),
  ('10000000-0000-0000-0000-000000000016', 'meera.krishnan@bitspilani.ac.in', crypt('SkillBridge@2024', gen_salt('bf', 10)), 'STUDENT', 'Meera Krishnan');

INSERT INTO student_profiles (id, user_id, institution_id, course, department, year, bio, cgpa, career_goal, portfolio_slug) VALUES
  ('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000001', 'B.Tech', 'Computer Science', 3, 'Passionate about machine learning and building intelligent systems. Experienced with Python, TensorFlow, and data pipelines.', 8.72, 'Machine Learning Engineer', 'aditya-sharma'),
  ('11000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '31000000-0000-0000-0000-000000000002', 'B.Tech', 'Information Technology', 4, 'Full-stack web developer with a strong foundation in React and Node.js. Looking for opportunities in product engineering.', 8.45, 'Full Stack Developer', 'priya-patel'),
  ('11000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', '31000000-0000-0000-0000-000000000001', 'B.Tech', 'Electronics & Communication', 3, 'Interested in embedded systems and IoT. Working on projects combining hardware and software.', 7.89, 'Embedded Systems Engineer', 'rahul-verma'),
  ('11000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', '31000000-0000-0000-0000-000000000003', 'B.Tech', 'Computer Science', 4, 'Data science enthusiast with experience in statistical modeling and data visualization.', 9.12, 'Data Scientist', 'sneha-gupta'),
  ('11000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '31000000-0000-0000-0000-000000000001', 'M.Tech', 'Artificial Intelligence', 2, 'Researching transformer architectures and their applications in NLP. Published two conference papers.', 9.35, 'AI Engineer', 'arjun-nair'),
  ('11000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', '31000000-0000-0000-0000-000000000002', 'B.Tech', 'Computer Science', 3, 'Focused on cloud infrastructure and DevOps practices. AWS certified.', 8.20, 'Cloud Engineer', 'kavitha-sundaram'),
  ('11000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', '31000000-0000-0000-0000-000000000004', 'B.Tech', 'Information Technology', 4, 'Full-stack developer experienced with MERN stack. Contributed to multiple open-source projects.', 8.56, 'Software Developer', 'mohammed-iqbal'),
  ('11000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008', '31000000-0000-0000-0000-000000000003', 'B.Tech', 'Computer Science', 3, 'Cybersecurity researcher focusing on network security and penetration testing.', 8.10, 'Security Engineer', 'ananya-iyer'),
  ('11000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', '31000000-0000-0000-0000-000000000001', 'B.Tech', 'Mechanical Engineering', 4, 'Bridging mechanical engineering with IoT and data analytics.', 7.65, 'Data Analyst', 'vikram-singh'),
  ('11000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000010', '31000000-0000-0000-0000-000000000004', 'MCA', 'Computer Applications', 2, 'Mobile app developer with experience in React Native and Flutter.', 8.80, 'Mobile Developer', 'deepika-rao'),
  ('11000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000011', '31000000-0000-0000-0000-000000000002', 'B.Tech', 'Computer Science', 2, 'Frontend developer learning React and design systems. Building accessible web interfaces.', 7.95, 'Web Developer', 'sarthak-joshi'),
  ('11000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012', '31000000-0000-0000-0000-000000000003', 'B.Tech', 'Computer Science', 4, 'DevOps engineer with experience in CI/CD, Docker, Kubernetes, and cloud platforms.', 8.33, 'DevOps Engineer', 'roshni-das'),
  ('11000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000013', '31000000-0000-0000-0000-000000000002', 'B.Tech', 'Electronics & Communication', 3, 'Signal processing and computer vision researcher.', 8.05, 'Computer Vision Engineer', 'karthik-menon'),
  ('11000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000014', '31000000-0000-0000-0000-000000000001', 'B.Tech', 'Information Technology', 3, 'Backend developer focused on distributed systems and microservices.', 8.67, 'Backend Developer', 'shreya-banerjee'),
  ('11000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000015', '31000000-0000-0000-0000-000000000004', 'B.Tech', 'Computer Science', 4, 'Systems programmer interested in compilers, operating systems, and low-level optimization.', 7.78, 'Systems Engineer', 'harish-kumar'),
  ('11000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000016', '31000000-0000-0000-0000-000000000003', 'B.Tech', 'Computer Science', 3, 'Data analyst with strong SQL and visualization skills. Experienced with Tableau and Power BI.', 8.40, 'Data Analyst', 'meera-krishnan');


-- ═════════════════════════════════════════════════════════════════════════════
-- ACADEMICIAN USERS + PROFILES (4 faculty)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO users (id, email, password_hash, role, name) VALUES
  ('40000000-0000-0000-0000-000000000001', 'dr.raghavan@iitd.ac.in',    crypt('SkillBridge@2024', gen_salt('bf', 10)), 'ACADEMICIAN', 'Dr. S. Raghavan'),
  ('40000000-0000-0000-0000-000000000002', 'dr.padmavathi@nitt.ac.in',  crypt('SkillBridge@2024', gen_salt('bf', 10)), 'ACADEMICIAN', 'Dr. G. Padmavathi'),
  ('40000000-0000-0000-0000-000000000003', 'dr.anand@bitspilani.ac.in', crypt('SkillBridge@2024', gen_salt('bf', 10)), 'ACADEMICIAN', 'Dr. K. Anand'),
  ('40000000-0000-0000-0000-000000000004', 'dr.lakshmi@vitvellore.ac.in', crypt('SkillBridge@2024', gen_salt('bf', 10)), 'ACADEMICIAN', 'Dr. R. Lakshmi');

INSERT INTO academician_profiles (id, user_id, institution_id, department, designation, specialization, experience) VALUES
  ('41000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000001', 'Computer Science', 'Professor', 'Machine Learning & AI', 18),
  ('41000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '31000000-0000-0000-0000-000000000002', 'Information Technology', 'Associate Professor', 'Cybersecurity', 12),
  ('41000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', '31000000-0000-0000-0000-000000000003', 'Computer Science', 'Assistant Professor', 'Cloud Computing', 8),
  ('41000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', '31000000-0000-0000-0000-000000000004', 'Computer Science', 'Professor', 'Data Science & Analytics', 15);


-- ═════════════════════════════════════════════════════════════════════════════
-- USER SKILLS (skill scores for students)
-- ═════════════════════════════════════════════════════════════════════════════

-- Aditya Sharma (ML focus)
INSERT INTO user_skills (user_id, skill_id, score, verified, source) VALUES
  ('10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 82.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000006', 48.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000015', 76.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000020', 64.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000021', 52.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000024', 70.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000030', 72.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000032', 68.00, false, 'assessment');

-- Priya Patel (Full Stack focus)
INSERT INTO user_skills (user_id, skill_id, score, verified, source) VALUES
  ('10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 85.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000003', 72.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000007', 90.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000008', 80.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000009', 78.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000006', 55.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000015', 82.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000019', 75.00, false, 'assessment');

-- Sneha Gupta (Data Science focus)
INSERT INTO user_skills (user_id, skill_id, score, verified, source) VALUES
  ('10000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000001', 88.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000006', 82.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000020', 78.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000021', 65.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000029', 85.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000031', 80.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000015', 70.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000032', 75.00, false, 'assessment');

-- Arjun Nair (AI/NLP focus)
INSERT INTO user_skills (user_id, skill_id, score, verified, source) VALUES
  ('10000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000001', 90.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000020', 85.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000021', 82.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000022', 88.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000006', 60.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000015', 78.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000012', 55.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000034', 72.00, false, 'assessment');

-- Kavitha Sundaram (Cloud focus)
INSERT INTO user_skills (user_id, skill_id, score, verified, source) VALUES
  ('10000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000001', 65.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000014', 78.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000026', 74.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000012', 80.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000013', 62.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000016', 72.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000027', 68.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000015', 85.00, true,  'assessment');

-- Mohammed Iqbal (Full Stack / MERN)
INSERT INTO user_skills (user_id, skill_id, score, verified, source) VALUES
  ('10000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000002', 88.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000008', 82.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000009', 80.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000017', 75.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000007', 85.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000015', 80.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000019', 72.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000033', 78.00, false, 'assessment');

-- Meera Krishnan (Data Analyst)
INSERT INTO user_skills (user_id, skill_id, score, verified, source) VALUES
  ('10000000-0000-0000-0000-000000000016', '50000000-0000-0000-0000-000000000001', 72.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000016', '50000000-0000-0000-0000-000000000006', 85.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000016', '50000000-0000-0000-0000-000000000029', 78.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000016', '50000000-0000-0000-0000-000000000031', 82.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000016', '50000000-0000-0000-0000-000000000020', 55.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000016', '50000000-0000-0000-0000-000000000032', 80.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000016', '50000000-0000-0000-0000-000000000015', 68.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000016', '50000000-0000-0000-0000-000000000030', 70.00, false, 'assessment');

-- Roshni Das (DevOps focus)
INSERT INTO user_skills (user_id, skill_id, score, verified, source) VALUES
  ('10000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000012', 85.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000013', 72.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000014', 70.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000016', 82.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000027', 78.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000015', 88.00, true,  'assessment'),
  ('10000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000001', 60.00, false, 'assessment'),
  ('10000000-0000-0000-0000-000000000012', '50000000-0000-0000-0000-000000000026', 68.00, false, 'assessment');


-- ═════════════════════════════════════════════════════════════════════════════
-- CAREER ROLES + REQUIRED SKILLS
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO career_roles (id, title, description, domain) VALUES
  ('60000000-0000-0000-0000-000000000001', 'Machine Learning Engineer', 'Design and deploy ML models for production systems', 'AI/ML'),
  ('60000000-0000-0000-0000-000000000002', 'Data Scientist',           'Analyze complex data to drive business decisions', 'Data Science'),
  ('60000000-0000-0000-0000-000000000003', 'Data Analyst',             'Transform raw data into actionable insights', 'Analytics'),
  ('60000000-0000-0000-0000-000000000004', 'Software Developer',       'Build and maintain software applications', 'Software Engineering'),
  ('60000000-0000-0000-0000-000000000005', 'Web Developer',            'Design and build web applications and interfaces', 'Web Development'),
  ('60000000-0000-0000-0000-000000000006', 'Cloud Engineer',           'Design, deploy and manage cloud infrastructure', 'Cloud & DevOps'),
  ('60000000-0000-0000-0000-000000000007', 'AI Engineer',              'Build and deploy AI-powered applications and services', 'AI/ML'),
  ('60000000-0000-0000-0000-000000000008', 'Full Stack Developer',     'Build end-to-end web applications across frontend and backend', 'Web Development'),
  ('60000000-0000-0000-0000-000000000009', 'DevOps Engineer',          'Automate deployment, monitoring, and infrastructure management', 'Cloud & DevOps'),
  ('60000000-0000-0000-0000-000000000010', 'Backend Developer',        'Design and build server-side applications, APIs, and databases', 'Software Engineering');

-- ML Engineer requirements
INSERT INTO career_role_skills (career_role_id, skill_id, required_level, weight, priority) VALUES
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 80.00, 1.00, 1),
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000020', 85.00, 1.00, 2),
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000021', 70.00, 0.80, 3),
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000006', 70.00, 0.70, 4),
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000015', 65.00, 0.50, 5),
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000012', 60.00, 0.50, 6),
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000030', 70.00, 0.40, 7);

-- Data Scientist requirements
INSERT INTO career_role_skills (career_role_id, skill_id, required_level, weight, priority) VALUES
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 85.00, 1.00, 1),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000006', 80.00, 0.90, 2),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000020', 80.00, 0.90, 3),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000029', 75.00, 0.70, 4),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000031', 70.00, 0.60, 5),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000015', 65.00, 0.40, 6),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000032', 65.00, 0.40, 7);

-- Full Stack Developer requirements
INSERT INTO career_role_skills (career_role_id, skill_id, required_level, weight, priority) VALUES
  ('60000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000002', 85.00, 1.00, 1),
  ('60000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000008', 80.00, 0.90, 2),
  ('60000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000009', 75.00, 0.90, 3),
  ('60000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000007', 80.00, 0.70, 4),
  ('60000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000006', 70.00, 0.60, 5),
  ('60000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000015', 70.00, 0.50, 6),
  ('60000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000019', 70.00, 0.50, 7);

-- Cloud Engineer requirements
INSERT INTO career_role_skills (career_role_id, skill_id, required_level, weight, priority) VALUES
  ('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000014', 80.00, 1.00, 1),
  ('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000026', 80.00, 1.00, 2),
  ('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000012', 75.00, 0.90, 3),
  ('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000013', 70.00, 0.80, 4),
  ('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000016', 70.00, 0.70, 5),
  ('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000027', 65.00, 0.60, 6),
  ('60000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000015', 70.00, 0.50, 7);

-- DevOps Engineer requirements
INSERT INTO career_role_skills (career_role_id, skill_id, required_level, weight, priority) VALUES
  ('60000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000012', 85.00, 1.00, 1),
  ('60000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000013', 75.00, 0.90, 2),
  ('60000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000016', 80.00, 0.80, 3),
  ('60000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000027', 80.00, 0.80, 4),
  ('60000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000014', 70.00, 0.70, 5),
  ('60000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000015', 75.00, 0.60, 6),
  ('60000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000001', 60.00, 0.40, 7);


-- ═════════════════════════════════════════════════════════════════════════════
-- ASSESSMENTS + QUESTIONS
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO assessments (id, title, target_role, domain, duration_minutes) VALUES
  ('70000000-0000-0000-0000-000000000001', 'Machine Learning Engineer Assessment', 'Machine Learning Engineer', 'AI/ML', 45),
  ('70000000-0000-0000-0000-000000000002', 'Full Stack Developer Assessment',      'Full Stack Developer',      'Web Development', 40),
  ('70000000-0000-0000-0000-000000000003', 'Data Analyst Assessment',              'Data Analyst',              'Analytics', 35);

-- ML Assessment Questions
INSERT INTO assessment_questions (id, assessment_id, question, question_type, category, difficulty, options, correct_answer, skill_id, marks, order_index) VALUES
  ('71000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001',
   'Which algorithm is most suitable for classifying emails as spam or not spam?',
   'MCQ', 'TECHNICAL', 'BEGINNER',
   '["Decision Tree", "Logistic Regression", "K-Means Clustering", "Linear Regression"]',
   'Logistic Regression', '50000000-0000-0000-0000-000000000020', 2, 1),

  ('71000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000001',
   'What is the purpose of the activation function in a neural network?',
   'MCQ', 'TECHNICAL', 'INTERMEDIATE',
   '["To normalize the input data", "To introduce non-linearity into the model", "To reduce the number of parameters", "To speed up training"]',
   'To introduce non-linearity into the model', '50000000-0000-0000-0000-000000000021', 3, 2),

  ('71000000-0000-0000-0000-000000000003', '70000000-0000-0000-0000-000000000001',
   'In a confusion matrix, what does the term "recall" measure?',
   'MCQ', 'TECHNICAL', 'INTERMEDIATE',
   '["True Positives / (True Positives + False Positives)", "True Positives / (True Positives + False Negatives)", "True Negatives / (True Negatives + False Positives)", "Accuracy of the model"]',
   'True Positives / (True Positives + False Negatives)', '50000000-0000-0000-0000-000000000020', 3, 3),

  ('71000000-0000-0000-0000-000000000004', '70000000-0000-0000-0000-000000000001',
   'Which SQL query would retrieve the top 5 customers by total purchase amount?',
   'MCQ', 'TECHNICAL', 'INTERMEDIATE',
   '["SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id ORDER BY SUM(amount) DESC LIMIT 5", "SELECT TOP 5 customer_id FROM orders ORDER BY amount", "SELECT customer_id FROM orders WHERE amount > 1000 LIMIT 5", "SELECT DISTINCT customer_id FROM orders LIMIT 5"]',
   'SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id ORDER BY SUM(amount) DESC LIMIT 5', '50000000-0000-0000-0000-000000000006', 2, 4),

  ('71000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000001',
   'What is the output of the following Python code: print(type([]) is list)',
   'MCQ', 'TECHNICAL', 'BEGINNER',
   '["True", "False", "Error", "None"]',
   'True', '50000000-0000-0000-0000-000000000001', 1, 5),

  ('71000000-0000-0000-0000-000000000006', '70000000-0000-0000-0000-000000000001',
   'Which regularization technique adds the absolute value of weights as a penalty?',
   'MCQ', 'TECHNICAL', 'ADVANCED',
   '["L1 (Lasso)", "L2 (Ridge)", "Elastic Net", "Dropout"]',
   'L1 (Lasso)', '50000000-0000-0000-0000-000000000020', 4, 6),

  ('71000000-0000-0000-0000-000000000007', '70000000-0000-0000-0000-000000000001',
   'If a train travels 120 km in 2 hours and then 180 km in 3 hours, what is the average speed?',
   'MCQ', 'APTITUDE', 'BEGINNER',
   '["50 km/h", "60 km/h", "65 km/h", "70 km/h"]',
   '60 km/h', NULL, 2, 7),

  ('71000000-0000-0000-0000-000000000008', '70000000-0000-0000-0000-000000000001',
   'A team of 5 can complete a project in 12 days. How many days would it take 3 people at the same rate?',
   'MCQ', 'APTITUDE', 'INTERMEDIATE',
   '["15 days", "18 days", "20 days", "24 days"]',
   '20 days', NULL, 3, 8),

  ('71000000-0000-0000-0000-000000000009', '70000000-0000-0000-0000-000000000001',
   'Your team disagrees on the choice of ML framework for a new project. How would you handle this?',
   'SCENARIO', 'SOFT_SKILL', 'INTERMEDIATE',
   '["Insist on your preferred framework", "Propose a comparative evaluation with defined criteria", "Let the senior team member decide", "Avoid the discussion"]',
   'Propose a comparative evaluation with defined criteria', NULL, 3, 9),

  ('71000000-0000-0000-0000-000000000010', '70000000-0000-0000-0000-000000000001',
   'Rate your ability to explain technical ML concepts to non-technical stakeholders.',
   'RATING', 'SOFT_SKILL', 'BEGINNER',
   '["1 - Not confident", "2 - Somewhat confident", "3 - Confident", "4 - Very confident", "5 - Expert"]',
   NULL, NULL, 2, 10);

-- Full Stack Assessment Questions
INSERT INTO assessment_questions (id, assessment_id, question, question_type, category, difficulty, options, correct_answer, skill_id, marks, order_index) VALUES
  ('72000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000002',
   'What is the virtual DOM in React?',
   'MCQ', 'TECHNICAL', 'BEGINNER',
   '["A copy of the real DOM kept in memory for efficient updates", "A debugging tool for DOM inspection", "A CSS rendering engine", "A server-side DOM"]',
   'A copy of the real DOM kept in memory for efficient updates', '50000000-0000-0000-0000-000000000008', 2, 1),

  ('72000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000002',
   'Which HTTP method is idempotent?',
   'MCQ', 'TECHNICAL', 'INTERMEDIATE',
   '["POST", "PUT", "PATCH (sometimes)", "All of the above"]',
   'PUT', '50000000-0000-0000-0000-000000000019', 3, 2),

  ('72000000-0000-0000-0000-000000000003', '70000000-0000-0000-0000-000000000002',
   'What does the "use strict" directive do in JavaScript?',
   'MCQ', 'TECHNICAL', 'BEGINNER',
   '["Enables strict type checking", "Prevents use of undeclared variables and other unsafe actions", "Enables ES6 features", "Optimizes code execution"]',
   'Prevents use of undeclared variables and other unsafe actions', '50000000-0000-0000-0000-000000000002', 2, 3),

  ('72000000-0000-0000-0000-000000000004', '70000000-0000-0000-0000-000000000002',
   'In Node.js, what is the event loop responsible for?',
   'MCQ', 'TECHNICAL', 'INTERMEDIATE',
   '["Managing memory allocation", "Handling asynchronous callbacks", "Compiling JavaScript to machine code", "Managing database connections"]',
   'Handling asynchronous callbacks', '50000000-0000-0000-0000-000000000009', 3, 4),

  ('72000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000002',
   'What is the difference between JOIN and UNION in SQL?',
   'MCQ', 'TECHNICAL', 'INTERMEDIATE',
   '["JOIN combines rows from different tables, UNION combines results of multiple SELECT statements", "They are the same operation", "UNION is faster than JOIN", "JOIN only works with two tables"]',
   'JOIN combines rows from different tables, UNION combines results of multiple SELECT statements', '50000000-0000-0000-0000-000000000006', 3, 5),

  ('72000000-0000-0000-0000-000000000006', '70000000-0000-0000-0000-000000000002',
   'If a pipe fills a tank in 6 hours and another empties it in 8 hours, how long to fill if both are open?',
   'MCQ', 'APTITUDE', 'INTERMEDIATE',
   '["12 hours", "18 hours", "24 hours", "14 hours"]',
   '24 hours', NULL, 3, 6),

  ('72000000-0000-0000-0000-000000000007', '70000000-0000-0000-0000-000000000002',
   'A client reports that the web application loads slowly on mobile devices. What is your approach?',
   'SCENARIO', 'SOFT_SKILL', 'INTERMEDIATE',
   '["Tell them to use a desktop", "Audit performance with Lighthouse, check bundle size, optimize images, implement lazy loading", "Blame the hosting provider", "Add a loading spinner"]',
   'Audit performance with Lighthouse, check bundle size, optimize images, implement lazy loading', NULL, 3, 7),

  ('72000000-0000-0000-0000-000000000008', '70000000-0000-0000-0000-000000000002',
   'Rate your comfort level working with version control in a team setting.',
   'RATING', 'SOFT_SKILL', 'BEGINNER',
   '["1 - Not comfortable", "2 - Basic commits", "3 - Branching/merging", "4 - Code reviews and PRs", "5 - Advanced workflows"]',
   NULL, '50000000-0000-0000-0000-000000000015', 2, 8);

-- Data Analyst Assessment Questions
INSERT INTO assessment_questions (id, assessment_id, question, question_type, category, difficulty, options, correct_answer, skill_id, marks, order_index) VALUES
  ('73000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000003',
   'What is the difference between HAVING and WHERE in SQL?',
   'MCQ', 'TECHNICAL', 'INTERMEDIATE',
   '["WHERE filters rows before grouping, HAVING filters after grouping", "They are identical", "HAVING is faster", "WHERE only works with numbers"]',
   'WHERE filters rows before grouping, HAVING filters after grouping', '50000000-0000-0000-0000-000000000006', 3, 1),

  ('73000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000003',
   'Which Python library is commonly used for data manipulation and analysis?',
   'MCQ', 'TECHNICAL', 'BEGINNER',
   '["NumPy", "Pandas", "Matplotlib", "Scikit-learn"]',
   'Pandas', '50000000-0000-0000-0000-000000000001', 2, 2),

  ('73000000-0000-0000-0000-000000000003', '70000000-0000-0000-0000-000000000003',
   'What does a p-value of 0.03 in a hypothesis test indicate?',
   'MCQ', 'TECHNICAL', 'ADVANCED',
   '["The result is statistically significant at the 5% level", "The null hypothesis is true", "There is a 3% chance the alternative hypothesis is wrong", "The sample size is too small"]',
   'The result is statistically significant at the 5% level', '50000000-0000-0000-0000-000000000029', 4, 3),

  ('73000000-0000-0000-0000-000000000004', '70000000-0000-0000-0000-000000000003',
   'A store sells 150 items on Monday, 200 on Tuesday, 180 on Wednesday. What percentage increase from Monday to Tuesday?',
   'MCQ', 'APTITUDE', 'BEGINNER',
   '["25%", "33.3%", "50%", "20%"]',
   '33.3%', NULL, 2, 4),

  ('73000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000003',
   'Find the next number: 2, 6, 12, 20, 30, ?',
   'MCQ', 'APTITUDE', 'INTERMEDIATE',
   '["40", "42", "44", "36"]',
   '42', NULL, 3, 5),

  ('73000000-0000-0000-0000-000000000006', '70000000-0000-0000-0000-000000000003',
   'Your analysis reveals that a key business metric declined 15% month-over-month. How do you present this to stakeholders?',
   'SCENARIO', 'SOFT_SKILL', 'INTERMEDIATE',
   '["Just share the numbers", "Present the decline with root cause analysis, comparison to trends, and recommended actions", "Blame external factors", "Wait until someone asks"]',
   'Present the decline with root cause analysis, comparison to trends, and recommended actions', NULL, 3, 6),

  ('73000000-0000-0000-0000-000000000007', '70000000-0000-0000-0000-000000000003',
   'Rate your experience with data visualization and storytelling.',
   'RATING', 'SOFT_SKILL', 'BEGINNER',
   '["1 - No experience", "2 - Basic charts", "3 - Dashboards", "4 - Interactive visualizations", "5 - Data storytelling expert"]',
   NULL, NULL, 2, 7);


-- ═════════════════════════════════════════════════════════════════════════════
-- ASSESSMENT RESULTS (pre-computed for demo students)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO assessment_results (user_id, assessment_id, technical_score, aptitude_score, soft_skill_score, overall_score, completed_at) VALUES
  ('10000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 72.50, 68.00, 74.00, 71.50, now() - interval '5 days'),
  ('10000000-0000-0000-0000-000000000004', '70000000-0000-0000-0000-000000000001', 82.00, 78.00, 72.00, 78.00, now() - interval '3 days'),
  ('10000000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000001', 88.00, 75.00, 80.00, 82.50, now() - interval '4 days'),
  ('10000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000002', 80.00, 72.00, 78.00, 77.00, now() - interval '6 days'),
  ('10000000-0000-0000-0000-000000000007', '70000000-0000-0000-0000-000000000002', 85.00, 70.00, 82.00, 80.00, now() - interval '2 days'),
  ('10000000-0000-0000-0000-000000000016', '70000000-0000-0000-0000-000000000003', 78.00, 82.00, 80.00, 80.00, now() - interval '1 day'),
  ('10000000-0000-0000-0000-000000000009', '70000000-0000-0000-0000-000000000003', 62.00, 75.00, 68.00, 68.00, now() - interval '7 days');


-- ═════════════════════════════════════════════════════════════════════════════
-- OPPORTUNITIES (22 opportunities across types)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, industry_id, type, title, description, location, remote, duration, stipend, salary_min, salary_max, eligibility, deadline, status) VALUES
  -- Internships
  ('80000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000002', 'INTERNSHIP',
   'Machine Learning Intern', 'Work on recommendation systems and search ranking models. You will build and evaluate ML models that directly impact millions of users.', 'Bangalore', false, '6 months', 40000.00, NULL, NULL,
   'B.Tech/M.Tech in CS/IT/ECE, 3rd year or above', now() + interval '30 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000002', '21000000-0000-0000-0000-000000000003', 'INTERNSHIP',
   'Backend Engineering Intern', 'Build scalable payment infrastructure handling millions of transactions. Work with distributed systems, microservices, and high-availability architecture.', 'Bangalore', false, '3 months', 35000.00, NULL, NULL,
   'B.Tech in CS/IT, pre-final or final year', now() + interval '21 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000003', '21000000-0000-0000-0000-000000000004', 'INTERNSHIP',
   'Frontend Development Intern', 'Build responsive web interfaces for Zoho''s suite of business applications. Work with React and modern CSS frameworks.', 'Chennai', false, '4 months', 25000.00, NULL, NULL,
   'B.Tech/BCA in CS/IT, 2nd year or above', now() + interval '45 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000004', '21000000-0000-0000-0000-000000000007', 'INTERNSHIP',
   'Data Engineering Intern', 'Build ETL pipelines processing billions of transaction records. Work with Spark, Kafka, and data warehousing solutions.', 'Bangalore', true, '6 months', 45000.00, NULL, NULL,
   'B.Tech/M.Tech in CS/IT, pre-final or final year', now() + interval '25 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000005', '21000000-0000-0000-0000-000000000008', 'INTERNSHIP',
   'Product Analytics Intern', 'Analyze user behavior and product metrics to drive decision-making. Build dashboards and run A/B test analyses.', 'Bangalore', true, '3 months', 30000.00, NULL, NULL,
   'Any engineering background, strong SQL skills', now() + interval '15 days', 'OPEN'),

  -- Jobs
  ('80000000-0000-0000-0000-000000000006', '21000000-0000-0000-0000-000000000001', 'JOB',
   'Associate Software Engineer', 'Join our digital services team to build enterprise software solutions for global clients. Training provided on proprietary frameworks.', 'Pune', false, 'Full-time', NULL, 400000.00, 600000.00,
   'B.Tech/BE in any engineering discipline, 2024/2025 batch', now() + interval '60 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000007', '21000000-0000-0000-0000-000000000006', 'JOB',
   'Systems Engineer', 'Design, develop, and maintain enterprise systems. Opportunity to work on cutting-edge projects across domains.', 'Mumbai', false, 'Full-time', NULL, 350000.00, 500000.00,
   'B.Tech/BE/MCA, 2024/2025 batch', now() + interval '45 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000008', '21000000-0000-0000-0000-000000000005', 'JOB',
   'Software Development Engineer', 'Build SaaS products used by 60,000+ businesses worldwide. Work on customer engagement and support solutions.', 'Chennai', false, 'Full-time', NULL, 800000.00, 1200000.00,
   'B.Tech in CS/IT, strong coding fundamentals', now() + interval '35 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000009', '21000000-0000-0000-0000-000000000009', 'JOB',
   'Cloud Infrastructure Engineer', 'Design and manage cloud infrastructure for enterprise clients. Work with multi-cloud environments.', 'Hyderabad', true, 'Full-time', NULL, 600000.00, 900000.00,
   'B.Tech in CS/IT/ECE, cloud certification preferred', now() + interval '40 days', 'OPEN'),

  -- Training Programs
  ('80000000-0000-0000-0000-000000000010', '21000000-0000-0000-0000-000000000001', 'TRAINING',
   'Infosys Springboard — Python for Data Science', 'Comprehensive training program covering Python fundamentals, data manipulation with Pandas, statistical analysis, and machine learning basics.', 'Online', true, '8 weeks', NULL, NULL, NULL,
   'Open to all engineering students', now() + interval '20 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000011', '21000000-0000-0000-0000-000000000006', 'TRAINING',
   'TCS iON Digital Learning — Cloud Fundamentals', 'Learn cloud computing concepts, AWS/Azure basics, virtualization, and containerization through hands-on labs.', 'Online', true, '6 weeks', NULL, NULL, NULL,
   'Open to all engineering students', now() + interval '30 days', 'OPEN'),

  -- Workshops
  ('80000000-0000-0000-0000-000000000012', '21000000-0000-0000-0000-000000000002', 'WORKSHOP',
   'Building Scalable Microservices', 'Two-day intensive workshop on microservice architecture, API design patterns, containerization, and deployment strategies.', 'Bangalore', false, '2 days', NULL, NULL, NULL,
   'B.Tech/M.Tech students with basic programming knowledge', now() + interval '14 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000013', '21000000-0000-0000-0000-000000000003', 'WORKSHOP',
   'Introduction to Payment Systems & Fintech', 'Workshop covering payment gateways, UPI architecture, financial regulations, and building secure transaction systems.', 'Online', true, '1 day', NULL, NULL, NULL,
   'Open to CS/IT students', now() + interval '10 days', 'OPEN'),

  -- Live Projects
  ('80000000-0000-0000-0000-000000000014', '21000000-0000-0000-0000-000000000005', 'LIVE_PROJECT',
   'Open Source Contribution — CRM Module', 'Contribute to an open-source CRM module. Fix bugs, add features, and get mentored by senior engineers.', 'Remote', true, '3 months', 15000.00, NULL, NULL,
   'Intermediate programming skills, Git proficiency', now() + interval '30 days', 'OPEN'),

  -- Mentorship
  ('80000000-0000-0000-0000-000000000015', '21000000-0000-0000-0000-000000000002', 'MENTORSHIP',
   'Career Mentorship — Engineering at Scale', 'Get mentored by senior engineers at Flipkart. Monthly 1:1 sessions covering career growth, technical skills, and interview preparation.', 'Online', true, '6 months', NULL, NULL, NULL,
   'B.Tech/M.Tech students in CS/IT', now() + interval '20 days', 'OPEN'),

  -- Apprenticeship
  ('80000000-0000-0000-0000-000000000016', '21000000-0000-0000-0000-000000000004', 'APPRENTICESHIP',
   'Zoho Development Apprenticeship', 'Year-long apprenticeship program combining structured learning with real project work. Potential for full-time conversion.', 'Chennai', false, '12 months', 20000.00, NULL, NULL,
   'B.Tech/BCA final year or recent graduates', now() + interval '45 days', 'OPEN'),

  -- FDP
  ('80000000-0000-0000-0000-000000000017', '21000000-0000-0000-0000-000000000001', 'FDP',
   'Faculty Development Program — AI in Education', 'Five-day FDP on integrating AI tools into curriculum design, assessment, and personalized learning. Hands-on sessions with industry tools.', 'Mysore', false, '5 days', NULL, NULL, NULL,
   'Faculty members from engineering institutions', now() + interval '25 days', 'OPEN'),

  -- Faculty Internship
  ('80000000-0000-0000-0000-000000000018', '21000000-0000-0000-0000-000000000006', 'FACULTY_INTERNSHIP',
   'Faculty Internship — Enterprise Systems', 'Four-week immersion program for faculty to experience enterprise software development practices, agile methodologies, and industry tools.', 'Pune', false, '4 weeks', 50000.00, NULL, NULL,
   'Faculty with minimum 3 years teaching experience', now() + interval '35 days', 'OPEN'),

  -- Research Collaboration
  ('80000000-0000-0000-0000-000000000019', '21000000-0000-0000-0000-000000000002', 'RESEARCH',
   'Applied Research — Recommendation Systems', 'Collaborative research on next-generation recommendation algorithms. Joint publications and access to large-scale datasets.', 'Bangalore', true, '12 months', NULL, NULL, NULL,
   'Faculty or PhD researchers in ML/AI', now() + interval '60 days', 'OPEN'),

  -- Consultancy
  ('80000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000007', 'CONSULTANCY',
   'Fintech Security Audit Consultancy', 'Engage faculty experts in reviewing and auditing payment security infrastructure. Domain expertise in cryptography and network security required.', 'Remote', true, '3 months', NULL, NULL, NULL,
   'Faculty with expertise in cybersecurity or cryptography', now() + interval '30 days', 'OPEN'),

  -- Additional opportunities
  ('80000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000008', 'INTERNSHIP',
   'DevOps Engineering Intern', 'Automate deployment pipelines for Swiggy''s delivery platform. Work with Docker, Kubernetes, and cloud infrastructure at scale.', 'Bangalore', false, '6 months', 35000.00, NULL, NULL,
   'B.Tech in CS/IT, familiarity with Linux and scripting', now() + interval '28 days', 'OPEN'),

  ('80000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000003', 'JOB',
   'Data Analyst', 'Join the business analytics team to analyze payment trends, merchant behavior, and financial KPIs. Build data pipelines and dashboards.', 'Bangalore', true, 'Full-time', NULL, 700000.00, 1000000.00,
   'B.Tech/M.Tech with strong SQL and Python skills', now() + interval '25 days', 'OPEN');


-- ═════════════════════════════════════════════════════════════════════════════
-- SKILL REQUIREMENTS (for opportunities)
-- ═════════════════════════════════════════════════════════════════════════════

-- ML Intern at Flipkart
INSERT INTO skill_requirements (opportunity_id, skill_id, required_level, weight) VALUES
  ('80000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 80.00, 1.00),
  ('80000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000020', 85.00, 1.00),
  ('80000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000006', 70.00, 0.80),
  ('80000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000015', 65.00, 0.50);

-- Backend Intern at Razorpay
INSERT INTO skill_requirements (opportunity_id, skill_id, required_level, weight) VALUES
  ('80000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000004', 75.00, 1.00),
  ('80000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000006', 70.00, 0.80),
  ('80000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000019', 70.00, 0.80),
  ('80000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000015', 65.00, 0.50),
  ('80000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000025', 60.00, 0.50);

-- Frontend Intern at Zoho
INSERT INTO skill_requirements (opportunity_id, skill_id, required_level, weight) VALUES
  ('80000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000002', 80.00, 1.00),
  ('80000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000008', 75.00, 0.90),
  ('80000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000007', 80.00, 0.80),
  ('80000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000015', 60.00, 0.40);

-- Data Engineering Intern at PhonePe
INSERT INTO skill_requirements (opportunity_id, skill_id, required_level, weight) VALUES
  ('80000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000001', 75.00, 1.00),
  ('80000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000006', 80.00, 1.00),
  ('80000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000015', 65.00, 0.50);

-- Product Analytics Intern at Swiggy
INSERT INTO skill_requirements (opportunity_id, skill_id, required_level, weight) VALUES
  ('80000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000006', 80.00, 1.00),
  ('80000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000001', 65.00, 0.70),
  ('80000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000031', 60.00, 0.60);

-- SDE at Freshworks
INSERT INTO skill_requirements (opportunity_id, skill_id, required_level, weight) VALUES
  ('80000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000002', 80.00, 1.00),
  ('80000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000008', 75.00, 0.90),
  ('80000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000009', 70.00, 0.80),
  ('80000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000006', 65.00, 0.60),
  ('80000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000024', 70.00, 0.70);

-- Cloud Infra Engineer at Wipro
INSERT INTO skill_requirements (opportunity_id, skill_id, required_level, weight) VALUES
  ('80000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000014', 80.00, 1.00),
  ('80000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000026', 75.00, 0.90),
  ('80000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000012', 70.00, 0.80),
  ('80000000-0000-0000-0000-000000000009', '50000000-0000-0000-0000-000000000016', 65.00, 0.60);

-- DevOps Intern at Swiggy
INSERT INTO skill_requirements (opportunity_id, skill_id, required_level, weight) VALUES
  ('80000000-0000-0000-0000-000000000021', '50000000-0000-0000-0000-000000000012', 75.00, 1.00),
  ('80000000-0000-0000-0000-000000000021', '50000000-0000-0000-0000-000000000013', 65.00, 0.80),
  ('80000000-0000-0000-0000-000000000021', '50000000-0000-0000-0000-000000000016', 70.00, 0.70),
  ('80000000-0000-0000-0000-000000000021', '50000000-0000-0000-0000-000000000015', 70.00, 0.50);

-- Data Analyst at Razorpay
INSERT INTO skill_requirements (opportunity_id, skill_id, required_level, weight) VALUES
  ('80000000-0000-0000-0000-000000000022', '50000000-0000-0000-0000-000000000006', 85.00, 1.00),
  ('80000000-0000-0000-0000-000000000022', '50000000-0000-0000-0000-000000000001', 75.00, 0.90),
  ('80000000-0000-0000-0000-000000000022', '50000000-0000-0000-0000-000000000029', 70.00, 0.60),
  ('80000000-0000-0000-0000-000000000022', '50000000-0000-0000-0000-000000000032', 65.00, 0.40);


-- ═════════════════════════════════════════════════════════════════════════════
-- APPLICATIONS
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO applications (student_id, opportunity_id, status, applied_at, notes) VALUES
  -- Aditya applied to ML Intern (Flipkart) - Under Review
  ('11000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', 'UNDER_REVIEW', now() - interval '3 days', NULL),
  -- Aditya applied to Data Engineering (PhonePe) - Applied
  ('11000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000004', 'APPLIED', now() - interval '1 day', NULL),
  -- Priya applied to Frontend (Zoho) - Shortlisted
  ('11000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000003', 'SHORTLISTED', now() - interval '5 days', 'Strong portfolio and React experience'),
  -- Priya applied to SDE (Freshworks) - Interview
  ('11000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000008', 'INTERVIEW', now() - interval '7 days', 'Interview scheduled for next week'),
  -- Sneha applied to ML Intern (Flipkart) - Shortlisted
  ('11000000-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000001', 'SHORTLISTED', now() - interval '4 days', 'Strong data science background'),
  -- Sneha applied to Data Analyst (Razorpay) - Applied
  ('11000000-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000022', 'APPLIED', now() - interval '2 days', NULL),
  -- Arjun applied to ML Intern (Flipkart) - Selected
  ('11000000-0000-0000-0000-000000000005', '80000000-0000-0000-0000-000000000001', 'SELECTED', now() - interval '10 days', 'Excellent NLP expertise and research publications'),
  -- Mohammed applied to SDE (Freshworks) - Under Review
  ('11000000-0000-0000-0000-000000000007', '80000000-0000-0000-0000-000000000008', 'UNDER_REVIEW', now() - interval '4 days', NULL),
  -- Mohammed applied to Frontend (Zoho) - Applied
  ('11000000-0000-0000-0000-000000000007', '80000000-0000-0000-0000-000000000003', 'APPLIED', now() - interval '1 day', NULL),
  -- Kavitha applied to Cloud Infra (Wipro) - Interview
  ('11000000-0000-0000-0000-000000000006', '80000000-0000-0000-0000-000000000009', 'INTERVIEW', now() - interval '6 days', 'AWS certified, strong Linux skills'),
  -- Roshni applied to DevOps Intern (Swiggy) - Under Review
  ('11000000-0000-0000-0000-000000000012', '80000000-0000-0000-0000-000000000021', 'UNDER_REVIEW', now() - interval '3 days', NULL),
  -- Meera applied to Product Analytics (Swiggy) - Shortlisted
  ('11000000-0000-0000-0000-000000000016', '80000000-0000-0000-0000-000000000005', 'SHORTLISTED', now() - interval '5 days', 'Strong SQL and analytical skills'),
  -- Meera applied to Data Analyst (Razorpay) - Applied
  ('11000000-0000-0000-0000-000000000016', '80000000-0000-0000-0000-000000000022', 'APPLIED', now() - interval '2 days', NULL);


-- ═════════════════════════════════════════════════════════════════════════════
-- PROJECTS
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO projects (id, student_id, title, description, project_url, github_url) VALUES
  ('90000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'Movie Recommendation Engine',
   'Collaborative filtering-based recommendation system using matrix factorization. Trained on the MovieLens 25M dataset achieving 0.87 RMSE.',
   NULL, 'https://github.com/aditya-sharma/movie-recommender'),
  ('90000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000001', 'Sentiment Analysis Pipeline',
   'End-to-end NLP pipeline for analyzing product reviews using BERT fine-tuning. Deployed as a REST API using FastAPI.',
   NULL, 'https://github.com/aditya-sharma/sentiment-pipeline'),
  ('90000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000002', 'E-commerce Platform',
   'Full-stack e-commerce application with React frontend, Node.js backend, and MongoDB. Includes payment integration, cart management, and admin dashboard.',
   'https://shop-demo.priyapatel.dev', 'https://github.com/priya-patel/ecommerce-platform'),
  ('90000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000004', 'Customer Churn Prediction',
   'Machine learning model predicting customer churn for a telecom company using gradient boosting. Achieved 89% accuracy with feature importance analysis.',
   NULL, 'https://github.com/sneha-gupta/churn-prediction'),
  ('90000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000005', 'Multilingual Document Summarizer',
   'Transformer-based summarization system supporting English, Hindi, and Tamil. Uses mBART with custom fine-tuning on Indian language datasets.',
   NULL, 'https://github.com/arjun-nair/multilingual-summarizer'),
  ('90000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000007', 'Task Management App',
   'Full-stack task management application with real-time collaboration using Socket.io. Built with React, Express, and MongoDB.',
   'https://taskflow.mohammediqbal.dev', 'https://github.com/mohammed-iqbal/taskflow'),
  ('90000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000012', 'CI/CD Pipeline Automation',
   'Automated deployment pipeline using GitHub Actions, Docker, and Kubernetes. Includes staging and production environments with rollback capabilities.',
   NULL, 'https://github.com/roshni-das/cicd-automation');

INSERT INTO project_skills (project_id, skill_id) VALUES
  ('90000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001'),
  ('90000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000020'),
  ('90000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001'),
  ('90000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000022'),
  ('90000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000019'),
  ('90000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000008'),
  ('90000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000009'),
  ('90000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000017'),
  ('90000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000001'),
  ('90000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000020'),
  ('90000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000006'),
  ('90000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000001'),
  ('90000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000021'),
  ('90000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000022'),
  ('90000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000008'),
  ('90000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000009'),
  ('90000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000002'),
  ('90000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000012'),
  ('90000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000013'),
  ('90000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000027');


-- ═════════════════════════════════════════════════════════════════════════════
-- CERTIFICATIONS
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO certifications (student_id, name, issuer, issue_date, credential_url, verified) VALUES
  ('11000000-0000-0000-0000-000000000001', 'Machine Learning Specialization',           'Stanford Online (Coursera)',  '2025-08-15', 'https://coursera.org/verify/specialization/ABC123', true),
  ('11000000-0000-0000-0000-000000000001', 'TensorFlow Developer Certificate',          'Google',                     '2025-11-20', 'https://credential.net/tf-cert/XYZ789', true),
  ('11000000-0000-0000-0000-000000000002', 'Meta Front-End Developer Professional Certificate', 'Meta (Coursera)',    '2025-06-10', 'https://coursera.org/verify/professional-cert/DEF456', true),
  ('11000000-0000-0000-0000-000000000004', 'IBM Data Science Professional Certificate',  'IBM (Coursera)',            '2025-09-01', 'https://coursera.org/verify/professional-cert/GHI012', true),
  ('11000000-0000-0000-0000-000000000006', 'AWS Solutions Architect — Associate',        'Amazon Web Services',       '2026-01-15', 'https://aws.amazon.com/verification/JKL345', true),
  ('11000000-0000-0000-0000-000000000012', 'Certified Kubernetes Administrator',         'CNCF',                      '2026-03-20', 'https://cncf.io/verify/MNO678', true),
  ('11000000-0000-0000-0000-000000000005', 'Deep Learning Specialization',               'DeepLearning.AI (Coursera)','2025-07-25', 'https://coursera.org/verify/specialization/PQR901', true);


-- ═════════════════════════════════════════════════════════════════════════════
-- LEARNING RESOURCES
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO learning_resources (id, title, provider, url, type, skill_id, description, duration, difficulty) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'SQL for Data Science',               'Coursera',         'https://coursera.org/learn/sql-for-data-science', 'Course', '50000000-0000-0000-0000-000000000006', 'Learn SQL fundamentals including queries, joins, subqueries, and aggregation functions.', '4 weeks', 'BEGINNER'),
  ('a0000000-0000-0000-0000-000000000002', 'Advanced SQL for Analytics',          'DataCamp',         'https://datacamp.com/courses/advanced-sql', 'Course', '50000000-0000-0000-0000-000000000006', 'Window functions, CTEs, query optimization, and analytical SQL patterns.', '6 hours', 'INTERMEDIATE'),
  ('a0000000-0000-0000-0000-000000000003', 'Machine Learning Crash Course',       'Google',           'https://developers.google.com/machine-learning/crash-course', 'Course', '50000000-0000-0000-0000-000000000020', 'Practical introduction to machine learning with TensorFlow.', '15 hours', 'BEGINNER'),
  ('a0000000-0000-0000-0000-000000000004', 'Deep Learning with PyTorch',          'Udacity',          'https://udacity.com/course/deep-learning-pytorch', 'Course', '50000000-0000-0000-0000-000000000021', 'Build and train deep neural networks using PyTorch.', '8 weeks', 'INTERMEDIATE'),
  ('a0000000-0000-0000-0000-000000000005', 'React — The Complete Guide',          'Udemy',            'https://udemy.com/course/react-the-complete-guide', 'Course', '50000000-0000-0000-0000-000000000008', 'Comprehensive React course covering hooks, routing, Redux, and Next.js.', '48 hours', 'BEGINNER'),
  ('a0000000-0000-0000-0000-000000000006', 'Docker and Kubernetes',              'Pluralsight',      'https://pluralsight.com/courses/docker-kubernetes', 'Course', '50000000-0000-0000-0000-000000000012', 'Containerization with Docker and orchestration with Kubernetes.', '10 hours', 'INTERMEDIATE'),
  ('a0000000-0000-0000-0000-000000000007', 'AWS Cloud Practitioner Essentials',  'AWS',              'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials', 'Course', '50000000-0000-0000-0000-000000000014', 'Cloud computing fundamentals on AWS.', '6 hours', 'BEGINNER'),
  ('a0000000-0000-0000-0000-000000000008', 'Git and GitHub for Professionals',   'freeCodeCamp',     'https://freecodecamp.org/news/git-and-github-for-beginners', 'Tutorial', '50000000-0000-0000-0000-000000000015', 'Version control with Git from basics to advanced workflows.', '3 hours', 'BEGINNER'),
  ('a0000000-0000-0000-0000-000000000009', 'System Design Primer',               'GitHub',           'https://github.com/donnemartin/system-design-primer', 'Resource', '50000000-0000-0000-0000-000000000025', 'Comprehensive guide to system design concepts and interview preparation.', 'Self-paced', 'ADVANCED'),
  ('a0000000-0000-0000-0000-000000000010', 'NLP with Transformers',              'Hugging Face',     'https://huggingface.co/course', 'Course', '50000000-0000-0000-0000-000000000022', 'Learn to use transformer models for NLP tasks.', '8 hours', 'INTERMEDIATE'),
  ('a0000000-0000-0000-0000-000000000011', 'Python for Everybody',               'Coursera',         'https://coursera.org/specializations/python', 'Course', '50000000-0000-0000-0000-000000000001', 'Learn Python programming from scratch with practical projects.', '8 months', 'BEGINNER'),
  ('a0000000-0000-0000-0000-000000000012', 'Data Structures and Algorithms',     'GeeksforGeeks',    'https://geeksforgeeks.org/data-structures', 'Resource', '50000000-0000-0000-0000-000000000024', 'Comprehensive DSA tutorials and practice problems.', 'Self-paced', 'INTERMEDIATE');


-- ═════════════════════════════════════════════════════════════════════════════
-- LEARNING RECOMMENDATIONS (for demo students)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO learning_recommendations (student_id, resource_id, priority, reason) VALUES
  -- Aditya: SQL and Deep Learning gaps
  ('11000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, 'Required by 71% of ML Engineer positions. Current score: 48%.'),
  ('11000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 2, 'Advanced SQL analytics needed for data pipeline work.'),
  ('11000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 3, 'Deep learning skills needed for ML Engineer role. Current score: 52%.'),
  -- Priya: SQL and TypeScript gaps
  ('11000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 1, 'SQL proficiency required for full-stack roles. Current score: 55%.'),
  -- Kavitha: Kubernetes gap
  ('11000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 1, 'Kubernetes skills needed for Cloud Engineer role. Current score: 62%.'),
  -- Meera: ML gap
  ('11000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000003', 1, 'ML fundamentals would strengthen your data analysis capabilities. Current score: 55%.');


-- ═════════════════════════════════════════════════════════════════════════════
-- COLLABORATIONS
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO collaborations (industry_id, institution_id, type, title, description, status) VALUES
  ('21000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000001', 'Research', 'AI-Powered Code Review Systems',
   'Collaborative research on using large language models for automated code review and quality assessment.', 'ACTIVE'),
  ('21000000-0000-0000-0000-000000000002', '31000000-0000-0000-0000-000000000002', 'Guest Lecture Series', 'Engineering at Scale',
   'Quarterly guest lecture series where Flipkart engineers share real-world system design challenges.', 'ACTIVE'),
  ('21000000-0000-0000-0000-000000000003', '31000000-0000-0000-0000-000000000003', 'Innovation Challenge', 'Fintech Innovation Challenge 2026',
   'Annual hackathon-style challenge focusing on payment security, financial inclusion, and UPI innovation.', 'OPEN'),
  ('21000000-0000-0000-0000-000000000004', '31000000-0000-0000-0000-000000000004', 'Curriculum Advisory', 'Industry-Aligned Curriculum Development',
   'Zoho engineers advise on curriculum updates to align course content with current industry practices.', 'ACTIVE'),
  ('21000000-0000-0000-0000-000000000008', '31000000-0000-0000-0000-000000000001', 'Capstone Projects', 'Real-World Capstone Program',
   'Swiggy provides real-world problem statements for final-year capstone projects with mentorship.', 'ACTIVE');


-- ═════════════════════════════════════════════════════════════════════════════
-- MENTORSHIPS
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO mentorships (mentor_id, mentee_id, opportunity_id, status, feedback) VALUES
  ('21000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000005', '80000000-0000-0000-0000-000000000001', 'ACTIVE',
   'Arjun is progressing well on the recommendation system module. Recommend focusing on scalability testing next.'),
  ('21000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000015', 'PENDING', NULL),
  ('21000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000007', NULL, 'ACTIVE',
   'Mohammed shows strong full-stack skills. Working on improving system design thinking.');


-- ═════════════════════════════════════════════════════════════════════════════
-- NOTIFICATIONS
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO notifications (user_id, type, title, message, link, read, created_at) VALUES
  ('10000000-0000-0000-0000-000000000001', 'application_update', 'Application Update',
   'Your application for Machine Learning Intern at Flipkart is now under review.', '/student/applications', true, now() - interval '3 days'),
  ('10000000-0000-0000-0000-000000000001', 'opportunity_match', 'New Opportunity Match',
   'Data Engineering Intern at PhonePe matches 87% of your skill profile.', '/opportunities/80000000-0000-0000-0000-000000000004', false, now() - interval '1 day'),
  ('10000000-0000-0000-0000-000000000001', 'learning_recommendation', 'Learning Recommendation',
   'Based on your skill gaps, we recommend: SQL for Data Science on Coursera.', '/student/skills', false, now() - interval '2 days'),
  ('10000000-0000-0000-0000-000000000002', 'application_update', 'Shortlisted!',
   'Congratulations! You have been shortlisted for Frontend Development Intern at Zoho.', '/student/applications', true, now() - interval '4 days'),
  ('10000000-0000-0000-0000-000000000002', 'application_update', 'Interview Scheduled',
   'Your interview for Software Development Engineer at Freshworks has been scheduled.', '/student/applications', false, now() - interval '1 day'),
  ('10000000-0000-0000-0000-000000000005', 'application_update', 'Selected!',
   'Congratulations! You have been selected for Machine Learning Intern at Flipkart.', '/student/applications', true, now() - interval '8 days'),
  ('10000000-0000-0000-0000-000000000005', 'mentorship', 'Mentor Feedback',
   'Your mentor has left feedback on your internship progress.', '/student/dashboard', false, now() - interval '2 days'),
  ('10000000-0000-0000-0000-000000000006', 'application_update', 'Interview Scheduled',
   'Your interview for Cloud Infrastructure Engineer at Wipro has been scheduled.', '/student/applications', false, now() - interval '1 day'),
  ('10000000-0000-0000-0000-000000000016', 'application_update', 'Shortlisted!',
   'You have been shortlisted for Product Analytics Intern at Swiggy.', '/student/applications', true, now() - interval '3 days'),
  ('20000000-0000-0000-0000-000000000002', 'new_application', 'New Application',
   'Aditya Sharma applied for Machine Learning Intern. Match score: 78%.', '/industry/candidates', false, now() - interval '3 days'),
  ('20000000-0000-0000-0000-000000000002', 'new_application', 'New Application',
   'Sneha Gupta applied for Machine Learning Intern. Match score: 91%.', '/industry/candidates', false, now() - interval '4 days'),
  ('30000000-0000-0000-0000-000000000001', 'placement_update', 'Placement Update',
   'Arjun Nair has been selected for ML Intern at Flipkart.', '/institution/dashboard', false, now() - interval '8 days');


-- ═════════════════════════════════════════════════════════════════════════════
-- DONE — Seed data complete
-- ═════════════════════════════════════════════════════════════════════════════
-- Demo credentials for all users: SkillBridge@2024
--
-- Quick login examples:
--   Student:      aditya.sharma@iitd.ac.in
--   Industry:     hr@flipkart.com
--   Institution:  admin@iitdelhi.ac.in
--   Academician:  dr.raghavan@iitd.ac.in
