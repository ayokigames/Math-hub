import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Search, Sigma, Zap, ArrowLeft, Maximize, 
  Bot, Send, Ghost, X, Shield, Play, Terminal
} from 'lucide-react';
import htm from 'htm';
import { GoogleGenAI } from "@google/genai";

const html = htm.bind(React.createElement);

const GameCategory = {
  ACTION: 'Action',
  STRATEGY: 'Strategy',
  PUZZLE: 'Puzzle',
  RETRO: 'Retro'
};

const GAMES = [
  {
    id: 'slope',
    title: 'Slope',
    description: 'High-speed 3D spatial reasoning challenge. Navigate gravity-defying courses with extreme precision.',
    category: GameCategory.ACTION,
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600',
    url: 'https://azgames.io/game/xlope/'
  },
  {
    id: 'clusterrush',
    title: 'Cluster Rush',
    description: 'Kinetic platforming module. Master momentum across shifting logic sectors and obstacles.',
    category: GameCategory.ACTION,
    thumbnail: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600',
    url: './clusterrush/index.html'
  },
  {
    id: 'bad-parenting-1',
    title: 'Bad Parenting 1',
    description: 'Psychological survival strategy. Analyze environmental cues and complex household dynamics.',
    category: GameCategory.STRATEGY,
    thumbnail: 'https://images.unsplash.com/photo-1505632958218-4f23394784a6?auto=format&fit=crop&q=80&w=600',
    url: './badparenting1/index.html'
  },
  {
    id: 'kindergarten',
    title: 'Kindergarten',
    description: 'High-stakes social interaction simulator. Navigate school-yard diplomacy in a tactical environment.',
    category: GameCategory.STRATEGY,
    thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=600',
    url: './kindergarten/index.html'
  },
  {
    id: 'kindergarten-2',
    title: 'Kindergarten 2',
    description: 'Advanced tactical social simulator. Complex NPC logic and expanded exploration sectors.',
    category: GameCategory.STRATEGY,
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
    url: './kindergarten2/index.html'
  },
  {
    id: 'escape-road',
    title: 'Escape Road',
    description: 'Tactical navigation module. Calibrate reflexes for high-density urban transit avoidance.',
    category: GameCategory.ACTION,
    thumbnail: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&q=80&w=600',
    url: './escaperoad/index.html'
  },
  {
    id: 'cookie-clicker',
    title: 'Cookie Clicker',
    description: 'Infinite resource optimization. Scale production via massive algorithmic efficiency.',
    category: GameCategory.STRATEGY,
    thumbnail: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600',
    url: 'https://orteil.dashnet.org/cookieclicker/'
  }
];

