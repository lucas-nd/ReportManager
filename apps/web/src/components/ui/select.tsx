import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../lib/utils.js';
export type SelectOption = { value: string; label: string };
type Props = {
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
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(
    Math.max(
      0,
      options.findIndex((o) => o.value === value),
    ),
  );
  const root = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const selected = options.find((o) => o.value === value);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  useEffect(() => {
    const pointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', pointer);
    return () => document.removeEventListener('pointerdown', pointer);
  }, []);
  const keyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'Home' ||
      e.key === 'End'
    ) {
      e.preventDefault();
      setOpen(true);
      setActive((current) =>
        e.key === 'Home'
          ? 0
          : e.key === 'End'
            ? options.length - 1
            : e.key === 'ArrowDown'
              ? (current + 1) % options.length
              : (current - 1 + options.length) % options.length,
      );
    }
    if (e.key === 'Enter' && open) {
      e.preventDefault();
      onValueChange(options[active]?.value ?? '');
      close();
    }
  };
  return (
    <span className="relative mt-1 block" ref={root}>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={keyDown}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border border-border bg-surface px-3 text-left text-sm outline-none hover:border-brand/40 focus-visible:ring-2 focus-visible:ring-ring/20',
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
        />
      </button>
      {open && (
        <div
          id={`${id}-options`}
          role="listbox"
          aria-label={label}
          className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface p-1.5 shadow-xl shadow-overlay/15"
        >
          {options.map((option, index) => (
            <button
              id={`${id}-option-${index}`}
              key={option.value}
              tabIndex={-1}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setActive(index)}
              onClick={() => {
                onValueChange(option.value);
                close();
              }}
              className={cn(
                'flex min-h-10 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm outline-none',
                index === active && 'bg-surface-muted',
                option.value === value &&
                  'bg-brand/10 font-semibold text-brand',
              )}
            >
              {option.label}
              {option.value === value && <Check className="size-4" />}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
