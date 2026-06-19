import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
 value: string;
 onChange: (value: string) => void;
 placeholder?: string;
 disabled?: boolean;
}

export function SearchBar({ value, onChange, placeholder = 'جستجو...', disabled = false }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full pl-4 pr-12 h-[42px] rounded-2xl border border-border dark:border-border bg-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
