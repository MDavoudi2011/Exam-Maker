import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuit, LayoutDashboard, List, PlusCircle, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-e bg-card hidden md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
              <BrainCircuit className="h-6 w-6" />
              <span>آزمون ساز هوشیار</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/5 active:bg-primary/10"
              >
                <LayoutDashboard className="h-4 w-4" />
                داشبورد
              </Link>
              <Link
                href="/exams"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/5 active:bg-primary/10"
              >
                <List className="h-4 w-4" />
                آزمون‌ها
              </Link>
              <Link
                href="/create"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/5 active:bg-primary/10"
              >
                <PlusCircle className="h-4 w-4" />
                ساخت آزمون جدید
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4" />
              خروج از حساب
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <BrainCircuit className="h-6 w-6" />
            <span>آزمون ساز هوشیار</span>
          </Link>
          <nav className="ms-auto flex gap-4 text-sm font-medium">
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary">داشبورد</Link>
            <Link href="/exams" className="text-muted-foreground hover:text-primary">آزمون‌ها</Link>
          </nav>
        </header>
        <div className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
