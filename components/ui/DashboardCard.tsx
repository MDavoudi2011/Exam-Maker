import React from 'react';

export function DashboardCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-card dark:bg-background rounded-3xl p-4 md:p-6 shadow-xl shadow-black/5 border border-border dark:border-border ${className}`}>
      {children}
    </div>
  );
}
