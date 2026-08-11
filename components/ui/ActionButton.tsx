import React, { ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/styles.util';

export type ActionButtonColor = 'sky' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'orange' | 'slate';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 icon: LucideIcon;
 title: string;
 color?: ActionButtonColor;
}

export function ActionButtonGroup({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("inline-flex items-center justify-center gap-1.5 md:gap-2 opacity-100 md:opacity-70 group-hover:opacity-100 transition-opacity", className)}>
      {children}
    </div>
  );
}

export function ActionButton({ icon: Icon, title, color = 'slate', className, ...props }: ActionButtonProps) {
  const colorClasses = {
    sky: 'bg-info/10 text-info hover:bg-info/20',
    amber: 'bg-warning/10 text-warning hover:bg-warning/20',
    emerald: 'bg-success/10 text-success hover:bg-success/20',
    rose: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
    indigo: 'bg-primary/10 text-primary hover:bg-primary/20',
    orange: 'bg-warning/10 text-warning hover:bg-warning/20',
    slate: 'bg-muted text-muted-foreground hover:bg-secondary dark:text-muted-foreground'
  };

  return (
    <button
      className={cn("p-1.5 rounded-lg transition-colors tooltip-trigger", colorClasses[color], className)}
      title={title}
      {...props}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
