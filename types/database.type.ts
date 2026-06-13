export type Exam = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  creator_id: string;
  is_published: boolean;
  time_limit_minutes: number | null;
};

export type Question = {
  id: string;
  created_at: string;
  updated_at: string;
  subject: string | null;
  content: string;
  options: string[];
  correct_option_index: number;
  point_value: number;
};

export type ExamQuestion = {
  id: string;
  exam_id: string;
  question_id: string;
  order_index: number;
  question?: Question; 
};

export type Attempt = {
  id: string;
  created_at: string;
  exam_id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  status: 'in_progress' | 'completed';
};

export type Answer = {
  id: string;
  created_at: string;
  attempt_id: string;
  exam_question_id: string;
  selected_option_index: number;
};
