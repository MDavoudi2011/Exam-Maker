'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, LayoutDashboard, List, BarChart3, ChevronRight, Users, Database, Menu, X } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { UserProfileDropdown } from '@/components/ui/UserProfileDropdown';
import { Footer } from '@/components/Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: any;
  userRole: string;
}

export function AdminLayout({ children, user, userRole }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/login';
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="h-screen w-full bg-muted/50 dark:bg-background font-sans text-foreground flex flex-col relative overflow-hidden" dir="rtl">
      <UserProfileDropdown
        user={user}
        userRole={userRole}
        onLogout={handleLogout}
        onDashboardClick={() => window.location.href = '/admin'}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row relative">
        {/* Background Decor */}
        <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>
        <div className="absolute top-64 -right-64 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>

        {/* Mobile Top Bar */}
        <div className="md:hidden flex shrink-0 items-center justify-between p-4 bg-card/70 dark:bg-background/70 backdrop-blur-xl border-b border-border z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -mr-1 text-foreground" aria-label="Open Menu">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-1.5 rounded-xl border border-primary/10">
                <BrainCircuit className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/60">پنل ادمین</h2>
            </div>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        {/* Sidebar */}
        <aside className={`fixed md:static inset-y-0 right-0 w-72 bg-card/95 md:bg-card/70 dark:bg-background/95 dark:md:bg-background/70 backdrop-blur-2xl border-l border-border p-6 flex flex-col z-50 md:z-10 shadow-2xl md:shadow-none h-full transition-transform duration-300 shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-2.5 rounded-2xl shadow-inner border border-primary/10">
                <BrainCircuit className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/60">پنل ادمین</h2>
                <p className="text-xs text-muted-foreground font-medium tracking-tight">آزمون‌ساز هوشیار</p>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-muted-foreground bg-muted rounded-xl hover:bg-secondary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 focus:outline-none overflow-y-auto pr-2 custom-scrollbar">
            <NavItem
              href="/admin"
              active={pathname === '/admin'}
              icon={<LayoutDashboard />}
              label="نمای کلی"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/exams"
              active={pathname.includes('/admin/exams')}
              icon={<List />}
              label="مدیریت آزمون‌ها"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/reports"
              active={pathname.includes('/admin/reports')}
              icon={<BarChart3 />}
              label="گزارش‌ها و نتایج"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/users"
              active={pathname.includes('/admin/users')}
              icon={<Users />}
              label="مدیریت کاربران"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/questions"
              active={pathname.includes('/admin/questions')}
              icon={<Database />}
              label="بانک سوالات"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto z-10 relative flex flex-col">
          <div className="p-4 md:p-8 lg:p-10 lg:pr-8 flex-1">
            <div className="max-w-7xl mx-auto pb-10">
              {children}
            </div>
          </div>
          <Footer className="border-none mt-auto" />
        </main>
      </div>
    </div>
  );
}

function NavItem({ active, href, icon, label, onClick }: { active: boolean, href: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
        active
          ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
          : 'text-muted-foreground dark:text-muted-foreground hover:bg-muted hover:text-foreground '
      }`}
    >
      <div className={`transition-colors [&>svg]:w-5 [&>svg]:h-5 ${active ? 'opacity-100' : 'text-muted-foreground group-hover:text-primary'}`}>
        {icon}
      </div>
      <span className="flex-1 text-right">{label}</span>
      {active && <ChevronRight className="w-4 h-4 opacity-70" />}
    </Link>
  );
}
