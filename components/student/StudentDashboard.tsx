'use client';

import React, { useState, useMemo } from 'react';
import { Student } from '@/lib/types';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  BookOpen,
  Calendar,
  Compass,
  Star,
  Zap,
} from 'lucide-react';

interface Props {
  students: Student[];
}

export const StudentDashboard: React.FC<Props> = ({ students }) => {
  const { selectedStudentId, setSelectedStudentId } = useAppStore();

  // Find active student or fallback to first
  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Goal tracker state (Local interactive state)
  const [targetGpa, setTargetGpa] = useState<number>(3.5);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState<number>(14);
  const [milestones, setMilestones] = useState([
    { id: 'm1', label: 'Complete Week 6 Problem Set draft before Friday', done: true },
    { id: 'm2', label: 'Review lecture notes with peer study group', done: true },
    { id: 'm3', label: 'Attend faculty office hours for Midterm preparation', done: false },
    { id: 'm4', label: 'Schedule 20-min academic planning check-in with advisor', done: false },
  ]);

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };

  // Credit progress calculation (120 total credits typical degree benchmark)
  const totalDegreeCredits = 120;
  const creditsEarned = currentStudent.creditsCompleted;
  const creditPercentage = Math.min(100, Math.round((creditsEarned / totalDegreeCredits) * 100));

  // Circular progress ring math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (creditPercentage / 100) * circumference;

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Student Top Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-800 ring-1 ring-inset ring-teal-600/20 dark:bg-teal-950/60 dark:text-teal-300">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Self-Advocacy &amp; Journey Hub
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Token: {currentStudent.id}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back to your Success Journey!
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {currentStudent.major} • Cohort {currentStudent.cohort} • Semester {currentStudent.currentSemester}
            </p>
          </div>

          {/* Quick Demo Switcher for Students */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-2 dark:bg-slate-800 dark:border-slate-700">
            <label htmlFor="student-demo-select" className="text-xs text-slate-500">Switch Demo Student:</label>
            <select
              id="student-demo-select"
              aria-label="Select Demo Student Persona"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 bg-white py-1 px-2 text-slate-800 font-mono dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="STU-1002">STU-1002 • Priya S. (Demo Persona)</option>
              <option value="STU-1005">STU-1005 (Data Science)</option>
              <option value="STU-1015">STU-1015 (Business Analytics)</option>
              <option value="STU-1025">STU-1025 (Electrical Eng.)</option>
              <option value="STU-1040">STU-1040 (Information Systems)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ROW 1: Progress Ring & Strengths Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Ring Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Degree Milestone Progress
          </span>

          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                className="text-teal-500 transition-all duration-1000 ease-out"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {creditPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Completed</span>
            </div>
          </div>

          <div className="w-full space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Credits Earned:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {creditsEarned} / {totalDegreeCredits}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cumulative GPA:</span>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                {currentStudent.cumulativeGpa.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Attendance Consistency:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {currentStudent.overallAttendanceRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Strengths Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Your Academic Strengths &amp; Milestones
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Celebrating verified commitments and positive study habits built over your journey.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-950/60 dark:bg-amber-950/20">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Lecture Attendance Discipline</span>
                </div>
                <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                  Maintained an impressive <strong>{currentStudent.overallAttendanceRate}%</strong> attendance record across your classes this term.
                </p>
              </div>

              <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 dark:border-teal-950/60 dark:bg-teal-950/20">
                <div className="flex items-center space-x-2 text-xs font-bold text-teal-900 dark:text-teal-200">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <span>Foundational Course Mastery</span>
                </div>
                <p className="mt-1 text-xs text-teal-800/90 dark:text-teal-300/80 leading-relaxed">
                  Successfully completed core prerequisites in {currentStudent.major}, advancing steady credit accumulation.
                </p>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950/60 dark:bg-indigo-950/20">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  <span>Digital Portal Engagement</span>
                </div>
                <p className="mt-1 text-xs text-indigo-800/90 dark:text-indigo-300/80 leading-relaxed">
                  Active engagement on online modules (score: {currentStudent.lmsEngagementScore}/100) reflecting dedicated study review.
                </p>
              </div>

              <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-950/60 dark:bg-purple-950/20">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>Term Resilience</span>
                </div>
                <p className="mt-1 text-xs text-purple-800/90 dark:text-purple-300/80 leading-relaxed">
                  Demonstrated persistence in completing complex multi-week assignments and lab projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Next 3 Recommended Actions & Opportunities to Grow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next 3 Supportive Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Next 3 Best Actions for You
              </h3>
              <p className="text-xs text-slate-500">
                Tailored opportunities to maximize your mastery and stay ahead of deadlines.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Personalized
            </span>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Join the Weekly Peer Study Sprint
                </h4>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                  Connect with fellow {currentStudent.major} classmates this Wednesday at 4 PM to work through core problem sets.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Lock in Midterm Planning with Your Faculty Mentor
                </h4>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                  Book a 15-minute office hour session to clarify gateway topic reviews and review mock questions.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Set Up Course Calendar Reminders
                </h4>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                  Sync assignment due dates to your phone to reduce end-of-week submission rush and turn in work calmly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Goal Tracker */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive Semester Goal Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Track your personal academic habits and checklist targets.
              </p>
            </div>
            <Target className="w-5 h-5 text-indigo-600" />
          </div>

          {/* Goal Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Target Term GPA:</span>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="number"
                  min="2.0"
                  max="4.0"
                  step="0.1"
                  value={targetGpa}
                  onChange={(e) => setTargetGpa(Number(e.target.value))}
                  className="w-20 rounded-lg border border-slate-300 bg-white p-1 text-xs font-mono font-bold text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                <span className="text-[10px] text-slate-400">Aim high!</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Weekly Study Target:</span>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="number"
                  min="5"
                  max="35"
                  step="1"
                  value={weeklyStudyHours}
                  onChange={(e) => setWeeklyStudyHours(Number(e.target.value))}
                  className="w-20 rounded-lg border border-slate-300 bg-white p-1 text-xs font-mono font-bold text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                <span className="text-[10px] text-slate-400">hours/week</span>
              </div>
            </div>
          </div>

          {/* Milestone Checklist */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Weekly Milestones ({milestones.filter((m) => m.done).length} / {milestones.length} Completed)
            </span>
            {milestones.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMilestone(m.id)}
                className={`w-full flex items-center space-x-2.5 p-2.5 rounded-xl text-left text-xs transition border ${
                  m.done
                    ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                    : 'border-slate-100 bg-slate-50/60 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                    m.done
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {m.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className={m.done ? 'line-through text-slate-500 dark:text-slate-400' : ''}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
