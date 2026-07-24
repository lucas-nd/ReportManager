import { parseWorkflowTemplate } from '@report-manager/shared';
export const attendanceTemplate = parseWorkflowTemplate({
  schemaVersion: 1,
  id: 'technicalAttendance',
  version: '1.0.0',
  name: 'Atendimento técnico',
  initialStateId: 'checking',
  initialScreenId: 'checkOrder',
  optionSources: ['equipment', 'stepTypes', 'parts'],
  states: [
    { id: 'checking', screenId: 'checkOrder' },
    { id: 'active', screenId: 'hub' },
    { id: 'paused', screenId: 'hub' },
    { id: 'closing', screenId: 'closing' },
    { id: 'completed', screenId: 'summary', readOnly: true },
  ],
  screens: [
    {
      id: 'checkOrder',
      title: 'Conferência da ordem de serviço',
      sections: [
        {
          id: 'companySection',
          title: 'Dados da empresa',
          fields: [
            {
              id: 'companyLegalName',
              label: 'Razão social',
              binding: 'company.legalName',
              type: 'text',
            },
            {
              id: 'companyTradeName',
              label: 'Nome fantasia',
              binding: 'company.tradeName',
              type: 'text',
            },
            {
              id: 'companyTaxId',
              label: 'CNPJ',
              binding: 'company.taxId',
              type: 'text',
            },
            {
              id: 'companyAddress',
              label: 'Endereço',
              binding: 'company.address',
              type: 'text',
            },
          ],
        },
      ],
      actions: [
        {
          id: 'start',
          label: 'Confirmar e iniciar',
          action: { type: 'setState', stateId: 'active' },
        },
      ],
    },
    {
      id: 'hub',
      title: 'Atendimento',
      sections: [
        {
          id: 'stepsSection',
          title: 'Etapas do atendimento',
          fields: [
            {
              id: 'steps',
              label: 'Etapas',
              binding: 'steps',
              type: 'collection',
              itemWorkflow: 'stepFlow',
            },
          ],
        },
      ],
      actions: [],
    },
    {
      id: 'closing',
      title: 'Fechamento operacional',
      sections: [],
      actions: [],
    },
    {
      id: 'summary',
      title: 'Atendimento concluído',
      sections: [],
      actions: [],
    },
  ],
  transitions: [
    { id: 'begin', from: 'checking', to: 'active' },
    { id: 'pauseAttendance', from: 'active', to: 'paused' },
    { id: 'resumeAttendance', from: 'paused', to: 'active' },
    { id: 'closeAttendance', from: 'active', to: 'closing' },
    { id: 'completeAttendance', from: 'closing', to: 'completed' },
  ],
  subflows: [
    {
      id: 'stepFlow',
      initialStateId: 'open',
      states: [{ id: 'open' }, { id: 'paused' }, { id: 'completed' }],
    },
  ],
});
