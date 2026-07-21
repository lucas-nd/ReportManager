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
          ? 'inline-flex min-h-9 items-center gap-2 rounded-full bg-success/10 px-3 text-xs font-semibold text-success'
          : 'inline-flex min-h-9 items-center gap-2 rounded-full bg-danger/10 px-3 text-xs font-semibold text-danger'
      }
      role="status"
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}
