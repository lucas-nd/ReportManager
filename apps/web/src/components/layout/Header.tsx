import { useLocation } from 'react-router-dom';

import { useConnectionStatus } from '../../hooks/useConnectionStatus.js';
import {
  pageTitles,
  technicianCopy,
} from '../../technician/technicianContent.js';
import { ConnectionStatus } from './ConnectionStatus.js';
import { MobileSidebar } from './Sidebar.js';
import { ThemeToggle } from './ThemeToggle.js';

export function Header() {
  const location = useLocation();
  const isOnline = useConnectionStatus();
  const title = pageTitles[location.pathname] ?? 'Report Manager';

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 md:h-[4.5rem] md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <MobileSidebar />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                {technicianCopy.header.areaLabel}
              </p>
              <h1 className="truncate text-lg font-bold tracking-tight md:text-xl">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionStatus isOnline={isOnline} />
            <ThemeToggle />
          </div>
        </div>
      </header>
      {!isOnline ? (
        <div
          className="border-b border-danger/20 bg-danger/8 px-4 py-2 text-center text-xs font-medium text-danger"
          role="alert"
        >
          {technicianCopy.header.offlineNotice}
        </div>
      ) : null}
    </>
  );
}
