import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  Pause,
  Play,
  Plus,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer.js';
import { Button } from '../components/ui/button.js';
import { DateTimeInput } from '../components/ui/date-time-input.js';
import { Select } from '../components/ui/select.js';
import { AttachmentStore } from '../workflow/engine.js';

type StepStatus = 'active' | 'paused' | 'completed';
type Step = {
  id: string;
  type: string;
  otherType?: string;
  equipment: string[];
  startedAt: string;
  endedAt?: string;
  summary: string;
  measurements: { name: string; value: string; unit: string }[];
  parts: { name: string; quantity: string }[];
  photos: {
    reference: string;
    name: string;
    category: string;
    caption: string;
  }[];
  notes: string;
  status: StepStatus;
  pauseReason?: string;
  pauseNote?: string;
};
const order = {
  id: 'OS-2026-0142',
  company: {
    legalName: 'FrioSul Alimentos S.A.',
    tradeName: 'FrioSul Alimentos',
    taxId: '12.345.678/0001-90',
    address: 'Av. das Indústrias, 1840 · Distrito Industrial',
  },
  equipment: ['Chiller Carrier 30XW', 'Bomba Grundfos NB 50-200'],
  request: 'Baixa eficiência térmica e ruído anormal no circuito secundário.',
};
const emptyStep = (): Step => ({
  id: crypto.randomUUID(),
  type: '',
  equipment: [],
  startedAt: new Date().toISOString().slice(0, 16),
  summary: '',
  measurements: [],
  parts: [],
  photos: [],
  notes: '',
  status: 'active',
});
const field =
  'mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm';
const label = 'text-sm font-semibold';
const closingTextFields = [
  ['diagnosis', 'Diagnóstico'],
  ['result', 'Resultado geral'],
  ['equipmentCondition', 'Condição final dos equipamentos'],
  ['recommendations', 'Recomendações'],
] as const;

