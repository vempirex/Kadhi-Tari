import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import React from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'primary' | 'glass' | 'soft' | 'outline' | 'flat';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ 
  className, 
  variant = 'primary', 
  children,
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-white border border-warm-200 shadow-soft',
    glass: 'bg-white/70 border border-white/20 backdrop-blur-xl',
    soft: 'bg-warm-50 border border-warm-100',
    outline: 'border border-warm-200',
    flat: 'bg-white shadow-none border-none'
  };

  return (
    <motion.div
      ref={ref}
      className={twMerge(
        'rounded-3xl transition-all duration-300',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
