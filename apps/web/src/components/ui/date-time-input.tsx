import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils.js';
import { Input } from './input.js';

type DateTimeInputProps = Omit<ComponentProps<typeof Input>, 'type'> & {
  type?: 'date' | 'datetime-local';
};

export function DateTimeInput({
  className,
  type = 'date',
  ...props
}: DateTimeInputProps) {
  return (
    <Input
      type={type}
      className={cn('date-time-input mt-1 font-mono tabular-nums', className)}
      {...props}
    />
  );
}
