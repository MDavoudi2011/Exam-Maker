import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/styles.util';

export function Modal({ isOpen, onClose, children, maxWidth = 'max-w-2xl' }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, maxWidth?: string }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-[72px] md:top-0 inset-x-0 bottom-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className={cn(`relative w-full ${maxWidth} bg-card rounded-3xl shadow-xl flex flex-col h-full md:h-auto md:max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden border border-border`)}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, icon: Icon, onClose }: { title: string, icon?: React.ElementType, onClose?: () => void }) {
  return (
    <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30 z-10">
      <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
        {Icon && <Icon className="w-5 h-5 text-primary" />} 
        {title}
      </h3>
      {onClose && (
        <button onClick={onClose} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("p-6 overflow-y-auto space-y-6 custom-scrollbar text-foreground", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 border-t border-border bg-muted/30 z-10 flex gap-3">
      {children}
    </div>
  );
}
