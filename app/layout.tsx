import type {Metadata} from 'next';
import './globals.css';
import { Vazirmatn } from "next/font/google";
import { cn } from "@/utils/styles.util";

const vazirmatn = Vazirmatn({subsets:['arabic'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'آزمون ساز هوشیار',
  description: 'سیستم ساخت و برگزاری آزمون، آزمون ساز هوشیار',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" className={cn("font-sans antialiased", vazirmatn.variable)} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-background overflow-x-hidden text-foreground selection:bg-primary/20 flex flex-col">{children}</body>
    </html>
  );
}
