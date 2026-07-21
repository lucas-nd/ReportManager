import { Moon, Sun } from 'lucide-react';

import { useTheme } from '../../theme/ThemeProvider.js';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground outline-none transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onClick={toggleTheme}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
