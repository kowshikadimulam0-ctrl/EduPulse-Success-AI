'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  BarChart3,
  Users2,
  GraduationCap,
  Database,
  TrendingUp,
  Activity,
  Bot,
  Scale,
  Sparkles,
  CheckCircle2,
  Layers,
  BookOpen,
} from 'lucide-react';

export const SidebarNav: React.FC = () => {
  const { currentTab, setCurrentTab, activeRole } = useAppStore();

  const navItems = [
    {
      id: 'demo-guide',
      label: 'Demo Story & Pitch',
      badge: 'Stage 6 Live',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold',
      icon: <BookOpen className="w-4 h-4" />,
      desc: 'Priya story, 10 slides, Q&A & tests',
    },
    {
      id: 'data-explorer',
      label: 'Data Explorer',
      badge: 'Stage 1 Live',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      icon: <Database className="w-4 h-4" />,
      desc: '1,500 records & sanity charts',
    },
    {
      id: 'insights',
      label: 'Analytics & Patterns',
      badge: 'Stage 2 Live',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      icon: <TrendingUp className="w-4 h-4" />,
      desc: 'Cohorts, funnels, bottlenecks & K-means',
    },
    {
      id: 'evaluation',
      label: 'Model Evaluation & ROC',
      badge: 'Stage 3 Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      icon: <Activity className="w-4 h-4" />,
      desc: 'Holdout precision, recall & ROC-AUC',
    },
    {
      id: 'ethics',
      label: 'DPDP Model Card & Audit',
      badge: 'Stage 3 Live',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      icon: <Scale className="w-4 h-4" />,
      desc: 'Algorithmic fairness & demographic audit',
    },
    {
      id: 'overview',
      label: 'Leadership View',
      badge: 'Stage 4 Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      icon: <BarChart3 className="w-4 h-4" />,
      desc: 'Retention cohorts & bottlenecks',
    },
    {
      id: 'caseload',
      label: 'Advisor Caseload',
      badge: 'Stage 4 Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      icon: <Users2 className="w-4 h-4" />,
      desc: 'Prioritized queue & intervention logger',
    },
    {
      id: 'student-view',
      label: 'Student Journey Hub',
      badge: 'Stage 4 Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      icon: <GraduationCap className="w-4 h-4" />,
      desc: 'Self-advocacy & strengths cards',
    },
    {
      id: 'gemini-tools',
      label: 'Gemini AI Assistant',
      badge: 'Stage 5 Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      icon: <Bot className="w-4 h-4" />,
      desc: 'Ask data & supportive nudges',
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-slate-200 bg-white p-4 flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        <div>
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs dark:bg-indigo-950/40 dark:text-indigo-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Current Active Role Context Note */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-violet-50/50 p-3 dark:border-indigo-950/60 dark:from-indigo-950/20 dark:to-violet-950/10">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Active Perspective</span>
          </div>
          <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-300 capitalize">
            Role: <strong>{activeRole}</strong>
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            Tone, metrics, and actions dynamically adapt to the active role.
          </p>
        </div>
      </div>

      {/* Stage Progress Card */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Milestone Tracker</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            Stage 6 / 6
          </span>
        </div>
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
          Production Platform Complete &amp; Audited
        </p>
        <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden dark:bg-slate-700">
          <div className="bg-emerald-500 h-full w-[100%] rounded-full transition-all duration-500"></div>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          <span>Tests, Error Boundaries &amp; Pitch Ready</span>
        </p>
      </div>
    </aside>
  );
};
