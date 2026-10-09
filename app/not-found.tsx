import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Page Not Found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The requested student analytics route or view does not exist.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
