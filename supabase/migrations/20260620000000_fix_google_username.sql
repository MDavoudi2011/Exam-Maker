-- اضافه کردن ستون display_name به جدول profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;

-- بروزرسانی تریگر ثبت نام برای انتقال درست اطلاعات
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, username, display_name)
  VALUES (
    new.id, 
    new.email, 
    'user', -- نقش پیش‌فرض برای کاربر جدید
    new.raw_user_meta_data->>'username', -- نام کاربری (فقط برای ثبت نام دستی که چک شده تکراری نیست)
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ) -- نام نمایشی از گوگل یا سایر ورودی‌ها
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- رفع مشکل مقادیر اشتباه که قبلا در username ذخیره شده بودند
UPDATE public.profiles
SET username = NULL
WHERE id IN (
  SELECT p.id FROM public.profiles p
  JOIN auth.users u ON p.id = u.id
  WHERE p.username = u.raw_user_meta_data->>'full_name'
  OR p.username = split_part(u.email, '@', 1)
);

-- بک‌فیل (Backfill) برای پر کردن display_name کاربران موجود
UPDATE public.profiles p
SET display_name = COALESCE(
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'name',
  p.username,
  split_part(u.email, '@', 1)
)
FROM auth.users u
WHERE p.id = u.id AND (p.display_name IS NULL OR p.display_name = '');
