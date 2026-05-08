import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import StatsPanel from './components/StatsPanel';
import CountrySection from './components/CountrySection';
import StickerGrid from './components/StickerGrid';
import { useStickers } from './hooks/useStickers';
import { Moon, Sun, Info, List, Copy } from 'lucide-react';

const translations = {
  es: {
    title: 'Copa Mundial 2026',
    byCountry: 'Por País',
    allStickers: 'Todas las Figuras',
    loading: 'Cargando figuras...',
    noStickers: 'No se encontraron figuras',
    tryDifferent: 'Intenta con otro término',
    rightClickRemove: 'Click derecho para eliminar',
    longPress: 'Mantén para eliminar',
    uniqueStickers: 'Figuras Únicas',
    duplicates: 'Duplicados',
    complete: 'Completo',
    intro: 'Introducción'
  }
};

const TEAM_COLORS = {
  ARG: '#6cade4', AUS: '#125eac', AUT: '#ed2939', BEL: '#ffd90f',
  BRA: '#ffc107', CMR: '#d90919', CAN: '#ff0000', CHN: '#de2910',
  COL: '#fcd116', CRO: '#ff0000', CZE: '#11457e', DEN: '#c60c30',
  ECU: '#ffda00', ENG: '#ce1124', ESP: '#c60a30', FRA: '#0055a4',
  GER: '#000000', GHA: '#006b3f', GRE: '#0d5eaf', HUN: '#c4442b',
  IRN: '#239e46', IRL: '#169b62', ITA: '#008c45', JPN: '#bc002d',
  KOR: '#0047a0', KSA: '#007a33', MAR: '#ce1126', MEX: '#007934',
  NED: '#fc9f00', NGA: '#007a5e', NOR: '#ba0c2f', NZL: '#000000',
  PAN: '#d21012', PER: '#d91022', POL: '#dc143c', POR: '#006600',
  ROU: '#002B7F', RUS: '#d52b1e', SEN: '#008046', SRB: '#c63638',
  SCO: '#0065bd', SUI: '#ff0000', SWE: '#006aa7', TUN: '#e70013',
  TUR: '#e30a17', UKR: '#005bbb', URU: '#ffffff', USA: '#cf0a2e',
  FWC: '#f7d717'
};

export default function App() {
  const [view, setView] = useState('grouped');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const { stickers, stats, loading, search, setSearch, increment, decrement } = useStickers();
  const t = translations.es;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const groupedStickers = useMemo(() => {
    const groups = {};
    for (const sticker of stickers) {
      const code = sticker.country_code;
      if (!groups[code]) groups[code] = [];
      groups[code].push(sticker);
    }
    return Object.entries(groups).sort(([a], [b]) => {
      if (a[0] === 'FWC') return -1;
      if (b[0] === 'FWC') return 1;
      return a.localeCompare(b);
    });
  }, [stickers]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-black' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'}`}>
      <div className={`mx-auto min-h-screen shadow-2xl ${darkMode ? 'bg-black/95' : 'bg-white/80'} backdrop-blur-xl`}>
        <header className={`sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center gap-3 border-b backdrop-blur-lg ${
          darkMode 
            ? 'bg-black/80 border-green-800/50' 
            : 'bg-white/70 border-green-200/50'
        }`}>
          <img src="/logo.webp" alt="World Cup 2026" className="w-10 h-10 rounded-lg" />
          <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link
            to="/missing"
            className={`p-2 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
            title="Figuras Faltantes"
          >
            <List className="w-5 h-5" />
          </Link>
          <Link
            to="/duplicates"
            className={`p-2 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
            title="Figuras Duplicadas"
          >
            <Copy className="w-5 h-5" />
          </Link>
        </header>

        <SearchBar onSearch={setSearch} darkMode={darkMode} />
        <StatsPanel stats={stats} darkMode={darkMode} t={t} />

        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 backdrop-blur-md border-b gap-2 ${
          darkMode 
            ? 'bg-black/60 border-green-800/30' 
            : 'bg-white/50 border-green-200/30'
        }`}>
          <div className="flex gap-2">
            <button
              onClick={() => setView('grouped')}
              className={`sm:flex-none px-2 sm:px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                view === 'grouped' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/40' 
                  : `${darkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-100 text-green-700 hover:bg-green-200'}`
              }`}
            >
              {t.byCountry}
            </button>
            <button
              onClick={() => setView('grid')}
              className={`sm:flex-none px-2 sm:px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                view === 'grid' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/40' 
                  : `${darkMode ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-100 text-green-700 hover:bg-green-200'}`
              }`}
            >
              {t.allStickers}
            </button>
          </div>

          <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-green-500/70' : 'text-green-600'}`}>
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">{t.rightClickRemove}</span>
            <span className="sm:hidden">{t.longPress}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className={`text-sm ${darkMode ? 'text-green-500/70' : 'text-green-600'}`}>{t.loading}</p>
          </div>
        ) : view === 'grid' ? (
          <StickerGrid stickers={stickers} onIncrement={increment} onDecrement={decrement} darkMode={darkMode} />
        ) : (
          groupedStickers.map(([country, countryStickers]) => (
            <CountrySection
              key={country}
              country={country}
              stickers={countryStickers}
              onIncrement={increment}
              onDecrement={decrement}
              darkMode={darkMode}
              isIntro={country === 'FWC'}
              t={t}
              teamColor={TEAM_COLORS[country]}
            />
          ))
        )}
      </div>
    </div>
  );
}