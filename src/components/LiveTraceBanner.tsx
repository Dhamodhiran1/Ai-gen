import React from 'react';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { EduModuleId } from '../types.ts';

interface LiveTraceBannerProps {
  currentStep: number;
  isLoading: boolean;
  moduleId: EduModuleId;
  endpoint: string;
  query: string;
}

export const LiveTraceBanner: React.FC<LiveTraceBannerProps> = ({
  currentStep,
  isLoading,
  moduleId: _moduleId,
  endpoint,
  query,
}) => {
  const steps = [
    { num: 1, label: 'Start' },
    { num: 2, label: 'User Input' },
    { num: 3, label: `Route (${endpoint})` },
    { num: 4, label: 'AI Inference' },
    { num: 5, label: 'Render' },
    { num: 6, label: 'Next Question' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Current Active Step Status */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-400 font-medium">Pipeline:</span>
          {isLoading ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30 text-[11px] animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
              Executing Step {currentStep}...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30 text-[11px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Step {currentStep} Active
            </span>
          )}
          {query && (
            <span className="text-slate-400 truncate max-w-[200px] hidden sm:inline" title={query}>
              "{query}"
            </span>
          )}
        </div>

        {/* Mini Step Tracker */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <React.Fragment key={s.num}>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors whitespace-nowrap ${
                    isCurrent
                      ? 'bg-indigo-600 text-white font-bold ring-1 ring-indigo-400'
                      : isCompleted
                      ? 'bg-slate-800 text-emerald-400'
                      : 'bg-slate-950/60 text-slate-500'
                  }`}
                >
                  <span>{s.num}.</span>
                  <span>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </div>
  );
};
