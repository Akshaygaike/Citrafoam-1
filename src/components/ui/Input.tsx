import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, required, leftIcon, rightIcon, id, ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || defaultId;
    const hasError = !!error;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-graphite">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-graphite/50">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            required={required}
            className={cn(
              "flex h-11 w-full rounded-lg bg-porcelain border border-graphite/20 px-3 py-2 text-sm text-graphite placeholder:text-graphite/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical-500 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              hasError && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-graphite/50">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn("text-xs", hasError ? "text-red-500" : "text-graphite/60")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, required, id, ...props }, ref) => {
    const defaultId = useId();
    const textareaId = id || defaultId;
    const hasError = !!error;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-graphite">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          required={required}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg bg-porcelain border border-graphite/20 px-3 py-2 text-sm text-graphite placeholder:text-graphite/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical-500 disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn("text-xs", hasError ? "text-red-500" : "text-graphite/60")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, required, id, children, ...props }, ref) => {
    const defaultId = useId();
    const selectId = id || defaultId;
    const hasError = !!error;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-graphite">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          required={required}
          className={cn(
            "flex h-11 w-full rounded-lg bg-porcelain border border-graphite/20 px-3 py-2 text-sm text-graphite transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-botanical-500 disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {(error || helperText) && (
          <p className={cn("text-xs", hasError ? "text-red-500" : "text-graphite/60")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
