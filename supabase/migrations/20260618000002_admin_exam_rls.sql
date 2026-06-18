-- allow admins to read and manage all exams
CREATE POLICY "Allow admins manage exams" ON exams FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- allow admins to manage all exam_questions
CREATE POLICY "Allow admins manage exam_questions" ON exam_questions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- allow authenticated to read/create exams
CREATE POLICY "Allow authenticated read own exams" ON exams FOR SELECT USING (auth.uid() = created_by);

-- Also for test attempts and test answers, they are already ALLOW ALL USING (true) so we don't need to change them.
