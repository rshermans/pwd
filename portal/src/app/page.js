"use client";
import { useEffect, useMemo, useState } from 'react';

const IconPortal = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const IconChat = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const IconChart = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const IconSend = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const IconLink = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;

const CATEGORIES = [
  { id: 'ig', title: 'Instagram', emoji: '📸', desc: 'Posts, Stories e Analytics', link: '../conteudo/instagram/index.html' },
  { id: 'li', title: 'LinkedIn', emoji: '💼', desc: 'Artigos e Presença Profissional', link: '../conteudo/linkedin/index.html' },
  { id: 'wa', title: 'WhatsApp', emoji: '📱', desc: 'Gestão da Comunidade', link: '../conteudo/whatsapp/index.html' },
  { id: 'nl', title: 'Newsletter', emoji: '📧', desc: 'Campanhas semanais', link: '../conteudo/newsletter/index.html' },
  { id: 'vid', title: 'Vídeos', emoji: '🎬', desc: 'Clips curtos e YouTube', link: '../conteudo/videos/index.html' },
  { id: 'pod', title: 'Podcast', emoji: '🎙️', desc: 'Entrevistas gravadas', link: '../conteudo/podcast/index.html' },
  { id: 'web', title: 'Webinar', emoji: '🌐', desc: 'Página de registo e specs', link: '../conteudo/webinar/index.html' },
  { id: '3atl', title: '3ATL', emoji: '📝', desc: 'Avaliações e Entregáveis', link: '../3atl/index.html' },
  { id: 'art', title: 'Artefactos', emoji: '📂', desc: 'Ficheiros base do projeto', link: '../artefacts/index.html' },
];

const KPI_LABELS = {
  ig_seg: 'Instagram - seguidores',
  ig_posts: 'Instagram - posts',
  ig_eng: 'Instagram - engagement',
  wa_mem: 'WhatsApp - membros ativos',
  wa_int: 'WhatsApp - interacoes/semana',
  pod_ep: 'Podcast - episodios',
  ent: 'Entrevistas publicadas',
  web_reg: 'Webinar - registos',
  web_live: 'Webinar - participantes ao vivo',
  web_sp: 'Webinar - speakers confirmados',
  li_art: 'LinkedIn - artigos',
  web_lp: 'Website - landing page webinar'
};

const DATA_BASE_URL =
  process.env.NEXT_PUBLIC_DATA_BASE_URL ||
  'https://raw.githubusercontent.com/rshermans/pwd/main/docs/data';
const CONTENT_BASE_URL =
  process.env.NEXT_PUBLIC_CONTENT_BASE_URL ||
  'https://rshermans.github.io/pwd';

function parseEvidenceDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return null;
  const parts = dateString.split('/');
  if (parts.length < 2) return null;
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2] || new Date().getFullYear());
  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function withContentBase(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${CONTENT_BASE_URL}${path.replace('..', '')}`;
}

function downloadJson(filename, payload) {
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('portal');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou o assistente RAG do projeto blockchain.pt. Posso ajudar a encontrar links, resumir documentos ou indicar as próximas tarefas da semana. Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');
  const [stateData, setStateData] = useState(null);
  const [snapshotData, setSnapshotData] = useState([]);
  const [dataStatus, setDataStatus] = useState({ loading: true, error: '' });
  const [draftRaw, setDraftRaw] = useState('');
  const [draftStatus, setDraftStatus] = useState({ ok: true, message: '' });

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const stateResponse = await fetch(`${DATA_BASE_URL}/state.json`, { cache: 'no-store' });
        if (!stateResponse.ok) throw new Error('Nao foi possivel carregar state.json');
        const stateJson = await stateResponse.json();

        const indexResponse = await fetch(`${DATA_BASE_URL}/snapshots/index.json`, { cache: 'no-store' });
        let indexJson = { snapshots: [] };
        if (indexResponse.ok) {
          indexJson = await indexResponse.json();
        }

        const snapshots = Array.isArray(indexJson.snapshots) ? indexJson.snapshots : [];
        const ordered = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));
        const lastTwo = ordered.slice(-2);

        const resolvedSnapshots = await Promise.all(
          lastTwo.map(async (entry) => {
            const response = await fetch(`${DATA_BASE_URL}/snapshots/${entry.file}`, { cache: 'no-store' });
            if (!response.ok) return null;
            return { ...entry, payload: await response.json() };
          })
        );

        if (!mounted) return;
        setStateData(stateJson);
        setDraftRaw(JSON.stringify(stateJson, null, 2));
        setSnapshotData(resolvedSnapshots.filter(Boolean));
        setDataStatus({ loading: false, error: '' });
      } catch (error) {
        if (!mounted) return;
        setDataStatus({ loading: false, error: error instanceof Error ? error.message : 'Erro ao carregar dados' });
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  function validateDraftJson(value) {
    try {
      const parsed = JSON.parse(value);
      if (!parsed || typeof parsed !== 'object') throw new Error('JSON invalido');
      if (!parsed.tasks || !parsed.kpis || !Array.isArray(parsed.evidence)) {
        throw new Error('Precisa conter tasks, kpis e evidence');
      }
      return { ok: true, parsed, message: 'JSON valido' };
    } catch (error) {
      return {
        ok: false,
        parsed: null,
        message: error instanceof Error ? error.message : 'JSON invalido'
      };
    }
  }

  const results = useMemo(() => {
    if (!stateData) return [];

    const currentKpis = stateData.kpis || {};
    const previous = snapshotData.length > 0 ? snapshotData[0]?.payload?.kpis || {} : {};

    return Object.entries(currentKpis)
      .map(([key, value]) => {
        const prevValue = Number(previous[key] || 0);
        const curValue = Number(value || 0);
        const delta = curValue - prevValue;
        return {
          id: key,
          label: KPI_LABELS[key] || key,
          current: curValue,
          previous: prevValue,
          delta
        };
      })
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  }, [snapshotData, stateData]);

  const dataHealth = useMemo(() => {
    if (!stateData) return { lastUpdateText: 'Sem dados', evidenceCount: 0, snapshotCount: 0 };
    const evidences = Array.isArray(stateData.evidence) ? stateData.evidence : [];
    const latestEvidence = evidences
      .map((e) => ({ ...e, parsedDate: parseEvidenceDate(e.date) }))
      .filter((e) => e.parsedDate)
      .sort((a, b) => b.parsedDate - a.parsedDate)[0];

    return {
      lastUpdateText: latestEvidence?.date || 'Nao informado',
      evidenceCount: evidences.length,
      snapshotCount: snapshotData.length
    };
  }, [snapshotData.length, stateData]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `Esta funcionalidade RAG está a ser preparada. Quando implementarmos a API, vou procurar nos seus ficheiros locais e responder contextualmente a "${input}".` 
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#0f1115] text-[#f0f0f2] overflow-hidden font-sans selection:bg-[#22c55e] selection:text-white">
      
      <aside className="w-64 border-r border-white/5 bg-white/[0.02] flex flex-col backdrop-blur-xl">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
            pwd Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Knowledge Base</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('portal')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'portal' ? 'bg-[#22c55e]/10 text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <IconPortal />
            <span className="font-medium text-sm">Links e Conteúdos</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'chat' ? 'bg-[#22c55e]/10 text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <IconChat />
            <span className="font-medium text-sm">Assistente IA (RAG)</span>
          </button>

          <button
            onClick={() => setActiveTab('resultados')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'resultados' ? 'bg-[#22c55e]/10 text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <IconChart />
            <span className="font-medium text-sm">Resultados</span>
          </button>

          <button
            onClick={() => setActiveTab('atualizacao')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === 'atualizacao' ? 'bg-[#22c55e]/10 text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <IconPortal />
            <span className="font-medium text-sm">Atualizacao (Admin)</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-white/5">
          <a href="../docs/index.html" className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:border-[#22c55e] hover:bg-[#22c55e]/10 transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            Voltar ao Dashboard
          </a>
        </div>
      </aside>

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#22c55e]/10 blur-[120px] rounded-full pointer-events-none"></div>

        {activeTab === 'portal' && (
          <div className="flex-1 overflow-y-auto p-10 z-10 animate-in fade-in duration-500">
            <header className="mb-10">
              <h2 className="text-3xl font-semibold mb-2">Repositório de Conteúdos</h2>
              <p className="text-gray-400">Acesso rápido aos artefatos, redes sociais e documentos do projeto.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map(cat => (
                <a 
                  key={cat.id} 
                  href={withContentBase(cat.link)}
                  target="_blank"
                  rel="noreferrer"
                  className="group block p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#22c55e]/50 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{cat.emoji}</div>
                    <h3 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                      {cat.title}
                      <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#22c55e]">
                        <IconLink />
                      </span>
                    </h3>
                    <p className="text-sm text-gray-400">{cat.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6 z-10 h-full animate-in fade-in duration-500">
            <header className="mb-6 text-center">
              <h2 className="text-2xl font-semibold mb-1 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                Assistente RAG
              </h2>
              <p className="text-sm text-gray-400">Pergunte aos documentos do projeto (PT-PT / EN)</p>
            </header>

            <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 leading-relaxed text-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#22c55e] text-[#0f1115] font-medium rounded-tr-sm' 
                        : 'bg-white/[0.05] text-gray-200 border border-white/10 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/[0.01] border-t border-white/[0.05]">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Faça uma pergunta sobre o projeto..." 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-full py-4 pl-6 pr-16 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/50 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 p-2.5 rounded-full bg-[#22c55e] text-[#0f1115] hover:bg-[#1ea850] disabled:opacity-50 disabled:hover:bg-[#22c55e] transition-colors"
                  >
                    <IconSend />
                  </button>
                </form>
                <div className="text-center mt-3 text-[10px] text-gray-500">
                  Respostas baseadas nos ficheiros do projeto. Pode conter imprecisões.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resultados' && (
          <div className="flex-1 overflow-y-auto p-10 z-10 animate-in fade-in duration-500">
            <header className="mb-10">
              <h2 className="text-3xl font-semibold mb-2">Resultados e Tendencia</h2>
              <p className="text-gray-400">
                Comparativo entre o estado atual e o ultimo snapshot semanal.
              </p>
            </header>

            {dataStatus.loading && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-gray-300">
                A carregar dados...
              </div>
            )}

            {!dataStatus.loading && dataStatus.error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-sm text-red-200">
                {dataStatus.error}
              </div>
            )}

            {!dataStatus.loading && !dataStatus.error && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Ultima atualizacao</p>
                    <p className="text-xl font-semibold">{dataHealth.lastUpdateText}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Evidencias registadas</p>
                    <p className="text-xl font-semibold">{dataHealth.evidenceCount}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Snapshots carregados</p>
                    <p className="text-xl font-semibold">{dataHealth.snapshotCount}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {results.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-gray-300">
                      Ainda nao existem KPIs preenchidos no estado atual.
                    </div>
                  )}

                  {results.map((item) => {
                    const up = item.delta >= 0;
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-center justify-between gap-6"
                      >
                        <div>
                          <p className="text-sm text-gray-400">{item.label}</p>
                          <p className="text-2xl font-semibold mt-1">{item.current}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${up ? 'text-green-400' : 'text-red-400'}`}>
                            {up ? '+' : ''}
                            {item.delta} vs semana anterior
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Anterior: {item.previous}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'atualizacao' && (
          <div className="flex-1 overflow-y-auto p-10 z-10 animate-in fade-in duration-500">
            <header className="mb-8">
              <h2 className="text-3xl font-semibold mb-2">Atualizacao do Estado</h2>
              <p className="text-gray-400">
                Edite o `state.json` aqui e descarregue os ficheiros prontos para commit.
              </p>
            </header>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
              <p className="text-sm text-gray-300">
                Fluxo recomendado: carregar dados atuais, editar JSON, validar, descarregar `state.json` e criar snapshot com 1 clique.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Depois, substitua em `docs/data/` no repositório e faça commit.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0f1115]/80 p-4 mb-4">
              <textarea
                value={draftRaw}
                onChange={(event) => setDraftRaw(event.target.value)}
                className="w-full h-[420px] bg-transparent text-sm font-mono text-gray-200 outline-none"
                spellCheck={false}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const result = validateDraftJson(draftRaw);
                  setDraftStatus({ ok: result.ok, message: result.message });
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
              >
                Validar JSON
              </button>

              <button
                onClick={() => {
                  const result = validateDraftJson(draftRaw);
                  if (!result.ok) {
                    setDraftStatus({ ok: false, message: result.message });
                    return;
                  }
                  downloadJson('state.json', result.parsed);
                  setDraftStatus({ ok: true, message: 'state.json descarregado' });
                }}
                className="px-4 py-2 rounded-lg bg-[#22c55e] text-[#0f1115] text-sm font-medium hover:bg-[#1ea850]"
              >
                Descarregar state.json
              </button>

              <button
                onClick={() => {
                  const result = validateDraftJson(draftRaw);
                  if (!result.ok) {
                    setDraftStatus({ ok: false, message: result.message });
                    return;
                  }
                  const today = new Date().toISOString().slice(0, 10);
                  downloadJson(`${today}.json`, result.parsed);
                  setDraftStatus({ ok: true, message: `Snapshot ${today}.json descarregado` });
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
              >
                Criar snapshot (download)
              </button>
            </div>

            <p className={`mt-4 text-sm ${draftStatus.ok ? 'text-green-400' : 'text-red-400'}`}>
              {draftStatus.message || 'Pronto para editar e validar.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
