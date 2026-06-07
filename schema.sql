-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- If the existing schema had `creator_id` instead of `created_by`, we can rename it. 
-- Or recreate if you prefer dropping. Here we drop everything and recreate for a clean slate,
-- but only if you are okay with data loss. To be safe, we will just CREATE OR REPLACE / ALTER.
-- For a fresh start, please run these DROP statements manually if needed:
-- DROP TABLE answers, attempts, exam_questions, questions, exams CASCADE;

CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT FALSE,
    time_limit_minutes INTEGER
);

-- If the table existed previously with creator_id instead of created_by:
-- ALTER TABLE exams RENAME COLUMN creator_id TO created_by;

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subject TEXT,
    content TEXT NOT NULL,
    options JSONB, -- Example: ["Option A", "Option B", "Option C", "Option D"]
    correct_option_index INTEGER,
    point_value INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    UNIQUE(exam_id, question_id)
);

CREATE TABLE IF NOT EXISTS test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER,
    status TEXT CHECK (status IN ('in_progress', 'completed')) DEFAULT 'in_progress'
);

CREATE TABLE IF NOT EXISTS test_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
    exam_question_id UUID REFERENCES exam_questions(id) ON DELETE CASCADE,
    selected_option_index INTEGER,
    UNIQUE(attempt_id, exam_question_id)
);

-- Basic RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of published exams" ON exams FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Allow owners to manage exams" ON exams FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Allow authenticated read questions" ON questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert questions" ON questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read exam_questions" ON exam_questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert exam_questions" ON exam_questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to manage own attempts" ON test_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to manage own answers" ON test_answers FOR ALL USING (
    EXISTS (SELECT 1 FROM test_attempts WHERE test_attempts.id = test_answers.attempt_id AND test_attempts.user_id = auth.uid())
);

-- INSERT SAMPLE DATA --
DO $$
DECLARE
  v_exam_id UUID;
  v_q1_id UUID;
  v_q2_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM exams WHERE title = 'آزمون تستی نمونه' LIMIT 1) THEN
    -- Insert Exam
    INSERT INTO exams (title, description, time_limit_minutes, is_published)
    VALUES ('آزمون تستی نمونه', 'این یک آزمون نمونه برای بررسی عملکرد سامانه است.', 15, true)
    RETURNING id INTO v_exam_id;
    
    -- Insert Questions
    INSERT INTO questions (content, options, correct_option_index, point_value)
    VALUES ('پایتخت ایران کدام شهر است؟', '["شیراز", "تهران", "اصفهان", "مشهد"]'::jsonb, 1, 10)
    RETURNING id INTO v_q1_id;

    INSERT INTO questions (content, options, correct_option_index, point_value)
    VALUES ('حاصل ضرب ۵ در ۶ چند می‌شود؟', '["۳۰", "۲۰", "۳۵", "۲۵"]'::jsonb, 0, 10)
    RETURNING id INTO v_q2_id;

    -- Link Questions to Exam
    INSERT INTO exam_questions (exam_id, question_id, order_index)
    VALUES (v_exam_id, v_q1_id, 0);

    INSERT INTO exam_questions (exam_id, question_id, order_index)
    VALUES (v_exam_id, v_q2_id, 1);
  END IF;
END $$;
