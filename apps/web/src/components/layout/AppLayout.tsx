import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { DesktopSidebar } from './Sidebar.js';
import { Header } from './Header.js';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <div className="min-w-0 flex-1">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
