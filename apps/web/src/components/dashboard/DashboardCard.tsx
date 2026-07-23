import type { LucideIcon } from 'lucide-react';

import { cn } from '../../lib/utils.js';

type DashboardCardProps = {
  description: string;
  icon: LucideIcon;
  label: string;
  suffix?: string;
  tone: 'brand' | 'warning' | 'success' | 'danger';
  value: string;
};

const toneStyles = {
  brand: 'bg-brand/10 text-brand',
  danger: 'bg-danger/10 text-danger',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning-foreground',
};

export function DashboardCard({
  description,
  icon: Icon,
  label,
  suffix,
  tone,
  value,
}: DashboardCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-brand/30 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-5">{label}</p>
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-xl',
            toneStyles[tone],
          )}
        >
          <Icon className="size-4" aria-hidden={true} />
        </div>
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <strong className="font-mono text-3xl font-bold tracking-tight">
          {value}
        </strong>
        {suffix ? (
          <span className="font-mono text-xs text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </article>
  );
}
