/**
 * Unit Test Suite for Analytics and Risk Functions
 * Run with: npm test (or tsx --test tests/analytics-and-risk.test.ts)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { getStudents } from '../lib/data/students';
import { Student } from '../lib/types';
import { calculateSlope, extractStudentFeatures } from '../lib/analytics/featureEngineering';
import { evaluateStudentRisk } from '../lib/risk';
import { computeCohortRetention } from '../lib/analytics/retention';
import { computeJourneyFunnel } from '../lib/analytics/funnel';
import { computeBottleneckCourses } from '../lib/analytics/bottlenecks';
import { computeStudentPersonas } from '../lib/analytics/kmeans';

describe('Feature Engineering Unit Tests', () => {
  test('calculateSlope returns 0 for flat horizontal trajectory', () => {
    const flatPoints = [
      { x: 1, y: 3.0 },
      { x: 2, y: 3.0 },
      { x: 3, y: 3.0 },
    ];
    const slope = calculateSlope(flatPoints);
    assert.strictEqual(slope, 0);
  });

  test('calculateSlope returns positive slope for improving GPA trajectory', () => {
    const risingPoints = [
      { x: 1, y: 2.2 },
      { x: 2, y: 2.6 },
      { x: 3, y: 3.0 },
      { x: 4, y: 3.4 },
    ];
    const slope = calculateSlope(risingPoints);
    assert.ok(slope > 0, `Expected positive slope, received ${slope}`);
    assert.strictEqual(slope, 0.4);
  });

  test('calculateSlope returns negative slope for declining academic performance', () => {
    const fallingPoints = [
      { x: 1, y: 3.8 },
      { x: 2, y: 3.3 },
      { x: 3, y: 2.9 },
      { x: 4, y: 2.4 },
    ];
    const slope = calculateSlope(fallingPoints);
    assert.ok(slope < 0, `Expected negative slope, received ${slope}`);
  });

  test('calculateSlope handles edge cases with 0 or 1 points safely without throwing', () => {
    assert.strictEqual(calculateSlope([]), 0);
    assert.strictEqual(calculateSlope([{ x: 1, y: 3.5 }]), 0);
  });

  test('extractStudentFeatures produces bounded metrics and valid trend labels', () => {
    const students = getStudents();
    assert.ok(students.length > 0, 'Students dataset should not be empty');

    const sample = students[0];
    const features = extractStudentFeatures(sample);

    assert.strictEqual(features.studentId, sample.id);
    assert.ok(features.attendanceRate >= 0 && features.attendanceRate <= 100);
    assert.ok(['Accelerating', 'Steady', 'Declining'].includes(features.gradeTrendLabel));
    assert.ok(features.creditVelocity >= 0 && features.creditVelocity <= 1.0);
    assert.ok(typeof features.lmsDecay === 'boolean');
  });
});

describe('Risk Model & Zero Data Leakage Unit Tests', () => {
  test('Risk score is strictly bounded between 0 and 100', () => {
    const students = getStudents();
    for (const student of students.slice(0, 50)) {
      const risk = evaluateStudentRisk(student);
      assert.ok(
        risk.riskScore >= 0 && risk.riskScore <= 100,
        `Risk score ${risk.riskScore} out of bounds for ${student.id}`
      );
      assert.ok(
        risk.rawProbability >= 0.0 && risk.rawProbability <= 1.0,
        `Probability ${risk.rawProbability} out of bounds for ${student.id}`
      );
      assert.ok(risk.topFactors.length >= 1 && risk.topFactors.length <= 3);
      assert.ok(risk.recommendedAction.length > 0);
    }
  });

  test('ZERO DATA LEAKAGE: Risk evaluation strictly ignores future semesters', () => {
    const students = getStudents();
    const enrolledSem2Student = students.find(
      (s) => s.status === 'enrolled' && s.currentSemester === 2
    );
    assert.ok(enrolledSem2Student, 'Should find at least one student in semester 2');

    // Baseline risk score
    const originalRisk = evaluateStudentRisk(enrolledSem2Student);

    // Deep copy and artificially inject a future course in semester 3 with a failing grade
    const clonedWithFutureLeakage: Student = JSON.parse(JSON.stringify(enrolledSem2Student));
    clonedWithFutureLeakage.courses.push({
      courseId: 'LEAK-FUTURE-301',
      courseName: 'Advanced Future Course',
      semester: 3, // Future semester!
      grade: 1.0,
      credits: 4,
      attendanceRate: 45,
      passed: false,
      isBottleneck: true,
    });

    const leakedRisk = evaluateStudentRisk(clonedWithFutureLeakage);

    // The risk score and probability MUST be 100% identical because the model guards against future course peeking
    assert.strictEqual(
      leakedRisk.riskScore,
      originalRisk.riskScore,
      'Risk model must not peek into future course grades (zero data leakage violated)'
    );
    assert.strictEqual(
      leakedRisk.rawProbability,
      originalRisk.rawProbability,
      'Logistic probability must remain unaffected by future semester data'
    );
  });

  test('FAIRNESS AUDIT & DPDP: Demographic isolation guarantees zero bias in scoring', () => {
    const students = getStudents();
    const testStudent = students[3];
    const baseRisk = evaluateStudentRisk(testStudent);

    // Create clones with altered demographic variables (gender, region, income, first-gen)
    const alteredClone1: Student = {
      ...JSON.parse(JSON.stringify(testStudent)),
      demographics: {
        gender: testStudent.demographics.gender === 'Female' ? 'Male' : 'Female',
        region: 'Rural',
        incomeBand: 'Low',
        firstGen: true,
      },
    };

    const alteredClone2: Student = {
      ...JSON.parse(JSON.stringify(testStudent)),
      demographics: {
        gender: 'Non-Binary',
        region: 'Urban',
        incomeBand: 'High',
        firstGen: false,
      },
    };

    const risk1 = evaluateStudentRisk(alteredClone1);
    const risk2 = evaluateStudentRisk(alteredClone2);

    // Verify mathematical identity
    assert.strictEqual(
      risk1.riskScore,
      baseRisk.riskScore,
      'Altering demographic variables must not change the risk score'
    );
    assert.strictEqual(
      risk2.riskScore,
      baseRisk.riskScore,
      'Demographic isolation violated: income/region affected risk score'
    );
    assert.strictEqual(
      risk1.rawProbability,
      baseRisk.rawProbability,
      'Logistic probability must be identical regardless of demographics'
    );
    assert.strictEqual(
      risk1.topFactors.length,
      baseRisk.topFactors.length,
      'Factor count must be identical'
    );
    assert.strictEqual(
      risk1.topFactors[0].factor,
      baseRisk.topFactors[0].factor,
      'Primary risk driver must remain identical'
    );
  });

  test('Graduated students return minimal baseline risk with supportive status', () => {
    const students = getStudents();
    const graduatedStudent = students.find((s) => s.status === 'graduated');
    if (graduatedStudent) {
      const risk = evaluateStudentRisk(graduatedStudent);
      assert.strictEqual(risk.riskBand, 'Low Support Needed');
      assert.ok(risk.riskScore < 10, 'Graduated students should have near-zero risk');
    }
  });
});

describe('Cohort Retention Analytics Unit Tests', () => {
  test('computeCohortRetention yields valid cohorts with 100% semester 1 baseline', () => {
    const students = getStudents();
    const retentionSummary = computeCohortRetention(students);

    assert.ok(retentionSummary.cohortCurves.length >= 3, 'Should track at least 3 cohorts');
    assert.ok(
      retentionSummary.aggregateFirstYearRetention > 50 &&
        retentionSummary.aggregateFirstYearRetention <= 100,
      'Aggregate retention should be a plausible percentage'
    );

    for (const curve of retentionSummary.cohortCurves) {
      assert.ok(curve.startingStudents > 0, `Cohort ${curve.cohort} has 0 students`);
      assert.strictEqual(
        curve.semesters[0].retentionRate,
        100,
        `Semester 1 retention must strictly be 100% for cohort ${curve.cohort}`
      );

      // Verify monotonic non-increasing property (retention can never increase across semesters)
      for (let i = 1; i < curve.semesters.length; i++) {
        assert.ok(
          curve.semesters[i].retentionRate <= curve.semesters[i - 1].retentionRate + 0.01,
          `Retention increased between semester ${i} and ${i + 1} in cohort ${curve.cohort}`
        );
      }
    }
  });
});

describe('Journey Funnel & Bottleneck Analytics Unit Tests', () => {
  test('computeJourneyFunnel calculates sequential milestone attrition correctly', () => {
    const students = getStudents();
    const funnel = computeJourneyFunnel(students);

    assert.ok(funnel.funnelSteps.length >= 5, 'Funnel should have multiple milestones');
    assert.ok(funnel.funnelSteps[0].conversionRate === 100, 'First step conversion is 100%');
    assert.ok(funnel.overallGraduationRate > 0 && funnel.overallGraduationRate <= 100);
    assert.ok(funnel.biggestDropStep.length > 0, 'Should identify biggest attrition step');
  });

  test('computeBottleneckCourses detects gateway courses with calculated hurdle rates', () => {
    const students = getStudents();
    const bottleneckSummary = computeBottleneckCourses(students);

    assert.ok(bottleneckSummary.bottleneckCourses.length > 0, 'Should find bottleneck courses');
    const topCourse = bottleneckSummary.bottleneckCourses[0];

    assert.ok(topCourse.failRate >= 0 && topCourse.failRate <= 100);
    assert.ok(topCourse.withdrawalRate >= 0 && topCourse.withdrawalRate <= 100);
    assert.ok(topCourse.combinedHurdleRate >= topCourse.failRate);
    assert.ok(topCourse.recommendedCurriculumAction.length > 0);
  });
});

describe('K-Means Student Persona Clustering Unit Tests', () => {
  test('computeStudentPersonas groups students into 4 distinct, named personas', () => {
    const students = getStudents();
    const kMeansResult = computeStudentPersonas(students, 4);

    assert.strictEqual(kMeansResult.personas.length, 4, 'Should produce exactly 4 clusters');
    assert.strictEqual(kMeansResult.totalClustered, students.length);

    // Sum of population counts must equal total students
    const totalCount = kMeansResult.personas.reduce((sum, p) => sum + p.studentCount, 0);
    assert.strictEqual(totalCount, students.length);

    // Check persona integrity
    for (const persona of kMeansResult.personas) {
      assert.ok(persona.name.length > 0);
      assert.ok(persona.description.length > 0);
      assert.ok(persona.recommendedSupportPlaybook.length > 0);
      assert.ok(persona.characteristics.avgGpa >= 1.0 && persona.characteristics.avgGpa <= 4.0);
    }
  });
});
