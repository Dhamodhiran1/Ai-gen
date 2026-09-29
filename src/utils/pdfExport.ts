import { jsPDF } from 'jspdf';
import { 
  ExplainResponseData, 
  QAResponseData, 
  QuizResponseData, 
  SummarizeResponseData, 
  LearningPathResponseData 
} from '../types.ts';

// Helper to sanitize text for standard PDF fonts while preserving readable content
function cleanText(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u2023\u25E6]/g, '-')
    .replace(/[\u2026]/g, '...')
    .trim();
}

class PDFBuilder {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  currentY: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 15;
    this.currentY = 15;
  }

  checkPageBreak(neededSpace: number = 20) {
    if (this.currentY + neededSpace > this.pageHeight - 20) {
      this.doc.addPage();
      this.currentY = 18;
    }
  }

  addHeader(moduleName: string, endpoint: string) {
    // Header gradient/band
    this.doc.setFillColor(15, 23, 42); // slate-900
    this.doc.rect(0, 0, this.pageWidth, 24, 'F');

    // Title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('EduGenie', this.margin, 12);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(148, 163, 184); // slate-400
    this.doc.text('Smart AI Learning Platform', this.margin + 26, 12);

    // Module badge
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(129, 140, 248); // indigo-400
    this.doc.text(`${moduleName} (${endpoint})`, this.pageWidth - this.margin, 12, { align: 'right' });

    // Date
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 116, 139);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    this.doc.text(dateStr, this.pageWidth - this.margin, 19, { align: 'right' });

    this.currentY = 32;
  }

  addTitle(titleText: string) {
    this.checkPageBreak(15);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(18);
    this.doc.setTextColor(15, 23, 42);
    
    const lines = this.doc.splitTextToSize(cleanText(titleText), this.pageWidth - (this.margin * 2));
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += (lines.length * 7) + 4;
  }

  addCalloutBox(title: string, content: string, accentColor: [number, number, number] = [99, 102, 241]) {
    const textLines = this.doc.splitTextToSize(cleanText(content), this.pageWidth - (this.margin * 2) - 10);
    const boxHeight = (textLines.length * 5) + 12;

    this.checkPageBreak(boxHeight + 5);

    // Background
    this.doc.setFillColor(248, 250, 252);
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), boxHeight, 2, 2, 'F');

    // Accent line
    this.doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    this.doc.roundedRect(this.margin, this.currentY, 3, boxHeight, 1, 1, 'F');

    // Box Header
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    this.doc.text(title.toUpperCase(), this.margin + 7, this.currentY + 6);

    // Box Content
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(51, 65, 85);
    this.doc.text(textLines, this.margin + 7, this.currentY + 12);

    this.currentY += boxHeight + 6;
  }

  addSectionHeader(text: string) {
    this.checkPageBreak(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(30, 41, 59);
    this.doc.text(cleanText(text), this.margin, this.currentY);
    
    // Underline
    this.doc.setDrawColor(226, 232, 240);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY + 2, this.pageWidth - this.margin, this.currentY + 2);

    this.currentY += 8;
  }

  addParagraph(text: string) {
    if (!text) return;
    this.checkPageBreak(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(71, 85, 105);
    
    const lines = this.doc.splitTextToSize(cleanText(text), this.pageWidth - (this.margin * 2));
    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += (lines.length * 5) + 4;
  }

  addBulletPoints(points: string[]) {
    if (!points || !points.length) return;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(51, 65, 85);

    points.forEach((p, idx) => {
      const bulletText = cleanText(p);
      const lines = this.doc.splitTextToSize(bulletText, this.pageWidth - (this.margin * 2) - 8);
      const neededSpace = (lines.length * 5) + 3;

      this.checkPageBreak(neededSpace);

      // Bullet dot
      this.doc.setFillColor(99, 102, 241);
      this.doc.circle(this.margin + 2, this.currentY - 1, 1, 'F');

      this.doc.text(lines, this.margin + 7, this.currentY);
      this.currentY += (lines.length * 5) + 3;
    });
    this.currentY += 2;
  }

  addFooters() {
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(148, 163, 184);

      // Line
      this.doc.setDrawColor(226, 232, 240);
      this.doc.setLineWidth(0.3);
      this.doc.line(this.margin, this.pageHeight - 12, this.pageWidth - this.margin, this.pageHeight - 12);

      this.doc.text('EduGenie AI • Generated Study Document', this.margin, this.pageHeight - 7);
      this.doc.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin, this.pageHeight - 7, { align: 'right' });
    }
  }

  save(fileName: string) {
    this.addFooters();
    this.doc.save(`${fileName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_edugenie.pdf`);
  }
}

