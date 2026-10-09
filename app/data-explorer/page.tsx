'use client';

import React, { useMemo } from 'react';
import { getStudents } from '@/lib/data/students';
import { AppHeader } from '@/components/layout/AppHeader';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { DataExplorerView } from '@/components/data-explorer/DataExplorerView';

export default function DataExplorerPage() {
  const students = useMemo(() => {
    return getStudents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <AppHeader />
      <div className="flex-1 flex flex-col md:flex-row">
        <SidebarNav />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <DataExplorerView students={students} />
        </main>
      </div>
    </div>
  );
}
