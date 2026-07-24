import { CalendarDays, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/utils.js';

type Props = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  type?: 'date' | 'datetime-local';
  className?: string;
};
const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
const week = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const pad = (value: number) => String(value).padStart(2, '0');
const isoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export function DateTimeInput({
  label,
  value,
  onValueChange,
  type = 'date',
  className,
}: Props) {
  const initial = value
    ? new Date(`${value.slice(0, 10)}T12:00:00`)
    : new Date();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const root = useRef<HTMLSpanElement>(null);
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    return Array.from(
      { length: 42 },
      (_, index) =>
        new Date(
          month.getFullYear(),
          month.getMonth(),
          index - first.getDay() + 1,
        ),
    );
  }, [month]);
  const datePart = value.slice(0, 10);
  const timePart = value.includes('T') ? value.slice(11, 16) : '08:00';
  const display = value
    ? new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        ...(type === 'datetime-local' ? { timeStyle: 'short' } : {}),
      }).format(new Date(`${datePart}T${timePart}`))
    : 'Selecione a data';
  const choose = (date: Date) => {
    const next = isoDate(date);
    onValueChange(type === 'datetime-local' ? `${next}T${timePart}` : next);
    if (type === 'date') setOpen(false);
  };
  return (
    <span className="relative mt-1 block" ref={root}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'date-time-input flex h-11 w-full items-center justify-between rounded-xl border border-border bg-surface px-3 font-mono text-sm tabular-nums outline-none hover:border-brand/40 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
          className,
        )}
      >
        <span>{display}</span>
        <CalendarDays className="size-4 text-brand" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={
            type === 'datetime-local' ? 'Escolher data e hora' : 'Escolher data'
          }
          className="absolute z-50 mt-2 w-[min(20rem,calc(100vw-3rem))] rounded-2xl border border-border bg-surface p-4 shadow-xl shadow-overlay/20"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Mês anterior"
              className="rounded-lg p-2 hover:bg-surface-muted"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
            >
              <ChevronLeft className="size-4" />
            </button>
            <strong className="font-mono text-xs uppercase tracking-wider">
              {monthNames[month.getMonth()]} {month.getFullYear()}
            </strong>
            <button
              type="button"
              aria-label="Próximo mês"
              className="rounded-lg p-2 hover:bg-surface-muted"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7 text-center">
            {week.map((day, index) => (
              <span
                className="py-1 font-mono text-[10px] text-muted-foreground"
                key={`${day}-${index}`}
              >
                {day}
              </span>
            ))}
            {days.map((day) => {
              const currentMonth = day.getMonth() === month.getMonth();
              const selected = isoDate(day) === datePart;
              return (
                <button
                  type="button"
                  aria-label={day.toLocaleDateString('pt-BR')}
                  key={isoDate(day)}
                  onClick={() => choose(day)}
                  className={cn(
                    'mx-auto flex size-9 items-center justify-center rounded-lg text-sm hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring',
                    !currentMonth && 'text-muted-foreground/45',
                    selected &&
                      'bg-brand font-bold text-brand-foreground hover:bg-brand',
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
          {type === 'datetime-local' && (
            <label className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-sm font-semibold">
              <Clock className="size-4 text-brand" />
              Horário
              <input
                aria-label="Horário"
                type="time"
                value={timePart}
                onChange={(event) =>
                  onValueChange(
                    `${datePart || isoDate(new Date())}T${event.target.value}`,
                  )
                }
                className="ml-auto rounded-lg border border-border bg-background px-3 py-2 font-mono outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          )}
        </div>
      )}
    </span>
  );
}
