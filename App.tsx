import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Search, Sigma, Target, Zap, Play, ArrowLeft, Maximize, 
  Bot, Send, Cpu, Settings, Ghost, X, Shield, Info, 
  Flame, Trophy, Clock, LayoutGrid, Terminal, ChevronRight
} from 'lucide-react';
import htm from 'htm';
import { GoogleGenAI } from "@google/genai";

const html = htm.bind(React.createElement);

// --- Tactical Assets ---
const GameCategory = {
  ACTION: 'Action',
  STRATEGY: 'Strategy',
  KINETIC: 'Kinetic',
  RETRO: 'Retro'
};

const GAMES = [
  {
    id: 'slope',
    title: 'Slope',
    description: 'High-speed 3D spatial reasoning. Navigate gravity-defying courses with precision.',
    category: GameCategory.ACTION,
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600',
    url: 'https://azgames.io/game/xlope/'
  },
  {
    id: 'clusterrush',
    title: 'Cluster Rush',
    description: 'Kinetic platforming module. Master momentum across shifting sectors.',
    category: GameCategory.KINETIC,
    thumbnail: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600',
    url: 'https://genizymath.github.io/iframe/81.html'
  },
  {
    id: 'bad-parenting-1',
    title: 'Bad Parenting 1',
    description: 'Psychological survival strategy. Analyze environmental cues and dynamics.',
    category: GameCategory.STRATEGY,
    thumbnail: 'https://images.unsplash.com/photo-1505632958218-4f23394784a6?auto=format&fit=crop&q=80&w=600',
    url: 'https://genizymath.github.io/iframe/166.html'
  },
  {
    id: 'kindergarten',
    title: 'Kindergarten',
    description: 'High-stakes social interaction simulator. Navigate school-yard diplomacy.',
    category: GameCategory.STRATEGY,
    thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=600',
    url: 'https://genizymath.github.io/iframe/445.html'
  },
  {
    id: 'kindergarten-2',
    title: 'Kindergarten 2',
    description: 'Advanced tactical social simulator. Complex NPC logic and expanded sectors.',
    category: GameCategory.STRATEGY,
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
    url: 'https://genizymath.github.io/iframe/446.html'
  },
  {
    id: 'escape-road',
    title: 'Escape Road',
    description: 'Tactical navigation module. Calibrate reflexes for urban transit avoidance.',
    category: GameCategory.ACTION,
    thumbnail: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&q=80&w=600',
    url: 'https://genizymath.github.io/iframe/264.html'
  },
  {
    id: 'cookie-clicker',
    title: 'Cookie Clicker',
    description: 'Infinite resource optimization. Scale production via algorithmic efficiency.',
    category: GameCategory.RETRO,
    thumbnail: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600',
    url: 'https://orteil.dashnet.org/cookieclicker/'
  }
];

