type AccessPageProps = {
  description: string;
  title: string;
};

function AccessPage({ description, title }: AccessPageProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6 text-foreground">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </section>
    </main>
  );
}

export function ForgotPasswordPage() {
  return (
    <AccessPage
      title="Recuperar senha"
      description="Informe seu e-mail para iniciar a recuperação da conta."
    />
  );
}

export function ResetPasswordPage() {
  return (
    <AccessPage
      title="Redefinir senha"
      description="Escolha uma nova senha para sua conta."
    />
  );
}

export function ForbiddenPage() {
  return (
    <AccessPage
      title="Acesso negado"
      description="Seu perfil não tem acesso a esta página."
    />
  );
}

export function AdminHomePage() {
  return (
    <section className="mx-auto w-full max-w-7xl p-4 sm:p-6 md:p-8">
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm leading-6 text-muted-foreground">
          Gerencie usuários, cadastros e ordens de serviço.
        </p>
      </div>
    </section>
  );
}

export function TechnicianHomePage() {
  return (
    <AccessPage
      title="Serviços atribuídos"
      description="Consulte e execute seus atendimentos."
    />
  );
}
