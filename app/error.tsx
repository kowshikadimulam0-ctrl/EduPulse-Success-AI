'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js route error captured:', error);
  }, [error]);

  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-slate-50 p-4 dark:bg-slate-950"
    >
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            EduPulse encountered an issue processing the requested analytics view. We have logged
            this event and your session state is intact.
          </p>
        </div>

        {error.message && (
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs font-mono text-slate-700 dark:text-slate-300 text-left overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
