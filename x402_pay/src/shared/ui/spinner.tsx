import * as React from 'react';
import { cx } from '@/shared/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'brand';
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    } as const;

    const variants = {
      default: 'border-gray-200 border-t-gray-900',
      brand: 'border-gray-200 border-t-primary',
    } as const;

    return (
      <div
        ref={ref}
        className={cx(
          'inline-block animate-spin rounded-full border-2',
          sizes[size],
          variants[variant],
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner };
