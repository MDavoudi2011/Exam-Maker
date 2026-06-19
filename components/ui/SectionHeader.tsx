import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
 icon: LucideIcon;
 title: string;
 description: string;
}

export function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <div>
      <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
        <Icon className="w-7 h-7 text-primary" />
        {title}
      </h2>
      <p className="text-muted-foreground font-medium mt-2">{description}</p>
    </div>
  );
}
