# Guia de Setup — blockchain.pt no Notion

## Estrutura sugerida da página

```
📋 blockchain.pt — Plano Mai–Jun 2026
├── 📌 Contexto e Objetivos  (texto)
├── 📊 KPIs (tabela simples)
├── ✅ Tarefas (database principal)
│   ├── Vista: Board (por Status)
│   ├── Vista: Por Semana
│   ├── Vista: Por Canal
│   └── Vista: Timeline
└── 📁 Recursos
    ├── Link Instagram
    ├── Link WhatsApp
    └── Link Webinar (quando disponível)
```

---

## Passo 1 — Importar o CSV

1. Abre o Notion e cria uma página nova
2. Escreve `/import` e escolhe **Import > CSV**
3. Seleciona o ficheiro `blockchain_pt_tarefas.csv`
4. O Notion cria automaticamente uma database com todas as 38 tarefas

---

## Passo 2 — Ajustar os tipos de propriedades

Após a importação, vai a cada coluna e define o tipo correto:

| Propriedade | Tipo no Notion |
|---|---|
| Tarefa | Title (já é por defeito) |
| Fase | Select |
| Semana | Select |
| Data Início | Date |
| Canal | Multi-select |
| Status | Status (ou Select) |
| Notas | Text |

Para **Status**, usa as opções:
- 🔘 Por fazer
- 🔵 Em curso
- ✅ Concluído
- ⏸ Bloqueado

---

## Passo 3 — Criar as vistas

### Vista 1: Board por Status (recomendada para uso diário)
- Clica em **Add a view > Board**
- Agrupa por: **Status**
- Mostra colunas: Tarefa, Semana, Canal

### Vista 2: Agrupado por Semana
- **Add a view > Table**
- Agrupa por: **Semana**
- Útil para ver o que fazer esta semana

### Vista 3: Filtrado por Canal
- **Add a view > Table**
- Filtra por: **Canal = Instagram** (duplica para cada canal)
- Útil para sessões de criação de conteúdo

### Vista 4: Timeline
- **Add a view > Timeline**
- Data de início: **Data Início**
- Agrupa por: **Fase**
- Dá visão geral das 8 semanas

---

## Passo 4 — Publicar e partilhar

### Para partilhar como página pública (só leitura):
1. Clica em **Share** (canto superior direito)
2. Ativa **Publish to web**
3. Copia o link e partilha com os colegas

### Para dar acesso de edição a colegas:
1. **Share > Invite**
2. Insere o email de cada colega
3. Define permissão: **Can edit** ou **Can comment**
- "Can edit" → marcam tarefas e adicionam notas
- "Can comment" → só comentam, não editam

---

## Passo 5 — Bloco de KPIs (adicionar à página)

Cria uma tabela simples acima da database com os objetivos mínimos:

| Canal | Métrica | Objetivo |
|---|---|---|
| Instagram | Seguidores | 200 |
| Instagram | Posts publicados | 20 |
| WhatsApp | Membros ativos | 50 |
| Podcast | Episódios | 2 |
| Webinar | Registos | 50 |
| Webinar | Participantes ao vivo | 30 |
| LinkedIn | Artigos | 3 |
| Speakers | Confirmados | 3 |

---

## Dica de manutenção

Uma vez por semana (sugestão: segunda-feira de manhã):
1. Abre a vista **Por Semana**
2. Marca o que foi feito na semana anterior como ✅ Concluído
3. Move o que está "Em curso" ou atualiza o estado
4. Adiciona notas nos itens com contexto útil para os colegas

---

*Template gerado para blockchain.pt — v1.0 | Mai 2026*
