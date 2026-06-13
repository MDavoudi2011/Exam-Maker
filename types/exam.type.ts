export interface RequiredFields {
  fullName?: boolean;
  nationalCode?: boolean;
  personnelCode?: boolean;
  orgTitle?: boolean;
  className?: boolean;
  school?: boolean;
  district?: boolean;
}

export interface StudentInfo {
  fullName?: string;
  nationalCode?: string;
  personnelCode?: string;
  orgTitle?: string;
  className?: string;
  school?: string;
  district?: string;
}

export interface ExamSettings {
  status?: string;
  studentDetails?: RequiredFields;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  time_limit_minutes?: number;
  is_published?: boolean;
  show_results?: boolean;
  settings?: ExamSettings;
  [key: string]: any;
}

export interface Question {
  id: string;
  content: string;
  options: string[];
  correct_option_index: number;
  point_value?: number;
  topic?: string;
  [key: string]: any;
}

export interface QuestionDetails {
  content: string;
  options: string[];
  correct_option_index: number;
  point_value?: number;
  [key: string]: any;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  order_index?: number;
  questions: QuestionDetails;
  [key: string]: any;
}

export interface TestAttempt {
  id: string;
  exam_id: string;
  score?: number;
  status: string;
  [key: string]: any;
}

export interface TestAnswer {
  exam_question_id: string;
  selected_option_index: number;
  attempt_id?: string;
  [key: string]: any;
}
