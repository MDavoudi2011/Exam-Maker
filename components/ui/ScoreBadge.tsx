import React from 'react';
import { toFarsiNumber } from '@/utils/text.util';

export function ScoreBadge({ score, className = '' }: { score: number | string | null | undefined, className?: string }) {
  if (score === null || score === undefined) {
    return (
      <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-bold min-w-[3.5rem] h-7 ${className}`}>
        -
      </span>
    );
  }
  
  const numericScore = typeof score === 'string' ? parseFloat(score) : score;
  const formattedScore = `${toFarsiNumber(Number(numericScore).toFixed(1).replace(/\.0$/, ''))}٪`;
  
  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-black min-w-[3.5rem] h-7 ${className}`}>
      {formattedScore}
    </span>
  );
}
