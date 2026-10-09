/**
 * K-Means Student Persona Clustering
 * Pure TypeScript clustering engine that groups students by behavioral indicators,
 * naming and describing each persona with supportive, asset-based language.
 */

import { Student } from '@/lib/types';

export interface StudentPersona {
  clusterId: number;
  name: string;
  tagline: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  studentCount: number;
  populationPercentage: number;
  description: string;
  characteristics: {
    avgGpa: number;
    avgAttendance: number;
    avgLmsEngagement: number;
    avgLateSubmissionRate: number;
  };
  recommendedSupportPlaybook: string;
}

export interface KMeansResult {
  personas: StudentPersona[];
  totalClustered: number;
  iterationsToConverge: number;
  soWhat: string;
}

interface FeatureVector {
  studentId: string;
  // Normalized features [0, 1]
  values: number[]; // [attendanceNorm, gpaNorm, lmsNorm, timelinessNorm]
  rawGpa: number;
  rawAttendance: number;
  rawLms: number;
  rawLateRate: number;
}

/**
 * Computes Euclidean distance between two feature vectors.
 */
function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Normalizes values between 0 and 1.
 */
function normalize(val: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (val - min) / (max - min)));
}

/**
 * Runs native K-Means clustering (K=4) on student behavioral and engagement features.
 */
