-- Update Questions RLS to only allow admins to insert
DROP POLICY IF EXISTS "Allow authenticated insert questions" ON questions;

CREATE POLICY "Allow admins insert questions" ON questions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
