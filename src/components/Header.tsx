import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  CheckSquare, 
  FileText, 
  GitFork, 
  Workflow, 
  Globe2 
} from 'lucide-react';
import { EduModuleId, SupportedLanguage } from '../types.ts';

interface HeaderProps {
  activeModule: EduModuleId;
  onSelectModule: (id: EduModuleId) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onOpenArchitecture: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  language,
  onSelectLanguage,
  onOpenArchitecture,
  onOpenAbout,
}) => {
  const modules: Array<{ id: EduModuleId; name: string; endpoint: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'explain', name: 'Explanation', endpoint: '/explain', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'qa', name: 'Q&A Module', endpoint: '/qa', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'quiz', name: 'Quiz Generator', endpoint: '/quiz', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'summarize', name: 'Summarizer', endpoint: '/summarize', icon: <FileText className="w-4 h-4" /> },
    { id: 'learn', name: 'Learning Path', endpoint: '/learn/recommendations', icon: <GitFork className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  EduGenie
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-md">
                  AI v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                5-Module Smart Learning Engine
              </p>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            {modules.map((m) => {
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectModule(m.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {m.icon}
                  <span>{m.name}</span>
                  <span className={`text-[10px] font-mono opacity-60 hidden lg:inline ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {m.endpoint}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
              <select
                value={language}
                onChange={(e) => onSelectLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-slate-200 text-xs font-medium py-1 pr-2 pl-0.5 focus:outline-none cursor-pointer"
                title="Select Response Language"
              >
                <option value="english" className="bg-slate-900 text-slate-200">English</option>
                <option value="tanglish" className="bg-slate-900 text-slate-200">Tanglish (தமிழ் in English)</option>
                <option value="tamil" className="bg-slate-900 text-slate-200">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* About EduGenie Project Specs Button */}
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition"
              title="View Project Specifications & Mac M1 Overview"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">About</span>
            </button>

            {/* Technical Flow / Architecture Button */}
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition shadow-sm hover:shadow-amber-500/10"
              title="View Technical Architecture & Step-by-Step Flow"
            >
              <Workflow className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Technical Architecture</span>
            </button>
          </div>

        </div>

        {/* Mobile Module Nav */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {modules.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {m.icon}
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
