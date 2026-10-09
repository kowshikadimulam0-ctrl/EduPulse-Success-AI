'use client';

import React from 'react';
import { Student } from '@/lib/types';
import {
  X,
  Compass,
  CheckCircle2,
  Calendar,
  BookOpen,
  Activity,
  Sliders,
  PlusCircle,
  Clock,
  Award,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  student: Student | null;
  onClose: () => void;
  onOpenWhatIf: (student: Student) => void;
  onOpenIntervention: (student: Student) => void;
}

export const Student360Drawer: React.FC<Props> = ({
  student,
  onClose,
  onOpenWhatIf,
  onOpenIntervention,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm">
                {student.id.replace('STU-', '#')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Student 360: {student.id}
                  </h2>
                  <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Cohort {student.cohort}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {student.major} • Semester {student.currentSemester} • Status: <span className="capitalize">{student.status.replace('_', ' ')}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Close Student 360 drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Toolbar */}
          <div className="mt-4 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenWhatIf(student)}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulate What-If Trajectory</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenIntervention(student)}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Advisor Intervention</span>
            </button>
          </div>
        </div>

        {/* Drawer Body Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Section 1: "Why Flagged?" Plain-English Risk Card */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-violet-50/50 p-5 dark:border-indigo-950 dark:from-indigo-950/30 dark:to-violet-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                Early Warning &amp; Care Urgency
              </span>
              <span className="text-2xl font-black font-mono text-indigo-700 dark:text-indigo-300">
                {student.risk.riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
              Support Band: <strong>{student.risk.riskCategory}</strong>
            </p>

            <div className="mt-4 space-y-2.5">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                Top 3 Plain-English Drivers
              </span>
              {student.risk.topFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/80 bg-white/90 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/80 shadow-2xs"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                    <span>{idx + 1}. {factor.factor}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md uppercase font-bold ${
                        factor.impactLevel === 'high'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : factor.impactLevel === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {factor.impactLevel}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {factor.plainEnglishExplanation}
                  </p>
                </div>
              ))}
            </div>

            {/* Recommended Action */}
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              <span className="font-bold block">Recommended Next Step:</span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                {student.risk.recommendedAction}
              </p>
            </div>
          </div>

          {/* Section 2: Academic Progress & Course Sequence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Course Performance &amp; Attendance History
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {student.courses.length} courses completed
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Sem</th>
                    <th className="px-3 py-2">Course</th>
                    <th className="px-3 py-2 text-right">Grade</th>
                    <th className="px-3 py-2 text-right">Attendance</th>
                    <th className="px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {student.courses.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-3 py-2 text-slate-400">S{c.semester}</td>
                      <td className="px-3 py-2 font-sans font-medium text-slate-800 dark:text-slate-200">
                        {c.courseId} - {c.courseName}
                        {c.isBottleneck && (
                          <span className="ml-1 text-[9px] px-1 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold">
                            Gateway
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-slate-900 dark:text-white">
                        {c.grade.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={c.attendanceRate < 70 ? 'text-rose-600 font-bold' : ''}>
                          {c.attendanceRate}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center font-sans">
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            c.passed
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {c.passed ? 'Passed' : 'Needs Retake'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Past Logged Interventions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Advisor Action History
              </h3>
              <span className="text-xs text-slate-500">
                {student.interventions.length} logged
              </span>
            </div>

            {student.interventions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800">
                No past interventions recorded for this student yet. Click &quot;Log Advisor Intervention&quot; above to add one.
              </div>
            ) : (
              <div className="space-y-2">
                {student.interventions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                      <span>{item.type}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      {item.notes}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/60 pt-1.5 dark:border-slate-700">
                      <span>Owner: <strong>{item.owner}</strong></span>
                      <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">
                        Status: {item.outcome.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Close 360 View
          </button>
        </div>
      </div>
    </div>
  );
};
