'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Universal React Error Boundary
 * Catches rendering exceptions gracefully and displays an accessible,
 * supportive recovery screen without crashing the whole application.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled component error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="m-4 md:m-8 p-6 md:p-8 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20 backdrop-blur-sm"
        >
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {this.props.fallbackTitle || 'Component Encountered a Problem'}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {this.props.fallbackMessage ||
                  'The analytics workspace experienced an unexpected issue while rendering this section. Your underlying data is safe.'}
              </p>

              {this.state.error && (
                <div className="mt-4 p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-rose-100 dark:border-rose-900/30 text-xs font-mono text-rose-700 dark:text-rose-300 overflow-x-auto">
                  {this.state.error.message || 'Unknown error occurred'}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleReload}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
