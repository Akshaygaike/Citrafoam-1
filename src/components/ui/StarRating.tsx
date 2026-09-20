'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function StarRating({ rating, size = 'md', interactive = false, onChange, className }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[...Array(5)].map((_, i) => {
        const fill = displayRating >= i + 1 ? '100%' : displayRating > i ? `${(displayRating - i) * 100}%` : '0%';
        const isFull = fill === '100%';
        const isEmpty = fill === '0%';
        
        return (
          <div
            key={i}
            className={cn(
              "relative",
              interactive && "cursor-pointer hover:scale-110 transition-transform"
            )}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Empty Star Background */}
            <Star className={cn("text-gray-300", sizeStyles[size])} strokeWidth={isEmpty && !interactive ? 2 : 1.5} />
            
            {/* Filled Star Overlay */}
            {!isEmpty && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: fill }}
              >
                <Star
                  className={cn("fill-[#F59E0B] text-[#F59E0B]", sizeStyles[size])}
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
