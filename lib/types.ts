/**
 * Domain types for AI-Powered Student Analytics and Success Platform
 * Strictly separates operational/behavioral factors from demographic auditing fields.
 */

export type CohortYear = '2021-Fall' | '2022-Fall' | '2023-Fall' | '2024-Fall';

export type StudentStatus = 'enrolled' | 'graduated' | 'withdrawn' | 'on_leave';

export type AcademicMajor =
  | 'Computer Science'
  | 'Data Science'
  | 'Electrical Engineering'
  | 'Business Analytics'
  | 'Information Systems';

export interface CourseRecord {
  courseId: string;
  courseName: string;
  semester: number;
  credits: number;
  grade: number; // 0.0 - 4.0 scale
  attendanceRate: number; // percentage 0 - 100
  passed: boolean;
  isBottleneck: boolean; // gateway/prerequisite courses with historically high failure
}

export interface DemographicProfile {
  // CRITICAL ETHICS PRINCIPLE:
  // These fields are STRICTLY for equity & fairness auditing (DPDP Act 2023).
  // They are NEVER passed as inputs to risk scoring or early-warning algorithms.
  gender: 'Female' | 'Male' | 'Non-Binary';
  region: 'Urban' | 'Suburban' | 'Rural';
  incomeBand: 'Low' | 'Medium' | 'High';
  firstGen: boolean;
}

export interface InterventionRecord {
  id: string;
  studentId: string;
  date: string;
  type: 'Academic Tutoring' | 'Advisor Check-in' | 'Peer Mentoring' | 'Financial Guidance' | 'Wellness Support';
  owner: string;
  notes: string;
  outcome: 'pending' | 'improved' | 'steady' | 'needs_followup';
}

export interface RiskFactor {
  factor: string;
  weight: number;
  impactLevel: 'high' | 'medium' | 'low';
  plainEnglishExplanation: string;
}

export interface StudentRiskProfile {
  riskScore: number; // 0 - 100 (higher = greater need for academic support)
  riskCategory: 'Low Support Needed' | 'Moderate Reinforcement' | 'Priority Proactive Care';
  topFactors: RiskFactor[]; // Exactly 3 plain-English drivers
  recommendedAction: string;
}

export interface Student {
  id: string; // Anonymized format: STU-XXXX (No PII)
  anonymizedHash: string;
  cohort: CohortYear;
  major: AcademicMajor;
  currentSemester: number; // 1 to 8
  status: StudentStatus;
  
  // Academic & behavioral indicators (Valid risk scoring inputs)
  cumulativeGpa: number; // 0.0 to 4.0
  creditsCompleted: number;
  creditsAttempted: number;
  overallAttendanceRate: number; // 0 to 100%
  lateSubmissionRate: number; // 0 to 100%
  lmsEngagementScore: number; // 0 to 100 (weekly logins, resource views, quiz participation)
  
  // Historical progression
  courses: CourseRecord[];
  
  // Equity lens (Strictly for fairness analysis, never risk inputs)
  demographics: DemographicProfile;
  
  // Interventions logged by advisors
  interventions: InterventionRecord[];
  
  // Precomputed or dynamically computed risk
  risk: StudentRiskProfile;
}

export type UserRole = 'leadership' | 'advisor' | 'student';
