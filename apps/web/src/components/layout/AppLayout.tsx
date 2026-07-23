import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useSession } from '../../auth/SessionContext.js';
import { DesktopSidebar } from './Sidebar.js';
import { Header } from './Header.js';
import { layoutContentByRole } from './layoutContent.js';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useSession();

  if (!user) {
    return null;
  }

  const content = layoutContentByRole[user.role];

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <DesktopSidebar collapsed={sidebarCollapsed} content={content} />
      <div className="min-w-0 flex-1">
        <Header
          content={content}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
