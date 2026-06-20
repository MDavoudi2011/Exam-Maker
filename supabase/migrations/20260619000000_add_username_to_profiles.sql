-- اضافه کردن ستون username به جدول profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- دسترسی خواندن پروفایل‌ها را برای همه باز می‌کنیم تا ورود با نام کاربری کار کند
CREATE POLICY IF NOT EXISTS "Allow public read access to profiles for login" 
ON public.profiles FOR SELECT USING (true);

-- بروزرسانی تریگر ثبت نام برای انتقال username از متادیتا
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, username)
  VALUES (
    new.id, 
    new.email, 
    'user', -- نقش پیش‌فرض برای کاربر جدید
    new.raw_user_meta_data->>'username' -- دریافت نام کاربری در صورت ثبت نام با آن
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
