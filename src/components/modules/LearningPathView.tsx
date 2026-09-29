import React, { useState } from 'react';
import { 
  GitFork, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  Trophy, 
  FolderGit2, 
  BookOpen, 
  Check, 
  Copy,
  ChevronRight,
  Download
} from 'lucide-react';
import { LearningPathResponseData, SupportedLanguage, EduModuleId } from '../../types.ts';
import { exportLearningPathPDF } from '../../utils/pdfExport.ts';

interface LearningPathViewProps {
  initialTopic?: string;
  language: SupportedLanguage;
  onNavigateToModule: (moduleId: EduModuleId, initialPrompt?: string) => void;
  onStartRequest: (step: number, endpoint: string, query: string) => void;
  onCompleteRequest: () => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  initialTopic = '',
  language,
  onNavigateToModule,
  onStartRequest,
  onCompleteRequest,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [pace, setPace] = useState<'casual' | 'standard' | 'intensive'>('standard');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LearningPathResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      handleGenerateRoadmap(initialTopic);
    }
  }, [initialTopic]);

  const presetTracks = [
    'SQL & Relational Database Mastery',
    'Fullstack Web Development with React & Node',
    'Machine Learning & Generative AI Engineer',
    'Cloud Architecture & DevOps with AWS',
    'Cybersecurity & Network Defense',
  ];

  const handleGenerateRoadmap = async (selectedTopic?: string) => {
    const targetTopic = selectedTopic || topic;
    if (!targetTopic.trim()) return;

    setLoading(true);
    setError(null);
    setCompletedSteps({});
    onStartRequest(2, '/learn/recommendations', targetTopic);

    try {
      onStartRequest(3, '/learn/recommendations', targetTopic);
      setTimeout(() => onStartRequest(4, '/learn/recommendations', targetTopic), 300);

      const res = await fetch('/learn/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          currentLevel,
          pace,
          goal: goal.trim() || undefined,
          language,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const json = await res.json();
      setData(json.data);
      onStartRequest(5, '/learn/recommendations', targetTopic);
      setTimeout(() => onCompleteRequest(), 400);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate learning roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const handleCopyRoadmap = () => {
    if (!data) return;
    const txt = `${data.roadmapTitle} (${data.estimatedTotalWeeks})\n${data.description}\n\nPrerequisites: ${data.prerequisites.join(', ')}\n\nMilestones:\n${data.milestones.map(m => `Step ${m.stepNumber}: ${m.phaseTitle} (${m.duration})\nObjectives: ${m.objectives.join(', ')}\nProject: ${m.handsOnProject}`).join('\n\n')}\n\nCapstone: ${data.finalCapstoneProject}`;
    navigator.clipboard.writeText(txt);
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
              <span className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400">
                <GitFork className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">Learning Path Module</h2>
              <span className="font-mono text-xs text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800/60">
                POST /learn/recommendations
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Oru topic-ah step-by-step ah padika personalized learning roadmaps-ah recommend pannum.
            </p>
          </div>

          {/* Level and Pace controls */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value as any)}
              className="bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 px-3 py-1.5 focus:outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as any)}
              className="bg-slate-950 text-slate-300 text-xs rounded-xl border border-slate-800 px-3 py-1.5 focus:outline-none"
            >
              <option value="casual">Casual Pace</option>
              <option value="standard">Standard Pace</option>
              <option value="intensive">Intensive Bootcamp</option>
            </select>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
              placeholder="Skill or subject (e.g. Fullstack React, AI Engineering, Quantum Physics)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
            />
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
              placeholder="Target Goal (e.g. Land a Job, Pass University Exam)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
            />
            <button
              onClick={() => handleGenerateRoadmap()}
              disabled={loading || !topic.trim()}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Build Roadmap</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Tracks */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Popular Career Tracks:</span>
            {presetTracks.map((pt) => (
              <button
                key={pt}
                onClick={() => {
                  setTopic(pt);
                  handleGenerateRoadmap(pt);
                }}
                className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition truncate max-w-[260px]"
                title={pt}
              >
                {pt}
              </button>
            ))}
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

      {/* Roadmap Output (Step 5) */}
      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Header Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                    Personalized Learning Roadmap
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    {data.estimatedTotalWeeks}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">{data.roadmapTitle}</h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {data.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => exportLearningPathPDF(data, completedSteps)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-pink-300 hover:text-white bg-pink-950/60 hover:bg-pink-900/60 rounded-lg border border-pink-800/80 transition"
                  title="Download Learning Roadmap PDF"
                >
                  <Download className="w-3.5 h-3.5 text-pink-400" />
                  <span>Download Roadmap PDF</span>
                </button>
                <button
                  onClick={handleCopyRoadmap}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Roadmap'}</span>
                </button>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider">
                Prerequisites:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.prerequisites.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-Step Milestones Timeline */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-pink-400" />
              Step-by-Step Progression Milestones
            </h4>

            <div className="space-y-4">
              {data.milestones.map((m) => {
                const isDone = !!completedSteps[m.stepNumber];

                return (
                  <div
                    key={m.stepNumber}
                    className={`bg-slate-900/90 border rounded-2xl p-5 sm:p-6 transition shadow-md ${
                      isDone
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleStepCompleted(m.stepNumber)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                            isDone
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                              : 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                          }`}
                          title="Click to mark milestone completed"
                        >
                          {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : `0${m.stepNumber}`}
                        </button>
                        <div>
                          <h5 className={`text-base font-bold transition ${isDone ? 'text-emerald-200 line-through' : 'text-white'}`}>
                            {m.phaseTitle}
                          </h5>
                          <span className="text-xs text-pink-400 font-mono">
                            {m.duration}
                          </span>
                        </div>
                      </div>

                      {/* Quick jump to explain this milestone */}
                      <button
                        onClick={() => onNavigateToModule('explain', m.phaseTitle)}
                        className="text-xs text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>Explain Phase Concepts</span>
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>

                    {/* Objectives list */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                        Learning Objectives:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {m.objectives.map((obj, oi) => (
                          <div key={oi} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 mt-0.5 shrink-0" />
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hands-on Project & Resources */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <strong className="text-amber-300 font-semibold block mb-1 flex items-center gap-1.5">
                          <FolderGit2 className="w-3.5 h-3.5" />
                          Milestone Project to Build:
                        </strong>
                        <span className="text-amber-100/90 leading-relaxed">
                          {m.handsOnProject}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                        <strong className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          Recommended Focus Resources:
                        </strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.keyResources.map((res, ri) => (
                            <span key={ri} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[11px]">
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Capstone Project & Career Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Final Capstone */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Final Capstone Portfolio Project</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {data.finalCapstoneProject}
              </p>
            </div>

            {/* Career Opportunities */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Target Roles & Opportunities</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {data.careerOpportunities.map((op, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                    {op}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
