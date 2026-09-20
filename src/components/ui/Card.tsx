import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'glass rounded-2xl transition-all duration-300',
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:shadow-card-hover hover:-translate-y-1',
        false: '',
      },
    },
    defaultVariants: {
      padding: 'md',
      hover: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, padding, hover, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ padding, hover, className }))} {...props}>
      {children}
    </div>
  );
}
