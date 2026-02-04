import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Search, Sigma, Zap, ArrowLeft, Maximize, 
  Bot, Send, Ghost, X, Shield, Play, Terminal,
  LayoutGrid, Flame, Trophy, Target, Clock, Settings
} from 'lucide-react';
import htm from 'htm';
import { GoogleGenAI } from "@google/genai";
import { GAMES } from './data/games.ts';
import { GameCategory } from './types.ts';

const html = htm.bind(React.createElement);

const ARES_HUD = ({ activeGame }: { activeGame?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ 
    role: 'ai', 
    text: 'ARES-1 Tactical Interface ready. I can provide strategy briefings for any module.' 
  }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const queryGemini = async (prompt: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: 'You are ARES-1, a tactical gaming assistant. Provide concise, pro-level strategy tips. Use a cyberpunk, professional military tone. Keep responses under 60 words.'
        }
      });
      return response.text;
    } catch (err) {
      console.error(err);
      return "CONNECTION_ERROR: AI Uplink restricted.";
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const result = await queryGemini(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: result || 'Uplink failure.' }]);
    setLoading(false);
  };

  const getBriefing = async () => {
    if (!activeGame || loading) return;
    setIsOpen(true);
    setLoading(true);
    const result = await queryGemini(`Provide a tactical briefing for the game: ${activeGame.title}. Include one tip and one secret.`);
    setMessages(prev => [...prev, { role: 'ai', text: result || 'Briefing failed.' }]);
    setLoading(false);
  };

  return html`
    <div className=${`fixed bottom-8 right-8 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'w-[360px] h-[500px]' : 'w-14 h-14'}`}>
      ${!isOpen ? html`
        <button 
          onClick=${() => setIsOpen(true)} 
          className="group relative w-full h-full bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)] border border-indigo-400/50 hover:scale-110 active:scale-95 transition-all"
        >
          <${Bot} className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#020617] animate-pulse"></div>
        </button>
      ` : html`
        <div className="w-full h-full bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden flex flex-col border border-indigo-500/20 shadow-2xl">
          <div className="p-5 bg-indigo-600/10 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg"><${Bot} className="w-4 h-4 text-white" /></div>
              <span className="font-orbitron text-[10px] font-black uppercase tracking-widest text-indigo-100">ARES-1 TACTICAL</span>
            </div>
            <button onClick=${() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><${X} className="w-4 h-4" /></button>
          </div>
          
          <div ref=${scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-[11px] scrollbar-hide">
            ${messages.map((m, i) => html`
              <div key=${i} className=${`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className=${`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 border border-white/5 text-indigo-300'}`}>
                  ${m.text}
                </div>
              </div>
            `)}
            ${loading && html`
              <div className="flex items-center gap-2 text-indigo-500 animate-pulse text-[9px] font-black tracking-widest uppercase">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                Analyzing Vectors...
              </div>
            `}
          </div>

          <div className="p-4 bg-slate-900/50 border-t border-white/5 space-y-3">
            ${activeGame && html`
              <button 
                onClick=${getBriefing}
                className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Request ${activeGame.title} Briefing
              </button>
            `}
            <form onSubmit=${handleSend} className="flex gap-2">
              <input 
                type="text" 
                value=${input} 
                onInput=${(e: any) => setInput(e.target.value)} 
                placeholder="Query Tactical Core..." 
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all" 
              />
              <button type="submit" className="p-2.5 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                <${Send} className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      `}
    </div>
  `;
};

const HomePage = ({ games, search, category, setCategory }: any) => {
  const filtered = useMemo(() => {
    return games.filter((g: any) => {
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || g.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [games, search, category]);

  return html`
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="relative h-[360px] rounded-[3rem] overflow-hidden border border-white/10 group">
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-center px-12 lg:px-20 max-w-4xl">
          <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] tracking-[0.5em] uppercase mb-6">
            <${Zap} className="w-4 h-4 fill-indigo-400" />
            Neural Optimization Active
          </div>
          <h1 className="font-orbitron text-6xl font-black text-white leading-none tracking-tighter uppercase mb-6">
            TACTICAL<br /><span className="text-indigo-500">MATH HUB</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
            Secure sandbox for high-performance cognitive development modules. System stability: 99.8%.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-32">
        ${filtered.map((game: any) => html`
          <${Link} 
            key=${game.id} 
            to="/game/${game.id}" 
            className="group relative flex flex-col h-full bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-20px_rgba(79,70,229,0.2)]"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img 
                src="${game.thumbnail}" 
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
              />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/10">
                ${game.category}
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="font-orbitron text-xl font-bold text-white uppercase mb-3 group-hover:text-indigo-400 transition-colors">
                ${game.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-2 flex-1">
                ${game.description}
              </p>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-widest">
                  <${Play} className="w-3 h-3 fill-indigo-500" />
                  INITIATE
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
                  <${ArrowLeft} className="w-4 h-4 text-white rotate-180" />
                </div>
              </div>
            </div>
          <//>
        `)}
      </div>
    </div>
  `;
};

const GameDetail = ({ games }: { games: any[] }) => {
  const { pathname } = useLocation();
  const gameId = pathname.split('/').pop();
  const game = games.find(g => g.id === gameId);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [gameId]);

  if (!game) return html`<div className="py-40 text-center font-orbitron text-slate-700 uppercase tracking-[1em]">VOID_SECTOR</div>`;

  return html`
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="flex items-center justify-between">
        <${Link} to="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-8 py-3.5 rounded-full border border-white/5">
          <${ArrowLeft} className="w-4 h-4" />
          Directory Extraction
        <//>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20">
            STABILITY: OPTIMAL
          </span>
        </div>
      </div>

      <div className="relative aspect-video w-full bg-black rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] group">
        <iframe 
          ref=${iframeRef}
          src="${game.url}" 
          className="w-full h-full border-0" 
          allow="autoplay; fullscreen; keyboard; gamepad" 
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-storage-access-by-user-activation"
        />
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
          <button 
            onClick=${() => iframeRef.current?.requestFullscreen()}
            className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-indigo-600 transition-all"
          >
            <${Maximize} className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="font-orbitron text-5xl font-black text-white uppercase tracking-tighter mb-4">${game.title}</h1>
            <p className="text-slate-400 text-xl leading-relaxed font-medium opacity-80">${game.description}</p>
          </div>
          
          <div className="p-8 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-500/10 flex items-start gap-6">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 shrink-0">
              <${Shield} className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-orbitron text-xs font-black text-white uppercase tracking-widest mb-2">Sandbox Security</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-wider">
                This module is operating within a Level 4 tactical container. Session data is encrypted and self-destructs upon extraction. Use the PANIC (ESC) protocol for immediate evacuation.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 space-y-8">
             <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Module Specs</p>
                <div className="space-y-3">
                   <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500 uppercase tracking-widest">Type</span>
                      <span className="text-indigo-400 uppercase tracking-widest">${game.category}</span>
                   </div>
                   <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500 uppercase tracking-widest">Latency</span>
                      <span className="text-green-500 uppercase tracking-widest">2ms</span>
                   </div>
                   <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500 uppercase tracking-widest">Encryption</span>
                      <span className="text-slate-300 uppercase tracking-widest">AES-256</span>
                   </div>
                </div>
             </div>
             <button 
               onClick=${() => window.location.replace("https://google.com")} 
               className="w-full py-5 bg-red-600/10 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border border-red-500/20 hover:bg-red-600 hover:text-white transition-all shadow-lg hover:shadow-red-600/20"
             >
               PANIC_ABORT (ESC)
             </button>
          </div>
        </div>
      </div>
      
      <${ARES_HUD} activeGame=${game} />
    </div>
  `;
};

const App = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [cloak, setCloak] = useState(() => localStorage.getItem('mh_cloak') === 'true');
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('mh_cloak', cloak.toString());
    document.title = cloak ? "about:blank" : "Math Hub | Tactical Command";
    
    const handlePanic = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.replace("https://google.com");
      }
    };
    window.addEventListener('keydown', handlePanic);
    return () => window.removeEventListener('keydown', handlePanic);
  }, [cloak]);

  const sidebarCategories = [
    { id: 'all', name: 'All Modules', icon: LayoutGrid },
    { id: GameCategory.ACTION, name: 'Combat Logic', icon: Flame },
    { id: GameCategory.STRATEGY, name: 'Tactical Intel', icon: Target },
    { id: GameCategory.PUZZLE, name: 'Cognitive Maze', icon: Trophy },
    { id: GameCategory.RETRO, name: 'Legacy Data', icon: Clock },
  ];

  return html`
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-inter selection:bg-indigo-600/40">
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-8 py-5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-12">
          <${Link} to="/" className="flex items-center gap-4 shrink-0 group">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-transform group-hover:scale-110">
              <${Sigma} className="w-6 h-6 text-white" />
            </div>
            <span className="font-orbitron text-2xl font-black text-white uppercase hidden sm:block tracking-tighter">
              MATH HUB<span className="text-indigo-500">.</span>
            </span>
          <//>
          
          <div className="flex-1 max-w-xl relative group">
            <${Search} className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Module Directory..." 
              value=${search} 
              onInput=${(e: any) => setSearch(e.target.value)} 
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-14 pr-6 text-[11px] text-white font-mono tracking-wider focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600 uppercase" 
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick=${() => setCloak(!cloak)} 
              title="Stealth Protocol"
              className=${`p-3 rounded-xl border transition-all ${cloak ? 'bg-green-600/10 text-green-400 border-green-500/20' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white'}`}
            >
              <${Ghost} className="w-5 h-5" />
            </button>
            <div className="h-8 w-[1px] bg-white/5 hidden lg:block"></div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Latency</span>
                <span className="text-[10px] font-black text-green-500 uppercase">2ms</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                <${Shield} className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-8 py-12 flex flex-col lg:flex-row gap-16">
        ${location.pathname === '/' && html`
          <aside className="w-full lg:w-72 space-y-10 shrink-0">
            <div className="space-y-6">
              <p className="px-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Directory</p>
              <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                ${sidebarCategories.map(cat => html`
                  <button 
                    key=${cat.id} 
                    onClick=${() => setCategory(cat.id)} 
                    className=${`group flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${category === cat.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-4">
                      <${cat.icon} className=${`w-4 h-4 ${category === cat.id ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'}`} />
                      ${cat.name}
                    </div>
                  </button>
                `)}
              </nav>
            </div>
            
            <div className="p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-500/10 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-black text-[9px] uppercase tracking-widest">
                <${Terminal} className="w-4 h-4" /> System Message
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Daily synchronization complete. 7 new modules decrypted. Global network uptime: 100%.
              </p>
            </div>
          </aside>
        `}
        
        <div className="flex-1 min-w-0">
          <${Routes}>
            <${Route} path="/" element=${html`<${HomePage} games=${GAMES} search=${search} category=${category} setCategory=${setCategory} />`} />
            <${Route} path="/game/:id" element=${html`<${GameDetail} games=${GAMES} />`} />
          <//>
        </div>
      </main>
    </div>
  `;
};

const RootApp = () => html`<${Router}><${App} /><//>`;
export default RootApp;