const ARES_HUD = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: 'ARES-1 Tactical Online. Signal established.' }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
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
          systemInstruction: 'You are ARES-1, tactical support AI. Use professional, military-tech tone. Keep tips short.'
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'UPLINK_ERROR' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'LINK_FAILURE' }]);
    } finally {
      setLoading(false);
    }
  };

  return html`
    <div className=${`fixed bottom-8 right-8 z-[100] transition-all duration-500 ${isOpen ? 'w-[300px] h-[400px]' : 'w-14 h-14'}`}>
      ${!isOpen ? html`
        <button onClick=${() => setIsOpen(true)} className="w-full h-full bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl border border-indigo-400/50 hover:scale-110 active:scale-95 transition-all">
          <${Bot} className="w-6 h-6 text-white" />
        </button>
      ` : html`
        <div className="w-full h-full glass-panel rounded-3xl overflow-hidden flex flex-col border border-indigo-500/30 shadow-2xl">
          <div className="p-4 bg-indigo-600/20 border-b border-indigo-500/10 flex items-center justify-between">
            <span className="font-orbitron text-[10px] font-black uppercase text-indigo-100">ARES-1 HUD</span>
            <button onClick=${() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400"><${X} className="w-4 h-4" /></button>
          </div>
          <div ref=${scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40 font-mono text-[10px] scrollbar-hide">
            ${messages.map((m, i) => html`
              <div key=${i} className=${`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className=${`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-white/5 text-indigo-300 rounded-tl-none'}`}>
                  ${m.text}
                </div>
              </div>
            `)}
          </div>
          <form onSubmit=${handleSend} className="p-3 bg-slate-900/80 border-t border-white/5 flex gap-2">
            <input type="text" value=${input} onInput=${(e) => setInput(e.target.value)} placeholder="Query..." className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" />
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
  const [cloak, setCloak] = useState(() => localStorage.getItem('mh_cloak_v21') === 'true');

  useEffect(() => {
    localStorage.setItem('mh_cloak_v21', cloak.toString());
    document.title = cloak ? "about:blank" : "Math Hub | Tactical Command";
    const handlePanic = (e) => { if (e.key === 'Escape') window.location.replace("https://google.com"); };
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
        <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-8">
            <${Link} to="/" className="flex items-center gap-3 shrink-0">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg"><${Sigma} className="w-5 h-5 text-white" /></div>
              <span className="font-orbitron text-2xl font-black text-white hidden sm:block">MATH HUB</span>
            <//>
            
            <div className="flex-1 max-w-lg relative">
              <${Search} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                placeholder="Scan tactical assets..." 
                value=${search} 
                onInput=${(e) => setSearch(e.target.value)} 
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono" 
              />
            </div>
            
            <button onClick=${() => setCloak(!cloak)} className=${`p-3 rounded-xl border transition-all ${cloak ? 'text-green-400 border-green-500/20' : 'text-slate-500 border-white/5'}`}>
              <${Ghost} className="w-5 h-5" />
            </button>
          </div>
        </nav>

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-64 space-y-8 shrink-0">
            <div className="space-y-3">
              <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-600">Categories</p>
              <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                ${['all', ...Object.values(GameCategory)].map(c => html`
                  <button key=${c} onClick=${() => setCategory(c)} className=${`px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${category === c ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}>
                    ${c === 'all' ? 'All Units' : c}
                  </button>
                `)}
              </nav>
            </div>
          </aside>
          
          <div className="flex-1 min-w-0">
            <${Routes}>
              <${Route} path="/" element=${html`
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
                  ${filtered.map(game => html`
                    <${Link} key=${game.id} to="/game/${game.id}" className="glass-panel rounded-3xl overflow-hidden group border border-white/5 flex flex-col hover:border-indigo-500/40 transition-all hover:-translate-y-1">
                      <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                        <img src="${game.thumbnail}" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 rounded-lg text-[8px] font-black text-indigo-400 uppercase tracking-widest border border-white/10">${game.category}</div>
                      </div>
                      <div className="p-8 space-y-3 flex-1">
                        <h3 className="font-orbitron text-lg font-bold text-white uppercase group-hover:text-indigo-400 transition-colors">${game.title}</h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">${game.description}</p>
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

const GameView = ({ games }) => {
  const { pathname } = useLocation();
  const gameId = pathname.split('/').pop();
  const game = games.find(g => g.id === gameId);
  const iframeRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, [gameId]);

  if (!game) return html`<div className="py-24 text-center font-orbitron opacity-40 uppercase tracking-widest">MODULE_NOT_FOUND</div>`;

  return html`
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24">
      <div className="flex items-center justify-between">
        <${Link} to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all bg-white/5 px-6 py-2 rounded-full border border-white/5">
          <${ArrowLeft} className="w-3 h-3" /> Extraction
        <//>
        <div className="text-[10px] font-bold text-slate-700 font-mono uppercase tracking-widest">SESS: ${game.id.toUpperCase()}</div>
      </div>
      
      <div className="relative aspect-video w-full bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group ring-1 ring-indigo-500/10">
        <iframe 
          src="${game.url}" 
          className="w-full h-full border-0" 
          allow="autoplay; fullscreen; keyboard; gamepad" 
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-storage-access-by-user-activation"
          ref=${iframeRef} 
        />
        <button onClick=${() => iframeRef.current?.requestFullscreen()} className="absolute bottom-8 right-8 p-3 bg-black/60 backdrop-blur-xl border border-white/10 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600">
          <${Maximize} className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="font-orbitron text-4xl font-black text-white uppercase tracking-tighter">${game.title}</h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">${game.description}</p>
        </div>
        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6 h-fit">
           <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-widest"><${Shield} className="w-4 h-4" /> Shield: ACTIVE</div>
           <button onClick=${() => window.location.replace("https://google.com")} className="w-full py-4 bg-red-600/10 text-red-500 font-black text-[10px] uppercase rounded-2xl border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">PANIC (ESC)</button>
        </div>
      </div>
    </div>
  `;
};

export default App;