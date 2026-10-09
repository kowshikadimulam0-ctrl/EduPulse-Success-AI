'use client';

import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { getStudents } from '@/lib/data/students';
import { AppHeader } from '@/components/layout/AppHeader';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { DataExplorerView } from '@/components/data-explorer/DataExplorerView';
import { InsightsView } from '@/components/insights/InsightsView';
import { ModelEvaluationView } from '@/components/evaluation/ModelEvaluationView';
import { LeadershipDashboard } from '@/components/leadership/LeadershipDashboard';
import { AdvisorDashboard } from '@/components/advisor/AdvisorDashboard';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { GeminiAssistantView } from '@/components/gemini/GeminiAssistantView';
import { DemoHubView } from '@/components/demo/DemoHubView';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { PlaceholderView } from '@/components/layout/PlaceholderView';

export default function HomePage() {
  const { currentTab } = useAppStore();
  
  // Memoize students loaded from precomputed synthetic dataset
  const students = useMemo(() => {
    return getStudents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Skip to Content for Keyboard Accessibility (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-400 text-xs font-semibold"
      >
        Skip to main content
      </a>

      {/* Top Bar with Role Switcher & Theme Toggle */}
      <AppHeader />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        <SidebarNav />

        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          className="flex-1 min-w-0 overflow-y-auto focus:outline-hidden"
        >
          <ErrorBoundary
            fallbackTitle="Workspace View Error"
            fallbackMessage="An unexpected issue occurred while rendering this analytics module. You can reload or switch views safely."
          >
            {currentTab === 'demo-guide' ? (
              <DemoHubView students={students} />
            ) : currentTab === 'data-explorer' ? (
              <DataExplorerView students={students} />
            ) : currentTab === 'insights' ? (
              <InsightsView students={students} />
            ) : currentTab === 'evaluation' ? (
              <ModelEvaluationView students={students} initialTab="performance" />
            ) : currentTab === 'ethics' ? (
              <ModelEvaluationView students={students} initialTab="card" />
            ) : currentTab === 'overview' ? (
              <LeadershipDashboard students={students} />
            ) : currentTab === 'caseload' ? (
              <AdvisorDashboard students={students} />
            ) : currentTab === 'student-view' ? (
              <StudentDashboard students={students} />
            ) : currentTab === 'gemini-tools' ? (
              <GeminiAssistantView students={students} />
            ) : (
              <PlaceholderView tabId={currentTab} />
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
