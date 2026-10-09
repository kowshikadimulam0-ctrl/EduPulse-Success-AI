'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Database,
} from 'lucide-react';

interface Props {
  tabId: string;
}

const TAB_METADATA: Record<
  string,
  { title: string; stage: string; desc: string; upcomingFeatures: string[] }
> = {
  overview: {
    title: 'Leadership & Institutional Retention View',
    stage: 'Stage 4 (Engine in Stage 2)',
    desc: 'Empowers Deans, Provosts, and Department Chairs to identify multi-year retention trajectories, drop-off funnels, and gateway course bottlenecks.',
    upcomingFeatures: [
      'Multi-cohort retention matrix (2021 to 2024)',
      'Funnel analysis tracking transition from admission to degree completion',
      'High-impact bottleneck courses with low pass rates (e.g. CS-101, DS-102)',
      'K-Means student engagement personas (e.g. Self-Directed, High-Potential, In Need of Reinforcement)',
    ],
  },
  caseload: {
    title: 'Advisor Prioritized Caseload & Intervention Tracker',
    stage: 'Stage 4 (Scoring Engine in Stage 3)',
    desc: 'Provides academic advisors with a weekly triage list sorted by support urgency, with plain-English drivers for each student.',
    upcomingFeatures: [
      'Top 3 driving factors in clear, empathetic language',
      'Actionable intervention modal (Tutoring, 1-on-1 check-in, Peer mentoring)',
      'Intervention tracking with measured resolution rates',
      'Direct link to student 4-year course trajectory',
    ],
  },
  'student-view': {
    title: 'Student Self-Advocacy & Journey Hub',
    stage: 'Stage 4',
    desc: 'Presents students with an empowering, asset-based dashboard that highlights personal strengths, milestones, and actionable next steps without deficit labeling.',
    upcomingFeatures: [
      'Strengths-first recognition of attendance and milestones',
      'Targeted, supportive study tips and office hour links',
      'Upcoming milestone radar and credit completion tracker',
      'Private, constructive nudges with advisor contact',
    ],
  },
  'gemini-tools': {
    title: 'Gemini AI Assistant & Supportive Nudges',
    stage: 'Stage 5',
    desc: 'Server-side LLM intelligence providing conversational natural language data queries, automated leadership digests, and empathetic advisor draft emails.',
    upcomingFeatures: [
      '“Ask Your Data” Q&A powered by Gemini API route handlers',
      'Zero PII leakage: anonymized IDs and aggregated stats only',
      'Human-in-the-loop advisor nudge editor before sending',
      'Weekly executive summary for academic deans',
    ],
  },
  ethics: {
    title: 'Algorithmic Fairness & DPDP Act 2023 Model Card',
    stage: 'Stage 6 (Fairness Auditor in Stage 3)',
    desc: 'Transparent accountability documentation covering data provenance, feature isolation, and fairness audits across gender, region, and first-gen status.',
    upcomingFeatures: [
      'Strict separation: demographic data used solely for equity audits, never risk inputs',
      'Disparate impact ratio and equal opportunity difference metrics',
      'Compliance principles with India’s Digital Personal Data Protection Act 2023',
      '“How this score works” methodology explainer',
    ],
  },
};

export const PlaceholderView: React.FC<Props> = ({ tabId }) => {
  const { setCurrentTab } = useAppStore();
  const meta = TAB_METADATA[tabId] || {
    title: 'Upcoming Module',
    stage: 'Upcoming Stage',
    desc: 'This module is scheduled in the incremental development roadmap.',
    upcomingFeatures: ['Feature scaffolding underway.'],
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Layers className="w-3.5 h-3.5" />
            <span>Scheduled for {meta.stage}</span>
          </div>
          <span className="flex items-center space-x-1 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Ready in roadmap</span>
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {meta.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {meta.desc}
        </p>

        <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Planned Components in this Stage:
          </h3>
          <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {meta.upcomingFeatures.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-700 dark:border-slate-800/80 dark:bg-slate-800/40 dark:text-slate-300"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Active Stage 1 Features are Ready!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect the seeded 1,500 student dataset and sanity-check charts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentTab('data-explorer')}
            className="inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Open Data Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
