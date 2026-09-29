export type EduModuleId = 'explain' | 'qa' | 'quiz' | 'summarize' | 'learn';

export interface ArchitectureStep {
  step: number;
  title: string;
  detail: string;
  tamilDesc: string;
  modules?: Array<{
    name: string;
    endpoint: string;
    description: string;
  }>;
}

export type SupportedLanguage = 'english' | 'tamil' | 'tanglish';

export interface ExplainResponseData {
  topic: string;
  title: string;
  summary: string;
  simpleAnalogy: string;
  keyPoints: string[];
  detailedExplanation: string;
  realWorldExample: string;
  commonMisconceptions: string[];
  recommendedNextSteps: string[];
}

export interface QAResponseData {
  question: string;
  directAnswer: string;
  detailedBreakdown: string[];
  keyTakeaway: string;
  relatedQuestions: string[];
  practicalTip: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  tip: string;
}

export interface QuizResponseData {
  topic: string;
  difficulty: string;
  totalQuestions: number;
  questions: QuizQuestion[];
}

export interface KeyConcept {
  term: string;
  definition: string;
}

export interface SummarizeResponseData {
  title: string;
  tldr: string;
  bulletPoints: string[];
  keyConcepts: KeyConcept[];
  actionableTakeaways: string[];
  readingTimeSaved: string;
}

export interface LearningMilestone {
  stepNumber: number;
  phaseTitle: string;
  duration: string;
  objectives: string[];
  handsOnProject: string;
  keyResources: string[];
}

export interface LearningPathResponseData {
  topic: string;
  roadmapTitle: string;
  description: string;
  estimatedTotalWeeks: string;
  prerequisites: string[];
  milestones: LearningMilestone[];
  finalCapstoneProject: string;
  careerOpportunities: string[];
}

export interface HistoryItem {
  id: string;
  moduleId: EduModuleId;
  endpoint: string;
  title: string;
  query: string;
  timestamp: number;
  language: SupportedLanguage;
  data: ExplainResponseData | QAResponseData | QuizResponseData | SummarizeResponseData | LearningPathResponseData;
}
