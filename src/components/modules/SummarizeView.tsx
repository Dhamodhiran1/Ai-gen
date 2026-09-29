import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Copy, 
  Check, 
  Loader2, 
  Clock, 
  ListChecks, 
  BookMarked, 
  ArrowRight,
  HelpCircle,
  CheckSquare,
  Download
} from 'lucide-react';
import { SummarizeResponseData, SupportedLanguage, EduModuleId } from '../../types.ts';
import { exportSummarizePDF } from '../../utils/pdfExport.ts';
import { safePost } from '../../utils/apiClient.ts';

interface SummarizeViewProps {
  language: SupportedLanguage;
  onNavigateToModule: (moduleId: EduModuleId, initialPrompt?: string) => void;
  onStartRequest: (step: number, endpoint: string, query: string) => void;
  onCompleteRequest: () => void;
}

export const SummarizeView: React.FC<SummarizeViewProps> = ({
  language,
  onNavigateToModule,
  onStartRequest,
  onCompleteRequest,
}) => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState<'bullet_points' | 'tldr' | 'executive' | 'study_notes'>('bullet_points');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SummarizeResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const samplePassages = [
    {
      title: 'Operating Systems & Virtual Memory',
      content: `Virtual memory is a memory management technique where secondary memory can be used as if it were a part of the main memory. Virtual memory is a common technique used in a computer's operating system (OS). It uses both hardware and software to enable a computer to compensate for physical memory shortages by temporarily transferring data from random access memory (RAM) to disk storage. 

Mapping chunks of memory to disk files enables a computer to treat secondary memory as though it were main memory. Today, most personal computers (PCs) and servers come with more than enough physical memory to meet application demands. However, virtual memory can still be useful, for instance, when running multiple applications simultaneously, working with very large files, or dealing with burst memory requirements.

Virtual memory employs paging, where memory addresses are divided into fixed-size blocks called pages, and main memory is divided into corresponding page frames. When a program references a memory address that does not reside in physical RAM, a page fault occurs, prompting the OS to retrieve the page from swap space into RAM. While this enables massive flexibility and memory isolation between processes, excessive page swaps can lead to a performance degradation state known as thrashing.`,
    },
    {
      title: 'Photosynthesis & Solar Energy',
      content: `Photosynthesis is the fundamental biological process through which green plants, algae, and certain bacteria transform light energy into chemical energy stored in glucose molecules. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.

The process primarily occurs within plant leaves inside cellular organelles called chloroplasts, which contain the green pigment chlorophyll. Photosynthesis consists of two main stages: the Light-Dependent Reactions and the Light-Independent Reactions (also known as the Calvin Cycle). 

In the light-dependent reactions, which take place on the thylakoid membranes, photons strike chlorophyll molecules, exciting electrons and splitting water molecules into protons, oxygen gas (released as a byproduct), and electrons. This creates high-energy carrier molecules: ATP (adenosine triphosphate) and NADPH. In the Calvin cycle, occurring in the stroma of the chloroplast, enzymes use the chemical energy stored in ATP and NADPH to fix carbon dioxide from the atmosphere into three-carbon sugars, which are eventually synthesized into glucose and starch.`,
    },
    {
      title: 'Monetary Policy & Inflation',
      content: `Inflation is the rate at which the general level of prices for goods and services is rising and, consequently, the purchasing power of currency is falling. Central banks attempt to limit inflation, and avoid deflation, in order to keep the economy running smoothly.

When an economy experiences demand-pull inflation (where aggregate demand exceeds productive capacity) or cost-push inflation (where raw material and labor costs rise), central banks deploy contractionary monetary policy. The primary lever used is adjusting the benchmark interest rate. By raising interest rates, borrowing costs increase for commercial banks, consumers, and businesses. Mortgages, car loans, and business expansion credit become significantly more expensive, which cools down consumer spending and capital investment.

However, aggressive interest rate hikes carry the risk of over-tightening, leading to reduced business hiring, higher unemployment, and potentially triggering an economic recession. Conversely, during periods of economic slowdown, central banks lower interest rates and engage in quantitative easing to stimulate liquidity, encourage credit flow, and spur job creation.`,
    },
  ];

  const handleSummarize = async (contentToSummarize?: string) => {
    const targetText = contentToSummarize || text;
    if (!targetText.trim()) return;

    setLoading(true);
    setError(null);
    onStartRequest(2, '/summarize', targetText.slice(0, 50) + '...');

    try {
      onStartRequest(3, '/summarize', targetText.slice(0, 50) + '...');
      setTimeout(() => onStartRequest(4, '/summarize', targetText.slice(0, 50) + '...'), 300);

      const json = await safePost<{ success: boolean; data: SummarizeResponseData }>('/summarize', {
        text: targetText,
        style,
        language,
      });

      setData(json.data);
      onStartRequest(5, '/summarize', targetText.slice(0, 50) + '...');
      setTimeout(() => onCompleteRequest(), 400);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to summarize content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    const textOut = `${data.title}\n\nTL;DR:\n${data.tldr}\n\nKey Points:\n${data.bulletPoints.map(b => `• ${b}`).join('\n')}\n\nKey Concepts:\n${data.keyConcepts.map(k => `${k.term}: ${k.definition}`).join('\n')}\n\nActionable Takeaways:\n${data.actionableTakeaways.map(a => `→ ${a}`).join('\n')}`;
    navigator.clipboard.writeText(textOut);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">Summarization Module</h2>
              <span className="font-mono text-xs text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800/60">
                POST /summarize
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Periya paragraphs illa lessons-ah suthama short ah summary panni tharum (Condenses long chapters).
            </p>
          </div>

          {/* Style Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start">
            {(['bullet_points', 'tldr', 'study_notes', 'executive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition ${
                  style === s
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your long study notes, textbook paragraph, research paper abstract, or chapter here..."
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <span>Try with sample lesson:</span>
              {samplePassages.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setText(p.content);
                    handleSummarize(p.content);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-700 transition"
                >
                  {p.title}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleSummarize()}
              disabled={loading || !text.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Summarizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Summarize Lesson</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Output (Step 5) */}
      {data && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Header Card with Reading Time Saved */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-1 inline-block">
                  Summary Report
                </span>
                <h3 className="text-xl font-bold text-white">{data.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {data.readingTimeSaved}
                </span>
                <button
                  onClick={() => exportSummarizePDF(data)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs text-violet-300 hover:text-white bg-violet-950/60 hover:bg-violet-900/60 rounded-lg border border-violet-800/80 transition"
                  title="Download Summary PDF"
                >
                  <Download className="w-3.5 h-3.5 text-violet-400" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* TL;DR Callout */}
            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30">
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider block mb-1">
                TL;DR (Quick Takeaway)
              </span>
              <p className="text-sm text-slate-100 leading-relaxed font-medium">
                {data.tldr}
              </p>
            </div>
          </div>

          {/* Bullet Points & Key Concepts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Key Bullet Points */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-violet-400" />
                Structured Key Takeaways
              </h4>
              <ul className="space-y-2.5">
                {data.bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Concepts / Terminology */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-emerald-400" />
                Key Concepts & Glossary
              </h4>
              <div className="space-y-2.5">
                {data.keyConcepts.map((kc, i) => (
                  <div key={i} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs">
                    <strong className="text-emerald-300 block mb-0.5">{kc.term}</strong>
                    <span className="text-slate-300 leading-relaxed">{kc.definition}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Actionable Takeaways & Next Steps (Step 6) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" />
                Step 6: Practice & Test What You Learned
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {data.actionableTakeaways.map((at, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">→</span>
                    <span>{at}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigateToModule('quiz', data.title)}
                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Test on this Text</span>
              </button>
              <button
                onClick={() => onNavigateToModule('explain', data.title)}
                className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Deep Explain</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
