import React from 'react';
import { 
  Compass, 
  HelpCircle, 
  CheckSquare, 
  GitFork, 
  Sparkles, 
  ArrowRight,
  Laptop
} from 'lucide-react';
import { EduModuleId } from '../types.ts';

interface ScenarioLauncherProps {
  onSelectScenario: (moduleId: EduModuleId, prompt: string) => void;
}

export const ScenarioLauncher: React.FC<ScenarioLauncherProps> = ({
  onSelectScenario,
}) => {
  const scenarios = [
    {
      id: 1,
      badge: 'Scenario 1 • Q&A',
      title: 'Oceans & Rivers Inquiry',
      description: 'A student wants to know about oceans and rivers uses EduGenie to ask:',
      prompt: 'Which is the largest ocean?',
      moduleId: 'qa' as EduModuleId,
      icon: <HelpCircle className="w-4 h-4 text-emerald-400" />,
      tag: 'POST /qa',
      color: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10 hover:bg-emerald-950/20 text-emerald-300',
    },
    {
      id: 2,
      badge: 'Scenario 2 • Quiz Test',
      title: 'Pythagoras Self-Assessment',
      description: 'A student tests her mathematical understanding and clicks "Generate Quiz":',
      prompt: 'The Pythagoras Theorem',
      moduleId: 'quiz' as EduModuleId,
      icon: <CheckSquare className="w-4 h-4 text-amber-400" />,
      tag: 'POST /quiz',
      color: 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/10 hover:bg-amber-950/20 text-amber-300',
    },
    {
      id: 3,
      badge: 'Scenario 3 • Learning Path',
      title: 'SQL Structured Roadmap',
      description: 'A learner requests a structured plan with beginner to advanced topics & timelines:',
      prompt: 'SQL & Relational Databases',
      moduleId: 'learn' as EduModuleId,
      icon: <GitFork className="w-4 h-4 text-pink-400" />,
      tag: 'POST /learn/recommendations',
      color: 'border-pink-500/30 hover:border-pink-500/60 bg-pink-950/10 hover:bg-pink-950/20 text-pink-300',
    },
  ];

  return (
    <div className="mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Compass className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Official Project Test Scenarios (1-Click Run)
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            Live Demo
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Laptop className="w-3.5 h-3.5 text-slate-400" />
          <span>Optimized for Mac M1, PC & Mobile</span>
        </div>
      </div>

      {/* 3 Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            onClick={() => onSelectScenario(sc.moduleId, sc.prompt)}
            className={`group p-3.5 rounded-xl border ${sc.color} transition-all duration-200 cursor-pointer flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/60 border border-current">
                  {sc.badge}
                </span>
                <span className="font-mono text-[10px] text-slate-400 opacity-70">
                  {sc.tag}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white group-hover:text-indigo-200 transition mb-1">
                {sc.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                {sc.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold">
              <span className="text-white truncate max-w-[180px]">
                "{sc.prompt}"
              </span>
              <div className="flex items-center gap-1 text-[11px] opacity-80 group-hover:opacity-100 transition shrink-0 ml-1">
                <span>Run</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
