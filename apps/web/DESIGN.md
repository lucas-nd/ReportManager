# Design System — Precision Utility

Design language for the field service reporting platform. Mobile-first, focused on operational clarity for technicians, supervisors and administrators working in-field or at desks.

## 1. Direction

**Precision utility.** Slate + electric blue. Functional, dense but breathable, engineered feel — inspired by industrial tooling and modern SaaS operations dashboards (Linear, Vercel, Retool). No decorative gradients, no purple/indigo defaults, no generic AI aesthetics.

Principles:

- **Legibility over decoration.** Contrast, whitespace and monospaced metadata do the heavy lifting.
- **Mobile-first.** Every layout scales up from ~390px. Bottom nav on mobile, no bottom nav on desktop.
- **Minimal chrome.** Cards, thin borders, subtle surfaces — no heavy shadows, no glass, no neumorphism.
- **Semantic tokens only.** Never hardcode colors in components (`text-white`, `bg-[#...]`). Everything routes through CSS variables in `src/styles.css`.

## 2. Color tokens

Defined in `src/styles.css` (OKLCH) and exposed to Tailwind via `@theme inline`. Light theme is canonical; dark theme mirrors it.

### Core surfaces

| Token             | Light                  | Purpose                       |
| ----------------- | ---------------------- | ----------------------------- |
| `--background`    | oklch(0.985 0.003 250) | App background                |
| `--surface`       | oklch(1 0 0)           | Elevated surface              |
| `--surface-muted` | oklch(0.965 0.008 250) | Inset chips, secondary blocks |
| `--card`          | oklch(1 0 0)           | Card container                |
| `--border`        | oklch(0.92 0.01 255)   | Hairline borders              |

### Foreground

| Token                | Light                | Purpose                  |
| -------------------- | -------------------- | ------------------------ |
| `--foreground`       | oklch(0.18 0.03 260) | Primary text             |
| `--muted-foreground` | oklch(0.5 0.02 258)  | Secondary text, captions |

### Brand & primary

| Token       | Value                                           | Purpose                                           |
| ----------- | ----------------------------------------------- | ------------------------------------------------- |
| `--primary` | oklch(0.22 0.04 265) — slate-900                | Primary buttons, high-contrast blocks             |
| `--brand`   | oklch(0.58 0.19 262) — electric blue (~#2563EB) | Links, active state, KPIs of interest, focus ring |

### Status

| Token                        | Value                | Usage                          |
| ---------------------------- | -------------------- | ------------------------------ |
| `--success`                  | oklch(0.68 0.15 160) | Approved, completed            |
| `--warning`                  | oklch(0.78 0.15 75)  | Adjustments requested, waiting |
| `--danger` / `--destructive` | oklch(0.62 0.22 25)  | Rejected, destructive actions  |

Rule: any new color must be added as a semantic token first, then referenced by name. No inline hex, no `bg-blue-500` utilities.

## 3. Typography

Bundled locally through `@fontsource-variable` imports in `src/main.tsx` (never load remote font URLs from `styles.css`).

- **Sans (body & UI):** Inter — `--font-sans`
- **Mono (codes, metrics, metadata, timestamps):** JetBrains Mono — `--font-mono`

Scale (Tailwind defaults):

- Page title: `text-2xl font-bold tracking-tight` (mobile) → `text-3xl` (desktop KPIs)
- Section heading: `text-xs font-bold uppercase tracking-widest text-muted-foreground`
- Body: `text-sm`
- Metadata / codes / timestamps: `font-mono text-[10px]` or `text-xs`, often `uppercase tracking-wider`

Never use serif. Never Poppins/Nunito/Roboto.

## 4. Radius, spacing, elevation

- `--radius: 0.875rem` (base). Cards use `rounded-2xl`. Chips/badges use `rounded-full` or `rounded-xl`.
- Card padding: `p-4` (list rows) → `p-6` (feature cards, dashboard tiles).
- Section gaps: `mt-6` mobile, `mt-8`–`mt-10` desktop.
- Shadow: `shadow-sm` only on the active/hero card. Everything else is a 1px `border-border`.

## 5. Layout patterns

- **Mobile shell:** `max-w-md mx-auto`, content padded `px-6`, bottom-nav clearance `pb-24`.
- **Desktop shell:** `md:max-w-4xl` (list views) or `md:max-w-6xl` (dashboard), `md:px-8 md:py-12`, `md:pb-12`.
- **AppHeader** at top of every authenticated screen; **BottomNav** mobile-only; sidebar/desktop nav rendered inline via BottomNav's responsive variant.
- **KPI grid:** `grid-cols-2` mobile → `md:grid-cols-4` desktop, `gap-3` → `md:gap-4`.
- **List row:** `flex items-center justify-between rounded-2xl border border-border bg-card p-4`, hover `border-brand/40`, trailing `ChevronRight` with `group-hover:translate-x-0.5`.

## 6. Components

Base: shadcn/ui (Radix + Tailwind). Custom components live in `src/components/`.

Key custom components:

- `AppHeader` — title, subtitle, current-user chip.
- `BottomNav` — role-aware tabs; hidden on `md+`.
- `StatusBadge` — semantic pill for `OSStatus` (pendente / em_andamento / aguardando_aprovacao / ajustes_solicitados / aprovado / reprovado / concluida). Colors mapped to `success` / `warning` / `danger` / `brand` / neutral.
- `PriorityChip` — `baixa` / `media` / `alta` / `critica`, mapped to muted / brand / warning / danger.
- `SignaturePad` — canvas-based client & technician signatures.
- `AddActivityDialog` — timeline entry composer (category + description + photos).

Buttons:

- Primary: `bg-primary text-primary-foreground`, `rounded-xl`, `font-semibold`.
- Brand CTA: `bg-brand text-brand-foreground` (used sparingly — approvals, PDF export).
- Ghost: `hover:bg-surface-muted`.
- Destructive: `bg-destructive`.

## 7. Iconography

`lucide-react`, `size-3.5` inline / `size-4` in nav / `size-5` in headers. Always paired with a text label — icons never stand alone in nav.

## 8. Motion

Restrained. `transition-colors`, `transition-transform` on hover; `duration` default. Bars/progress use `transition-all`. No page-level animations, no framer-motion by default.

## 9. Data & metadata visual language

- OS codes, times, counts → **mono**, small, often muted.
- Numeric KPIs → large, bold, tracking-tight; accent color drawn from status semantics.
- Charts (dashboard) → flat bars using `bg-brand` / `bg-primary`, no gradients, thin rounded tops.

## 10. Role-driven variation

Same design system, different information density:

- **Técnico:** single-column, big touch targets, "Continuar atendimento" hero card.
- **Supervisor:** approval queue — list-first, review actions inline.
- **Admin:** dashboard — KPI grid, bar chart, top-clients list, brand-primary summary card.

## 11. Non-negotiables

- Do not hardcode colors — always tokens.
- Do not introduce purple/indigo gradients on white.
- Do not swap Inter/JetBrains Mono without updating this doc.
- Do not `@import` remote fonts in `styles.css` — use `<link>` in `__root.tsx`.
- Keep dark theme in parity when adding new tokens.
