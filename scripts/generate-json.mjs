/**
 * Standalone generator script to write data/students.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the TypeScript generator compiled or evaluate direct generator logic
class SeededRNG {
  constructor(seed = 424242) {
    this.state = seed;
  }
  next() {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick(items) {
    return items[Math.floor(this.next() * items.length)];
  }
  pickWeighted(items) {
    const total = items.reduce((sum, i) => sum + i.weight, 0);
    let r = this.next() * total;
    for (const { item, weight } of items) {
      if (r <= weight) return item;
      r -= weight;
    }
    return items[items.length - 1].item;
  }
  nextGaussian(mean = 0, stdDev = 1) {
    let u1 = this.next();
    let u2 = this.next();
    while (u1 === 0) u1 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }
}

const MAJORS = [
  'Computer Science',
  'Data Science',
  'Electrical Engineering',
  'Business Analytics',
  'Information Systems',
];

const BOTTLENECK_COURSES = {
  'Computer Science': [
    { id: 'CS-101', name: 'Data Structures & Algorithms', sem: 2 },
    { id: 'MATH-201', name: 'Discrete Mathematics', sem: 3 },
  ],
  'Data Science': [
    { id: 'DS-102', name: 'Statistical Foundations', sem: 2 },
    { id: 'DS-204', name: 'Applied Linear Algebra', sem: 3 },
  ],
  'Electrical Engineering': [
    { id: 'EE-105', name: 'Circuits & Signals Analysis', sem: 2 },
    { id: 'PHYS-201', name: 'Electromagnetics', sem: 3 },
  ],
  'Business Analytics': [
    { id: 'BA-102', name: 'Quantitative Decision Methods', sem: 2 },
    { id: 'BA-205', name: 'Database & SQL Modeling', sem: 3 },
  ],
  'Information Systems': [
    { id: 'IS-101', name: 'Object-Oriented Architecture', sem: 2 },
    { id: 'IS-202', name: 'Enterprise Systems & Networking', sem: 3 },
  ],
};

function computeRisk(gpa, attendance, lateRate, lms, status, bottleneckFails) {
  if (status === 'graduated') {
    return {
      riskScore: 4,
      riskCategory: 'Low Support Needed',
      topFactors: [
        { factor: 'Degree Completed', weight: 0, impactLevel: 'low', plainEnglishExplanation: 'Successfully graduated with required credits.' },
        { factor: 'Academic Mastery', weight: 0, impactLevel: 'low', plainEnglishExplanation: 'Satisfied all departmental curriculum goals.' },
        { factor: 'Transition Phase', weight: 0, impactLevel: 'low', plainEnglishExplanation: 'Alumni career pathways active.' },
      ],
      recommendedAction: 'Invite to join departmental alumni mentoring network.',
    };
  }

  const gpaDeficit = Math.max(0, 4.0 - gpa);
  const gpaScore = (gpaDeficit / 4.0) * 100;
  const attendanceDeficit = Math.max(0, 100 - attendance);
  const lateScore = Math.min(100, lateRate * 1.5);
  const lmsDeficit = Math.max(0, 100 - lms);
  const bottleneckBonus = Math.min(25, bottleneckFails * 12);

  let raw = gpaScore * 0.35 + attendanceDeficit * 0.30 + lmsDeficit * 0.20 + lateScore * 0.15 + bottleneckBonus;
  if (status === 'withdrawn') raw = Math.max(raw, 85);
  else if (status === 'on_leave') raw = Math.max(raw, 58);

  const finalScore = Math.round(Math.min(100, Math.max(0, raw)));

  const factorCandidates = [];
  if (attendance < 75) {
    factorCandidates.push({
      score: 100 - attendance,
      item: {
        factor: 'Attendance Rate',
        weight: 30,
        impactLevel: attendance < 60 ? 'high' : 'medium',
        plainEnglishExplanation: `Class attendance is at ${Math.round(attendance)}%, below the 80% recommended threshold.`,
      },
    });
  } else {
    factorCandidates.push({
      score: 10,
      item: {
        factor: 'Attendance Rate',
        weight: 10,
        impactLevel: 'low',
        plainEnglishExplanation: `Solid course attendance at ${Math.round(attendance)}%.`,
      },
    });
  }

  if (gpa < 2.7) {
    factorCandidates.push({
      score: (3.5 - gpa) * 30,
      item: {
        factor: 'Academic Progress (GPA)',
        weight: 35,
        impactLevel: gpa < 2.2 ? 'high' : 'medium',
        plainEnglishExplanation: `Cumulative GPA (${gpa.toFixed(2)}) is close to or below departmental threshold of 2.50.`,
      },
    });
  } else {
    factorCandidates.push({
      score: 8,
      item: {
        factor: 'Academic Progress (GPA)',
        weight: 10,
        impactLevel: 'low',
        plainEnglishExplanation: `Maintaining a healthy cumulative GPA of ${gpa.toFixed(2)}.`,
      },
    });
  }

  if (lateRate > 25) {
    factorCandidates.push({
      score: lateRate,
      item: {
        factor: 'Assignment Timeliness',
        weight: 15,
        impactLevel: lateRate > 45 ? 'high' : 'medium',
        plainEnglishExplanation: `${Math.round(lateRate)}% of recent coursework submissions were turned in past the deadline.`,
      },
    });
  }

  if (lms < 60) {
    factorCandidates.push({
      score: 100 - lms,
      item: {
        factor: 'Learning Platform Activity',
        weight: 20,
        impactLevel: lms < 40 ? 'high' : 'medium',
        plainEnglishExplanation: `Portal activity score is ${Math.round(lms)}/100, suggesting limited review of digital course materials.`,
      },
    });
  }

  if (bottleneckFails > 0) {
    factorCandidates.push({
      score: 80 + bottleneckFails * 10,
      item: {
        factor: 'Gateway Course Milestone',
        weight: 25,
        impactLevel: 'high',
        plainEnglishExplanation: `Student encountered difficulty in ${bottleneckFails} prerequisite gateway course(s), risking sequence delay.`,
      },
    });
  }

  factorCandidates.sort((a, b) => b.score - a.score);
  const topFactors = factorCandidates.slice(0, 3).map((f) => f.item);
  while (topFactors.length < 3) {
    topFactors.push({
      factor: 'Consistent Participation',
      weight: 5,
      impactLevel: 'low',
      plainEnglishExplanation: 'Active engagement across scheduled seminars and peer assignments.',
    });
  }

  let riskCategory = 'Low Support Needed';
  let recommendedAction = 'Continue periodic academic check-ins and celebrate recent milestones.';
  if (finalScore >= 65) {
    riskCategory = 'Priority Proactive Care';
    recommendedAction = 'Schedule a warm 1-on-1 advisor conversation to review scheduling, course load, and tutoring resources.';
  } else if (finalScore >= 40) {
    riskCategory = 'Moderate Reinforcement';
    recommendedAction = 'Recommend peer study groups for core subjects and send friendly milestone reminder nudges.';
  }

  return { riskScore: finalScore, riskCategory, topFactors, recommendedAction };
}

function generate() {
  const rng = new SeededRNG(202610);
  const students = [];
  const cohorts = [
    { cohort: '2021-Fall', count: 375, maxSemester: 8 },
    { cohort: '2022-Fall', count: 375, maxSemester: 6 },
    { cohort: '2023-Fall', count: 375, maxSemester: 4 },
    { cohort: '2024-Fall', count: 375, maxSemester: 2 },
  ];

  let idCounter = 1001;

  for (const cInfo of cohorts) {
    for (let i = 0; i < cInfo.count; i++) {
      const id = `STU-${idCounter++}`;
      const anonymizedHash = `anon_${(idCounter * 7919).toString(16)}`;
      const major = rng.pick(MAJORS);

      const archetypeRoll = rng.next();
      let baseGpa, baseAttendance, baseLateRate, baseLms, dropRiskMultiplier;

      if (archetypeRoll < 0.25) {
        baseGpa = rng.nextGaussian(3.6, 0.25);
        baseAttendance = rng.nextGaussian(93, 4);
        baseLateRate = rng.nextGaussian(6, 4);
        baseLms = rng.nextGaussian(88, 7);
        dropRiskMultiplier = 0.02;
      } else if (archetypeRoll < 0.75) {
        baseGpa = rng.nextGaussian(3.0, 0.35);
        baseAttendance = rng.nextGaussian(82, 7);
        baseLateRate = rng.nextGaussian(16, 8);
        baseLms = rng.nextGaussian(74, 9);
        dropRiskMultiplier = 0.08;
      } else if (archetypeRoll < 0.95) {
        baseGpa = rng.nextGaussian(2.2, 0.4);
        baseAttendance = rng.nextGaussian(68, 10);
        baseLateRate = rng.nextGaussian(36, 12);
        baseLms = rng.nextGaussian(52, 12);
        dropRiskMultiplier = 0.35;
      } else {
        baseGpa = rng.nextGaussian(1.8, 0.35);
        baseAttendance = rng.nextGaussian(54, 12);
        baseLateRate = rng.nextGaussian(55, 14);
        baseLms = rng.nextGaussian(38, 14);
        dropRiskMultiplier = 0.75;
      }

      const gpa = Number(rng.clamp(baseGpa, 1.2, 4.0).toFixed(2));
      const attendanceRate = Number(rng.clamp(baseAttendance, 35, 100).toFixed(1));
      const lateSubmissionRate = Number(rng.clamp(baseLateRate, 0, 90).toFixed(1));
      const lmsEngagementScore = Number(rng.clamp(baseLms, 15, 100).toFixed(1));

      let status = 'enrolled';
      let currentSemester = cInfo.maxSemester;

      if (cInfo.maxSemester >= 2) {
        const dropRoll = rng.next();
        if (dropRoll < dropRiskMultiplier) {
          status = 'withdrawn';
          currentSemester = rng.pickWeighted([
            { item: 1, weight: 45 },
            { item: 2, weight: 35 },
            { item: 3, weight: 15 },
            { item: Math.min(4, cInfo.maxSemester), weight: 5 },
          ]);
        } else if (dropRoll < dropRiskMultiplier + 0.03 && cInfo.maxSemester >= 3) {
          status = 'on_leave';
          currentSemester = rng.nextInt(2, cInfo.maxSemester);
        }
      }

      if (cInfo.cohort === '2021-Fall' && status === 'enrolled') {
        if (gpa >= 2.0) status = 'graduated';
        else status = 'enrolled';
      }

      const courses = [];
      let creditsAttempted = 0;
      let creditsCompleted = 0;
      let bottleneckFails = 0;
      const majorBottlenecks = BOTTLENECK_COURSES[major];

      for (let s = 1; s <= currentSemester; s++) {
        const bn = majorBottlenecks.find((b) => b.sem === s);
        const isBn = !!bn;
        const cCourseId = isBn ? bn.id : `${major.substring(0, 2).toUpperCase()}-${s}0${rng.nextInt(1, 4)}`;
        const cCourseName = isBn ? bn.name : `${major} Fundamentals Level ${s}`;

        let courseGrade = rng.clamp(gpa + rng.nextGaussian(0, isBn ? 0.6 : 0.4), 0.0, 4.0);
        if (isBn && gpa < 2.8) courseGrade = Math.max(0, courseGrade - 0.4);

        const passed = courseGrade >= 2.0;
        if (!passed && isBn) bottleneckFails++;

        const cCredits = 4;
        creditsAttempted += cCredits;
        if (passed) creditsCompleted += cCredits;

        courses.push({
          courseId: cCourseId,
          courseName: cCourseName,
          semester: s,
          credits: cCredits,
          grade: Number(courseGrade.toFixed(2)),
          attendanceRate: Number(rng.clamp(attendanceRate + rng.nextGaussian(0, 6), 30, 100).toFixed(1)),
          passed,
          isBottleneck: isBn,
        });

        const c2Credits = 3;
        const c2Grade = rng.clamp(gpa + rng.nextGaussian(0, 0.4), 0.0, 4.0);
        const c2Passed = c2Grade >= 2.0;
        creditsAttempted += c2Credits;
        if (c2Passed) creditsCompleted += c2Credits;

        courses.push({
          courseId: `GEN-${s}0${rng.nextInt(1, 3)}`,
          courseName: s <= 2 ? 'Academic Communication & Writing' : `Advanced Topics in ${major}`,
          semester: s,
          credits: c2Credits,
          grade: Number(c2Grade.toFixed(2)),
          attendanceRate: Number(rng.clamp(attendanceRate + rng.nextGaussian(0, 5), 30, 100).toFixed(1)),
          passed: c2Passed,
          isBottleneck: false,
        });
      }

      const gender = rng.pickWeighted([
        { item: 'Female', weight: 44 },
        { item: 'Male', weight: 52 },
        { item: 'Non-Binary', weight: 4 },
      ]);
      const region = rng.pickWeighted([
        { item: 'Urban', weight: 48 },
        { item: 'Suburban', weight: 34 },
        { item: 'Rural', weight: 18 },
      ]);
      const incomeBand = rng.pickWeighted([
        { item: 'Low', weight: 28 },
        { item: 'Medium', weight: 52 },
        { item: 'High', weight: 20 },
      ]);
      const firstGen = rng.next() < 0.32;

      const risk = computeRisk(gpa, attendanceRate, lateSubmissionRate, lmsEngagementScore, status, bottleneckFails);
      const interventions = [];

      if (risk.riskScore >= 50 && currentSemester >= 2) {
        interventions.push({
          id: `INT-${idCounter}-1`,
          studentId: id,
          date: `2024-0${rng.nextInt(1, 9)}-${rng.nextInt(10, 28)}`,
          type: rng.pick(['Academic Tutoring', 'Advisor Check-in', 'Peer Mentoring', 'Wellness Support']),
          owner: rng.pick(['Dr. Sarah Chen', 'Prof. Arvind Sharma', 'Advisor Maya Patel', 'Marcus Vance']),
          notes: 'Met to review study schedule and recommend supplementary workshops.',
          outcome: rng.pick(['improved', 'steady', 'pending', 'needs_followup']),
        });
      }

      students.push({
        id,
        anonymizedHash,
        cohort: cInfo.cohort,
        major,
        currentSemester,
        status,
        cumulativeGpa: gpa,
        creditsCompleted,
        creditsAttempted,
        overallAttendanceRate: attendanceRate,
        lateSubmissionRate,
        lmsEngagementScore,
        courses,
        demographics: { gender, region, incomeBand, firstGen },
        interventions,
        risk,
      });
    }
  }

  return students;
}

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const students = generate();
fs.writeFileSync(path.join(dataDir, 'students.json'), JSON.stringify(students, null, 2));
console.log(`Generated ${students.length} students into data/students.json successfully.`);
