'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Application Error</h1>
          <p className="text-sm text-slate-600">
            A fatal error occurred while loading the application shell.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
