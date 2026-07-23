import {
  CircleUserRound,
  CloudUpload,
  FileText,
  Gauge,
  RadioTower,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type TechnicianNavigationItem = {
  icon: LucideIcon;
  label: string;
  path: string;
  pendingCount?: number;
};

export const technicianNavigation: TechnicianNavigationItem[] = [
  { icon: Gauge, label: 'Dashboard', path: '/dashboard' },
  { icon: Wrench, label: 'Serviços', path: '/services' },
  { icon: FileText, label: 'Relatórios', path: '/reports' },
  {
    icon: CloudUpload,
    label: 'Uploads pendentes',
    path: '/pending-uploads',
    pendingCount: 12,
  },
  { icon: RadioTower, label: 'Sincronização', path: '/sync' },
  { icon: CircleUserRound, label: 'Minha conta', path: '/account' },
];

export const pageTitles: Record<string, string> = {
  '/dashboard': 'Visão geral',
  '/services': 'Serviços',
  '/reports': 'Relatórios',
  '/pending-uploads': 'Uploads pendentes',
  '/sync': 'Sincronização',
  '/account': 'Minha conta',
};

export const technicianProfile = {
  initials: 'LD',
  name: 'Lucas Diniz',
  role: 'Técnico de campo',
};

export const dashboardMetrics = [
  {
    description: 'Aguardando execução',
    label: 'Serviços pendentes',
    value: '5',
    tone: 'brand',
  },
  {
    description: 'Serviços em execução',
    label: 'Em andamento',
    value: '2',
    tone: 'warning',
  },
  {
    description: 'Histórico concluído',
    label: 'Relatórios enviados',
    value: '154',
    tone: 'success',
  },
  {
    description: 'Aguardando conexão',
    label: 'Sincronizações pendentes',
    value: '18',
    suffix: 'itens',
    tone: 'danger',
  },
] as const;

export const nextService = {
  address: 'Av. das Indústrias, 1840 · Distrito Industrial',
  client: 'FrioSul Alimentos',
  date: '21 jul. 2026',
  id: 'OS-2048',
  time: '08:30',
  type: 'Manutenção preventiva',
};

export const technicianCopy = {
  brand: {
    subtitle: 'Operação de campo',
  },
  header: {
    areaLabel: 'Área do técnico',
    offlineNotice:
      'Você está offline. Alterações ficarão neste dispositivo até a próxima sincronização.',
  },
  dashboard: {
    dateEyebrow: 'Segunda-feira · 20 jul.',
    greeting: 'Bom trabalho, Lucas.',
    intro: 'Confira sua operação antes de seguir para o próximo atendimento.',
    updatedAt: 'Dados atualizados às 07:42',
  },
  nextService: {
    addressLabel: 'Endereço',
    clientLabel: 'Cliente',
    dateLabel: 'Data',
    eyebrow: 'Próxima parada',
    startAction: 'Iniciar atendimento',
    timeLabel: 'Horário',
    title: 'Próximo serviço',
    todayBadge: 'Hoje',
  },
  pages: {
    account:
      'Gerencie seus dados, senha e preferências pessoais. As configurações completas serão disponibilizadas em uma próxima etapa.',
    pendingUploads:
      '12 arquivos estão armazenados neste dispositivo e serão enviados quando houver uma conexão estável.',
    reports:
      'Consulte os relatórios já enviados e acesse o histórico dos atendimentos concluídos.',
    services:
      'Aqui você encontrará os atendimentos atribuídos, poderá consultar os detalhes e iniciar a execução em campo.',
    sync: 'Acompanhe a troca de dados deste dispositivo com a operação central.',
  },
} as const;
