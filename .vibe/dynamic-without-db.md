# Portal Dinamico sem Base de Dados

## Resposta curta

Sim, o portal pode ser bastante dinamico sem banco, desde que os dados sejam tratados como "conteudo versionado".

## Estrategia recomendada

1. **Dados como arquivos**
   - manter KPIs, tarefas e evidencias em JSON sob controle de versao.
   - usar snapshots para historico temporal.

2. **Camada de transformacao**
   - no build do portal, agregar os JSONs e produzir um arquivo pronto para UI.
   - vantagem: frontend rapido e sem chamada cara.

3. **Revalidacao em deploy**
   - cada commit publica nova versao no Netlify com dados atualizados.
   - opcional: agendar builds diarios para "freshness".

4. **Edicao controlada**
   - formulario admin gera JSON validado (schema fixo).
   - PR de atualizacao de dados pode ser revisado como codigo.

## Limites desta abordagem

- escrita concorrente e historico por usuario sao limitados;
- filtros analiticos muito complexos podem ficar lentos;
- integracoes transacionais ficam mais trabalhosas.

## Como reduzir o risco sem DB

- versionar snapshots por data;
- validar schema no CI;
- manter backup automatico (ja existe no proprio git);
- padronizar nomes e chaves para evitar drift.

## Momento certo de migrar

Migre para PostgreSQL quando os ganhos de produtividade e confiabilidade superarem o custo de operar backend e banco.
