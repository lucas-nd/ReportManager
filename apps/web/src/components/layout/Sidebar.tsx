import * as Dialog from '@radix-ui/react-dialog';
import { ClipboardCheck, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useSession } from '../../auth/SessionContext.js';

import { cn } from '../../lib/utils.js';
import type { LayoutContent, NavigationItem } from './layoutContent.js';

function Brand({
  compact = false,
  subtitle,
}: {
  compact?: boolean;
  subtitle: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
        <ClipboardCheck className="size-5" aria-hidden="true" />
      </div>
      <div className={cn('min-w-0', compact && 'hidden')}>
        <p className="truncate text-sm font-bold tracking-tight">
          Report Manager
        </p>
        <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function PendingSyncBadge({ count }: { count: number }) {
  return (
    <span className="ml-auto rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-bold text-brand">
      {count}
    </span>
  );
}

export function SidebarItem({
  compact,
  item,
  onNavigate,
}: {
  compact?: boolean;
  item: NavigationItem;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
          isActive &&
            'bg-brand/10 font-semibold text-brand hover:bg-brand/10 hover:text-brand',
        )
      }
      to={item.path}
      title={compact ? item.label : undefined}
      onClick={onNavigate}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className={cn('truncate', compact && 'hidden')}>{item.label}</span>
      {item.pendingCount ? (
        <span className={cn(compact && 'hidden')}>
          <PendingSyncBadge count={item.pendingCount} />
        </span>
      ) : null}
    </NavLink>
  );
}

function SignOutButton({
  compact,
  onSignOut,
}: {
  compact?: boolean;
  onSignOut: () => void;
}) {
  return (
    <div className="border-t border-border pt-4">
      <button
        type="button"
        className={cn(
          'mt-3 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-danger/10 hover:text-danger focus-visible:ring-2 focus-visible:ring-ring',
          compact && 'md:justify-center',
        )}
        aria-label="Sair"
        onClick={onSignOut}
      >
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        <span className={cn(compact && 'hidden')}>Sair</span>
      </button>
    </div>
  );
}

function SidebarContent({
  compact,
  content,
  onNavigate,
}: {
  compact?: boolean;
  content: LayoutContent;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const { signOut } = useSession();

  function handleSignOut() {
    signOut();
    onNavigate?.();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex h-full flex-col">
      <Brand compact={compact} subtitle={content.brandSubtitle} />
      <nav
        className="mt-8 flex flex-1 flex-col gap-1"
        aria-label="Navegação principal"
      >
        {content.navigation.map((item) => (
          <SidebarItem
            compact={compact}
            item={item}
            key={item.path}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <SignOutButton compact={compact} onSignOut={handleSignOut} />
    </div>
  );
}

export function DesktopSidebar({
  collapsed,
  content,
}: {
  collapsed: boolean;
  content: LayoutContent;
}) {
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-svh shrink-0 border-r border-border bg-surface p-4 transition-[width] md:block',
        collapsed ? 'w-20' : 'w-72',
      )}
    >
      <SidebarContent compact={collapsed} content={content} />
    </aside>
  );
}

export function MobileSidebar({ content }: { content: LayoutContent }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-overlay/55 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(86vw,20rem)] border-r border-border bg-surface p-5 outline-none">
          <Dialog.Title className="sr-only">Menu principal</Dialog.Title>
          <Dialog.Description className="sr-only">
            Navegação da área do técnico
          </Dialog.Description>
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-xl text-muted-foreground outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Fechar menu"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </Dialog.Close>
          <SidebarContent content={content} onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
