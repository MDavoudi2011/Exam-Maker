import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h2 className="text-2xl font-bold mb-4">صفحه پیدا نشد</h2>
      <p className="mb-6">متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد.</p>
      <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