export function AttendancePage() {
  const { serviceOrderId } = useParams();
  const [screen, setScreen] = useState<
    'checking' | 'hub' | 'step' | 'pause' | 'closing' | 'completed'
  >('checking');
  const [attendancePaused, setAttendancePaused] = useState(false);
  const [company, setCompany] = useState(order.company);
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingId, setEditingId] = useState<string>();
  const [draft, setDraft] = useState<Step>(emptyStep);
  const [pauseReason, setPauseReason] = useState('');
  const [pauseNote, setPauseNote] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [closing, setClosing] = useState({
    diagnosis: '',
    result: '',
    incomplete: false,
    returnDecision: '',
    recommendations: '',
    technicianSignature: '',
    clientName: '',
    clientSignature: '',
    clientUnavailable: false,
    clientJustification: '',
    equipmentCondition: '',
  });
  const attachments = useMemo(() => new AttachmentStore(), []);
  const openStep = steps.find((item) => item.status !== 'completed');
  const updateDraft = <K extends keyof Step>(key: K, value: Step[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  function saveStep(mode: 'save' | 'complete') {
    const problems = [
      !draft.type && 'Informe o tipo da etapa.',
      draft.equipment.length === 0 && 'Selecione ao menos um equipamento.',
      mode === 'complete' &&
        !draft.summary.trim() &&
        'O resumo é obrigatório para concluir.',
    ].filter(Boolean) as string[];
    if (problems.length) return setErrors(problems);
    const saved = {
      ...draft,
      status: mode === 'complete' ? ('completed' as const) : draft.status,
      endedAt:
        mode === 'complete'
          ? new Date().toISOString().slice(0, 16)
          : draft.endedAt,
    };
    setSteps((current) =>
      editingId
        ? current.map((item) => (item.id === editingId ? saved : item))
        : [...current, saved],
    );
    setErrors([]);
    setEditingId(undefined);
    setScreen('hub');
  }
  function editStep(step: Step) {
    if (step.status === 'completed') return;
    setDraft(step);
    setEditingId(step.id);
    setErrors([]);
    setScreen('step');
  }
  function pauseStep() {
    if (!pauseReason) return setErrors(['Informe o motivo da pausa.']);
    setSteps((current) =>
      current.map((item) =>
        item.id === editingId
          ? { ...draft, status: 'paused', pauseReason, pauseNote }
          : item,
      ),
    );
    setErrors([]);
    setScreen('hub');
  }
  function validateClosing() {
    const problems = [
      !closing.diagnosis && 'Informe o diagnóstico.',
      !closing.result && 'Informe o resultado geral.',
      !closing.equipmentCondition &&
        'Informe a condição final dos equipamentos.',
      closing.incomplete &&
        !closing.returnDecision &&
        'Defina a decisão de retorno.',
      !closing.technicianSignature && 'A assinatura do técnico é obrigatória.',
      !closing.clientUnavailable &&
        !closing.clientName &&
        'Identifique o cliente.',
      !closing.clientUnavailable &&
        !closing.clientSignature &&
        'Colete a assinatura do cliente.',
      closing.clientUnavailable &&
        !closing.clientJustification &&
        'Justifique a ausência ou recusa do cliente.',
    ].filter(Boolean) as string[];
    if (problems.length) return setErrors(problems);
    setErrors([]);
    setScreen('completed');
  }
  const ErrorBox = () =>
    errors.length ? (
      <div
        role="alert"
        className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm"
      >
        <ul className="list-disc pl-5">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    ) : null;

  if (screen === 'checking')
    return (
      <PageContainer>
        <div className="mx-auto max-w-3xl">
          <Link
            to="/services"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ChevronLeft className="size-4" /> Serviços
          </Link>
          <section className="rounded-2xl border border-border bg-card p-6">
            <p className="font-mono text-xs text-brand">
              {serviceOrderId ?? order.id}
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Conferência da ordem de serviço
            </h2>
            <p className="mt-2 text-muted-foreground">
              Confira os dados antes de iniciar. As informações deste
              atendimento existem apenas nesta sessão.
            </p>
            <div className="mt-6 rounded-xl border border-border bg-surface-muted/50 p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">Dados da empresa</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Confira ou complete o cadastro
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className={label}>
                  Razão social
                  <input
                    aria-label="Razão social"
                    className={field}
                    value={company.legalName}
                    onChange={(event) =>
                      setCompany((current) => ({
                        ...current,
                        legalName: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className={label}>
                  Nome fantasia
                  <input
                    aria-label="Nome fantasia"
                    className={field}
                    value={company.tradeName}
                    onChange={(event) =>
                      setCompany((current) => ({
                        ...current,
                        tradeName: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className={label}>
                  CNPJ
                  <input
                    aria-label="CNPJ"
                    className={field}
                    inputMode="numeric"
                    placeholder="00.000.000/0000-00"
                    value={company.taxId}
                    onChange={(event) =>
                      setCompany((current) => ({
                        ...current,
                        taxId: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className={label}>
                  Endereço
                  <input
                    aria-label="Endereço da empresa"
                    className={field}
                    value={company.address}
                    onChange={(event) =>
                      setCompany((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Solicitação</dt>
                <dd>{order.request}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Equipamentos</dt>
                <dd>{order.equipment.join(' · ')}</dd>
              </div>
            </dl>
            <Button
              className="mt-6 bg-brand text-brand-foreground"
              onClick={() => setScreen('hub')}
            >
              Confirmar e iniciar
            </Button>
          </section>
        </div>
      </PageContainer>
    );

  if (screen === 'step')
    return (
      <PageContainer>
        <div className="mx-auto max-w-4xl">
          <button
            className="mb-4 text-sm text-muted-foreground"
            onClick={() => setScreen('hub')}
          >
            ← Voltar ao atendimento
          </button>
          <h2 className="text-2xl font-bold">
            {editingId ? 'Editar etapa' : 'Nova etapa'}
          </h2>
          <ErrorBox />
          <div className="mt-5 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            <label className={label}>
              Tipo
              <Select
                aria-label="Tipo da etapa"
                value={draft.type}
                onChange={(event) => updateDraft('type', event.target.value)}
              >
                <option value="">Selecione</option>
                <option>Diagnóstico</option>
                <option>Manutenção preventiva</option>
                <option>Reparo</option>
                <option>Teste operacional</option>
                <option>Outro</option>
              </Select>
            </label>
            {draft.type === 'Outro' && (
              <label className={label}>
                Outro tipo
                <input
                  className={field}
                  value={draft.otherType ?? ''}
                  onChange={(event) =>
                    updateDraft('otherType', event.target.value)
                  }
                />
              </label>
            )}
            <fieldset className="sm:col-span-2">
              <legend className={label}>Equipamentos</legend>
              {order.equipment.map((equipment) => (
                <label className="mt-2 mr-5 inline-flex gap-2" key={equipment}>
                  <input
                    type="checkbox"
                    checked={draft.equipment.includes(equipment)}
                    onChange={(event) =>
                      updateDraft(
                        'equipment',
                        event.target.checked
                          ? [...draft.equipment, equipment]
                          : draft.equipment.filter(
                              (item) => item !== equipment,
                            ),
                      )
                    }
                  />
                  {equipment}
                </label>
              ))}
            </fieldset>
            <label className={label}>
              Início
              <DateTimeInput
                aria-label="Início"
                type="datetime-local"
                value={draft.startedAt}
                onChange={(event) =>
                  updateDraft('startedAt', event.target.value)
                }
              />
            </label>
            <label className={label}>
              Fim
              <DateTimeInput
                aria-label="Fim"
                type="datetime-local"
                value={draft.endedAt ?? ''}
                onChange={(event) => updateDraft('endedAt', event.target.value)}
              />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Resumo
              <textarea
                className={field}
                rows={3}
                value={draft.summary}
                onChange={(event) => updateDraft('summary', event.target.value)}
              />
            </label>
            <Collection
              title="Medições"
              items={draft.measurements.map(
                (item) => `${item.name}: ${item.value} ${item.unit}`,
              )}
              onAdd={() =>
                updateDraft('measurements', [
                  ...draft.measurements,
                  { name: 'Pressão', value: '0', unit: 'bar' },
                ])
              }
            />
            <Collection
              title="Peças"
              items={draft.parts.map(
                (item) => `${item.name} (${item.quantity})`,
              )}
              onAdd={() =>
                updateDraft('parts', [
                  ...draft.parts,
                  { name: 'Item avulso', quantity: '1' },
                ])
              }
            />
            <div className="sm:col-span-2">
              <span className={label}>Fotos</span>
              <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border p-5 text-sm">
                <Camera className="size-4" /> Câmera ou galeria
                <input
                  aria-label="Adicionar foto"
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file)
                      updateDraft('photos', [
                        ...draft.photos,
                        {
                          reference: attachments.add(file),
                          name: file.name,
                          category: 'Evidência',
                          caption: '',
                        },
                      ]);
                  }}
                />
              </label>
              {draft.photos.map((photo) => (
                <p className="mt-2 text-sm" key={photo.reference}>
                  {photo.name} · {photo.category}
                </p>
              ))}
            </div>
            <label className={`${label} sm:col-span-2`}>
              Observações
              <textarea
                className={field}
                rows={3}
                value={draft.notes}
                onChange={(event) => updateDraft('notes', event.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button onClick={() => saveStep('save')}>Salvar etapa</Button>
              <Button
                className="bg-brand text-brand-foreground"
                onClick={() => saveStep('complete')}
              >
                Concluir etapa
              </Button>
              {editingId && draft.status !== 'completed' && (
                <Button variant="outline" onClick={() => setScreen('pause')}>
                  <Pause className="mr-2 size-4" />
                  Pausar etapa
                </Button>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    );

  if (screen === 'pause')
    return (
      <PageContainer>
        <section className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-bold">Pausar etapa</h2>
          <ErrorBox />
          <label className={`${label} mt-5 block`}>
            Motivo
            <Select
              aria-label="Motivo da pausa"
              value={pauseReason}
              onChange={(event) => setPauseReason(event.target.value)}
            >
              <option value="">Selecione</option>
              <option>Aguardando peça</option>
              <option>Aguardando cliente</option>
              <option>Condição insegura</option>
              <option>Outro</option>
            </Select>
          </label>
          <label className={`${label} mt-4 block`}>
            Observação
            <textarea
              className={field}
              value={pauseNote}
              onChange={(event) => setPauseNote(event.target.value)}
            />
          </label>
          <Button className="mt-5" onClick={pauseStep}>
            Confirmar pausa
          </Button>
        </section>
      </PageContainer>
    );

  if (screen === 'closing')
    return (
      <PageContainer>
        <section className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold">Fechamento operacional</h2>
          <ErrorBox />
          <div className="mt-5 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            {closingTextFields.map(([key, text]) => (
              <label className={label} key={key}>
                {text}
                <textarea
                  className={field}
                  value={closing[key]}
                  onChange={(event) =>
                    setClosing({ ...closing, [key]: event.target.value })
                  }
                />
              </label>
            ))}
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={closing.incomplete}
                onChange={(event) =>
                  setClosing({ ...closing, incomplete: event.target.checked })
                }
              />
              Há pendência ou estado incompleto
            </label>
            {closing.incomplete && (
              <label className={`${label} sm:col-span-2`}>
                Decisão de retorno
                <input
                  className={field}
                  value={closing.returnDecision}
                  onChange={(event) =>
                    setClosing({
                      ...closing,
                      returnDecision: event.target.value,
                    })
                  }
                />
              </label>
            )}
            <label className={label}>
              Assinatura do técnico
              <input
                aria-label="Assinatura do técnico"
                className={field}
                placeholder="Digite o nome para assinar"
                value={closing.technicianSignature}
                onChange={(event) =>
                  setClosing({
                    ...closing,
                    technicianSignature: event.target.value,
                  })
                }
              />
            </label>
            <label className={label}>
              Identificação do cliente
              <input
                className={field}
                value={closing.clientName}
                disabled={closing.clientUnavailable}
                onChange={(event) =>
                  setClosing({ ...closing, clientName: event.target.value })
                }
              />
            </label>
            <label className={label}>
              Assinatura do cliente
              <input
                aria-label="Assinatura do cliente"
                className={field}
                value={closing.clientSignature}
                disabled={closing.clientUnavailable}
                onChange={(event) =>
                  setClosing({
                    ...closing,
                    clientSignature: event.target.value,
                  })
                }
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={closing.clientUnavailable}
                onChange={(event) =>
                  setClosing({
                    ...closing,
                    clientUnavailable: event.target.checked,
                  })
                }
              />
              Cliente ausente ou recusou
            </label>
            {closing.clientUnavailable && (
              <label className={`${label} sm:col-span-2`}>
                Justificativa
                <input
                  className={field}
                  value={closing.clientJustification}
                  onChange={(event) =>
                    setClosing({
                      ...closing,
                      clientJustification: event.target.value,
                    })
                  }
                />
              </label>
            )}
            <Button
              className="bg-brand text-brand-foreground sm:col-span-2"
              onClick={validateClosing}
            >
              Concluir atendimento
            </Button>
          </div>
        </section>
      </PageContainer>
    );

  if (screen === 'completed')
    return (
      <PageContainer>
        <section className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8">
          <CheckCircle2 className="size-12 text-success" />
          <p className="mt-4 font-mono text-xs text-brand">{order.id}</p>
          <h2 className="mt-1 text-2xl font-bold">Atendimento concluído</h2>
          <p className="mt-2 text-muted-foreground">
            Resumo somente leitura · {steps.length} etapa(s) concluída(s)
          </p>
          <dl className="mt-6 grid gap-4">
            <div>
              <dt className="text-xs text-muted-foreground">Diagnóstico</dt>
              <dd>{closing.diagnosis}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Resultado</dt>
              <dd>{closing.result}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                Assinatura do técnico
              </dt>
              <dd>{closing.technicianSignature}</dd>
            </div>
          </dl>
          <Link className="mt-6 inline-block text-brand" to="/services">
            Voltar aos serviços
          </Link>
        </section>
      </PageContainer>
    );

  return (
    <PageContainer>
      <section className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-brand">{order.id}</p>
            <h2 className="text-2xl font-bold">Atendimento</h2>
            <p className="text-muted-foreground">
              {company.tradeName ||
                company.legalName ||
                'Empresa não identificada'}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${attendancePaused ? 'bg-warning/15' : 'bg-success/15'}`}
          >
            {attendancePaused ? 'Pausado' : 'Em andamento'}
          </span>
        </div>
        <ErrorBox />
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Etapas do atendimento</h3>
              <Button
                disabled={Boolean(openStep) || attendancePaused}
                onClick={() => {
                  setDraft(emptyStep());
                  setEditingId(undefined);
                  setScreen('step');
                }}
              >
                <Plus className="mr-2 size-4" />
                Nova etapa
              </Button>
            </div>
            {openStep && (
              <p role="alert" className="mt-3 text-sm text-warning">
                Conclua ou retome a etapa atual antes de criar outra.
              </p>
            )}
            <div className="mt-4 space-y-3">
              {steps.length === 0 && (
                <p className="rounded-xl bg-surface-muted p-5 text-sm text-muted-foreground">
                  Nenhuma etapa registrada.
                </p>
              )}
              {steps.map((step, index) => (
                <button
                  className="w-full rounded-xl border border-border p-4 text-left disabled:cursor-default disabled:opacity-80"
                  disabled={step.status === 'completed'}
                  key={step.id}
                  onClick={() => editStep(step)}
                >
                  <span className="font-semibold">
                    Etapa {index + 1} · {step.type}
                  </span>
                  <span className="ml-2 rounded-full bg-surface-muted px-2 py-1 text-xs">
                    {step.status === 'completed'
                      ? 'Concluída'
                      : step.status === 'paused'
                        ? 'Pausada'
                        : 'Ativa'}
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.equipment.join(', ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <aside className="flex min-w-52 flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setAttendancePaused((value) => !value)}
            >
              {attendancePaused ? (
                <Play className="mr-2 size-4" />
              ) : (
                <Pause className="mr-2 size-4" />
              )}
              {attendancePaused ? 'Retomar atendimento' : 'Pausar atendimento'}
            </Button>
            <Button
              disabled={
                attendancePaused ||
                steps.length === 0 ||
                steps.some((step) => step.status !== 'completed')
              }
              className="bg-brand text-brand-foreground"
              onClick={() => setScreen('closing')}
            >
              <CheckCircle2 className="mr-2 size-4" />
              Fechamento
            </Button>
          </aside>
        </div>
      </section>
    </PageContainer>
  );
}

function Collection({
  title,
  items,
  onAdd,
}: {
  title: string;
  items: string[];
  onAdd: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className={label}>{title}</span>
        <button type="button" className="text-sm text-brand" onClick={onAdd}>
          + Adicionar
        </button>
      </div>
      {items.map((item, index) => (
        <p
          className="mt-2 rounded-lg bg-surface-muted p-2 text-sm"
          key={`${item}-${index}`}
        >
          {item}
        </p>
      ))}
    </div>
  );
}
