import type { UserRole } from '@report-manager/shared';
import { Gauge, type LucideIcon } from 'lucide-react';

import {
  pageTitles as technicianPageTitles,
  technicianCopy,
  technicianNavigation,
  technicianProfile,
} from '../../technician/technicianContent.js';

export type NavigationItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  pendingCount?: number;
};

export type LayoutContent = {
  areaLabel: string;
  brandSubtitle: string;
  navigation: NavigationItem[];
  offlineNotice?: string;
  pageTitles: Record<string, string>;
  profile: {
    initials: string;
    name: string;
    role: string;
  };
};

const adminContent: LayoutContent = {
  areaLabel: 'Área administrativa',
  brandSubtitle: 'Gestão da operação',
  navigation: [{ icon: Gauge, label: 'Dashboard', path: '/admin' }],
  pageTitles: {
    '/admin': 'Painel administrativo',
  },
  profile: {
    initials: 'AD',
    name: 'Administrador',
    role: 'Administrador',
  },
};

const technicianContent: LayoutContent = {
  areaLabel: technicianCopy.header.areaLabel,
  brandSubtitle: technicianCopy.brand.subtitle,
  navigation: technicianNavigation,
  offlineNotice: technicianCopy.header.offlineNotice,
  pageTitles: technicianPageTitles,
  profile: technicianProfile,
};

export const layoutContentByRole: Record<UserRole, LayoutContent> = {
  administrator: adminContent,
  technician: technicianContent,
};
