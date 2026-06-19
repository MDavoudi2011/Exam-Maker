import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
 icon: LucideIcon;
 title: string;
 description: string;
 action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-2xl border border-dashed border-border/50 text-muted-foreground mx-0 md:mx-0 w-full overflow-hidden">
      <Icon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground mb-3" strokeWidth={2.5} />
      <h3 className="text-xs md:text-sm font-bold text-muted-foreground mb-1 text-center whitespace-nowrap">{title}</h3>
      {description && <p className="text-[10px] md:text-xs font-medium text-muted-foreground/60 text-center">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
