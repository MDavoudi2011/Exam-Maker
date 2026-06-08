import type { Metadata } from "next";
import "./globals.css";
import { Vazirmatn } from "next/font/google";
import { cn } from "@/lib/utils";

const vazirmatn = Vazirmatn({ subsets: ["arabic"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "آزمون‌ساز هوشیار",
  description: "Professional SaaS Quiz/Exam Maker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn("font-sans antialiased", vazirmatn.variable)}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background overflow-x-hidden text-slate-900 dark:text-slate-100 selection:bg-primary/20 flex flex-col"
      >
        {children}
      </body>
    </html>
  );
}
