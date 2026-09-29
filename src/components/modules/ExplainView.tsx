import React, { useState } from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  Layers, 
  HelpCircle,
  CheckSquare,
  Download
} from 'lucide-react';
import { ExplainResponseData, SupportedLanguage, EduModuleId } from '../../types.ts';
import { exportExplanationPDF } from '../../utils/pdfExport.ts';

interface ExplainViewProps {
  language: SupportedLanguage;
  onNavigateToModule: (moduleId: EduModuleId, initialPrompt?: string) => void;
  onStartRequest: (step: number, endpoint: string, query: string) => void;
  onCompleteRequest: () => void;
}

export const ExplainView: React.FC<ExplainViewProps> = ({
  language,
  onNavigateToModule,
  onStartRequest,
  onCompleteRequest,
}) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'elif5'>('intermediate');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExplainResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const presets = [
    'Quantum Computing & Qubits',
    'Transformer Attention Mechanism in AI',
    'Recursion & Call Stack in Programming',
    'Photosynthesis & Energy Conversion',
    'Inflation & Central Bank Interest Rates',
  ];

  const handleExplain = async (selectedTopic?: string) => {
    const targetTopic = selectedTopic || topic;
    if (!targetTopic.trim()) return;

    setLoading(true);
    setError(null);
    onStartRequest(2, '/explain', targetTopic);

    try {
      // Transition to Step 3: Routing & Step 4: AI Inference
      onStartRequest(3, '/explain', targetTopic);
      setTimeout(() => onStartRequest(4, '/explain', targetTopic), 300);

      const res = await fetch('/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          level,
          language,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const json = await res.json();
      setData(json.data);
      onStartRequest(5, '/explain', targetTopic);
      setTimeout(() => onCompleteRequest(), 400);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to explain topic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    const text = `${data.title}\n\nSummary:\n${data.summary}\n\nAnalogy:\n${data.simpleAnalogy}\n\nKey Points:\n${data.keyPoints.map(p => `• ${p}`).join('\n')}\n\nDetailed Explanation:\n${data.detailedExplanation}\n\nReal-World Example:\n${data.realWorldExample}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">Explanation Module</h2>
              <span className="font-mono text-xs text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                POST /explain
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Kashtamana topics-ah simple ah puriyurapola explain pannum (Simplifies complex topics with analogies).
            </p>
          </div>

          {/* Level Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start">
            {(['elif5', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition ${
                  level === lvl
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'elif5' ? 'Explain Like I\'m 5' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
              placeholder="e.g. Quantum Computing, Photosynthesis, How an Engine Works, Blockchain..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
          <button
            onClick={() => handleExplain()}
            disabled={loading || !topic.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Explaining...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Explain Topic</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Try asking:</span>
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => {
                setTopic(p);
                handleExplain(p);
              }}
              className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display (Step 5) */}
      {data && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Header Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1 inline-block">
                  Concept Breakdown
                </span>
                <h3 className="text-2xl font-extrabold text-white">{data.title}</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed font-medium">
                  {data.summary}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => exportExplanationPDF(data)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900/60 rounded-lg border border-sky-800/80 transition"
                  title="Download formatted PDF"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Lesson'}</span>
                </button>
              </div>
            </div>

            {/* Analogy Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-start gap-3 mt-4">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  Simple Everyday Analogy
                </h4>
                <p className="text-sm text-amber-100/90 leading-relaxed italic">
                  "{data.simpleAnalogy}"
                </p>
              </div>
            </div>
          </div>

          {/* Key Points & Deep Dive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Key Mechanics */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Core How It Works (Step-by-Step)
              </h4>
              <ul className="space-y-3">
                {data.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* In-Depth Explanation & Real World Example */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-2">
                  Detailed Explanation
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {data.detailedExplanation}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Real-World Scenario / Use Case
                </h5>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {data.realWorldExample}
                </p>
              </div>
            </div>

          </div>

          {/* Common Misconceptions & Recommended Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Misconceptions */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Common Misconceptions to Avoid
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {data.commonMisconceptions.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps / Step 6 Feedback Loop */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Step 6: Explore Next (adutha kelvi)
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  Click any question to ask in Q&A or generate a quiz on this topic:
                </p>
                <div className="space-y-2">
                  {data.recommendedNextSteps.map((next, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigateToModule('qa', next)}
                      className="w-full text-left p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 hover:text-white transition flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">{next}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0 transition" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons to Jump Modules */}
              <div className="flex gap-2 pt-4 border-t border-slate-800/80 mt-4">
                <button
                  onClick={() => onNavigateToModule('quiz', data.topic)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Test me with a Quiz</span>
                </button>
                <button
                  onClick={() => onNavigateToModule('qa', `Tell me more about ${data.topic}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask Q&A</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
