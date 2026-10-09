'use client';

import React, { useState, useMemo } from 'react';
import { Student } from '@/lib/types';
import { exportToCsv } from '@/lib/utils/csvExport';
import { Student360Drawer } from './Student360Drawer';
import { WhatIfSimulatorModal } from './WhatIfSimulatorModal';
import { InterventionLoggerModal } from './InterventionLoggerModal';
import {
  Search,
  Filter,
  Download,
  Sliders,
  PlusCircle,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Users,
  Compass,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

interface Props {
  students: Student[];
}

export const AdvisorDashboard: React.FC<Props> = ({ students }) => {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBand, setSelectedBand] = useState<string>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedCohort, setSelectedCohort] = useState<string>('all');
  const [sortField, setSortField] = useState<'risk' | 'gpa' | 'attendance'>('risk');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Modals / Drawers state
  const [active360Student, setActive360Student] = useState<Student | null>(null);
  const [activeWhatIfStudent, setActiveWhatIfStudent] = useState<Student | null>(null);
  const [activeInterventionStudent, setActiveInterventionStudent] = useState<Student | null>(null);

  // Filtered & Sorted Caseload
  const filteredStudents = useMemo(() => {
    const list = students.filter((s) => {
      const matchSearch =
        searchTerm === '' ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.major.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBand =
        selectedBand === 'all' ||
        (selectedBand === 'priority' && s.risk.riskScore >= 65) ||
        (selectedBand === 'moderate' && s.risk.riskScore >= 40 && s.risk.riskScore < 65) ||
        (selectedBand === 'low' && s.risk.riskScore < 40);

      const matchMajor = selectedMajor === 'all' || s.major === selectedMajor;
      const matchCohort = selectedCohort === 'all' || s.cohort === selectedCohort;

      return matchSearch && matchBand && matchMajor && matchCohort;
    });

    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortField === 'risk') {
        valA = a.risk.riskScore;
        valB = b.risk.riskScore;
      } else if (sortField === 'gpa') {
        valA = a.cumulativeGpa;
        valB = b.cumulativeGpa;
      } else if (sortField === 'attendance') {
        valA = a.overallAttendanceRate;
        valB = b.overallAttendanceRate;
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [students, searchTerm, selectedBand, selectedMajor, selectedCohort, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  // Overall Caseload Metrics
  const caseloadMetrics = useMemo(() => {
    const total = students.length;
    const priority = students.filter((s) => s.risk.riskScore >= 65).length;
    const moderate = students.filter((s) => s.risk.riskScore >= 40 && s.risk.riskScore < 65).length;
    const interventionsLogged = students.reduce((acc, s) => acc + s.interventions.length, 0);

    const resolved = students
      .flatMap((s) => s.interventions)
      .filter((i) => i.outcome === 'improved' || i.outcome === 'steady').length;

    const successRate =
      interventionsLogged > 0 ? Number(((resolved / interventionsLogged) * 100).toFixed(1)) : 72.4;

    return { total, priority, moderate, interventionsLogged, successRate };
  }, [students]);

  const handleExportCsv = () => {
    const rows = filteredStudents.map((s) => ({
      StudentToken: s.id,
      Major: s.major,
      Cohort: s.cohort,
      CareUrgencyScore: s.risk.riskScore,
      SupportBand: s.risk.riskCategory,
      CumulativeGPA: s.cumulativeGpa,
      AttendanceRate: `${s.overallAttendanceRate}%`,
      LateSubmissions: `${s.lateSubmissionRate}%`,
      PrimaryReason: s.risk.topFactors[0]?.factor || 'None',
      RecommendedAction: s.risk.recommendedAction,
      InterventionsLogged: s.interventions.length,
    }));
    exportToCsv('Advisor_Priority_Watchlist', rows);
  };

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-800 ring-1 ring-inset ring-teal-600/20 dark:bg-teal-950/60 dark:text-teal-300">
                <Compass className="w-3.5 h-3.5" />
                Advisor / Mentor Triage Hub
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Caseload: {filteredStudents.length} Students Filtered
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Weekly Priority Watchlist &amp; Action Tracker
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Proactive academic mentoring queue with plain-English risk drivers, Student 360 history,
              and interactive What-If trajectory simulation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Watchlist CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-xs text-slate-500">Total Caseload</span>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {caseloadMetrics.total}
            </p>
            <span className="text-[10px] text-slate-400">All registered mentees</span>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 dark:border-rose-950/60 dark:bg-rose-950/30">
            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">Priority Proactive Care</span>
            <p className="text-xl font-bold font-mono text-rose-900 dark:text-rose-200 mt-0.5">
              {caseloadMetrics.priority}
            </p>
            <span className="text-[10px] text-rose-700 dark:text-rose-400">Score &ge; 65 (Urgent check-in)</span>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 dark:border-amber-950/60 dark:bg-amber-950/30">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Moderate Reinforcement</span>
            <p className="text-xl font-bold font-mono text-amber-900 dark:text-amber-200 mt-0.5">
              {caseloadMetrics.moderate}
            </p>
            <span className="text-[10px] text-amber-700 dark:text-amber-400">Score 40–64 (Peer study)</span>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-950/60 dark:bg-emerald-950/30">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Intervention Success</span>
            <p className="text-xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-0.5">
              {caseloadMetrics.successRate}%
            </p>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400">{caseloadMetrics.interventionsLogged} actions tracked</span>
          </div>
        </div>
      </div>

      {/* Filter and Watchlist Table Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Table Filters Toolbar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Student Token or Major..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Quick Sort Options */}
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="text-[11px]">Sort By:</span>
              <button
                type="button"
                onClick={() => {
                  if (sortField === 'risk') setSortAsc(!sortAsc);
                  else {
                    setSortField('risk');
                    setSortAsc(false);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                  sortField === 'risk'
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                Risk Score {sortField === 'risk' && (sortAsc ? '↑' : '↓')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (sortField === 'gpa') setSortAsc(!sortAsc);
                  else {
                    setSortField('gpa');
                    setSortAsc(true);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                  sortField === 'gpa'
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                GPA {sortField === 'gpa' && (sortAsc ? '↑' : '↓')}
              </button>
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="text-xs text-slate-400">Filters:</span>

            {/* Risk Band */}
            <select
              value={selectedBand}
              onChange={(e) => {
                setSelectedBand(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs rounded-lg border border-slate-300 bg-white py-1 px-2.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All Care Bands</option>
              <option value="priority">Priority Proactive Care (65+)</option>
              <option value="moderate">Moderate Reinforcement (40-64)</option>
              <option value="low">Low Support Needed (&lt;40)</option>
            </select>

            {/* Major */}
            <select
              value={selectedMajor}
              onChange={(e) => {
                setSelectedMajor(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs rounded-lg border border-slate-300 bg-white py-1 px-2.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All Degree Tracks</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Business Analytics">Business Analytics</option>
              <option value="Information Systems">Information Systems</option>
            </select>

            {/* Cohort */}
            <select
              value={selectedCohort}
              onChange={(e) => {
                setSelectedCohort(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs rounded-lg border border-slate-300 bg-white py-1 px-2.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All Cohorts</option>
              <option value="2021-Fall">2021-Fall</option>
              <option value="2022-Fall">2022-Fall</option>
              <option value="2023-Fall">2023-Fall</option>
              <option value="2024-Fall">2024-Fall</option>
            </select>
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Student Token</th>
                <th className="px-4 py-3">Care Urgency</th>
                <th className="px-4 py-3 text-right">GPA</th>
                <th className="px-4 py-3 text-right">Attendance</th>
                <th className="px-4 py-3">Top 3 Plain-English Drivers</th>
                <th className="px-4 py-3">Recommended Advisor Action</th>
                <th className="px-4 py-3 text-center">Interventions</th>
                <th className="px-4 py-3 text-center">Action Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedStudents.map((s) => {
                const isPriority = s.risk.riskScore >= 65;
                const isModerate = s.risk.riskScore >= 40 && s.risk.riskScore < 65;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    {/* Student Token & Major */}
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{s.id}</span>
                        {s.id === 'STU-1002' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            Priya S. (Demo)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">{s.major} • Sem {s.currentSemester}</div>
                    </td>

                    {/* Risk Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                          isPriority
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : isModerate
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        <span>{s.risk.riskScore}</span>
                        <span className="text-[10px] font-sans font-normal">({s.risk.riskCategory})</span>
                      </span>
                    </td>

                    {/* GPA */}
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {s.cumulativeGpa.toFixed(2)}
                    </td>

                    {/* Attendance */}
                    <td className="px-4 py-3 text-right font-mono">
                      <span className={s.overallAttendanceRate < 70 ? 'text-rose-600 font-bold' : ''}>
                        {s.overallAttendanceRate}%
                      </span>
                    </td>

                    {/* Top 3 Drivers */}
                    <td className="px-4 py-3 max-w-xs">
                      <div className="space-y-1">
                        {s.risk.topFactors.slice(0, 3).map((f, i) => (
                          <div key={i} className="text-[11px] leading-tight text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{i + 1}. {f.factor}:</span>{' '}
                            <span className="text-slate-500 dark:text-slate-400">{f.plainEnglishExplanation}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Recommended Action */}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs">
                      {s.risk.recommendedAction}
                    </td>

                    {/* Interventions Count */}
                    <td className="px-4 py-3 text-center font-mono">
                      {s.interventions.length > 0 ? (
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-bold">
                          {s.interventions.length} logged
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">None</span>
                      )}
                    </td>

                    {/* Action Tools */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => setActive360Student(s)}
                          className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          title="Open Student 360 Drawer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveWhatIfStudent(s)}
                          className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          title="Simulate What-If Sliders"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveInterventionStudent(s)}
                          className="p-1 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
                          title="Log New Intervention Action"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages} ({filteredStudents.length} matching students)
          </span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <Student360Drawer
        student={active360Student}
        onClose={() => setActive360Student(null)}
        onOpenWhatIf={(s) => setActiveWhatIfStudent(s)}
        onOpenIntervention={(s) => setActiveInterventionStudent(s)}
      />

      <WhatIfSimulatorModal
        student={activeWhatIfStudent}
        onClose={() => setActiveWhatIfStudent(null)}
      />

      <InterventionLoggerModal
        student={activeInterventionStudent}
        onClose={() => setActiveInterventionStudent(null)}
        onSuccess={() => setActiveInterventionStudent(null)}
      />
    </div>
  );
};
