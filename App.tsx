import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Flame, 
  Clock, 
  LayoutGrid,
  Sigma,
  ChevronRight,
  Target,
  Terminal,
  Play,
  ArrowLeft,
  Maximize,
  Settings,
  Shield,
  Ghost,
  X,
  EyeOff,
  Sparkles,
  ExternalLink,
  Lock,
  Monitor,
  Activity,
  Cpu,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import htm from 'htm';
import { GameCategory } from './types.ts';
import { GAMES } from './data/games.ts';
import { getGameGuide } from './services/geminiService.ts';

const html = htm.bind(React.createElement);

const StealthProtocol = {
  launch: () => {
    const url = window.location.href;
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert("Stealth Protocol Warning: Popups blocked. Enable popups to initialize anonymous window.");
      return;
    }

    const doc = win.document;
    doc.title = "Google Docs";
    
    const link = doc.createElement('link') as HTMLLinkElement;
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
    doc.head.appendChild(link);

    const iframe = doc.createElement('iframe');
    iframe.src = url;
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = '#020617';
    
    doc.body.style.margin = '0';
    doc.body.style.padding = '0';
    doc.body.style.overflow = 'hidden';
    doc.body.appendChild(iframe);

    setTimeout(() => {
      window.location.replace("https://www.google.com/search?q=calculus+notes+2025+academic+study+guide");
    }, 100);
  }
};

const SettingsModal = ({ isOpen, onClose, cloakEnabled, onToggleCloak }) => {
  if (!isOpen) return null;

  return html`
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick=${onClose}></div>
      <div className="relative w-full max-w-xl glass-panel rounded-[2.5rem] border border-white/10 shadow-2xl p-10 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-orbitron text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <${Terminal} className="w-5 h-5 text-indigo-500" />
            Security Matrix
          </h2>
          <button onClick=${onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <${X} className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <${Ghost} className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">About:Blank Cloak</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase">Operational</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Initialize in an anonymous <code className="text-indigo-300">about:blank</code> tab. This leaves no trace in local browsing history.
            </p>
            <button 
              onClick=${StealthProtocol.launch}
              className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-600/20 uppercase text-[10px] tracking-widest"
            >
              <${ExternalLink} className="w-4 h-4" />
              Initialize Stealth Uplink
            </button>
          </div>

          <button 
            onClick=${onToggleCloak}
            className=${`flex items-center justify-between p-6 rounded-3xl border transition-all text-left ${
              cloakEnabled 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-slate-900/50 border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="space-y-1">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Visual Mask</h3>
              <p className="text-[10px] text-slate-500 font-medium">
                ${cloakEnabled ? 'Active: Masked as "Google Docs"' : 'Rename current tab and replace favicon instantly.'}
              </p>
            </div>
            <${EyeOff} className=${`w-5 h-5 ${cloakEnabled ? 'text-green-400' : 'text-slate-600'}`} />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-between group">
          <div className="flex items-center gap-3 text-red-400">
            <${Shield} className="w-5 h-5" />
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest">Panic Reset</span>
              <span className="block text-[9px] font-bold text-red-500/60 uppercase">Press [ESC] to self-destruct session</span>
            </div>
          </div>
          <div className="px-3 py-1 bg-red-500/10 rounded-lg text-[10px] font-black text-red-400 border border-red-500/20">ESC</div>
        </div>
      </div>
    </div>
  `;
};

const Navbar = ({ onSearch, onOpenSettings }) => html`
  <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
    <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
      <${Link} to="/" className="flex items-center gap-3 shrink-0">
        <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105 active:scale-95">
          <${Sigma} className="w-5 h-5 text-white" />
        </div>
        <span className="font-orbitron text-lg font-black tracking-tighter text-white uppercase hidden sm:inline">Math Hub</span>
      <//>

      <div className="flex-1 max-w-xl relative">
        <${Search} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Scan operational modules..." 
          onInput=${(e) => onSearch(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all text-slate-200 placeholder:text-slate-600"
        />
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick=${StealthProtocol.launch} 
          className="hidden md:flex items-center gap-2 p-3 bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all rounded-2xl px-5"
        >
          <${Monitor} className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Stealth</span>
        </button>
        <button onClick=${onOpenSettings} className="p-3 rounded-2xl glass-panel border border-white/5 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-all">
          <${Settings} className="w-5 h-5" />
        </button>
      </div>
    </div>
  </nav>
`;

const HomePage = ({ games, searchQuery, activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'All Modules', icon: LayoutGrid },
    { id: GameCategory.ACTION, name: 'Kinetic', icon: Flame },
    { id: GameCategory.STRATEGY, name: 'Tactical', icon: Target },
    { id: GameCategory.RETRO, name: 'Archive', icon: Clock },
  ];

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, activeCategory]);

  return html`
    <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-12 animate-in">
      <div className="flex flex-wrap gap-3">
        ${categories.map(cat => html`
          <button 
            onClick=${() => onCategoryChange(cat.id)}
            className=${`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border transition-all ${
              activeCategory === cat.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/30' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            <${cat.icon} className="w-3.5 h-3.5" />
            ${cat.name}
          </button>
        `)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        ${filteredGames.map(game => html`
          <${Link} key=${game.id} to="/game/${game.id}" className="command-card flex flex-col glass-panel rounded-3xl overflow-hidden border border-white/5 group shadow-lg">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img src="${game.thumbnail}" className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
              <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors"></div>
              <div className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all">
                <${Play} className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-orbitron text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate pr-4">${game.title}</h3>
                <${ChevronRight} className="w-4 h-4 text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">${game.category}</p>
            </div>
          <//>
        `)}
      </div>
    </div>
  `;
};

const GameView = ({ games }) => {
  const { pathname } = useLocation();
  const id = pathname.split('/').pop();
  const game = games.find(g => g.id === id);
  const [guide, setGuide] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [operationalPhase, setOperationalPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const phases = [
    { text: 'Establishing handshake...', code: 'SEC_HS_INIT', icon: Activity },
    { text: 'Decrypting tactical assets...', code: 'AES256_OPEN', icon: Lock },
    { text: 'Bypassing restriction layers...', code: 'FW_BYPASS_99', icon: Shield },
    { text: 'Synchronizing interactive vectors...', code: 'SYNC_VEC_100', icon: Target },
    { text: 'Finalizing tactical uplink...', code: 'UPLINK_READY', icon: Cpu },
    { text: 'Operational verification complete.', code: 'INIT_VERIFIED', icon: CheckCircle2 }
  ];

  useEffect(() => {
    if (game) {
      getGameGuide(game.title).then(setGuide);
      setIsLoading(true);
      setOperationalPhase(0);
      setProgress(0);
    }
    window.scrollTo(0, 0);

    const phaseInterval = setInterval(() => {
      setOperationalPhase(prev => {
        if (prev < phases.length - 2) {
          const next = prev + 1;
          setProgress((next / (phases.length - 1)) * 90);
          return next;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(phaseInterval);
  }, [game]);

  const enterFullscreen = () => {
    const el = iframeRef.current;
    if (el) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
    }
  };

  const handleLoad = () => {
    setOperationalPhase(phases.length - 1);
    setProgress(100);
    setTimeout(() => setIsLoading(false), 500);
  };

  if (!game) return html`<div className="p-40 text-center font-orbitron text-slate-500 uppercase tracking-[0.4em] opacity-30">ERR: DATA_CORRUPTED</div>`;

  return html`
    <div className="max-w-[1500px] mx-auto px-6 py-10 space-y-10 animate-in">
      <div className="flex items-center justify-between">
        <${Link} to="/" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <${ArrowLeft} className="w-3.5 h-3.5" />
          Directory Hub
        <//>
        <div className="flex items-center gap-6">
          <button onClick=${StealthProtocol.launch} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-2">
            <${Shield} className="w-3.5 h-3.5" />
            Launch Cloaked
          </button>
        </div>
      </div>

      <div className="group relative aspect-video w-full bg-slate-950 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
        <div className=${`absolute inset-0 bg-[#020617] flex flex-col items-center justify-center z-40 transition-all duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="scanline"></div>
          
          <div className="relative mb-12">
            <div className="w-32 h-32 border-[1px] border-indigo-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 m-auto w-24 h-24 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <${Sigma} className="w-10 h-10 text-indigo-500 animate-pulse" />
            </div>
          </div>

          <div className="space-y-6 text-center w-full max-w-sm px-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.4em] font-mono flex items-center justify-center gap-2">
                <span className="w-1 h-1 bg-indigo-500 rounded-full animate-ping"></span>
                [ PHASE: ${phases[operationalPhase].code} ]
              </span>
              <h2 className="font-orbitron text-xs font-black uppercase tracking-[0.3em] text-white flex items-center justify-center gap-3">
                ${React.createElement(phases[operationalPhase].icon, { className: "w-3.5 h-3.5 text-indigo-400" })}
                ${phases[operationalPhase].text}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-[2px] flex-1 bg-white/5 rounded-full overflow-hidden shadow-[inset_0_0_4px_black]">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_#6366f1]"
                  style=${{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 font-bold min-w-[3ch]">
                ${Math.round(progress)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest border-t border-white/5 pt-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-slate-700">Latency Check</span>
                <span className="text-green-500/80 font-mono">12ms [STABLE]</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-slate-700">Encrypted</span>
                <span className="text-indigo-400 font-mono">256-BIT [OK]</span>
              </div>
            </div>
          </div>
        </div>

        <iframe 
          ref=${iframeRef}
          src="${game.url}" 
          className="w-full h-full border-0" 
          allow="autoplay; fullscreen; keyboard" 
          onLoad=${handleLoad}
        />
        
        <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all z-30">
          <button onClick=${enterFullscreen} className="p-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 text-white hover:bg-indigo-600 transition-all">
            <${Maximize} className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <h1 className="font-orbitron text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter">${game.title}</h1>
            <div className="flex items-center gap-4 text-indigo-400">
              <span className="px-3 py-1 bg-indigo-500/10 rounded-lg text-[10px] font-black tracking-widest border border-indigo-500/20 uppercase">${game.category} Module</span>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Baseline: Established</span>
            </div>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-4xl">${game.description}</p>
        </div>
        <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-500/10 space-y-6 self-start">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-indigo-400">
              <${Sparkles} className="w-5 h-5" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Tactical Intelligence</h4>
            </div>
            <${Terminal} className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-[11px] text-slate-300 font-medium leading-relaxed whitespace-pre-wrap font-mono opacity-80 bg-black/20 p-4 rounded-2xl border border-white/5">
            ${guide || 'Generating operational intelligence...'}
          </div>
        </div>
      </div>
    </div>
  `;
};

const MathHubApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cloakEnabled, setCloakEnabled] = useState(false);

  useEffect(() => {
    const handlePanic = (e) => {
      if (e.key === 'Escape') window.location.replace("https://www.google.com/search?q=calculus+notes+and+academic+integrity+2025");
    };
    window.addEventListener('keydown', handlePanic);
    return () => window.removeEventListener('keydown', handlePanic);
  }, []);

  const toggleCloak = () => {
    const val = !cloakEnabled;
    setCloakEnabled(val);
    document.title = val ? "Google Docs" : "Math Hub | Command Center";
    
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = val ? 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico' : '/favicon.ico';
  };

  return html`
    <${Router}>
      <div className="min-h-screen flex flex-col bg-[#020617] selection:bg-indigo-500 selection:text-white">
        <${Navbar} onSearch=${setSearchQuery} onOpenSettings=${() => setIsSettingsOpen(true)} />
        <main className="flex-1">
          <${Routes}>
            <${Route} path="/" element=${html`<${HomePage} games=${GAMES} searchQuery=${searchQuery} activeCategory=${activeCategory} onCategoryChange=${setActiveCategory} />`} />
            <${Route} path="/game/:id" element=${html`<${GameView} games=${GAMES} />`} />
          <//>
        </main>
        
        <footer className="glass-panel border-t border-white/5 py-16 px-6 mt-10">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-3">
              <${Sigma} className="w-5 h-5 text-indigo-500" />
              <span className="font-orbitron font-black uppercase text-xs tracking-[0.4em] text-white">Math Hub v4.0.0-PRO</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <a href="#" className="hover:text-indigo-400 transition-colors">Nodes</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Protocol</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Manifesto</a>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <${Lock} className="w-3.5 h-3.5" />
              End-to-End Secure
            </div>
          </div>
        </footer>

        <${SettingsModal} isOpen=${isSettingsOpen} onClose=${() => setIsSettingsOpen(false)} cloakEnabled=${cloakEnabled} onToggleCloak=${toggleCloak} />
      </div>
    <//>
  `;
};

export default MathHubApp;