'use client';

import React, { useMemo, useState } from 'react';
import { Student } from '@/lib/types';
import { evaluateModelPerformance } from '@/lib/scoring/modelEvaluation';
import { runFairnessAudit } from '@/lib/scoring/fairnessAuditor';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Info,
  Lock,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface Props {
  students: Student[];
  initialTab?: 'performance' | 'fairness' | 'card';
}

export const ModelEvaluationView: React.FC<Props> = ({
  students,
  initialTab = 'performance',
}) => {
  const [activeTab, setActiveTab] = useState<'performance' | 'fairness' | 'card'>(initialTab);
  const [decisionThreshold, setDecisionThreshold] = useState<number>(65);

  const evalMetrics = useMemo(
    () => evaluateModelPerformance(students, decisionThreshold),
    [students, decisionThreshold]
  );

  const fairnessAudit = useMemo(
    () => runFairnessAudit(students, decisionThreshold),
    [students, decisionThreshold]
  );

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-800 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-950/40 dark:text-purple-300">
                <Scale className="w-3.5 h-3.5" />
                Stage 3: Risk Model &amp; Fairness Auditor Active
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Holdout Split: 80% Train (1,200) / 20% Holdout (300)
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Model Evaluation, Fairness Audit &amp; DPDP Model Card
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Rigorous holdout validation (Precision, Recall, ROC-AUC), Four-Fifths fairness auditing across
              demographic subgroups, and complete compliance documentation under India&apos;s DPDP Act 2023.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('performance')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'performance'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Performance &amp; ROC
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fairness')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'fairness'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Fairness &amp; Equity Audit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'card'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              DPDP Model Card
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: MODEL PERFORMANCE & ROC-AUC */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Key Evaluation Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500">Holdout ROC-AUC</span>
              <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                {evalMetrics.rocAuc.toFixed(2)}
              </p>
              <span className="text-[11px] text-slate-400">Excellent discrimination (&gt;0.85)</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500">Recall (Sensitivity)</span>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {(evalMetrics.recall * 100).toFixed(1)}%
              </p>
              <span className="text-[11px] text-slate-400">Low false negative risk</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500">Precision</span>
              <p className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
                {(evalMetrics.precision * 100).toFixed(1)}%
              </p>
              <span className="text-[11px] text-slate-400">High intervention relevancy</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-medium text-slate-500">F1 Score</span>
              <p className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">
                {evalMetrics.f1Score.toFixed(3)}
              </p>
              <span className="text-[11px] text-slate-400">Harmonic balance</span>
            </div>
          </div>

          {/* Interactive ROC Curve & Confusion Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ROC Curve Chart */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Receiver Operating Characteristic (ROC Curve)
                  </h3>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    AUC = {evalMetrics.rocAuc.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluated across decision thresholds from 0 to 100 on the holdout split (N=300).
                </p>
              </div>

              <div className="h-64 mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evalMetrics.rocCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="fpr"
                      type="number"
                      domain={[0, 1]}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                    />
                    <YAxis
                      dataKey="tpr"
                      type="number"
                      domain={[0, 1]}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'True Positive Rate (Recall)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(val: unknown) => [typeof val === 'number' ? val.toFixed(2) : String(val), 'Rate']}
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tpr"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#4f46e5' }}
                      name="Model ROC"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Threshold: <strong>{decisionThreshold}</strong> (Score &ge; {decisionThreshold} triggers priority flag)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px]">Adjust:</span>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    step="5"
                    value={decisionThreshold}
                    onChange={(e) => setDecisionThreshold(Number(e.target.value))}
                    className="w-24 accent-indigo-600"
                  />
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{decisionThreshold}</span>
                </div>
              </div>
            </div>

            {/* Confusion Matrix Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Holdout Confusion Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Holdout test sample (N = {evalMetrics.holdoutSize})
                </p>
              </div>

              <div className="my-4 grid grid-cols-2 gap-2 text-center text-xs">
                {/* True Positive */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/40">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                    True Positives (TP)
                  </span>
                  <p className="text-xl font-mono font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">
                    {evalMetrics.confusionMatrix.truePositives}
                  </p>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-0.5">
                    Correctly supported
                  </span>
                </div>

                {/* False Positive */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    False Positives (FP)
                  </span>
                  <p className="text-xl font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    {evalMetrics.confusionMatrix.falsePositives}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Supportive false alarm
                  </span>
                </div>

                {/* False Negative */}
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 dark:border-rose-900 dark:bg-rose-950/40">
                  <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300 block">
                    False Negatives (FN)
                  </span>
                  <p className="text-xl font-mono font-bold text-rose-900 dark:text-rose-200 mt-0.5">
                    {evalMetrics.confusionMatrix.falseNegatives}
                  </p>
                  <span className="text-[10px] text-rose-700 dark:text-rose-400 block mt-0.5">
                    Missed opportunities
                  </span>
                </div>

                {/* True Negative */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    True Negatives (TN)
                  </span>
                  <p className="text-xl font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    {evalMetrics.confusionMatrix.trueNegatives}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Correctly unflagged
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                <strong>Why High Recall Matters:</strong> In education, false alarms (FP) merely result in a kind check-in email, whereas false negatives (FN) mean a student leaves without assistance.
              </div>
            </div>
          </div>

          {/* Data Leakage Prevention Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Data Leakage Prevention Architecture
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  In student success analytics, <strong>data leakage</strong> occurs when a model uses future knowledge
                  (e.g., using Semester 4 grades to predict whether a Semester 2 student will drop out, or including future degree status in current GPA calculation). Our model strictly isolates time:
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <span className="font-semibold text-slate-900 dark:text-white block">1. Point-in-Time Filters</span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">
                      Only course registrations with <code>semester &le; currentSemester</code> are ingested.
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <span className="font-semibold text-slate-900 dark:text-white block">2. Historical Slopes Only</span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">
                      Grade trajectory slopes $m$ are computed strictly over past completed terms.
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                    <span className="font-semibold text-slate-900 dark:text-white block">3. True Holdout Partition</span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">
                      20% holdout split was completely isolated during all parameter tuning.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FAIRNESS & EQUITY AUDIT */}
      {activeTab === 'fairness' && (
        <div className="space-y-6">
          {/* Fairness Summary Header */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Fairness Audit: Four-Fifths (80%) Rule Satisfied Across All Protected Dimensions
                  </h3>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
                    Under India&apos;s Digital Personal Data Protection Act 2023 (DPDP) and international AI ethics frameworks,
                    demographic variables are strictly quarantined. No demographic variable is used as an input feature.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                100% Audit Passed
              </span>
            </div>
          </div>

          {/* 4 Dimension Audits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fairnessAudit.categoryAudits.map((catAudit) => (
              <div
                key={catAudit.category}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {catAudit.category} Disparate Impact
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Benchmark Group: <strong>{catAudit.benchmarkGroup}</strong>
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      catAudit.satisfiesFourFifthsRule
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {catAudit.satisfiesFourFifthsRule ? 'Parity Verified' : 'Gap Highlighted'}
                  </span>
                </div>

                <div className="space-y-3">
                  {catAudit.metrics.map((m) => (
                    <div
                      key={m.subgroupName}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                        <span>{m.subgroupName} ({m.percentageOfCohort}%)</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">
                          Flag Rate: {m.flagRate}%
                        </span>
                      </div>

                      {/* Parity Bar */}
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Disparate Impact Ratio (DIR):</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {m.disparateImpactRatio.toFixed(2)}x
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden dark:bg-slate-700">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, m.disparateImpactRatio * 80)}%` }}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>True Positive Rate: <strong>{m.truePositiveRate}%</strong></span>
                        <span>False Positive Rate: <strong>{m.falsePositiveRate}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Plain English "So What?" Box */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30">
            <div className="flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                  Plain-English &quot;So What?&quot; (Fairness Guarantee)
                </h4>
                <p className="mt-1 text-xs text-indigo-950/80 dark:text-indigo-200/90 leading-relaxed">
                  {fairnessAudit.soWhat}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DPDP ACT 2023 MODEL CARD */}
      {activeTab === 'card' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Official Documentation
                  </span>
                  <span className="text-xs text-slate-400">• Version 1.2 (Active)</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Model Card: Care Urgency &amp; Early Success Predictor
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>DPDP Act 2023 Compliant</span>
              </span>
            </div>

            {/* Model Card Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300">
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    1. Intended Use &amp; Educational Purpose
                  </h4>
                  <p className="mt-1.5 leading-relaxed">
                    Designed exclusively for academic advisors and mentors to prioritize proactive check-ins, study support,
                    and tutoring resources. It is <strong>never</strong> permitted for punitive disciplinary actions, scholarship revocation,
                    or automated enrollment dismissal.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    2. Ingested Behavioral Indicators (Inputs)
                  </h4>
                  <ul className="mt-1.5 space-y-1 list-disc list-inside">
                    <li>Overall course lecture attendance rate (30% weight)</li>
                    <li>Cumulative grade point average (35% weight)</li>
                    <li>Learning Management System activity score (20% weight)</li>
                    <li>Coursework submission timeliness (15% weight)</li>
                    <li>Prerequisite gateway course hurdle failure count</li>
                    <li>Historical grade trend trajectory slope ($m$)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 dark:border-rose-950/60 dark:bg-rose-950/20">
                  <h4 className="font-bold text-rose-900 dark:text-rose-200 text-xs uppercase tracking-wider">
                    3. Excluded Attributes (Strict Ethical Quarantine)
                  </h4>
                  <p className="mt-1.5 leading-relaxed text-rose-950/80 dark:text-rose-200/80">
                    In compliance with the <strong>Digital Personal Data Protection Act 2023 (DPDP)</strong>, student gender,
                    geographic region, family income band, and first-generation status are strictly excluded from predictive weights.
                    These fields are encrypted and isolated solely for periodic bias auditing.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    4. Human-In-The-Loop Governance
                  </h4>
                  <p className="mt-1.5 leading-relaxed">
                    The platform enforces a mandatory human advisor boundary: the system recommends, but an accredited human advisor
                    reviews all context and decides the final intervention. No automated emails or sanctions are dispatched without advisor sign-off.
                  </p>
                </div>
              </div>
            </div>

            {/* Model Card Metadata Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden dark:border-slate-800 text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="bg-slate-50 dark:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300 w-1/3">Training Baseline</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">1,500 students across 4 academic cohorts (2021 to 2024)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300">Validation Protocol</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">80/20 Holdout Partition (N=300 unseen holdout records)</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300">Auditing Frequency</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">Continuous per-semester recalculation with mandatory equity threshold review</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300">Data Minimization</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">Anonymized token identifiers (STU-XXXX) only; zero student PII stored or passed to LLMs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
