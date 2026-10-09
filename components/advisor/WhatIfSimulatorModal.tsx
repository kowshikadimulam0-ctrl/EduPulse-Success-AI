'use client';

import React, { useState, useMemo } from 'react';
import { Student } from '@/lib/types';
import { evaluateStudentRisk } from '@/lib/risk';
import {
  X,
  Sliders,
  TrendingDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  RotateCcw,
} from 'lucide-react';

interface Props {
  student: Student | null;
  onClose: () => void;
}

export const WhatIfSimulatorModal: React.FC<Props> = ({ student, onClose }) => {
  if (!student) return null;
  return <WhatIfSimulatorContent student={student} onClose={onClose} />;
};

const WhatIfSimulatorContent: React.FC<{ student: Student; onClose: () => void }> = ({
  student,
  onClose,
}) => {
  // Initial slider states initialized to student's current baseline
  const [simAttendance, setSimAttendance] = useState<number>(student.overallAttendanceRate);
  const [simLate, setSimLate] = useState<number>(student.lateSubmissionRate);
  const [simLms, setSimLms] = useState<number>(student.lmsEngagementScore);

  // Baseline score
  const baselineRisk = useMemo(() => evaluateStudentRisk(student), [student]);

  // Dynamically recomputed simulated score
  const simulatedRisk = useMemo(() => {
    const virtualStudent: Student = {
      ...student,
      overallAttendanceRate: simAttendance,
      lateSubmissionRate: simLate,
      lmsEngagementScore: simLms,
      // If simulated attendance is much higher, project slightly higher simulated GPA
      cumulativeGpa: Number(
        Math.min(
          4.0,
          student.cumulativeGpa + (simAttendance > student.overallAttendanceRate ? (simAttendance - student.overallAttendanceRate) * 0.01 : 0)
        ).toFixed(2)
      ),
    };
    return evaluateStudentRisk(virtualStudent);
  }, [student, simAttendance, simLate, simLms]);

  const scoreDelta = simulatedRisk.riskScore - baselineRisk.riskScore;

  const handleReset = () => {
    setSimAttendance(student.overallAttendanceRate);
    setSimLate(student.lateSubmissionRate);
    setSimLms(student.lmsEngagementScore);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 animate-in zoom-in-95 duration-150 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                What-If Trajectory Simulator: {student.id}
              </h3>
              <p className="text-xs text-slate-500">
                Adjust academic habits to preview impact on Care Urgency Score
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Before vs After Score Comparison Banner */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Current Baseline
            </span>
            <p className="text-2xl font-black font-mono text-slate-800 dark:text-slate-200">
              {baselineRisk.riskScore}
            </p>
            <span className="text-[10px] text-slate-500">{baselineRisk.riskBand}</span>
          </div>

          <div className="flex flex-col items-center">
            <ArrowRight className="w-5 h-5 text-indigo-500" />
            {scoreDelta < 0 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {scoreDelta} pts
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Simulated Outcome
            </span>
            <p className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {simulatedRisk.riskScore}
            </p>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
              {simulatedRisk.riskBand}
            </span>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-4">
          {/* Slider 1: Attendance Rate */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-800 dark:text-slate-200">
                Projected Course Attendance
              </span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {simAttendance}% (Baseline: {student.overallAttendanceRate}%)
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="1"
              value={simAttendance}
              onChange={(e) => setSimAttendance(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>40% (Severe absence)</span>
              <span>80% (Recommended)</span>
              <span>100% (Perfect)</span>
            </div>
          </div>

          {/* Slider 2: Late Submission Rate */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-800 dark:text-slate-200">
                Coursework Late Submission Rate
              </span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {simLate}% (Baseline: {student.lateSubmissionRate}%)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="1"
              value={simLate}
              onChange={(e) => setSimLate(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (All on-time)</span>
              <span>25% (Occasional delay)</span>
              <span>70% (Chronic late)</span>
            </div>
          </div>

          {/* Slider 3: LMS Platform Engagement */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-800 dark:text-slate-200">
                LMS Platform Engagement Score
              </span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {simLms}/100 (Baseline: {student.lmsEngagementScore})
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="1"
              value={simLms}
              onChange={(e) => setSimLms(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>20 (Low portal activity)</span>
              <span>65 (Steady)</span>
              <span>100 (High reading activity)</span>
            </div>
          </div>
        </div>

        {/* Motivational Goal Summary */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/30 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center space-x-2 font-bold mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Target Action Plan Takeaway</span>
          </div>
          {scoreDelta < 0 ? (
            <p className="text-[11px] leading-relaxed">
              Achieving an attendance target of <strong>{simAttendance}%</strong> and cutting late assignments to <strong>{simLate}%</strong> will lower Care Urgency by <strong>{Math.abs(scoreDelta)} points</strong>, transitioning the student into the <strong>{simulatedRisk.riskBand}</strong> band!
            </p>
          ) : (
            <p className="text-[11px] leading-relaxed">
              Adjust the sliders above to demonstrate the clear numerical benefits of improved study habits.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Student Baseline</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs"
          >
            Done Simulating
          </button>
        </div>
      </div>
    </div>
  );
};
