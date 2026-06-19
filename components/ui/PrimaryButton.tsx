import React, { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 icon?: React.ReactNode;
 children: React.ReactNode;
}

export function PrimaryButton({ icon, children, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button 
      className={`flex whitespace-nowrap items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 h-[42px] bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-bold text-xs md:text-sm shrink-0 shadow-lg shadow-primary/25 ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
