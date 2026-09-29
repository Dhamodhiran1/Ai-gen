import React from 'react';
import { 
  X, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  CheckSquare, 
  GitFork, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  Laptop
} from 'lucide-react';
import { EduModuleId } from '../types.ts';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (moduleId: EduModuleId, prompt: string) => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                About EduGenie
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Project Specification
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Lightweight AI-powered educational assistant designed for students of all academic levels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Main Abstract Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-violet-950/20 to-slate-900 border border-indigo-900/40 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Project Mission
            </h3>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
              EduGenie is a lightweight AI-powered educational assistant that simplifies learning through generative AI. Designed for students of all academic levels, EduGenie empowers learners to easily conquer difficult subjects, test their knowledge, and map their educational growth.
            </p>
          </div>

          {/* 5 Core Capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              5 Core Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Smart & Concise Q&A</strong>
                  <span className="text-slate-400 text-[11px]">Ask questions and receive smart, concise, and structured answers.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Simplified Explanations</strong>
                  <span className="text-slate-400 text-[11px]">Understand complex concepts through analogies and multi-level explanations.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Quizzes from Topics or Text</strong>
                  <span className="text-slate-400 text-[11px]">Generate interactive quizzes from either subject topics or textbook paragraphs.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <GitFork className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Personalized Learning Paths</strong>
                  <span className="text-slate-400 text-[11px]">Receive step-by-step roadmaps with beginner to advanced timelines & projects.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 sm:col-span-2">
                <FileText className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Educational Summarization</strong>
                  <span className="text-slate-400 text-[11px]">Summarize large educational passages, textbooks, and revision notes into high-impact TL;DRs and key takeaways.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture & Device Performance */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Laptop className="w-4 h-4 text-indigo-400" />
                <span>Architecture & Device Compatibility</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Built with a FastAPI / Express backend gateway and a responsive frontend. EduGenie leverages lightweight and cloud-based AI models for local efficiency and cloud power. It runs smoothly on devices like the <strong>Mac M1</strong>, ensuring broad accessibility for learners and developers.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-semibold">
                Mac M1 Ready
              </span>
            </div>
          </div>

          {/* 3 Test Scenarios Quick Run */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Test the 3 Official Scenarios
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onSelectScenario('qa', 'Which is the largest ocean?');
                }}
                className="w-full p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between group transition"
              >
                <div>
                  <strong className="text-emerald-300 block text-xs">Scenario 1: Oceans & Rivers</strong>
                  <span className="text-slate-400 text-[11px]">Student asks: "Which is the largest ocean?"</span>
                </div>
                <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition">Run Scenario →</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSelectScenario('quiz', 'The Pythagoras Theorem');
                }}
                className="w-full p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between group transition"
              >
                <div>
                  <strong className="text-amber-300 block text-xs">Scenario 2: Pythagoras Theorem Quiz</strong>
                  <span className="text-slate-400 text-[11px]">Student tests her understanding with "Generate Quiz"</span>
                </div>
                <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition">Run Scenario →</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSelectScenario('learn', 'SQL & Relational Databases');
                }}
                className="w-full p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between group transition"
              >
                <div>
                  <strong className="text-pink-300 block text-xs">Scenario 3: SQL Structured Learning Path</strong>
                  <span className="text-slate-400 text-[11px]">Beginner to advanced topics, timelines, and projects</span>
                </div>
                <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition">Run Scenario →</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
