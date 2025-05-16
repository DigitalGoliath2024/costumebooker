import React from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-[1.02]',
          {
            'bg-gradient-to-br from-teal-500 via-primary-600 to-primary-700 text-white shadow-[0_0_15px_rgba(49,196,141,0.15)] hover:shadow-[0_0_25px_rgba(49,196,141,0.25)] hover:from-teal-600 hover:via-primary-700 hover:to-primary-800 focus-visible:ring-primary-500': variant === 'primary',
            'bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 text-white shadow-[0_0_15px_rgba(128,149,171,0.15)] hover:shadow-[0_0_25px_rgba(128,149,171,0.25)] hover:from-accent-600 hover:via-accent-700 hover:to-accent-800 focus-visible:ring-accent-400': variant === 'secondary',
            'border-2 border-primary-200 bg-white text-primary-700 hover:bg-gray-50 focus-visible:ring-primary-400 shadow-sm hover:shadow': variant === 'outline',
            'bg-transparent hover:bg-primary-50 text-primary-700 focus-visible:ring-primary-400': variant === 'ghost',
            'underline-offset-4 hover:underline text-primary-600 focus-visible:ring-primary-500': variant === 'link',
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;