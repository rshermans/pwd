# Riscos e Mitigacoes

## Risco 1: Dados inconsistentes entre homepage e portal

**Mitigacao:**
- unica fonte de dados em JSON versionado;
- validacao automatica no CI;
- responsavel semanal pelo fechamento dos numeros.

## Risco 2: Operacao depende de uma pessoa

**Mitigacao:**
- playbook de atualizacao simples;
- checklist operacional por ritual;
- ownership claro por persona.

## Risco 3: Queda de cadencia de conteudo

**Mitigacao:**
- planeamento semanal com backlog minimo;
- definicao de "conteudo minimo viavel";
- template reutilizavel por canal.

## Risco 4: Narrativa fraca para oportunidades

**Mitigacao:**
- registrar baseline no inicio;
- publicar resultados mensais com comparativo;
- transformar aprendizados em ativos publicos (posts, relatorios, demos).

## Risco 5: Bloqueio tecnico no PostgreSQL

**Mitigacao:**
- manter operacao sem DB como caminho principal no curto prazo;
- preparar migracao por etapas;
- considerar alternativa temporaria (Supabase/Neon/SQLite cloud) se Oracle atrasar.
