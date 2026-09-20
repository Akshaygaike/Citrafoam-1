'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  target: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ current, target, showLabel = true, className }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Delay slightly for animation on mount
    const timer = setTimeout(() => {
      setProgress(Math.min(100, Math.max(0, (current / target) * 100)));
    }, 100);
    return () => clearTimeout(timer);
  }, [current, target]);

  const remaining = Math.max(0, target - current);
  const isTargetMet = remaining === 0;

  return (
    <div className={cn("w-full flex flex-col space-y-2", className)}>
      {showLabel && (
        <div className="text-sm font-medium text-graphite text-center">
          {isTargetMet ? (
            <span className="text-emerald-600 font-bold">Free Shipping Unlocked!</span>
          ) : (
            <span>
              <span className="font-bold">₹{remaining}</span> away from free shipping
            </span>
          )}
        </div>
      )}
      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isTargetMet
              ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
              : "bg-gradient-to-r from-botanical-300 to-botanical-600"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
