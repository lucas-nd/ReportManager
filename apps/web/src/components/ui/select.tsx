import { ChevronDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils.js';

export function Select({
  className,
  children,
  ...props
}: ComponentProps<'select'>) {
  return (
    <span className="relative mt-1 block">
      <select
        className={cn(
          'h-11 w-full appearance-none rounded-xl border border-border bg-surface py-2 pr-10 pl-3 text-sm text-foreground outline-none transition-colors hover:border-brand/40 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </span>
  );
}
