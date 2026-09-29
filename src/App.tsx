/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckSquare, 
  FileText, 
  GitFork, 
  Workflow, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { EduModuleId, SupportedLanguage } from './types.ts';
import { Header } from './components/Header.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { ScenarioLauncher } from './components/ScenarioLauncher.tsx';
import { LiveTraceBanner } from './components/LiveTraceBanner.tsx';
import { ExplainView } from './components/modules/ExplainView.tsx';
import { QAView } from './components/modules/QAView.tsx';
import { QuizView } from './components/modules/QuizView.tsx';
import { SummarizeView } from './components/modules/SummarizeView.tsx';
import { LearningPathView } from './components/modules/LearningPathView.tsx';

export default function App() {
  const [activeModule, setActiveModule] = useState<EduModuleId>('explain');
  const [language, setLanguage] = useState<SupportedLanguage>('english');
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Live pipeline state tracking (Steps 1 to 6)
  const [pipelineStep, setPipelineStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeQuery, setActiveQuery] = useState<string>('');

  // Cross-module initial query propagation
  const [moduleInitialQuery, setModuleInitialQuery] = useState<string>('');

  const handleStartRequest = (step: number, _endpoint: string, query: string) => {
    setPipelineStep(step);
    setIsLoading(step < 5);
    setActiveQuery(query);
  };

  const handleCompleteRequest = () => {
    setPipelineStep(6);
    setIsLoading(false);
  };

  const handleNavigateToModule = (moduleId: EduModuleId, initialPrompt?: string) => {
    setActiveModule(moduleId);
    if (initialPrompt) {
      setModuleInitialQuery(initialPrompt);
    } else {
      setModuleInitialQuery('');
    }
    setPipelineStep(2);
  };

  const endpointMap: Record<EduModuleId, string> = {
    explain: '/explain',
    qa: '/qa',
    quiz: '/quiz',
    summarize: '/summarize',
    learn: '/learn/recommendations',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeModule={activeModule}
        onSelectModule={(id) => {
          setActiveModule(id);
          setModuleInitialQuery('');
          setPipelineStep(2);
        }}
        language={language}
        onSelectLanguage={setLanguage}
        onOpenArchitecture={() => setShowArchitecture(true)}
        onOpenAbout={() => setShowAbout(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Real-time Technical Architecture Step Tracer */}
        <LiveTraceBanner
          currentStep={pipelineStep}
          isLoading={isLoading}
          moduleId={activeModule}
          endpoint={endpointMap[activeModule]}
          query={activeQuery}
        />

        {/* Hero Banner with Quick Description of the Architecture */}
        <div className="mb-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                EduGenie — AI-Powered Educational Assistant
              </h1>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Simplifies learning through generative AI. Designed for students of all academic levels: Ask smart questions, understand complex concepts, generate quizzes, receive personalized learning paths, and summarize educational passages.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowAbout(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Project Abstract</span>
            </button>
            <button
              onClick={() => setShowArchitecture(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs font-semibold text-amber-300 hover:text-amber-200 transition flex items-center gap-1.5 shadow-sm"
            >
              <Workflow className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspect Flow</span>
            </button>
          </div>
        </div>

        {/* 3 Official Test Scenarios Quick Launcher */}
        <ScenarioLauncher onSelectScenario={handleNavigateToModule} />

        {/* Active Module Content */}
        {activeModule === 'explain' && (
          <ExplainView
            language={language}
            onNavigateToModule={handleNavigateToModule}
            onStartRequest={handleStartRequest}
            onCompleteRequest={handleCompleteRequest}
          />
        )}

        {activeModule === 'qa' && (
          <QAView
            initialQuestion={moduleInitialQuery}
            language={language}
            onNavigateToModule={handleNavigateToModule}
            onStartRequest={handleStartRequest}
            onCompleteRequest={handleCompleteRequest}
          />
        )}

        {activeModule === 'quiz' && (
          <QuizView
            initialTopic={moduleInitialQuery}
            language={language}
            onNavigateToModule={handleNavigateToModule}
            onStartRequest={handleStartRequest}
            onCompleteRequest={handleCompleteRequest}
          />
        )}

        {activeModule === 'summarize' && (
          <SummarizeView
            language={language}
            onNavigateToModule={handleNavigateToModule}
            onStartRequest={handleStartRequest}
            onCompleteRequest={handleCompleteRequest}
          />
        )}

        {activeModule === 'learn' && (
          <LearningPathView
            initialTopic={moduleInitialQuery}
            language={language}
            onNavigateToModule={handleNavigateToModule}
            onStartRequest={handleStartRequest}
            onCompleteRequest={handleCompleteRequest}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>EduGenie Full-Stack AI System</span>
            <span>•</span>
            <span className="font-mono text-slate-500">FastAPI / Express API Gateway</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button 
              onClick={() => setShowArchitecture(true)}
              className="text-indigo-400 hover:text-indigo-300 transition"
            >
              Step-by-Step Architecture Guide
            </button>
            <span>•</span>
            <span className="text-slate-400">English / தமிழ் / Tanglish Ready</span>
          </div>
        </div>
      </footer>

      {/* Technical Architecture Modal */}
      <ArchitectureModal
        isOpen={showArchitecture}
        onClose={() => setShowArchitecture(false)}
        activeModule={activeModule}
      />

      {/* About EduGenie Project Specifications Modal */}
      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        onSelectScenario={handleNavigateToModule}
      />
    </div>
  );
}
