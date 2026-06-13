import { Exam, ExamQuestion } from './exam.type';

export type RunnerQuestion = {
  id: string;
  contentHtml: string;
  options: string[];
};

export type ExamRunnerProps = {
  examId?: string;
  title: string;
  timeLimit: number; // minutes
  questions: RunnerQuestion[];
};

export interface UseExamViewerProps {
  exam: Exam;
  questions: ExamQuestion[];
  user: any;
  adminViewAttemptId?: string;
}
