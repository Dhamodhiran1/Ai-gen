import React, { useState } from 'react';
import { 
  X, 
  Workflow, 
  Server, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Check, 
  Cpu, 
  Layout, 
  Sparkles, 
  RotateCw, 
  BookOpen, 
  HelpCircle, 
  CheckSquare, 
  FileText, 
  GitFork,
  Code2,
  Play,
  Loader2
} from 'lucide-react';
import { EduModuleId } from '../types.ts';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: EduModuleId;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  activeModule,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'tester' | 'code'>('flow');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(`/${activeModule === 'learn' ? 'learn/recommendations' : activeModule}`);
  const [copied, setCopied] = useState(false);

  // Live Tester State
  const [testPayload, setTestPayload] = useState<string>(
    JSON.stringify({ topic: 'Black Holes', level: 'beginner', language: 'tanglish' }, null, 2)
  );
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<number | null>(null);
  const [testTime, setTestTime] = useState<number | null>(null);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      badge: 'Step 1: Start',
      title: 'User opens EduGenie',
      tamil: 'User intha EduGenie app-ah open panranga.',
      detail: 'Client SPA initializes, verifies connectivity to the AI Gateway, loads active learning preferences & pre-warmed models.',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    },
    {
      step: 2,
      badge: 'Step 2: Frontend Input',
      title: 'User Input & Parameterization',
      tamil: 'User thangaluku enna venumo athana kelvigalaiyo illa text-aiyo input ah kodupanga.',
      detail: 'Form gathers prompt, target audience level, quiz difficulty, or study text. Validates input bounds client-side.',
      icon: <Layout className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    },
    {
      step: 3,
      badge: 'Step 3: Backend Gateway',
      title: 'FastAPI / Express API Router',
      tamil: 'User select panna option-ku yetharpola, avangaloda request antha specific endpoint-ku route aagum.',
      detail: 'Routes incoming HTTP POST request to the corresponding specialized micro-service / handler endpoint.',
      icon: <Server className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    },
    {
      step: 4,
      badge: 'Step 4: 5 Core Modules',
      title: 'Gemini 3.8 Flash AI Engine',
      tamil: 'Backend la intha 5 important modules vela seiyum: /explain, /qa, /quiz, /summarize, /learn/recommendations',
      detail: 'Enforces strict JSON schema validation, deep domain reasoning, and multi-language comprehension (English, Tamil, Tanglish).',
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
    },
    {
      step: 5,
      badge: 'Step 5: Frontend Display',
      title: 'Interactive Results Rendering',
      tamil: 'AI ready panna intha ellam answers-um marubadiyum screen la display aagum.',
      detail: 'Structured cards, interactive MCQ engine with scoring & confetti, roadmap timeline, and copyable study takeaways.',
      icon: <CheckCircle2 className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    },
    {
      step: 6,
      badge: 'Step 6: End & Feedback Loop',
      title: 'Review & Next Question',
      tamil: 'User result-ah paathutu, venum na adutha kelviya kekalam (Interactive Follow-up).',
      detail: 'One-click follow-up recommendations, retry quizzes, download revision notes, or branch to learning roadmap.',
      icon: <RotateCw className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    },
  ];

  const modulesList = [
    {
      name: 'Explanation Module',
      endpoint: '/explain',
      icon: <BookOpen className="w-4 h-4 text-sky-400" />,
      desc: 'Kashtamana topics-ah simple ah puriyurapola explain pannum.',
      defaultPayload: { topic: 'Quantum Computing', level: 'beginner', language: 'tanglish' },
      curl: `curl -X POST http://localhost:3000/explain \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "Quantum Computing", "level": "beginner", "language": "tanglish"}'`,
    },
    {
      name: 'Q&A Module',
      endpoint: '/qa',
      icon: <HelpCircle className="w-4 h-4 text-emerald-400" />,
      desc: 'User kekura kelvigaluku correct ah answer pannum.',
      defaultPayload: { question: 'Why is the sky blue?', language: 'english' },
      curl: `curl -X POST http://localhost:3000/qa \\
  -H "Content-Type: application/json" \\
  -d '{"question": "Why is the sky blue?", "language": "english"}'`,
    },
    {
      name: 'Quiz Generation Module',
      endpoint: '/quiz',
      icon: <CheckSquare className="w-4 h-4 text-amber-400" />,
      desc: 'Ethavathu topic la irunthu test athavathu quizzes-ah generate pannum.',
      defaultPayload: { topic: 'Python Data Structures', count: 3, difficulty: 'medium' },
      curl: `curl -X POST http://localhost:3000/quiz \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "Python Data Structures", "count": 3, "difficulty": "medium"}'`,
    },
    {
      name: 'Summarization Module',
      endpoint: '/summarize',
      icon: <FileText className="w-4 h-4 text-violet-400" />,
      desc: 'Periya paragraphs illa lessons-ah suthama short ah summary panni tharum.',
      defaultPayload: { text: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.', style: 'bullet_points' },
      curl: `curl -X POST http://localhost:3000/summarize \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Photosynthesis is the process...", "style": "bullet_points"}'`,
    },
    {
      name: 'Learning Path Module',
      endpoint: '/learn/recommendations',
      icon: <GitFork className="w-4 h-4 text-pink-400" />,
      desc: 'Oru topic-ah step-by-step ah padika personalized learning roadmaps-ah recommend pannum.',
      defaultPayload: { topic: 'Fullstack Web Development', currentLevel: 'beginner', pace: 'standard' },
      curl: `curl -X POST http://localhost:3000/learn/recommendations \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "Fullstack Web Development", "currentLevel": "beginner", "pace": "standard"}'`,
    },
  ];

  const currentModule = modulesList.find(m => m.endpoint === selectedEndpoint) || modulesList[0];

  const handleSelectEndpoint = (ep: string) => {
    setSelectedEndpoint(ep);
    const mod = modulesList.find(m => m.endpoint === ep);
    if (mod) {
      setTestPayload(JSON.stringify(mod.defaultPayload, null, 2));
    }
  };

  const handleRunLiveTest = async () => {
    setTestLoading(true);
    setTestResponse(null);
    setTestStatus(null);
    const start = performance.now();

    try {
      const parsedBody = JSON.parse(testPayload);
      const res = await fetch(selectedEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody),
      });

      const latency = Math.round(performance.now() - start);
      setTestTime(latency);
      setTestStatus(res.status);

      const json = await res.json();
      setTestResponse(json);
    } catch (err: any) {
      setTestResponse({ error: err.message || 'Failed to execute request' });
      setTestStatus(500);
    } finally {
      setTestLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Backend Architecture & Live Inspector
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  Online
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Inspect how the backend processes requests, test endpoints live, or inspect `/server.ts`
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'flow'
                ? 'border-indigo-500 text-white bg-indigo-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Architecture Flow (Steps 1-6)</span>
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'tester'
                ? 'border-emerald-500 text-white bg-emerald-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live API Tester & Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'code'
                ? 'border-amber-500 text-white bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Backend Code (`server.ts`)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: FLOW OVERVIEW */}
          {activeTab === 'flow' && (
            <>
              {/* Step-by-Step Visual Pipeline */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Execution Flow (Step 1 to Step 6)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {steps.map((s) => (
                    <div 
                      key={s.step} 
                      className={`p-4 rounded-xl border ${s.color} transition-all hover:scale-[1.01] flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/60 border border-current">
                            {s.badge}
                          </span>
                          {s.icon}
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
                        <p className="text-xs text-slate-300 font-medium italic mb-2">
                          "{s.tamil}"
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {s.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Endpoint Overview Cards */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-400" />
                      Step 4 Micro-Module Endpoints
                    </h4>
                    <p className="text-xs text-slate-400">
                      Select an endpoint to inspect routing, cURL invocation, and purpose
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {modulesList.map((m) => (
                      <button
                        key={m.endpoint}
                        onClick={() => handleSelectEndpoint(m.endpoint)}
                        className={`px-2.5 py-1 text-xs font-mono rounded-lg transition ${
                          selectedEndpoint === m.endpoint
                            ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {m.endpoint}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {currentModule.icon}
                      <span className="text-sm font-bold text-white">{currentModule.name}</span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        POST {currentModule.endpoint}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(currentModule.curl)}
                      className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy cURL'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 italic">
                    Tamil Guide: "{currentModule.desc}"
                  </p>

                  <div className="bg-slate-950 rounded-md p-3 border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mb-2">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      <span>Terminal / cURL Verification</span>
                    </div>
                    <pre className="text-[11px] font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
                      {currentModule.curl}
                    </pre>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: LIVE API TESTER */}
          {activeTab === 'tester' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-emerald-400" />
                    Live Backend Endpoint Tester
                  </h4>
                  <p className="text-xs text-slate-400">
                    Send real HTTP POST requests directly to the EduGenie backend and inspect headers, latency, and JSON output
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {modulesList.map((m) => (
                    <button
                      key={m.endpoint}
                      onClick={() => handleSelectEndpoint(m.endpoint)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-lg transition ${
                        selectedEndpoint === m.endpoint
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {m.endpoint}
                    </button>
                  ))}
                </div>
              </div>

              {/* Request & Response Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Request Box */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-300 font-bold">
                        POST {selectedEndpoint}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Content-Type: application/json
                      </span>
                    </div>
                    <textarea
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      rows={8}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
                    />
                  </div>

                  <button
                    onClick={handleRunLiveTest}
                    disabled={testLoading}
                    className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {testLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing in Backend...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Send Request to {selectedEndpoint}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Response Box */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-300 font-bold">
                        Backend Response
                      </span>
                      {testStatus !== null && (
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                            testStatus === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            HTTP {testStatus}
                          </span>
                          {testTime && (
                            <span className="text-[11px] font-mono text-slate-400">
                              {testTime}ms
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 max-h-56 overflow-y-auto leading-relaxed">
                      {testLoading ? (
                        <div className="flex items-center gap-2 text-slate-400 py-6 justify-center">
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Waiting for Express backend & Gemini inference...</span>
                        </div>
                      ) : testResponse ? (
                        <pre className="whitespace-pre-wrap text-[11px] text-emerald-300">
                          {JSON.stringify(testResponse, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-slate-500 italic">
                          Click "Send Request" to trigger this endpoint and inspect the returned JSON response.
                        </span>
                      )}
                    </div>
                  </div>

                  {testResponse && (
                    <button
                      onClick={() => handleCopy(JSON.stringify(testResponse, null, 2))}
                      className="mt-3 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 py-1.5 px-3 rounded-lg border border-slate-800 transition flex items-center justify-center gap-1.5 self-end"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Response JSON'}</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: BACKEND CODE VIEWER */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    Express Server Architecture (`server.ts`)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Full server-side code powering all 5 modules with Gemini 3.8 Flash and model fallback cascade
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                  server.ts
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  <span>File: /server.ts • TypeScript • Express + @google/genai</span>
                  <button
                    onClick={() => handleCopy('View root file /server.ts in workspace')}
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Location</span>
                  </button>
                </div>

                <div className="space-y-4 text-xs text-slate-300 font-mono leading-relaxed max-h-96 overflow-y-auto pr-2">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-indigo-400 font-bold block mb-1">1. Model Initialization:</span>
                    <pre className="text-[11px] text-slate-300 whitespace-pre">
{`const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];`}
                    </pre>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-emerald-400 font-bold block mb-1">2. Dedicated Micro-Routes:</span>
                    <pre className="text-[11px] text-slate-300 whitespace-pre">
{`app.post('/explain', handleExplain);
app.post('/qa', handleQA);
app.post('/quiz', handleQuiz);
app.post('/summarize', handleSummarize);
app.post('/learn/recommendations', handleLearningPath);
app.get('/api/architecture', ...);
app.get('/health', ...);`}
                    </pre>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
                    <span className="text-amber-400 font-bold block mb-1">3. Language Support:</span>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Prompts dynamically adapt to <strong>English</strong>, <strong>Tanglish</strong>, or <strong>Tamil</strong> based on client selection, enforcing structured JSON schemas with responseSchema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Viva / Presentation Highlights */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-violet-950/20 to-slate-900 border border-indigo-900/40 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-bold text-white text-sm">Viva & Review Talking Points:</div>
              <p>• <strong>Strict Modularity:</strong> Each learning objective is decoupled into a dedicated endpoint (`/explain`, `/qa`, `/quiz`, `/summarize`, `/learn/recommendations`).</p>
              <p>• <strong>Structured JSON Contracts:</strong> Guarantees deterministic frontend parsing with zero hallucinated UI errors.</p>
              <p>• <strong>Language Adaptability:</strong> Native Tamil and Tanglish prompting opens accessibility for students in regional education contexts.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition shadow-md shadow-indigo-600/30"
          >
            Close Architecture Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
