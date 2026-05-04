# Roadmap de Implementacao

## Fase 1 - Operacao Solida sem DB (1 a 2 semanas)

**Objetivo:** garantir previsibilidade e rotina.

Entregas:
- padrao unico para atualizar `docs/data/state.json`;
- calendario semanal por canal;
- checklist de "publicado + evidenciado + medido";
- links bidirecionais entre homepage e portal.

Definicao de pronto:
- qualquer pessoa da equipa consegue atualizar status em menos de 10 minutos;
- homepage e portal mostram os mesmos numeros-base.

## Fase 2 - Automacao Leve (2 a 4 semanas)

**Objetivo:** reduzir operacao manual.

Entregas:
- GitHub Action para validar schema dos JSONs;
- GitHub Action para gerar snapshot semanal automatico;
- pagina de "health" com ultimo update e qualidade dos dados.

Definicao de pronto:
- erros de formato nao chegam a producao;
- evolucao semanal fica registrada sem trabalho repetitivo.

## Fase 3 - Storytelling de Performance (4 a 8 semanas)

**Objetivo:** transformar dados em autoridade de mercado.

Entregas:
- secao "Resultados" no portal com comparativos;
- template de relatorio mensal para stakeholders;
- baseline + ganho + aprendizado + proximo experimento.

Definicao de pronto:
- existe uma narrativa clara de impacto para apresentar em reunioes.

## Fase 4 - Escala com PostgreSQL (quando necessario)

**Objetivo:** aumentar confiabilidade e capacidade analitica.

Entregas:
- API de escrita autenticada;
- modelo de dados para KPIs, tarefas e evidencias;
- rotina de backup e observabilidade basica;
- migracao gradual mantendo compatibilidade com JSON.

Definicao de pronto:
- plataforma suporta multiplos editores sem perda de dados.
