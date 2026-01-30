
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  Search, 
  Flame, 
  Trophy, 
  Clock, 
  Menu, 
  X, 
  LayoutGrid,
  Sigma,
  ChevronRight,
  Sparkles,
  BookOpen,
  Target
} from 'lucide-react';
import htm from 'htm';
import { GameCategory } from './types.ts';
import { GAMES } from './data/games.ts';
import { getGameGuide } from './services/geminiService.ts';

const html = htm.bind(React.createElement);

const Navbar = ({ onSearch }) => {
  return html`
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <${Link} to="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/20">
            <${Sigma} className="w-6 h-6 text-white" />
          </div>
          <span className="font-orbitron text-xl font-black tracking-tighter text-white uppercase">
            Math Hub<span className="text-indigo-500">.</span>
          </span>
        <//>

        <div className="hidden md:flex flex-1 max-w-md relative group">
          <${Search} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            onInput=${(e) => onSearch(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>
    </nav>
  `;
};

const GameCard = ({ game }) => {
  return html`
    <${Link} 
      to="/game/${game.id}"
      className="group bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="aspect-video relative overflow-hidden bg-slate-900">
        <img 
          src="${game.thumbnail}" 
          alt="${game.title}"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-60" />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-xl text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2 tracking-tight">
            ${game.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium">
            ${game.description}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-indigo-400 text-xs font-bold uppercase tracking-widest">
          Launch Module
          <${ChevronRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    <//>
  `;
};

const Sidebar = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'All Resources', icon: LayoutGrid },
    { id: GameCategory.ACTION, name: 'Action', icon: Flame },
    { id: GameCategory.PUZZLE, name: 'Puzzle', icon: Trophy },
    { id: GameCategory.STRATEGY, name: 'Strategy', icon: Target },
    { id: GameCategory.RETRO, name: 'Retro', icon: Clock },
  ];

  return html`
    <aside className="w-64 hidden lg:block sticky top-24 h-fit space-y-8">
      <div className="space-y-2">
        <p className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Core Sections</p>
        ${categories.map((cat) => html`
          <button
            key=${cat.id}
            onClick=${() => onCategoryChange(cat.id)}
            className=${`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeCategory === cat.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <${cat.icon} className=${`w-4 h-4 ${activeCategory === cat.id ? 'text-white' : 'text-slate-500'}`} />
            ${cat.name}
          </button>
        `)}
      </div>
    </aside>
  `;
};

const HomePage = ({ games, searchQuery, activeCategory }) => {
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, activeCategory]);

  return html`
    <div className="space-y-12 page-fade-in">
      ${searchQuery === '' && activeCategory === 'all' ? html`
        <section className="relative h-[340px] rounded-[40px] overflow-hidden group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1200" 
            alt="Math Hub Hero" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-r from-slate-950 via-slate-950/60 to-transparent" />
          <div className="relative h-full flex flex-col justify-center px-10 md:px-20 max-w-3xl">
            <h1 className="font-orbitron text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
              COGNITIVE <br /><span className="text-indigo-500">ACCELERATION</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl mb-8 leading-relaxed max-w-xl font-medium">
              Access premium interactive resources designed for high-performance learning and logic development.
            </p>
            <div className="flex gap-4">
              <${Link} to="/game/escape-road-2" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-indigo-600/40 active:scale-95 uppercase text-sm tracking-widest">
                Start Training
              <//>
            </div>
          </div>
        </section>
      ` : null}

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
            ${activeCategory === 'all' ? 'Active Modules' : activeCategory}
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          ${filteredGames.map(game => html`<${GameCard} key=${game.id} game=${game} />`)}
        </div>
      </section>
    </div>
  `;
};

const GameDetail = ({ games }) => {
  const { pathname } = useLocation();
  const gameId = pathname.split('/').pop();
  const game = useMemo(() => games.find(g => g.id === gameId), [games, gameId]);
  
  const [guide, setGuide] = useState('');
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (game) {
      setIsLoadingGuide(true);
      setGuide('');
      getGameGuide(game.title)
        .then(res => {
          setGuide(res);
          setIsLoadingGuide(false);
        })
        .catch(() => {
          setGuide('Unable to load AI guide.');
          setIsLoadingGuide(false);
        });
    }
  }, [game]);

  if (!game) return html`<div className="p-20 text-center text-slate-400 font-bold">Module not found.</div>`;

  return html`
    <div className="max-w-6xl mx-auto space-y-12 page-fade-in">
      <div className="relative aspect-video w-full bg-black rounded-[40px] overflow-hidden border border-slate-800 shadow-2xl">
        <iframe 
          src="${game.url}" 
          title="${game.title}"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">${game.title}</h1>
            <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-400 text-xs font-black rounded-full border border-indigo-500/20 uppercase tracking-widest">
              ${game.category}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xl font-medium">
            ${game.description}
          </p>

          <div className="mt-12 p-8 bg-slate-900/50 border border-indigo-500/20 rounded-[32px] space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
              <${Sparkles} className="w-5 h-5 text-indigo-400" />
              AI Tactical Briefing
            </h3>
            <div className="text-slate-300 leading-relaxed max-w-none">
              ${isLoadingGuide 
                ? html`<div className="animate-pulse text-slate-500">Decrypting tactics...</div>`
                : html`<div className="whitespace-pre-line">${guide}</div>`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const MathHubApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  return html`
    <${Router} future=${{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
        <${Navbar} onSearch=${setSearchQuery} />
        
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex gap-16">
          <${Sidebar} activeCategory=${activeCategory} onCategoryChange=${setActiveCategory} />
          
          <div className="flex-1">
            <${Routes}>
              <${Route} path="/" element=${html`<${HomePage} games=${GAMES} searchQuery=${searchQuery} activeCategory=${activeCategory} />`} />
              <${Route} path="/game/:id" element=${html`<${GameDetail} games=${GAMES} />`} />
            <//>
          </div>
        </main>

        <footer className="bg-slate-950 border-t border-slate-900 py-16 px-6 text-center">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 opacity-40 grayscale">
              <${Sigma} className="w-5 h-5" />
              <span className="font-orbitron font-black uppercase text-sm">Math Hub</span>
            </div>
          </div>
        </footer>
      </div>
    <//>
  `;
};

export default MathHubApp;
