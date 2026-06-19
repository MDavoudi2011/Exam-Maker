import React, { useRef, useEffect } from 'react';
import { ArrowUpDown, ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  value: string;
  direction: 'asc' | 'desc';
  options: SortOption[];
  onChange: (value: string) => void;
  onDirectionToggle: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function SortDropdown({
  value,
  direction,
  options,
  onChange,
  onDirectionToggle,
  isOpen,
  onToggle,
  onClose,
  icon,
  disabled = false
}: SortDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className={`relative flex-1 md:w-56 shrink-0 w-full min-w-0`} ref={dropdownRef}>
      <button 
        onClick={onToggle}
        type="button"
        disabled={disabled}
        className="w-full px-3 h-[42px] rounded-2xl border border-border bg-background hover:bg-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm font-bold text-foreground flex items-center justify-between min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {icon || <ArrowUpDown className="w-4 h-4 shrink-0 text-muted-foreground hidden md:block" />}
          <span className="truncate">
            {selectedOption ? selectedOption.label : 'مرتب‌سازی...'}
          </span>
        </div>
        <div
          onClick={(e) => {
            if (disabled) return;
            e.stopPropagation();
            onDirectionToggle();
          }}
          className={`p-1 hover:bg-muted rounded-md transition-colors mr-1 shrink-0 flex items-center justify-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          {direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />}
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-popover rounded-2xl shadow-xl shadow-black/5 border border-border overflow-hidden flex flex-col p-2 animate-in fade-in zoom-in-95 duration-100 origin-top z-50">
          <div className="space-y-1 p-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  onClose();
                }}
                className={`w-full flex flex-col px-3 py-2.5 rounded-xl text-sm font-bold transition-colors text-right ${value === option.value ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span>{option.label}</span>
                  {value === option.value && (
                    <span className="text-primary">{direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
