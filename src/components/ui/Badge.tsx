import React from 'react';
import { cn } from '../../lib/utils';

type BadgeProps = {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Badge = ({
  className,
  variant = 'default',
  ...props
}: BadgeProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-primary-100 text-primary-800': variant === 'default',
          'bg-teal-100 text-teal-800': variant === 'secondary',
          'bg-transparent border border-primary-300 text-primary-700': variant === 'outline',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'danger',
        },
        className
      )}
      {...props}
    />
  );
};

export default Badge;