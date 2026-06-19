'use client';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h2 className="text-2xl font-bold mb-4">خطای سیستمی رخ داد</h2>
          <button onClick={() => reset()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  );
}
