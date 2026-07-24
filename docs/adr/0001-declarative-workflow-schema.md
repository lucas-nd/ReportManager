# ADR 0001: schema declarativo próprio para workflows

## Status

Aceito

## Contexto

O Atendimento exige formulários condicionais, estados operacionais, telas e subfluxos repetíveis. Formulários React codificados acoplariam o domínio à interface. JSON Schema descreveria valores, mas exigiria contratos paralelos para telas, transições e ações.

## Decisão

Adotar um contrato Zod próprio, versionado e totalmente serializável em JSON. O contrato descreve campos, condições seguras, telas, estados, transições, ações, fontes de opções e subfluxos. A aplicação resolve fontes externas e renderizadores por tipo.

Templates publicados são imutáveis. Toda instância guarda `templateId` e `templateVersion` e nunca muda implicitamente de versão.

## Consequências

O motor pode validar referências antes da execução e a UI não precisa conhecer o domínio do Atendimento. Em contrapartida, o schema e suas migrações futuras são responsabilidade do produto. Editor, publicação e migração de instâncias permanecem fora desta entrega.
