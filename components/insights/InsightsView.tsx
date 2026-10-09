'use client';

import React, { useMemo, useState } from 'react';
import { Student } from '@/lib/types';
import { computeCohortRetention } from '@/lib/analytics/retention';
import { computeJourneyFunnel } from '@/lib/analytics/funnel';
import { computeBottleneckCourses } from '@/lib/analytics/bottlenecks';
import { computeStudentPersonas } from '@/lib/analytics/kmeans';
import { computeFeatureEngineeringSummary } from '@/lib/analytics/featureEngineering';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  Filter,
  Users,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Activity,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';

interface Props {
  students: Student[];
}

export const InsightsView: React.FC<Props> = ({ students }) => {
  const [activeTab, setActiveTab] = useState<'retention' | 'funnel' | 'bottlenecks' | 'personas' | 'features'>('retention');

  // Compute all analytics using pure functions
  const retentionData = useMemo(() => computeCohortRetention(students), [students]);
  const funnelData = useMemo(() => computeJourneyFunnel(students), [students]);
  const bottleneckData = useMemo(() => computeBottleneckCourses(students), [students]);
  const personaData = useMemo(() => computeStudentPersonas(students, 4), [students]);
  const featureData = useMemo(() => computeFeatureEngineeringSummary(students), [students]);

  // Transform retention curves for Recharts multi-line chart
  const retentionChartData = useMemo(() => {
    const sems = [1, 2, 3, 4, 5, 6, 7, 8];
    return sems.map((sem) => {
      const row: Record<string, string | number> = { semester: `Sem ${sem}` };
      retentionData.cohortCurves.forEach((curve) => {
        const pt = curve.semesters.find((s) => s.semester === sem);
        if (pt) {
          row[curve.cohort] = pt.retentionRate;
        }
      });
      return row;
    });
  }, [retentionData]);

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                Stage 2: Analytics Engine Active
              </span>
              <span className="text-xs text-slate-500 font-mono">
                1,500 records analyzed
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Journey & Pattern Discovery
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Evidence-based analytics across cohort survival curves, funnel transition drop-offs,
              gateway bottlenecks, K-Means student personas, and trajectory slopes.
            </p>
          </div>

          {/* Quick Sub-navigation */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('retention')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'retention'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Retention
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('funnel')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'funnel'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Funnel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bottlenecks')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'bottlenecks'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Bottlenecks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('personas')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'personas'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Personas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'features'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Feature Slopes
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Cohort Retention Curves */}
      {(activeTab === 'retention' || activeTab === 'features') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Finding 1: Cohort Retention Curves
                </span>
                <span className="text-xs text-slate-400">• Multi-Year Tracking</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Semester-by-Semester Survival Trajectory Across 4 Cohorts
              </h2>
            </div>
            <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5 dark:bg-indigo-950/40 dark:border-indigo-900">
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">1st-Year Retention:</span>
              <span className="text-sm font-bold font-mono text-indigo-900 dark:text-indigo-200">
                {retentionData.aggregateFirstYearRetention}%
              </span>
            </div>
          </div>

          {/* Retention Line Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  formatter={(val: unknown) => [`${val}%`, 'Retention']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="2021-Fall"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="2021 Cohort (Full 8 Sem)"
                />
                <Line
                  type="monotone"
                  dataKey="2022-Fall"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="2022 Cohort (6 Sem)"
                />
                <Line
                  type="monotone"
                  dataKey="2023-Fall"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="2023 Cohort (4 Sem)"
                />
                <Line
                  type="monotone"
                  dataKey="2024-Fall"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="2024 Cohort (2 Sem)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Plain English "So What?" Box */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30">
            <div className="flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                  Plain-English &quot;So What?&quot; (Leadership Takeaway)
                </h4>
                <p className="mt-1 text-xs text-indigo-950/80 dark:text-indigo-200/90 leading-relaxed">
                  {retentionData.soWhat}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Journey Drop-off Funnel */}
      {(activeTab === 'funnel' || activeTab === 'features') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Finding 2: Journey Drop-Off Funnel
                </span>
                <span className="text-xs text-slate-400">• Matriculation to Graduation</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Student Attrition at Critical Milestone Junctions
              </h2>
            </div>
            <div className="flex items-center space-x-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-1.5 dark:bg-rose-950/40 dark:border-rose-900">
              <span className="text-xs text-rose-700 dark:text-rose-300 font-medium">Completed Graduation Rate:</span>
              <span className="text-sm font-bold font-mono text-rose-900 dark:text-rose-200">
                {funnelData.overallGraduationRate}%
              </span>
            </div>
          </div>

          {/* Funnel Steps Visual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {funnelData.funnelSteps.map((step, idx) => (
              <div
                key={step.stepId}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">Step {idx + 1}</span>
                    {step.dropOffCount > 0 && (
                      <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                        -{step.dropOffCount} left
                      </span>
                    )}
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                    {step.stageName}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                    {step.milestoneDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                      {step.totalReached}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {step.conversionRate}%
                    </span>
                  </div>
                  <div className="mt-1.5 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden dark:bg-slate-700">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${step.conversionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Plain English "So What?" Box */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/60 dark:bg-rose-950/30">
            <div className="flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                  Plain-English &quot;So What?&quot; (Curricular Timing)
                </h4>
                <p className="mt-1 text-xs text-rose-950/80 dark:text-rose-200/90 leading-relaxed">
                  {funnelData.soWhat}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Curricular Bottleneck Courses */}
      {(activeTab === 'bottlenecks' || activeTab === 'features') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Finding 3: Curricular Bottlenecks
                </span>
                <span className="text-xs text-slate-400">• High Failure & Attrition Gates</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Courses with High Combined Fail + Withdrawal Hurdle Rates
              </h2>
            </div>
            <div className="flex items-center space-x-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5 dark:bg-amber-950/40 dark:border-amber-900">
              <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">Avg Hurdle Rate:</span>
              <span className="text-sm font-bold font-mono text-amber-900 dark:text-amber-200">
                {bottleneckData.averageHurdleRate}%
              </span>
            </div>
          </div>

          {/* Bottleneck Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Course Code & Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-right">Enrollments</th>
                  <th className="px-4 py-3 text-right">Avg Grade</th>
                  <th className="px-4 py-3 text-right">Fail Rate</th>
                  <th className="px-4 py-3 text-right">Withdrawal Rate</th>
                  <th className="px-4 py-3 text-right">Combined Hurdle</th>
                  <th className="px-4 py-3">Recommended Curricular Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {bottleneckData.bottleneckCourses.slice(0, 8).map((course) => {
                  const isHigh = course.combinedHurdleRate >= 25;
                  return (
                    <tr key={course.courseId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-indigo-600 dark:text-indigo-400">{course.courseId}</span>
                          <span>•</span>
                          <span>{course.courseName}</span>
                          {course.isGateway && (
                            <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                              Gateway
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {course.department}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {course.totalEnrollments}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold">
                        {course.averageGrade.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-rose-600 font-semibold">
                        {course.failRate}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-500">
                        {course.withdrawalRate}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                            isHigh
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {course.combinedHurdleRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-[11px]">
                        {course.recommendedCurriculumAction}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Plain English "So What?" Box */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
            <div className="flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  Plain-English &quot;So What?&quot; (Curricular Intervention)
                </h4>
                <p className="mt-1 text-xs text-amber-950/80 dark:text-amber-200/90 leading-relaxed">
                  {bottleneckData.soWhat}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: K-Means Student Personas */}
      {(activeTab === 'personas' || activeTab === 'features') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Finding 4: K-Means Student Personas
                </span>
                <span className="text-xs text-slate-400">• Native TypeScript Engine (K=4)</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Empirical Behavioral Clusters & Supportive Institutional Playbooks
              </h2>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 border border-purple-100 rounded-xl px-3 py-1.5 dark:bg-purple-950/40 dark:border-purple-900">
              <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">Clustering Convergence:</span>
              <span className="text-sm font-bold font-mono text-purple-900 dark:text-purple-200">
                {personaData.iterationsToConverge} iterations
              </span>
            </div>
          </div>

          {/* 4 Persona Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personaData.personas.map((persona) => (
              <div
                key={persona.clusterId}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${persona.badgeBg} ${persona.badgeText}`}>
                      {persona.name}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {persona.studentCount} students ({persona.populationPercentage}%)
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    &ldquo;{persona.tagline}&rdquo;
                  </p>

                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {persona.description}
                  </p>

                  {/* Centroid Characteristics */}
                  <div className="mt-4 grid grid-cols-4 gap-2 border-t border-b border-slate-200 py-3 dark:border-slate-700 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Avg GPA</span>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {persona.characteristics.avgGpa.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Attendance</span>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {persona.characteristics.avgAttendance}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">LMS Activity</span>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {persona.characteristics.avgLmsEngagement}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Late Subs</span>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {persona.characteristics.avgLateSubmissionRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supportive Recommended Playbook */}
                <div className="mt-4 rounded-lg bg-white p-3 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center space-x-1.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                    <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Recommended Institutional Playbook</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                    {persona.recommendedSupportPlaybook}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Plain English "So What?" Box */}
          <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4 dark:border-purple-900/60 dark:bg-purple-950/30">
            <div className="flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider">
                  Plain-English &quot;So What?&quot; (Personalized Interventions)
                </h4>
                <p className="mt-1 text-xs text-purple-950/80 dark:text-purple-200/90 leading-relaxed">
                  {personaData.soWhat}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Feature Engineering & Slopes */}
      {(activeTab === 'features' || activeTab === 'retention') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Finding 5: Feature Engineering &amp; Slopes
                </span>
                <span className="text-xs text-slate-400">• Dynamic Trajectory Modeling</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Detecting Early Warning Shifts via Grade Slopes &amp; LMS Decay
              </h2>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-xs font-medium text-slate-500">Declining Grade Slope (m &lt; -0.08)</span>
              <p className="text-2xl font-bold font-mono text-rose-600 mt-1">
                {featureData.decliningSlopeCount} students
              </p>
              <span className="text-[11px] text-slate-500">
                {featureData.decliningSlopePercentage}% of student population
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-xs font-medium text-slate-500">Digital LMS Engagement Decay</span>
              <p className="text-2xl font-bold font-mono text-amber-600 mt-1">
                {featureData.lmsDecayCount} students
              </p>
              <span className="text-[11px] text-slate-500">
                {featureData.lmsDecayPercentage}% showing &gt;20pt portal drop
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-xs font-medium text-slate-500">On-Track Credit Velocity (&ge; 90%)</span>
              <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                {featureData.highCreditVelocityPercentage}%
              </p>
              <span className="text-[11px] text-slate-500">
                Completed credits vs credits attempted
              </span>
            </div>
          </div>

          {/* Sample Student Feature Slope Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Student Token</th>
                  <th className="px-4 py-3 text-right">Attendance</th>
                  <th className="px-4 py-3 text-right">Grade Trend Slope (m)</th>
                  <th className="px-4 py-3">Trajectory Vector</th>
                  <th className="px-4 py-3">LMS Decay Alert</th>
                  <th className="px-4 py-3 text-right">Late Sub %</th>
                  <th className="px-4 py-3 text-right">Credit Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {featureData.sampleFeatures.slice(0, 7).map((feat) => {
                  let slopeBadge = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                  if (feat.gradeTrendLabel === 'Accelerating') slopeBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
                  else if (feat.gradeTrendLabel === 'Declining') slopeBadge = 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';

                  return (
                    <tr key={feat.studentId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {feat.studentId}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {feat.attendanceRate}%
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {feat.gradeTrendSlope > 0 ? `+${feat.gradeTrendSlope}` : feat.gradeTrendSlope}
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${slopeBadge}`}>
                          {feat.gradeTrendLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans">
                        {feat.lmsDecay ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Decay (-{feat.lmsDecayMagnitude}pts)</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Stable</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {feat.lateSubmissionRate}%
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                        {(feat.creditVelocity * 100).toFixed(0)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Plain English "So What?" Box */}
          <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900/60 dark:bg-teal-950/30">
            <div className="flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                  Plain-English &quot;So What?&quot; (Predictive Foresight)
                </h4>
                <p className="mt-1 text-xs text-teal-950/80 dark:text-teal-200/90 leading-relaxed">
                  {featureData.soWhat}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
