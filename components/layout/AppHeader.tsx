'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { UserRole } from '@/lib/types';
import {
  GraduationCap,
  ShieldCheck,
  Sun,
  Moon,
  Compass,
  UserCheck,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { activeRole, setActiveRole, theme, toggleTheme } = useAppStore();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'leadership',
      label: 'Leadership',
      icon: <GraduationCap className="w-4 h-4" />,
      desc: 'Dean & Provost view: retention, equity & bottlenecks',
    },
    {
      role: 'advisor',
      label: 'Advisor / Mentor',
      icon: <Compass className="w-4 h-4" />,
      desc: 'Weekly prioritized caseload & intervention actions',
    },
    {
      role: 'student',
      label: 'Student',
      icon: <UserCheck className="w-4 h-4" />,
      desc: 'Supportive journey progress & next best actions',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: Branding & Dataset Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                EduPulse Success AI
              </span>
              <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300">
                Demo data
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Student Analytics & Supportive Early Warning Platform
            </p>
          </div>
        </div>

        {/* Center: Role Switcher */}
        <div className="hidden md:flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <span className="px-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            Active Role:
          </span>
          <div className="flex space-x-1">
            {roles.map((r) => {
              const isActive = activeRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setActiveRole(r.role)}
                  aria-label={`Switch role to ${r.label}`}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-sm font-semibold dark:bg-slate-700 dark:text-indigo-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                  title={r.desc}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: DPDP compliance badge & Theme toggle */}
        <div className="flex items-center space-x-2">
          {/* Mobile role select */}
          <div className="md:hidden">
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as UserRole)}
              className="text-xs rounded-lg border border-slate-300 bg-white py-1 px-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Select Role"
            >
              <option value="leadership">Leadership</option>
              <option value="advisor">Advisor</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>DPDP Act 2023 Audited</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light or dark theme"
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
