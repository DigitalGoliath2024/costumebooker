import React from 'react';
import { cn } from '../../lib/utils';

type CardProps = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-accent-200 bg-white shadow-sm overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type CardHeaderProps = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const CardHeader = ({ className, children, ...props }: CardHeaderProps) => {
  return (
    <div
      className={cn('px-6 py-4 border-b border-accent-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

type CardTitleProps = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

const CardTitle = ({ className, children, ...props }: CardTitleProps) => {
  return (
    <h3
      className={cn('text-lg font-semibold text-accent-900', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

type CardDescriptionProps = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = ({
  className,
  children,
  ...props
}: CardDescriptionProps) => {
  return (
    <p
      className={cn('text-sm text-accent-500', className)}
      {...props}
    >
      {children}
    </p>
  );
};

type CardContentProps = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const CardContent = ({ className, children, ...props }: CardContentProps) => {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
};

type CardFooterProps = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const CardFooter = ({ className, children, ...props }: CardFooterProps) => {
  return (
    <div
      className={cn('px-6 py-4 border-t border-accent-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };