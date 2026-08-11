import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/styles.util';

interface SectionHeaderProps {
 icon: LucideIcon;
 title: string;
 description: string;
 className?: string;
}

export function SectionHeader({ icon: Icon, title, description, className }: SectionHeaderProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
        <Icon className="w-7 h-7 text-primary" />
        {title}
      </h2>
      <p className="text-muted-foreground font-medium mt-2">{description}</p>
    </div>
  );
}
