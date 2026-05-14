import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'hover:bg-white/[0.05] text-gray-800 hover:text-white',
    outline: 'border-2 border-white/5 hover:border-white/20 text-white shadow-inner',
    glass: 'bg-white/[0.01] border-2 border-white/5 backdrop-blur-3xl hover:bg-white/[0.05] hover:border-white/20 text-white shadow-inner'
  };

  const sizes = {
    sm: 'px-8 py-4 text-[12px]',
    md: 'px-10 py-6 text-[14px]',
    lg: 'px-12 py-8 text-2xl',
    xl: 'px-16 py-10 text-4xl'
  };

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled && !isLoading ? { scale: 1.05, y: -4 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
      disabled={disabled || isLoading}
      className={twMerge(
        'inline-flex items-center justify-center rounded-[4rem] font-black uppercase tracking-[0.4em] transition-all duration-[1000ms] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed italic',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={40} />
      ) : children}
    </motion.button>
  );
});

Button.displayName = 'Button';