export function computeStudentPersonas(students: Student[], k: number = 4): KMeansResult {
  if (students.length === 0) {
    return {
      personas: [],
      totalClustered: 0,
      iterationsToConverge: 0,
      soWhat: 'No student records available for clustering.',
    };
  }

  // 1. Feature Extraction & Normalization
  const vectors: FeatureVector[] = students.map((s) => ({
    studentId: s.id,
    values: [
      normalize(s.overallAttendanceRate, 30, 100),
      normalize(s.cumulativeGpa, 1.0, 4.0),
      normalize(s.lmsEngagementScore, 10, 100),
      normalize(100 - s.lateSubmissionRate, 10, 100), // Timeliness
    ],
    rawGpa: s.cumulativeGpa,
    rawAttendance: s.overallAttendanceRate,
    rawLms: s.lmsEngagementScore,
    rawLateRate: s.lateSubmissionRate,
  }));

  // 2. Deterministic Initial Centroid Seeding (Representative archetype anchors)
  let centroids: number[][] = [
    [0.92, 0.90, 0.88, 0.90], // High Flyer
    [0.75, 0.68, 0.72, 0.78], // Steady Scholar
    [0.72, 0.55, 0.40, 0.50], // Lecture-Focused, Digital Gap
    [0.45, 0.35, 0.40, 0.35], // Needs Reinforcement
  ];

  let assignments: number[] = new Array(vectors.length).fill(0);
  let iterations = 0;
  const maxIterations = 25;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterations = iter + 1;
    let changed = false;

    // Step A: Assignment step
    for (let i = 0; i < vectors.length; i++) {
      let minDist = Infinity;
      let closestCluster = 0;

      for (let c = 0; c < k; c++) {
        const dist = euclideanDistance(vectors[i].values, centroids[c]);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = c;
        }
      }

      if (assignments[i] !== closestCluster) {
        assignments[i] = closestCluster;
        changed = true;
      }
    }

    // Step B: Update centroids step
    const newCentroids: number[][] = Array.from({ length: k }, () => [0, 0, 0, 0]);
    const clusterCounts: number[] = new Array(k).fill(0);

    for (let i = 0; i < vectors.length; i++) {
      const c = assignments[i];
      clusterCounts[c]++;
      for (let d = 0; d < 4; d++) {
        newCentroids[c][d] += vectors[i].values[d];
      }
    }

    let centroidShift = 0;
    for (let c = 0; c < k; c++) {
      if (clusterCounts[c] > 0) {
        for (let d = 0; d < 4; d++) {
          newCentroids[c][d] /= clusterCounts[c];
        }
      } else {
        newCentroids[c] = [...centroids[c]];
      }
      centroidShift += euclideanDistance(centroids[c], newCentroids[c]);
    }

    centroids = newCentroids;

    if (!changed || centroidShift < 0.001) {
      break;
    }
  }

  // 3. Compute Persona Profiles and Map Supportive Nomenclature
  const personaMeta = [
    {
      name: 'Self-Directed Achievers',
      tagline: 'High engagement across lectures & LMS portals',
      color: '#4f46e5', // indigo
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
      badgeText: 'text-indigo-700 dark:text-indigo-300',
      description:
        'Students demonstrating exemplary consistency, proactive deadline management, and strong foundational mastery.',
      recommendedSupportPlaybook:
        'Invite to lead peer study cohorts, apply for undergraduate research assistantships, and explore honors sequences.',
    },
    {
      name: 'Emerging Scholars',
      tagline: 'Reliable class attendance with steady mastery',
      color: '#0891b2', // cyan
      badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60',
      badgeText: 'text-cyan-700 dark:text-cyan-300',
      description:
        'Motivated students with steady class attendance who excel when given clear problem-solving frameworks and midterm reviews.',
      recommendedSupportPlaybook:
        'Provide subject-specific group problem sets, mid-semester check-ins, and career pathway alignment sessions.',
    },
    {
      name: 'Classroom-Engaged, Digital Gap',
      tagline: 'Attends physical lectures but misses online materials',
      color: '#d97706', // amber
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
      badgeText: 'text-amber-700 dark:text-amber-300',
      description:
        'Students who actively participate in face-to-face sessions but exhibit lower activity on online portals and sporadic submission delays.',
      recommendedSupportPlaybook:
        'Provide calendar automation nudges, mobile LMS setup assistance, and time-budgeting workshops.',
    },
    {
      name: 'High-Potential Learners Needing Reinforcement',
      tagline: 'Navigating academic friction with great growth capacity',
      color: '#e11d48', // rose
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
      badgeText: 'text-rose-700 dark:text-rose-300',
      description:
        'Students experiencing attendance or submission disruptions leading to GPA dips; represents our highest leverage opportunity for proactive care.',
      recommendedSupportPlaybook:
        'Schedule empathetic 1-on-1 advisor outreach, evaluate prerequisite pacing, and connect to campus tutoring and wellness partners.',
    },
  ];

  // Group student stats by cluster
  const clusterStats = Array.from({ length: k }, (_, idx) => {
    const clusterStudents = vectors.filter((_, i) => assignments[i] === idx);
    const count = clusterStudents.length;

    const avgGpa =
      count > 0 ? clusterStudents.reduce((a, b) => a + b.rawGpa, 0) / count : 0;
    const avgAttendance =
      count > 0 ? clusterStudents.reduce((a, b) => a + b.rawAttendance, 0) / count : 0;
    const avgLms =
      count > 0 ? clusterStudents.reduce((a, b) => a + b.rawLms, 0) / count : 0;
    const avgLate =
      count > 0 ? clusterStudents.reduce((a, b) => a + b.rawLateRate, 0) / count : 0;

    return {
      clusterId: idx,
      count,
      avgGpa: Number(avgGpa.toFixed(2)),
      avgAttendance: Number(avgAttendance.toFixed(1)),
      avgLms: Number(avgLms.toFixed(1)),
      avgLate: Number(avgLate.toFixed(1)),
    };
  });

  // Sort clusters descending by avg GPA so Persona 0 is highest-performing
  clusterStats.sort((a, b) => b.avgGpa - a.avgGpa);

  const personas: StudentPersona[] = clusterStats.map((stat, idx) => {
    const meta = personaMeta[idx];
    const pct = Number(((stat.count / students.length) * 100).toFixed(1));

    return {
      clusterId: idx,
      name: meta.name,
      tagline: meta.tagline,
      color: meta.color,
      badgeBg: meta.badgeBg,
      badgeText: meta.badgeText,
      studentCount: stat.count,
      populationPercentage: pct,
      description: meta.description,
      characteristics: {
        avgGpa: stat.avgGpa,
        avgAttendance: stat.avgAttendance,
        avgLmsEngagement: stat.avgLms,
        avgLateSubmissionRate: stat.avgLate,
      },
      recommendedSupportPlaybook: meta.recommendedSupportPlaybook,
    };
  });

  const soWhat =
    `K-Means reveals that student challenges are not monolithic: ~${personas[2]?.populationPercentage || 20}% of our population attend class regularly but fall behind on digital submissions ("Classroom-Engaged, Digital Gap"). Treating this group with punitive academic warnings misses the root cause—they require asynchronous pacing tools, not basic subject remediation.`;

  return {
    personas,
    totalClustered: students.length,
    iterationsToConverge: iterations,
    soWhat,
  };
}
