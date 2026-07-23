import { ArrowRight, Eye, EyeOff, Hammer, Lock, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/button.js';
import { Checkbox } from '../components/ui/checkbox.js';
import { Input } from '../components/ui/input.js';
import { useSession } from '../auth/SessionContext.js';

const interactiveLink =
  'inline-flex min-h-11 items-center rounded-sm text-brand outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticationError, setAuthenticationError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthenticationError(!signIn(email, password));
  }

  return (
    <main className="grid min-h-svh bg-background text-foreground md:grid-cols-2">
      <aside className="hidden min-h-svh flex-col justify-between bg-primary p-12 text-primary-foreground md:flex">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/10 font-mono text-sm font-bold">
            FF
          </div>
          <span className="text-lg font-bold tracking-tight">
            Report Manager
          </span>
        </div>

        <div className="max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary-foreground/50">
            Plataforma de serviços em campo
          </p>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight">
            Do check-in do técnico à gestão administrativa, tudo em um único
            fluxo.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-6 text-primary-foreground/60">
            Documente execuções em campo, revise e aprove relatórios e acompanhe
            a operação em tempo real.
          </p>
        </div>

        <p className="font-mono text-xs text-primary-foreground/40">
          v1.1 · MVP
        </p>
      </aside>

      <section className="flex min-h-svh items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Hammer className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight tracking-tight">
                Report Manager
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Entrar na plataforma
              </p>
            </div>
          </div>

          <header>
            <h1 className="text-2xl font-bold tracking-tight">
              Acesse sua conta
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use seu e-mail corporativo e senha para continuar.
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                htmlFor="email"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  className="pl-10"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                htmlFor="password"
              >
                Senha
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="px-10"
                  aria-invalid={authenticationError}
                  aria-describedby={
                    authenticationError ? 'authentication-error' : undefined
                  }
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <label
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl text-sm text-muted-foreground outline-none"
              htmlFor="remember-me"
            >
              <Checkbox
                id="remember-me"
                aria-label="Manter-me conectado"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              Manter-me conectado
            </label>

            {authenticationError && (
              <p
                id="authentication-error"
                className="text-sm text-danger"
                role="alert"
              >
                E-mail ou senha inválidos.
              </p>
            )}

            <Button
              type="submit"
              className="h-12 w-full bg-brand text-sm font-bold uppercase tracking-wider text-brand-foreground hover:bg-brand/90"
            >
              Entrar
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </form>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full border-border hover:border-brand/40"
            onClick={() => navigate('/forgot-password')}
          >
            Esqueci minha senha
          </Button>

          <div className="space-y-8">
            <p className="text-center text-xs text-muted-foreground">
              Não tem acesso?{' '}
              <a
                className={`${interactiveLink} font-semibold`}
                href="#administrator"
                onClick={(event) => event.preventDefault()}
              >
                Fale com seu administrador
              </a>
            </p>
            <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
              MVP · demo visual
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
