import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'soft' | 'danger';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = 'primary', 
  isLoading, 
  size = 'md',
  children,
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-charcoal text-white hover:bg-warm-800 shadow-sm',
    secondary: 'bg-white border border-warm-200 text-charcoal hover:bg-warm-50 shadow-sm',
    soft: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
    ghost: 'hover:bg-warm-100 text-warm-600 hover:text-charcoal',
    outline: 'border border-warm-200 hover:border-warm-300 text-charcoal',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled && !isLoading ? { y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      className={twMerge(
        'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin mr-2" size={20} />
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
