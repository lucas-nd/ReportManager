import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Snowflake,
} from 'lucide-react';

import { Button } from '../ui/button.js';
import {
  nextService,
  technicianCopy,
} from '../../technician/technicianContent.js';

export function NextServiceCard() {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-brand/25 bg-card shadow-sm">
      <div className="absolute inset-y-0 left-0 w-1 bg-brand" />
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
              {technicianCopy.nextService.eyebrow} · {nextService.id}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              {technicianCopy.nextService.title}
            </h2>
          </div>
          <span className="rounded-full bg-warning/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-warning-foreground">
            {technicianCopy.nextService.todayBadge}
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Snowflake className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {technicianCopy.nextService.clientLabel}
              </p>
              <p className="mt-0.5 text-lg font-bold">{nextService.client}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {nextService.type}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-surface-muted p-4">
            <MapPin
              className="mt-0.5 size-4 shrink-0 text-brand"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {technicianCopy.nextService.addressLabel}
              </p>
              <p className="mt-1 text-sm font-medium leading-5">
                {nextService.address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 border-border lg:border-l lg:pl-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3">
              <CalendarDays
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {technicianCopy.nextService.dateLabel}
              </p>
              <p className="mt-1 font-mono text-xs font-semibold">
                {nextService.date}
              </p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <Clock3
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {technicianCopy.nextService.timeLabel}
              </p>
              <p className="mt-1 font-mono text-xs font-semibold">
                {nextService.time}
              </p>
            </div>
          </div>
          <Button className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
            {technicianCopy.nextService.startAction}
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}
