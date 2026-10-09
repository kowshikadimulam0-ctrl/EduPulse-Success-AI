'use client';

import React, { useState } from 'react';
import { Student, InterventionRecord } from '@/lib/types';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  X,
  PlusCircle,
  CheckCircle2,
  Calendar,
  User,
  FileText,
} from 'lucide-react';

interface Props {
  student: Student | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const InterventionLoggerModal: React.FC<Props> = ({
  student,
  onClose,
  onSuccess,
}) => {
  const { addIntervention } = useAppStore();

  const [type, setType] = useState<InterventionRecord['type']>('Advisor Check-in');
  const [owner, setOwner] = useState<string>('Academic Advisor Team');
  const [notes, setNotes] = useState<string>(
    student ? `Met with ${student.id} to review prerequisite course load and recommend supplementary peer tutoring.` : ''
  );
  const [outcome, setOutcome] = useState<InterventionRecord['outcome']>('pending');

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: InterventionRecord = {
      id: `INT-${Date.now()}`,
      studentId: student.id,
      date: new Date().toISOString().split('T')[0],
      type,
      owner,
      notes,
      outcome,
    };
    addIntervention(newRecord);
    // Also push to local student record for immediate in-session reflection
    student.interventions.unshift(newRecord);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 animate-in zoom-in-95 duration-150 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Log Action: {student.id}
              </h3>
              <p className="text-xs text-slate-500">
                Record a supportive mentorship, tutoring, or guidance action
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Action Type */}
          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
              Intervention Action Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as InterventionRecord['type'])}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="Advisor Check-in">1-on-1 Advisor Check-in</option>
              <option value="Academic Tutoring">Academic Tutoring &amp; Learning Center</option>
              <option value="Peer Mentoring">Peer Study Cohort / Mentoring</option>
              <option value="Financial Guidance">Financial Counseling &amp; Emergency Aid</option>
              <option value="Wellness Support">Campus Wellness &amp; Counseling</option>
            </select>
          </div>

          {/* Owner / Staff Lead */}
          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
              Responsible Advisor / Mentor
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              placeholder="e.g. Dr. Sarah Chen, Advisor Maya Patel"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
              Session Notes &amp; Next Steps
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              placeholder="Outline specific milestones agreed with the student..."
            />
          </div>

          {/* Initial Status / Outcome */}
          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">
              Status Tracking
            </label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as InterventionRecord['outcome'])}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="pending">Pending Follow-up</option>
              <option value="improved">Improved Attendance / Pacing</option>
              <option value="steady">Steady &amp; On Track</option>
              <option value="needs_followup">Needs Continued Outreach</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-xs"
            >
              Save Intervention Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
