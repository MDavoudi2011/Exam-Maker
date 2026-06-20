-- افزودن کلید خارجی بین آزمون‌ها و پروفایل برای امکان join در postgrest
ALTER TABLE public.exams
DROP CONSTRAINT IF EXISTS exams_created_by_fkey;

ALTER TABLE public.exams
ADD CONSTRAINT exams_created_by_fkey
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