const ARES_HUD = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: 'ARES-1 System Online. Tactical analysis ready.' }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'You are ARES-1, a tactical assistant for Math Hub. You provide gaming tips and strategy advice. Keep your tone professional, cyber-themed, and very concise.'
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'Uplink failure.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'CONNECTION_ERROR: AI Uplink restricted.' }]);
    } finally {
      setLoading(false);
    }
  };

  return html`
    <div className=${`fixed bottom-8 right-8 z-[100] transition-all duration-500 ${isOpen ? 'w-[320px] h-[450px]' : 'w-14 h-14'}`}>
      ${!isOpen ? html`
        <button onClick=${() => setIsOpen(true)} className="w-full h-full bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border border-indigo-400/50 hover:scale-110 active:scale-95 transition-all">
          <${Bot} className="w-6 h-6 text-white" />
        </button>
      ` : html`
        <div className="w-full h-full bg-slate-900/95 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col border border-indigo-500/30 shadow-2xl">
          <div className="p-4 bg-indigo-600/20 border-b border-indigo-500/10 flex items-center justify-between">
            <span className="font-orbitron text-[10px] font-black uppercase tracking-widest text-indigo-100">ARES-1 HUD</span>
            <button onClick=${() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400"><${X} className="w-4 h-4" /></button>
          </div>
          <div ref=${scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[10px] scrollbar-hide">
            ${messages.map((m, i) => html`
              <div key=${i} className=${`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className=${`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 border border-white/5 text-indigo-300'}`}>
                  ${m.text}
                </div>
              </div>
            `)}
            ${loading && html`<div className="text-indigo-500 animate-pulse text-[8px] pl-2 font-black uppercase tracking-widest">Processing...</div>`}
          </div>
          <form onSubmit=${handleSend} className="p-3 bg-slate-900/80 border-t border-white/5 flex gap-2">
            <input type="text" value=${input} onInput=${(e: any) => setInput(e.target.value)} placeholder="Query ARES..." className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
            <button type="submit" className="p-2 bg-indigo-600 rounded-xl text-white"><${Send} className="w-4 h-4" /></button>
          </form>
        </div>
      `}
    </div>
  `;
};

const App = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [cloak, setCloak] = useState(() => localStorage.getItem('mh_cloak_v31') === 'true');

  useEffect(() => {
    localStorage.setItem('mh_cloak_v31', cloak.toString());
    document.title = cloak ? "about:blank" : "Math Hub | Tactical Command";
    const handlePanic = (e: KeyboardEvent) => { if (e.key === 'Escape') window.location.replace("https://google.com"); };
    window.addEventListener('keydown', handlePanic);
    return () => window.removeEventListener('keydown', handlePanic);
  }, [cloak]);

  const filtered = useMemo(() => {
    return GAMES.filter(g => {
      const matchesCategory = category === 'all' || g.category === category;
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return html`
    <${Router}>
      <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-inter selection:bg-indigo-600/40">
        <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-8 py-5">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-12">
            <${Link} to="/" className="flex items-center gap-4 shrink-0 group">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg transition-transform group-hover:scale-110"><${Sigma} className="w-6 h-6 text-white" /></div>
              <span className="font-orbitron text-2xl font-black text-white uppercase hidden sm:block tracking-tighter">MATH HUB</span>
            <//>
            
            <div className="flex-1 max-w-xl relative">
              <${Search} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Scan tactical modules..." 
                value=${search} 
                onInput=${(e: any) => setSearch(e.target.value)} 
                className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono transition-all" 
              />
            </div>
            
            <button 
              onClick=${() => setCloak(!cloak)} 
              title="Stealth Protocol"
              className=${`p-3.5 rounded-xl border transition-all ${cloak ? 'bg-green-600/10 text-green-400 border-green-500/20 shadow-lg' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white'}`}
            >
              <${Ghost} className="w-6 h-6" />
            </button>
          </div>
        </nav>

        <main className="flex-1 max-w-[1600px] mx-auto w-full px-8 py-12 flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-72 space-y-10 shrink-0">
            <div className="space-y-4">
              <p className="px-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Categories</p>
              <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                ${['all', ...Object.values(GameCategory)].map(c => html`
                  <button key=${c} onClick=${() => setCategory(c)} className=${`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${category === c ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}>
                    ${c === 'all' ? 'All Units' : c}
                  </button>
                `)}
              </nav>
            </div>
          </aside>
          
          <div className="flex-1 min-w-0">
            <${Routes}>
              <${Route} path="/" element=${html`
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pb-32">
                  ${filtered.map(game => html`
                    <${Link} key=${game.id} to="/game/${game.id}" className="bg-slate-900 rounded-[2.5rem] overflow-hidden group border border-white/5 flex flex-col hover:border-indigo-500/40 transition-all hover:-translate-y-2 h-full">
                      <div className="aspect-[16/10] relative overflow-hidden bg-slate-950 shrink-0">
                        <img src="${game.thumbnail}" className="w-full h-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100" />
                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/80 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest border border-white/10 shadow-xl">${game.category}</div>
                      </div>
                      <div className="p-8 space-y-3 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-orbitron text-lg font-bold text-white uppercase group-hover:text-indigo-400 transition-colors">${game.title}</h3>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium mt-2">${game.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-500 text-[9px] font-black uppercase tracking-widest mt-4">
                          <${Play} className="w-3 h-3" /> Initialize Module
                        </div>
                      </div>
                    <//>
                  `)}
                </div>
              `} />
              <${Route} path="/game/:id" element=${html`<${GameView} games=${GAMES} />`} />
            <//>
          </div>
        </main>
        
        <${ARES_HUD} />
      </div>
    <//>
  `;
};

const GameView = ({ games }: { games: any[] }) => {
  const { pathname } = useLocation();
  const gameId = pathname.split('/').pop();
  const game = games.find(g => g.id === gameId);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [gameId]);

  if (!game) return html`<div className="py-40 text-center font-orbitron opacity-40 uppercase tracking-[1em]">ERROR: MODULE_VOID</div>`;

  return html`
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="flex items-center justify-between">
        <${Link} to="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all bg-white/5 px-8 py-3 rounded-full border border-white/5">
          <${ArrowLeft} className="w-4 h-4" /> extraction protocol
        <//>
      </div>
      
      <div className="relative aspect-video w-full bg-black rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
        <iframe 
          src="${game.url}" 
          className="w-full h-full border-0" 
          allow="autoplay; fullscreen; keyboard; gamepad" 
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-storage-access-by-user-activation"
          ref=${iframeRef} 
        />
        <button onClick=${() => iframeRef.current?.requestFullscreen()} className="absolute bottom-10 right-10 p-3.5 bg-black/60 backdrop-blur-3xl border border-white/10 text-white rounded-xl opacity-0 group-hover:opacity-100 hover:bg-indigo-600 transition-all">
          <${Maximize} className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="font-orbitron text-5xl font-black text-white uppercase tracking-tighter">${game.title}</h1>
          <p className="text-slate-400 text-xl leading-relaxed font-medium opacity-80">${game.description}</p>
        </div>
        <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-white/5 space-y-6 h-fit">
           <div className="flex items-center gap-4 text-indigo-400 font-black text-[10px] uppercase tracking-widest"><${Shield} className="w-5 h-5" /> Protocol: ACTIVE</div>
           <div className="text-[11px] text-slate-500 font-medium">This module is currently running in a sandboxed tactical environment. Precision is advised.</div>
           <button onClick=${() => window.location.replace("https://google.com")} className="w-full py-5 bg-red-600/10 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">PANIC (ESC)</button>
        </div>
      </div>
    </div>
  `;
};

export default App;