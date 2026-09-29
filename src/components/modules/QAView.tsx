import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  Sparkles, 
  AlertCircle, 
  Copy, 
  Check, 
  Loader2, 
  MessageSquare, 
  Lightbulb, 
  ArrowRight, 
  FileText,
  BookmarkCheck,
  Download
} from 'lucide-react';
import { QAResponseData, SupportedLanguage, EduModuleId } from '../../types.ts';
import { exportQAPDF } from '../../utils/pdfExport.ts';
import { safePost } from '../../utils/apiClient.ts';

interface QAViewProps {
  initialQuestion?: string;
  language: SupportedLanguage;
  onNavigateToModule: (moduleId: EduModuleId, initialPrompt?: string) => void;
  onStartRequest: (step: number, endpoint: string, query: string) => void;
  onCompleteRequest: () => void;
}

export const QAView: React.FC<QAViewProps> = ({
  initialQuestion = '',
  language,
  onNavigateToModule: _onNavigateToModule,
  onStartRequest,
  onCompleteRequest,
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [context, setContext] = useState('');
  const [showContextInput, setShowContextInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QAResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync if initialQuestion changed from external click
  React.useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
      handleAsk(initialQuestion);
    }
  }, [initialQuestion]);

  const sampleQuestions = [
    'Which is the largest ocean?',
    'What is the longest river in the world?',
    'What is the difference between SQL and NoSQL databases?',
    'Why does time slow down near a black hole?',
    'How do computers convert 0s and 1s into graphics?',
  ];

  const handleAsk = async (queryToAsk?: string) => {
    const targetQ = queryToAsk || question;
    if (!targetQ.trim()) return;

    setLoading(true);
    setError(null);
    onStartRequest(2, '/qa', targetQ);

    try {
      onStartRequest(3, '/qa', targetQ);
      setTimeout(() => onStartRequest(4, '/qa', targetQ), 300);

      const json = await safePost<{ success: boolean; data: QAResponseData }>('/qa', {
        question: targetQ,
        context: context.trim() || undefined,
        language,
      });

      setData(json.data);
      onStartRequest(5, '/qa', targetQ);
      setTimeout(() => onCompleteRequest(), 400);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to answer question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    const text = `Question: ${data.question}\n\nDirect Answer: ${data.directAnswer}\n\nDetailed Breakdown:\n${data.detailedBreakdown.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\nKey Takeaway: ${data.keyTakeaway}\nPractical Tip: ${data.practicalTip}`;
    navigator.clipboard.writeText(text);
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
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <HelpCircle className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">Q&A Module</h2>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                POST /qa
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              User kekura kelvigaluku correct ah answer pannum (Precision answers with step-by-step logic).
            </p>
          </div>

          <button
            onClick={() => setShowContextInput(!showContextInput)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 self-start"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showContextInput ? 'Hide Reference Passage' : '+ Add Reference Text / Context'}</span>
          </button>
        </div>

        {/* Optional Context Field */}
        {showContextInput && (
          <div className="mb-3 animate-in fade-in duration-200">
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste book excerpt, problem description, code snippet or exam context (optional)..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Question Input */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask anything educational or technical..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Get Answer</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Questions */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Quick examples:</span>
          {sampleQuestions.map((sq) => (
            <button
              key={sq}
              onClick={() => {
                setQuestion(sq);
                handleAsk(sq);
              }}
              className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition truncate max-w-[280px]"
              title={sq}
            >
              {sq}
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

      {/* Answer Output (Step 5) */}
      {data && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Direct Answer Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <BookmarkCheck className="w-4 h-4" />
                <span>Verified Direct Answer</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportQAPDF(data)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 rounded-lg border border-emerald-800/80 transition"
                  title="Download formatted Q&A PDF"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Answer'}</span>
                </button>
              </div>
            </div>

            <div className="text-lg font-semibold text-white leading-relaxed bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 mb-4">
              "{data.directAnswer}"
            </div>

            {/* Detailed Step-by-Step Breakdown */}
            <div className="space-y-3 mt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Comprehensive Explanation
              </h4>
              <div className="space-y-2.5">
                {data.detailedBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaway & Tip Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-800/80">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
                  Key Takeaway
                </span>
                <p className="text-xs sm:text-sm text-indigo-100 font-medium">
                  {data.keyTakeaway}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Practical Memory Tip
                </span>
                <p className="text-xs sm:text-sm text-amber-100/90 font-medium">
                  {data.practicalTip}
                </p>
              </div>
            </div>
          </div>

          {/* Step 6: Follow-Up Questions (adutha kelvi) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step 6: Follow-up Questions (adutha kelviya kekalam)
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Click any question below to immediately ask it and continue your learning chain:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.relatedQuestions.map((rq, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(rq);
                    handleAsk(rq);
                  }}
                  className="text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-850 hover:border-slate-700 border border-slate-800/80 text-xs text-slate-200 hover:text-white transition flex items-center justify-between group shadow-sm"
                >
                  <span className="pr-2">{rq}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 transition" />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
