-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to start fresh (CAUTION: RUNNING THIS WILL DELETE ALL DATA)
-- FOR A COMPLETELY CLEAN SLATE, YOU CAN UNCOMMENT THE FOLLOWING LINE:
-- DROP TABLE IF EXISTS test_answers, test_attempts, exam_questions, questions, exams CASCADE;

CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT FALSE,
    time_limit_minutes INTEGER,
    show_results BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    content TEXT NOT NULL,
    options JSONB, -- Example: ["Option A", "Option B", "Option C", "Option D"]
    correct_option_index INTEGER,
    point_value INTEGER DEFAULT 1,
    topic TEXT
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
    full_name TEXT,
    national_code TEXT,
    personnel_code TEXT,
    org_title TEXT,
    class_name TEXT,
    school TEXT,
    district TEXT,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
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

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read of published exams" ON exams;
  DROP POLICY IF EXISTS "Allow owners to manage exams" ON exams;
  
  DROP POLICY IF EXISTS "Allow authenticated read questions" ON questions;
  DROP POLICY IF EXISTS "Allow authenticated insert questions" ON questions;
  DROP POLICY IF EXISTS "Allow authenticated update questions" ON questions;
  DROP POLICY IF EXISTS "Allow authenticated delete questions" ON questions;
  
  DROP POLICY IF EXISTS "Allow authenticated read exam_questions" ON exam_questions;
  DROP POLICY IF EXISTS "Allow authenticated insert exam_questions" ON exam_questions;
  DROP POLICY IF EXISTS "Allow authenticated update exam_questions" ON exam_questions;
  DROP POLICY IF EXISTS "Allow authenticated delete exam_questions" ON exam_questions;
  
  DROP POLICY IF EXISTS "Allow public all attempts" ON test_attempts;
  DROP POLICY IF EXISTS "Allow public all answers" ON test_answers;
EXCEPTION WHEN OTHERS THEN 
  -- Do nothing if policies don't exist
END $$;

-- Exams Policies
CREATE POLICY "Allow public read of published exams" ON exams FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Allow owners to manage exams" ON exams FOR ALL USING (auth.uid() = created_by);

-- Questions Policies
CREATE POLICY "Allow authenticated read questions" ON questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert questions" ON questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update questions" ON questions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete questions" ON questions FOR DELETE USING (auth.role() = 'authenticated');

-- Exam Questions Policies
CREATE POLICY "Allow authenticated read exam_questions" ON exam_questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert exam_questions" ON exam_questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update exam_questions" ON exam_questions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete exam_questions" ON exam_questions FOR DELETE USING (auth.role() = 'authenticated');

-- Test Attempts & Answers Policies (Public API)
CREATE POLICY "Allow public all attempts" ON test_attempts FOR ALL USING (true);
CREATE POLICY "Allow public all answers" ON test_answers FOR ALL USING (true);
