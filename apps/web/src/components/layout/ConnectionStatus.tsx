import { Wifi, WifiOff } from 'lucide-react';

type ConnectionStatusProps = {
  isOnline: boolean;
};

export function ConnectionStatus({ isOnline }: ConnectionStatusProps) {
  const Icon = isOnline ? Wifi : WifiOff;

  return (
    <div
      className={
        isOnline
          ? 'inline-flex min-h-9 items-center gap-0 rounded-full bg-success/10 px-2 @min-[34rem]/header:gap-2 @min-[34rem]/header:px-3 text-xs font-semibold text-success'
          : 'inline-flex min-h-9 items-center gap-0 rounded-full bg-danger/10 px-2 @min-[34rem]/header:gap-2 @min-[34rem]/header:px-3 text-xs font-semibold text-danger'
      }
      role="status"
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span className="sr-only @min-[34rem]/header:not-sr-only">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}
