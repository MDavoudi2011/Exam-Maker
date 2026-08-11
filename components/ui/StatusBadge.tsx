import React from 'react';
import { cn } from '@/utils/styles.util';

export function StatusBadge({ status, trueLabel, falseLabel, variant = 'default', className }: { status: boolean | string, trueLabel: string, falseLabel: string, variant?: 'default' | 'role', className?: string }) {
  let isTrue = status === true || status === 'active' || status === 'admin';
 
  if (variant === 'role') {
    return (
      <span className={cn(
        "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm",
        isTrue ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground',
        className
      )}>
        {isTrue ? trueLabel : falseLabel}
      </span>
    );
  }

  return (
    <span className={cn(
      "px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-lg border-2 text-center w-full block",
      isTrue ? 'border-success/30 bg-success/10 text-success' : 'border-destructive/30 bg-destructive/10 text-destructive',
      className
    )}>
      {isTrue ? trueLabel : falseLabel}
    </span>
  );
}
