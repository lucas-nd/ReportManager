import { ChevronsLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { useConnectionStatus } from '../../hooks/useConnectionStatus.js';
import { cn } from '../../lib/utils.js';

import { ConnectionStatus } from './ConnectionStatus.js';
import type { LayoutContent } from './layoutContent.js';
import { MobileSidebar } from './Sidebar.js';
import { ThemeToggle } from './ThemeToggle.js';

type HeaderProps = {
  content: LayoutContent;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

export function Header({
  content,
  sidebarCollapsed,
  onToggleSidebar,
}: HeaderProps) {
  const location = useLocation();
  const isOnline = useConnectionStatus();
  const title = content.pageTitles[location.pathname] ?? 'Report Manager';

  return (
    <>
      <header className="@container/header sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 md:h-[4.5rem] md:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <MobileSidebar content={content} />
            <button
              type="button"
              className="hidden size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
              aria-label={
                sidebarCollapsed
                  ? 'Expandir menu lateral'
                  : 'Recolher menu lateral'
              }
              onClick={onToggleSidebar}
            >
              <ChevronsLeft
                className={cn(
                  'size-4 transition-transform',
                  sidebarCollapsed && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                {content.areaLabel}
              </p>
              <h1 className="truncate text-lg font-bold tracking-tight md:text-xl">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionStatus isOnline={isOnline} />
            <ThemeToggle />
            <div className="flex items-center gap-2 border-l border-border pl-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted font-mono text-xs font-bold text-foreground">
                {content.profile.initials}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-semibold">
                  {content.profile.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {content.profile.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      {!isOnline && content.offlineNotice ? (
        <div
          className="border-b border-danger/20 bg-danger/8 px-4 py-2 text-center text-xs font-medium text-danger"
          role="alert"
        >
          {content.offlineNotice}
        </div>
      ) : null}
    </>
  );
}
