import {
  BriefcaseBusiness,
  CheckCircle2,
  CloudUpload,
  FileText,
  RefreshCw,
  Settings2,
  TimerReset,
  UserRound,
  Wrench,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { DashboardCard } from '../components/dashboard/DashboardCard.js';
import { NextServiceCard } from '../components/dashboard/NextServiceCard.js';
import { PageContainer } from '../components/layout/PageContainer.js';
import { Button } from '../components/ui/button.js';
import {
  dashboardMetrics,
  technicianCopy,
} from '../technician/technicianContent.js';

const metricIcons = [
  BriefcaseBusiness,
  Wrench,
  CheckCircle2,
  TimerReset,
] as const;

export function TechnicianDashboardPage() {
  return (
    <PageContainer>
      <section aria-labelledby="dashboard-summary">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
              {technicianCopy.dashboard.dateEyebrow}
            </p>
            <h2
              id="dashboard-summary"
              className="mt-1 text-2xl font-bold tracking-tight"
            >
              {technicianCopy.dashboard.greeting}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {technicianCopy.dashboard.intro}
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {technicianCopy.dashboard.updatedAt}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {dashboardMetrics.map((metric, index) => (
            <DashboardCard
              {...metric}
              icon={metricIcons[index]!}
              key={metric.label}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 md:mt-8" aria-label="Agenda operacional">
        <NextServiceCard />
      </section>
    </PageContainer>
  );
}

export function PlaceholderPage({
  children,
  description,
  icon: Icon,
  title,
}: {
  children?: ReactNode;
  description: string;
  icon: typeof Wrench;
  title: string;
}) {
  return (
    <PageContainer>
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {children}
      </section>
    </PageContainer>
  );
}

export function ServicesPage() {
  return (
    <PlaceholderPage
      description={technicianCopy.pages.services}
      icon={Wrench}
      title="Serviços"
    />
  );
}

export function ReportsPage() {
  return (
    <PlaceholderPage
      description={technicianCopy.pages.reports}
      icon={FileText}
      title="Relatórios"
    />
  );
}

export function PendingUploadsPage() {
  return (
    <PlaceholderPage
      description={technicianCopy.pages.pendingUploads}
      icon={CloudUpload}
      title="Uploads pendentes"
    />
  );
}

export function SyncPage() {
  return (
    <PlaceholderPage
      description={technicianCopy.pages.sync}
      icon={RefreshCw}
      title="Sincronização"
    >
      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Último envio', 'Hoje, 07:42'],
          ['Último download', 'Hoje, 07:40'],
          ['Status', '18 itens pendentes'],
        ].map(([term, detail]) => (
          <div
            className="rounded-xl border border-border bg-surface-muted p-4"
            key={term}
          >
            <dt className="text-xs text-muted-foreground">{term}</dt>
            <dd className="mt-1 font-mono text-xs font-semibold">{detail}</dd>
          </div>
        ))}
      </dl>
      <Button
        type="button"
        className="mt-5 bg-brand text-brand-foreground hover:bg-brand/90"
      >
        <RefreshCw className="mr-2 size-4" aria-hidden="true" />
        Sincronizar agora
      </Button>
    </PlaceholderPage>
  );
}

export function AccountPage() {
  return (
    <PlaceholderPage
      description={technicianCopy.pages.account}
      icon={UserRound}
      title="Minha conta"
    >
      <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
        <span className="rounded-full bg-surface-muted px-3 py-2">
          Dados pessoais
        </span>
        <span className="rounded-full bg-surface-muted px-3 py-2">
          Alterar senha
        </span>
        <span className="rounded-full bg-surface-muted px-3 py-2">
          <Settings2 className="mr-1.5 inline size-3.5" aria-hidden="true" />
          Preferências
        </span>
      </div>
    </PlaceholderPage>
  );
}
