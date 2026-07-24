import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils.js';

export type SelectOption = { value: string; label: string };
type SelectProps = {
  label: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function Select({
  label,
  options,
  value,
  onValueChange,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const selected = options.find((option) => option.value === value);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  return (
    <span className="relative mt-1 block" ref={root}>
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={`${label}-options`}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border border-border bg-surface py-2 pr-3 pl-3 text-left text-sm text-foreground outline-none transition-colors hover:border-brand/40 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <span className={cn('truncate', !selected && 'text-muted-foreground')}>
          {selected?.label ?? 'Selecione'}
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          id={`${label}-options`}
          role="listbox"
          aria-label={label}
          className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface p-1.5 shadow-xl shadow-overlay/15"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onValueChange(option.value);
                setOpen(false);
              }}
              className={cn(
                'flex min-h-10 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring',
                option.value === value &&
                  'bg-brand/10 font-semibold text-brand',
              )}
            >
              {option.label}
              {option.value === value && (
                <Check className="size-4" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
