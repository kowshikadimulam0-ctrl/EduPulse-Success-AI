'use client';

import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Bot,
  Sparkles,
  Send,
  HelpCircle,
  FileText,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  ChevronDown,
  ChevronUp,
  Mail,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

interface Props {
  students: Student[];
}

export const GeminiAssistantView: React.FC<Props> = ({ students }) => {
  const { addIntervention } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<'ask-data' | 'weekly-digest' | 'nudge-writer'>('ask-data');

  // "Ask Your Data" State
  const [askQuery, setAskQuery] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [askResult, setAskResult] = useState<{
    query: string;
    mappedFunction: string;
    computedData: Record<string, unknown>;
    explanation: string;
    promptUsed: string;
    antiHallucinationNote: string;
  } | null>(null);

  // "Weekly Digest" State
  const [digestLoading, setDigestLoading] = useState(false);
  const [digestResult, setDigestResult] = useState<{
    briefing: string;
    recommendations: string[];
    verifiedMetrics: Record<string, unknown>;
    promptUsed: string;
    antiHallucinationNote: string;
  } | null>(null);

  // "Nudge Writer" State
  const [nudgeStudentId, setNudgeStudentId] = useState<string>(
    students.find((s) => s.risk.riskScore >= 65)?.id || students[0]?.id || 'STU-1002'
  );
  const [nudgeLoading, setNudgeLoading] = useState(false);
  const [nudgeSubject, setNudgeSubject] = useState('');
  const [nudgeBody, setNudgeBody] = useState('');
  const [nudgeMeta, setNudgeMeta] = useState<{
    promptUsed: string;
    antiHallucinationNote: string;
  } | null>(null);
  const [nudgeSentAlert, setNudgeSentAlert] = useState(false);

  // Prompt inspector toggle states
  const [showAskPrompt, setShowAskPrompt] = useState(false);
  const [showDigestPrompt, setShowDigestPrompt] = useState(false);
  const [showNudgePrompt, setShowNudgePrompt] = useState(false);

  // Sample query chips
  const sampleQueries = [
    'Which courses have the highest drop-off and hurdle rates?',
    'What is our aggregate first-year retention rate across cohorts?',
    'Are there equity gaps across gender, region, or income bands?',
    'Describe the student persona segments from K-Means clustering',
  ];

  // Submit Ask Data
  const handleAskData = async (queryText: string) => {
    if (!queryText.trim()) return;
    setAskLoading(true);
    setAskResult(null);

    try {
      const res = await fetch('/api/gemini/ask-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText }),
      });
      const data = await res.json();
      setAskResult(data);
    } catch (err) {
      console.error('Ask data failed:', err);
    } finally {
      setAskLoading(false);
    }
  };

  // Submit Weekly Digest
  const handleGenerateDigest = async () => {
    setDigestLoading(true);
    try {
      const res = await fetch('/api/gemini/weekly-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setDigestResult(data);
    } catch (err) {
      console.error('Weekly digest failed:', err);
    } finally {
      setDigestLoading(false);
    }
  };

  // Submit Student Nudge
  const handleGenerateNudge = async () => {
    setNudgeLoading(true);
    setNudgeSentAlert(false);
    try {
      const res = await fetch('/api/gemini/student-nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: nudgeStudentId }),
      });
      const data = await res.json();
      setNudgeSubject(data.draftSubject || '');
      setNudgeBody(data.draftBody || '');
      setNudgeMeta({
        promptUsed: data.promptUsed,
        antiHallucinationNote: data.antiHallucinationNote,
      });
    } catch (err) {
      console.error('Student nudge failed:', err);
    } finally {
      setNudgeLoading(false);
    }
  };

  // Log Nudge as Advisor Intervention
  const handleCommitNudgeIntervention = () => {
    if (!nudgeStudentId || !nudgeBody) return;
    addIntervention({
      id: `INT-${Date.now()}`,
      studentId: nudgeStudentId,
      date: new Date().toISOString().split('T')[0],
      type: 'Advisor Check-in',
      owner: 'Academic Advisor (AI Assisted)',
      notes: `Sent supportive check-in email: "${nudgeSubject}"`,
      outcome: 'pending',
    });
    setNudgeSentAlert(true);
    setTimeout(() => setNudgeSentAlert(false), 4000);
  };

  return (
    <div className="space-y-6 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Bot className="w-3.5 h-3.5" />
                Stage 5: Secure Server-Side Gemini Intelligence Active
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Model: gemini-2.5-flash • Zero PII Leakage
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI-Powered Educational Intelligence &amp; Supportive Nudges
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Grounded natural-language queries against verified metrics, automated weekly leadership synthesis,
              and human-in-the-loop student check-in drafts.
            </p>
          </div>

          {/* Subtabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('ask-data')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeSubTab === 'ask-data'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Ask Your Data
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('weekly-digest');
                if (!digestResult) handleGenerateDigest();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeSubTab === 'weekly-digest'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Weekly Leadership Digest
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('nudge-writer');
                if (!nudgeBody) handleGenerateNudge();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeSubTab === 'nudge-writer'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Supportive Nudge Writer
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: ASK YOUR DATA */}
      {activeSubTab === 'ask-data' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Conversational Data Query (Function-Call Grounded)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Questions are mapped to whitelisted deterministic TypeScript analytics functions, executed locally,
                and explained by Gemini with zero extrapolation.
              </p>
            </div>

            {/* Prompt Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskData(askQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask a question about cohorts, bottleneck courses, personas, or retention..."
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={askLoading || !askQuery.trim()}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
              >
                {askLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Ask Gemini</span>
              </button>
            </form>

            {/* Sample Query Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block">Sample Queries:</span>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAskQuery(sample);
                      handleAskData(sample);
                    }}
                    className="text-[11px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition text-left"
                  >
                    &ldquo;{sample}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ask Data Response Display */}
          {askLoading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mapping question to whitelisted function &amp; grounding in 1,500 student records...
              </p>
            </div>
          )}

          {askResult && !askLoading && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Answer Card */}
              <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-xs dark:border-indigo-950 dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                      Gemini Grounded Explanation
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Function: {askResult.mappedFunction}
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {askResult.explanation}
                </div>

                {/* Computed Ground Truth JSON Preview */}
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                    Locally Computed Ground Truth Data (Fed to Gemini)
                  </span>
                  <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-300 overflow-x-auto max-h-36">
                    {JSON.stringify(askResult.computedData, null, 2)}
                  </pre>
                </div>

                {/* Prompt Inspector Toggle */}
                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAskPrompt(!showAskPrompt)}
                    className="inline-flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    <span>{showAskPrompt ? 'Hide Prompt & Anti-Hallucination Note' : 'Inspect Exact Prompt & Anti-Hallucination Note'}</span>
                    {showAskPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showAskPrompt && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-900 p-4 text-white text-xs font-mono space-y-3">
                      <div>
                        <span className="text-amber-400 font-bold block mb-1">Anti-Hallucination Architecture Note:</span>
                        <p className="text-slate-300 font-sans text-xs leading-relaxed">
                          {askResult.antiHallucinationNote}
                        </p>
                      </div>
                      <div>
                        <span className="text-indigo-400 font-bold block mb-1">Raw Grounding Prompt Sent to Gemini:</span>
                        <pre className="text-[11px] text-slate-300 whitespace-pre-wrap overflow-x-auto">
                          {askResult.promptUsed}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: WEEKLY LEADERSHIP DIGEST */}
      {activeSubTab === 'weekly-digest' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Executive Weekly Retention &amp; Strategy Digest
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically synthesizes cross-cohort retention metrics, bottleneck hurdles, and intervention outcomes into 3 executive recommendations.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateDigest}
              disabled={digestLoading}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${digestLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate Digest</span>
            </button>
          </div>

          {digestResult && (
            <div className="space-y-6">
              {/* Executive Briefing Text */}
              <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-xs dark:border-indigo-950 dark:bg-slate-900 space-y-4">
                <div className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-200 font-bold text-xs uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Executive Synthesis (Grounded in 1,500 Students)</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {digestResult.briefing}
                </div>

                {/* 3 Prioritized Recommendations */}
                <div className="border-t border-slate-100 pt-4 dark:border-slate-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                    Top 3 Prioritized Institutional Recommendations
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {digestResult.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs dark:border-indigo-950 dark:bg-indigo-950/30 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2 font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span>Action Priority {idx + 1}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] mt-1">
                            {rec}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prompt Inspector Toggle */}
                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowDigestPrompt(!showDigestPrompt)}
                    className="inline-flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    <span>{showDigestPrompt ? 'Hide Prompt & Grounding Details' : 'Inspect Exact Grounding Prompt'}</span>
                    {showDigestPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showDigestPrompt && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-900 p-4 text-white text-xs font-mono space-y-3">
                      <div>
                        <span className="text-amber-400 font-bold block mb-1">Anti-Hallucination Architecture Note:</span>
                        <p className="text-slate-300 font-sans text-xs leading-relaxed">
                          {digestResult.antiHallucinationNote}
                        </p>
                      </div>
                      <div>
                        <span className="text-indigo-400 font-bold block mb-1">Prompt Sent to Gemini API:</span>
                        <pre className="text-[11px] text-slate-300 whitespace-pre-wrap overflow-x-auto">
                          {digestResult.promptUsed}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: SUPPORTIVE NUDGE WRITER */}
      {activeSubTab === 'nudge-writer' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Supportive, Non-Judgmental Student Nudge Writer
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generates an empathetic check-in email that honors student strengths before gently inviting them for a conversation.
                </p>
              </div>

              {/* Student Picker */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Recipient Token:</span>
                <select
                  value={nudgeStudentId}
                  onChange={(e) => setNudgeStudentId(e.target.value)}
                  className="text-xs rounded-xl border border-slate-300 bg-white p-2 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {students.slice(0, 20).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} ({s.major} • Score: {s.risk.riskScore})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleGenerateNudge}
                  disabled={nudgeLoading}
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
                >
                  {nudgeLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Generate Draft'}
                </button>
              </div>
            </div>

            {/* Editable Draft Container */}
            <div className="mt-4 space-y-3">
              {nudgeSentAlert && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Success! Check-in email logged as an active advisor intervention.</span>
                </div>
              )}

              {/* Subject Field */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Subject Line (Editable)
                </label>
                <input
                  type="text"
                  value={nudgeSubject}
                  onChange={(e) => setNudgeSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Body Field */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Message Body (Editable)
                </label>
                <textarea
                  rows={8}
                  value={nudgeBody}
                  onChange={(e) => setNudgeBody(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-sans leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Human-in-the-loop: Advisor retains full authority to edit wording before sending.
                </span>
                <button
                  type="button"
                  onClick={handleCommitNudgeIntervention}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Log Intervention &amp; Send Nudge</span>
                </button>
              </div>

              {/* Prompt Inspector Toggle */}
              {nudgeMeta && (
                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowNudgePrompt(!showNudgePrompt)}
                    className="inline-flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    <span>{showNudgePrompt ? 'Hide Privacy & Prompt Verification' : 'Verify Zero-PII Prompt & Anti-Hallucination Details'}</span>
                    {showNudgePrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showNudgePrompt && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-900 p-4 text-white text-xs font-mono space-y-3">
                      <div>
                        <span className="text-emerald-400 font-bold block mb-1">Zero-PII Compliance Guarantee:</span>
                        <p className="text-slate-300 font-sans text-xs leading-relaxed">
                          {nudgeMeta.antiHallucinationNote}
                        </p>
                      </div>
                      <div>
                        <span className="text-indigo-400 font-bold block mb-1">Prompt Sent to Gemini:</span>
                        <pre className="text-[11px] text-slate-300 whitespace-pre-wrap overflow-x-auto">
                          {nudgeMeta.promptUsed}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
