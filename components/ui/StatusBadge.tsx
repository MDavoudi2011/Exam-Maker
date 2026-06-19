import React from 'react';

export function StatusBadge({ status, trueLabel, falseLabel, variant = 'default' }: { status: boolean | string, trueLabel: string, falseLabel: string, variant?: 'default' | 'role' }) {
  let isTrue = status === true || status === 'active' || status === 'admin';
 
  if (variant === 'role') {
    return (
      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
        isTrue 
          ? 'bg-success/10 text-success' 
          : 'bg-muted text-muted-foreground'
      }`}>
        {isTrue ? trueLabel : falseLabel}
      </span>
    );
  }

  return (
    <span className={`px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold rounded-lg border-2 text-center w-full block ${
      isTrue 
        ? 'border-success/30 bg-success/10 text-success'
        : 'border-destructive/30 bg-destructive/10 text-destructive'
    }`}>
      {isTrue ? trueLabel : falseLabel}
    </span>
  );
}
