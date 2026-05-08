import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, darkMode }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className={`sticky top-0 z-40 px-4 sm:px-6 py-3 backdrop-blur-xl transition-colors duration-300 ${
      darkMode 
        ? 'bg-black/60 border-b border-green-900/30' 
        : 'bg-white/60 border-b border-green-200/30'
    }`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
        <input
          type="text"
          placeholder="Buscar jugador, país o ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full pl-10 pr-10 py-3 rounded-xl text-base search-input border transition-all duration-300 ${
            darkMode 
              ? 'border-green-800/50 text-white placeholder-green-500/60' 
              : 'border-green-200/50 text-green-900 placeholder-green-500/70'
          }`}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-green-500 hover:text-green-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}