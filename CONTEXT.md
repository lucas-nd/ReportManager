# Contexto de domínio

- **Ordem de Serviço (OS):** demanda atribuída ao técnico, com cliente, local, equipamentos e solicitação. Existe antes da execução.
- **Atendimento:** execução operacional única e pausável de uma OS. Reúne etapas e fechamento.
- **Etapa:** unidade repetível de trabalho dentro do Atendimento. Somente uma pode estar ativa ou pausada por vez; uma etapa concluída é imutável no fluxo operacional.
- **Template:** definição declarativa e imutável de telas, campos, regras e transições.
- **Versão de Template:** revisão publicada de um template. Versões publicadas não mudam.
- **Instância:** respostas e posição de uma execução, sempre ligadas ao ID e à versão exata do template.
- **Estado do Workflow:** posição operacional da instância (por exemplo, ativo, pausado ou concluído).
- **Tela:** composição visual apresentada para um estado. Tela e estado são conceitos separados para permitir reutilização.

Nesta entrega, serviços e instâncias são seeds em memória. Recarregar a aplicação descarta o Atendimento em curso e restaura o estado inicial.
