# .vibe - Blueprint de Execucao

Esta pasta organiza a estrategia para transformar este repositorio em um ecossistema com tres camadas:

1. `docs/` no GitHub Pages como homepage oficial de tarefas, status e direcionamento.
2. `portal/` no Netlify como vitrine dinamica de conteudos e resultados.
3. Repositorio GitHub como fonte de verdade para conteudos, evidencias e historico.

## Objetivo do Case

Criar um caso de sucesso replicavel que demonstre:
- capacidade de gestao orientada por dados (KPIs + cadencia);
- operacao de conteudo multi-canal com rastreabilidade;
- governanca simples sem depender de banco de dados no inicio;
- caminho claro de evolucao para stack com PostgreSQL.

## Conteudo desta pasta

- `vision.md`: visao de produto, metas e proposta de valor.
- `personas.md`: papeis e responsabilidades (PO, Manager, Operacao, Stakeholders).
- `architecture.md`: arquitetura atual e alvo (sem DB e com DB).
- `implementation-roadmap.md`: plano em fases com entregas semanais.
- `kpis-and-rituals.md`: framework de medicao e rituais de acompanhamento.
- `dynamic-without-db.md`: como manter o portal dinamico sem base de dados.
- `risks-and-mitigations.md`: riscos principais e mitigacoes praticas.
- `success-case-playbook.md`: como transformar o projeto em estudo de caso.

## Como usar

1. Ler `vision.md` e `personas.md` para alinhar linguagem de negocio.
2. Executar a Fase 1 do `implementation-roadmap.md` (operacao sem DB).
3. Medir semanalmente com `kpis-and-rituals.md`.
4. Preparar narrativas de impacto com `success-case-playbook.md`.
5. Migrar para DB apenas quando os gatilhos tecnicos forem atingidos.
