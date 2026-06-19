import React, { useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  footer?: React.ReactNode;
  disabled?: boolean;
}

export function FilterDropdown({
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  onClose,
  icon,
  placeholder = 'فیلتر...',
  className = '',
  footer,
  disabled = false
}: FilterDropdownProps) {
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
    <div className={`relative flex-1 md:w-56 shrink-0 w-full min-w-0 ${className}`} ref={dropdownRef}>
      <button 
        onClick={onToggle}
        type="button"
        disabled={disabled}
        className="w-full px-3 h-[42px] rounded-2xl border border-border bg-background hover:bg-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs md:text-sm font-bold text-foreground flex items-center justify-between min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {icon || <Filter className="w-4 h-4 shrink-0 text-muted-foreground hidden md:block" />}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.count !== undefined && (
            <span className="px-1.5 h-5 flex shrink-0 items-center justify-center bg-muted text-muted-foreground text-[10px] rounded-full">
               {toFarsiNumber(selectedOption.count)}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground mr-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${value === option.value ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
              >
                <span>{option.label}</span>
                {option.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs ${value === option.value ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {toFarsiNumber(option.count)}
                  </span>
                )}
              </button>
            ))}
          </div>
          {footer && (
            <div className="mt-1 pt-1 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
