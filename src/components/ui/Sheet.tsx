'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({ isOpen, onClose, side = 'right', title, children, className }: SheetProps) {
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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const slideVariants = {
    hidden: { x: side === 'right' ? '100%' : '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { x: side === 'right' ? '100%' : '-100%', opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-graphite/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'sheet-title' : undefined}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className={cn(
              "fixed top-0 bottom-0 z-50 flex flex-col bg-porcelain shadow-2xl",
              side === 'right' ? 'right-0' : 'left-0',
              "w-full max-w-md",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              {title && (
                <h2 id="sheet-title" className="text-xl font-display font-semibold text-graphite">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-botanical-500"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-graphite" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
