import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import React from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'premium' | 'glass' | 'plain';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ 
  className, 
  variant = 'premium', 
  children,
  ...props 
}, ref) => {
  const variants = {
    premium: 'premium-card',
    glass: 'glass-panel rounded-[5rem]',
    plain: 'bg-white/[0.01] border border-white/5 rounded-[4rem] shadow-inner'
  };

  return (
    <motion.div
      ref={ref}
      className={twMerge(
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
