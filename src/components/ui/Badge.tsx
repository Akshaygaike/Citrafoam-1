import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-botanical-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        botanical: 'bg-botanical-100 text-botanical-800',
        brass: 'bg-brass-100 text-brass-800',
        info: 'bg-blue-100 text-blue-800',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        error: 'bg-red-100 text-red-800',
        neutral: 'bg-gray-100 text-gray-800',
      },
      size: {
        sm: 'text-xs px-2.5 py-0.5',
        md: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'botanical',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