// 1. Export Explanation Module PDF
export function exportExplanationPDF(data: ExplainResponseData) {
  const p = new PDFBuilder();
  p.addHeader('Explanation Module', 'POST /explain');
  p.addTitle(data.title || data.topic);

  p.addParagraph(data.summary);

  if (data.simpleAnalogy) {
    p.addCalloutBox('Everyday Analogy', data.simpleAnalogy, [217, 119, 6]); // amber
  }

  if (data.keyPoints && data.keyPoints.length) {
    p.addSectionHeader('Core Mechanism (How It Works)');
    p.addBulletPoints(data.keyPoints);
  }

  if (data.detailedExplanation) {
    p.addSectionHeader('Detailed Explanation');
    p.addParagraph(data.detailedExplanation);
  }

  if (data.realWorldExample) {
    p.addCalloutBox('Real-World Scenario / Use Case', data.realWorldExample, [16, 185, 129]); // emerald
  }

  if (data.commonMisconceptions && data.commonMisconceptions.length) {
    p.addSectionHeader('Common Misconceptions to Avoid');
    p.addBulletPoints(data.commonMisconceptions);
  }

  if (data.recommendedNextSteps && data.recommendedNextSteps.length) {
    p.addSectionHeader('Recommended Next Questions (Step 6)');
    p.addBulletPoints(data.recommendedNextSteps);
  }

  p.save(`explanation_${data.topic || 'topic'}`);
}

// 2. Export Q&A Module PDF
export function exportQAPDF(data: QAResponseData) {
  const p = new PDFBuilder();
  p.addHeader('Q&A Module', 'POST /qa');
  p.addTitle(data.question);

  p.addCalloutBox('Verified Direct Answer', data.directAnswer, [16, 185, 129]); // emerald

  if (data.detailedBreakdown && data.detailedBreakdown.length) {
    p.addSectionHeader('Step-by-Step Breakdown');
    p.addBulletPoints(data.detailedBreakdown);
  }

  if (data.keyTakeaway) {
    p.addCalloutBox('Key Takeaway', data.keyTakeaway, [99, 102, 241]); // indigo
  }

  if (data.practicalTip) {
    p.addCalloutBox('Practical Memory Tip', data.practicalTip, [217, 119, 6]); // amber
  }

  if (data.relatedQuestions && data.relatedQuestions.length) {
    p.addSectionHeader('Related Follow-up Questions (Step 6)');
    p.addBulletPoints(data.relatedQuestions);
  }

  p.save(`qa_${data.question.slice(0, 30)}`);
}

// 3. Export Quiz Module PDF
export function exportQuizPDF(
  data: QuizResponseData,
  userAnswers: Record<number, number> = {},
  isSubmitted: boolean = false
) {
  const p = new PDFBuilder();
  p.addHeader('Quiz Generation Module', 'POST /quiz');
  p.addTitle(`${data.topic} Quiz`);

  let scoreSummary = `Difficulty: ${data.difficulty.toUpperCase()} | Total Questions: ${data.totalQuestions}`;
  if (isSubmitted) {
    let correct = 0;
    data.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) correct++;
    });
    const pct = Math.round((correct / data.totalQuestions) * 100);
    scoreSummary += ` | Score: ${correct}/${data.totalQuestions} (${pct}%)`;
  }
  p.addParagraph(scoreSummary);

  data.questions.forEach((q, idx) => {
    p.checkPageBreak(40);
    p.addSectionHeader(`Question ${idx + 1}: ${q.question}`);

    const selectedOpt = userAnswers[q.id];

    q.options.forEach((opt, optIdx) => {
      p.checkPageBreak(8);
      const letter = String.fromCharCode(65 + optIdx);
      let prefix = `[  ]  ${letter}. `;

      if (isSubmitted) {
        if (optIdx === q.correctAnswerIndex) {
          prefix = `[CORRECT]  ${letter}. `;
        } else if (selectedOpt === optIdx) {
          prefix = `[YOUR ANSWER - WRONG]  ${letter}. `;
        }
      } else if (selectedOpt === optIdx) {
        prefix = `[X]  ${letter}. `;
      }

      p.doc.setFont('helvetica', optIdx === q.correctAnswerIndex && isSubmitted ? 'bold' : 'normal');
      p.doc.setFontSize(9);
      p.doc.setTextColor(optIdx === q.correctAnswerIndex && isSubmitted ? 16 : 71, optIdx === q.correctAnswerIndex && isSubmitted ? 185 : 85, optIdx === q.correctAnswerIndex && isSubmitted ? 129 : 105);
      
      const optLines = p.doc.splitTextToSize(`${prefix}${cleanText(opt)}`, p.pageWidth - (p.margin * 2) - 6);
      p.doc.text(optLines, p.margin + 4, p.currentY);
      p.currentY += (optLines.length * 4.5) + 2;
    });

    if (isSubmitted && q.explanation) {
      p.addCalloutBox(`Explanation for Q${idx + 1}`, `${q.explanation}${q.tip ? `\n\nTip: ${q.tip}` : ''}`, [99, 102, 241]);
    }

    p.currentY += 4;
  });

  p.save(`quiz_${data.topic}`);
}

