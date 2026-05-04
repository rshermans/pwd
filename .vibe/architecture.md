# Arquitetura: Atual e Alvo

## Estado Atual (recomendado agora)

### Camada 1: GitHub Repository
- Fonte de verdade para conteudos, docs, estado e historico.
- Versionamento de mudancas e rastreabilidade por commit.

### Camada 2: GitHub Pages (`docs/`)
- Homepage institucional com:
  - backlog e tarefas;
  - KPIs principais;
  - links para conteudos e portal.
- Publicacao estatica e confiavel.

### Camada 3: Portal Netlify (`portal/`)
- Interface de demonstracao com UX mais rica.
- Leitura de dados de fontes estaticas (JSON/MD) versionadas.
- Deploy continuo para iterar rapidamente.

## Como manter dinamico sem DB

1. Centralizar dados operacionais em JSON no repositorio (ex.: `docs/data/state.json`).
2. Criar snapshots semanais (ex.: `docs/data/snapshots/2026-05-01.json`).
3. Portal consome snapshots e gera:
   - tendencia;
   - comparativo semanal;
   - progresso por KPI.
4. Atualizacao pode ser manual (export/import) ou automatizada por GitHub Actions.

## Arquitetura Alvo (quando escalar)

- Backend API leve (Node/Next Route Handlers) para escrita segura.
- PostgreSQL (Oracle Cloud) para historico transacional.
- ETL simples para manter arquivos publicos anonimizados no `docs/data`.

## Gatilhos para migrar para PostgreSQL

- Mais de 2 editores simultaneos causando conflito frequente.
- Necessidade de historico de auditoria por usuario.
- Regras complexas de agregacao e filtros em tempo real.
- Integracao com automacoes externas (CRM, BI, webhook de redes).
