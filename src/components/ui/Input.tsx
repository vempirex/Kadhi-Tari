import React from 'react';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  className, 
  icon: Icon, 
  error, 
  label,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2 group w-full">
      {label && (
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1 group-focus-within:text-rose-400 transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute top-1/2 -translate-y-1/2 left-6 text-gray-600 group-focus-within:text-rose-500 transition-colors">
            <Icon size={20} strokeWidth={2.5} />
          </div>
        )}
        <input
          ref={ref}
          className={twMerge(
            "input-field",
            Icon && "pl-16",
            error && "border-rose-500/50 focus:border-rose-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest px-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
