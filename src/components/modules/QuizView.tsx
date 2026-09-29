import React, { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Lightbulb,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizResponseData, SupportedLanguage, EduModuleId } from '../../types.ts';
import { exportQuizPDF } from '../../utils/pdfExport.ts';

interface QuizViewProps {
  initialTopic?: string;
  language: SupportedLanguage;
  onNavigateToModule: (moduleId: EduModuleId, initialPrompt?: string) => void;
  onStartRequest: (step: number, endpoint: string, query: string) => void;
  onCompleteRequest: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialTopic = '',
  language,
  onNavigateToModule,
  onStartRequest,
  onCompleteRequest,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [quizMode, setQuizMode] = useState<'topic' | 'text'>('topic');
  const [passageText, setPassageText] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  React.useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      setQuizMode('topic');
    }
  }, [initialTopic]);

  const presetTopics = [
    'The Pythagoras Theorem',
    'Python & Object Oriented Programming',
    'Human Circulatory System & Biology',
    'Database Indexing & SQL Queries',
    'Basic Electrical Circuits & Ohm\'s Law',
  ];

  const handleGenerateQuiz = async (selectedTopic?: string) => {
    const targetTopic = selectedTopic || (quizMode === 'topic' ? topic : '');
    const targetText = quizMode === 'text' ? passageText : '';

    if (!targetTopic.trim() && !targetText.trim()) return;

    setLoading(true);
    setError(null);
    setUserAnswers({});
    setIsSubmitted(false);
    const traceQuery = targetTopic || targetText.slice(0, 45) + '...';
    onStartRequest(2, '/quiz', traceQuery);

    try {
      onStartRequest(3, '/quiz', traceQuery);
      setTimeout(() => onStartRequest(4, '/quiz', traceQuery), 300);

      const res = await fetch('/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic || undefined,
          text: targetText || undefined,
          difficulty,
          count: questionCount,
          language,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const json = await res.json();
      setQuizData(json.data);
      onStartRequest(5, '/quiz', traceQuery);
      setTimeout(() => onCompleteRequest(), 400);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    if (!quizData) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    quizData.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });
    const total = quizData.questions.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score.percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const scoreResult = isSubmitted ? calculateScore() : null;

  return (
    <div className="space-y-6">
      
      {/* Input Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <CheckSquare className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">Quiz Generation Module</h2>
              <span className="font-mono text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                POST /quiz
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ethavathu topic la irunthu test athavathu quizzes-ah generate pannum (Generates interactive MCQs).
            </p>
          </div>

          {/* Difficulty & Count Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg font-medium capitalize transition ${
                    difficulty === diff
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 px-2.5 py-1.5 focus:outline-none"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={8}>8 Questions</option>
            </select>
          </div>
        </div>

        {/* Mode Selector: Topic vs Text */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-400">Generate from:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setQuizMode('topic')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                quizMode === 'topic' ? 'bg-amber-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Topic Name
            </button>
            <button
              onClick={() => setQuizMode('text')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                quizMode === 'text' ? 'bg-amber-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Passage / Lesson Text
            </button>
          </div>
        </div>

        {/* Input Field */}
        {quizMode === 'topic' ? (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateQuiz()}
                placeholder="Enter topic (e.g. The Pythagoras Theorem, SQL Joins, Photosynthesis)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
            <button
              onClick={() => handleGenerateQuiz()}
              disabled={loading || !topic.trim()}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Crafting Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Quiz</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <textarea
              value={passageText}
              onChange={(e) => setPassageText(e.target.value)}
              placeholder="Paste your lesson, article, textbook paragraph, or study notes to generate comprehension test questions..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                onClick={() => handleGenerateQuiz()}
                disabled={loading || !passageText.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Text...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Quiz from Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Presets */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Try quiz on:</span>
          {presetTopics.map((pt) => (
            <button
              key={pt}
              onClick={() => {
                setTopic(pt);
                handleGenerateQuiz(pt);
              }}
              className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition"
            >
              {pt}
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

      {/* Quiz Content (Step 5) */}
      {quizData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Quiz Header & Score Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {quizData.difficulty} Difficulty Quiz
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-400">{quizData.totalQuestions} Questions</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">{quizData.topic}</h3>
            </div>

            {/* Score Result Banner (When Submitted) */}
            {scoreResult ? (
              <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className={`p-2 rounded-lg ${scoreResult.percentage >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Score</div>
                  <div className="text-sm font-bold text-white">
                    {scoreResult.correct}/{scoreResult.total} ({scoreResult.percentage}%)
                  </div>
                </div>
                <button
                  onClick={() => exportQuizPDF(quizData, userAnswers, isSubmitted)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900/60 rounded-lg border border-amber-800/80 transition ml-1"
                  title="Download Quiz Results PDF"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleResetQuiz}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title="Retake Quiz"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Answer the questions below or download as worksheet:
                </span>
                <button
                  onClick={() => exportQuizPDF(quizData, userAnswers, isSubmitted)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900/60 rounded-lg border border-amber-800/80 transition"
                  title="Download Quiz Worksheet PDF"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Worksheet PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {quizData.questions.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div 
                  key={q.id} 
                  className={`bg-slate-900/90 border rounded-2xl p-5 sm:p-6 transition shadow-md ${
                    isSubmitted
                      ? selectedOpt === q.correctAnswerIndex
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-rose-500/40 bg-rose-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Question Title */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      Q{qIndex + 1}
                    </span>
                    <h4 className="text-base font-semibold text-white leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 ml-0 sm:ml-10">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedOpt === optIndex;
                      const isCorrect = optIndex === q.correctAnswerIndex;

                      let btnStyle = 'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 text-slate-300';

                      if (isSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 line-through';
                        } else {
                          btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold ring-1 ring-amber-500';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          disabled={isSubmitted}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between group ${btnStyle} cursor-pointer disabled:cursor-default`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700/60 text-slate-400 font-mono text-[11px] flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation (When Submitted) */}
                  {isSubmitted && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 ml-0 sm:ml-10 space-y-2">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                        <span className="font-bold text-slate-300 block mb-1">
                          Why this is correct:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>

                      {q.tip && (
                        <div className="flex items-center gap-2 text-xs text-amber-300/90 italic">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Tip: {q.tip}</span>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Bottom Submit or Action Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            {!isSubmitted ? (
              <>
                <div className="text-xs text-slate-400">
                  Answered: <strong className="text-white">{Object.keys(userAnswers).length}</strong> / {quizData.totalQuestions}
                </div>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-amber-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Submit & Check Answers
                </button>
              </>
            ) : (
              <>
                <div className="text-xs text-slate-300">
                  Step 6: Great job! Want to review deeper or learn the full roadmap?
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => onNavigateToModule('explain', quizData.topic)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explain Topic</span>
                  </button>
                  <button
                    onClick={() => onNavigateToModule('learn', quizData.topic)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
                  >
                    <span>Full Roadmap</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