// 4. Export Summarize Module PDF
export function exportSummarizePDF(data: SummarizeResponseData) {
  const p = new PDFBuilder();
  p.addHeader('Summarization Module', 'POST /summarize');
  p.addTitle(data.title);

  p.addParagraph(`Time Efficiency: ${data.readingTimeSaved}`);

  if (data.tldr) {
    p.addCalloutBox('Executive TL;DR', data.tldr, [139, 92, 246]); // violet
  }

  if (data.bulletPoints && data.bulletPoints.length) {
    p.addSectionHeader('Key Summary Points');
    p.addBulletPoints(data.bulletPoints);
  }

  if (data.keyConcepts && data.keyConcepts.length) {
    p.addSectionHeader('Key Concepts & Glossary');
    data.keyConcepts.forEach((kc) => {
      p.checkPageBreak(12);
      p.doc.setFont('helvetica', 'bold');
      p.doc.setFontSize(9.5);
      p.doc.setTextColor(16, 185, 129); // emerald
      p.doc.text(`• ${cleanText(kc.term)}:`, p.margin + 2, p.currentY);

      p.doc.setFont('helvetica', 'normal');
      p.doc.setTextColor(71, 85, 105);
      const defLines = p.doc.splitTextToSize(cleanText(kc.definition), p.pageWidth - (p.margin * 2) - 8);
      p.doc.text(defLines, p.margin + 8, p.currentY + 4.5);
      p.currentY += (defLines.length * 4.5) + 6;
    });
  }

  if (data.actionableTakeaways && data.actionableTakeaways.length) {
    p.addSectionHeader('Actionable Takeaways');
    p.addBulletPoints(data.actionableTakeaways);
  }

  p.save(`summary_${data.title}`);
}

// 5. Export Learning Path Module PDF
export function exportLearningPathPDF(
  data: LearningPathResponseData,
  completedSteps: Record<number, boolean> = {}
) {
  const p = new PDFBuilder();
  p.addHeader('Learning Path Module', 'POST /learn/recommendations');
  p.addTitle(data.roadmapTitle);

  p.addParagraph(`${data.description}\nEstimated Total Duration: ${data.estimatedTotalWeeks}`);

  if (data.prerequisites && data.prerequisites.length) {
    p.addCalloutBox('Prerequisites', data.prerequisites.join(' • '), [100, 116, 139]);
  }

  p.addSectionHeader('Step-by-Step Milestones');

  data.milestones.forEach((m) => {
    p.checkPageBreak(35);
    const isDone = !!completedSteps[m.stepNumber];
    const statusText = isDone ? '[COMPLETED] ' : `[STEP ${m.stepNumber}] `;

    p.doc.setFont('helvetica', 'bold');
    p.doc.setFontSize(11);
    p.doc.setTextColor(isDone ? 16 : 236, isDone ? 185 : 72, isDone ? 129 : 153);
    p.doc.text(`${statusText}${cleanText(m.phaseTitle)} (${cleanText(m.duration)})`, p.margin, p.currentY);
    p.currentY += 6;

    // Objectives
    p.doc.setFont('helvetica', 'bold');
    p.doc.setFontSize(8.5);
    p.doc.setTextColor(100, 116, 139);
    p.doc.text('LEARNING OBJECTIVES:', p.margin + 4, p.currentY);
    p.currentY += 4;

    p.addBulletPoints(m.objectives);

    // Hands-on project
    p.addCalloutBox(`Milestone ${m.stepNumber} Project`, m.handsOnProject, [217, 119, 6]);

    p.currentY += 3;
  });

  if (data.finalCapstoneProject) {
    p.addCalloutBox('Final Capstone Portfolio Project', data.finalCapstoneProject, [245, 158, 11]);
  }

  if (data.careerOpportunities && data.careerOpportunities.length) {
    p.addSectionHeader('Career & Exam Opportunities');
    p.addBulletPoints(data.careerOpportunities);
  }

  p.save(`learning_roadmap_${data.topic}`);
}
