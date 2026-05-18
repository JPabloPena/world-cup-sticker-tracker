import { useState, useEffect } from 'react';
import { List, AlertCircle, ChevronDown, ChevronUp, Home } from 'lucide-react';

const TEAM_COLORS = {
  ARG: '#6cade4', AUS: '#125eac', AUT: '#ed2939', BEL: '#ffd90f',
  BRA: '#ffc107', CAN: '#ff0000', COL: '#fcd116', CRO: '#ff0000', CZE: '#11457e',
  ECU: '#ffda00', ENG: '#ce1124', ESP: '#c60a30', FRA: '#0055a4', GER: '#000000',
  GHA: '#006b3f', IRN: '#239e46', JPN: '#bc002d', KOR: '#0047a0', KSA: '#007a33',
  MAR: '#ce1126', MEX: '#007934', NED: '#fc9f00', NOR: '#ba0c2f', NZL: '#000000',
  PAN: '#d21012', POR: '#006600', SEN: '#008046', SCO: '#0065bd', SUI: '#ff0000',
  SWE: '#006aa7', TUN: '#e70013', TUR: '#e30a17', URU: '#ffffff', USA: '#cf0a2e',
  FWC: '#f7d717', COLA: '#d21012', BIH: '#083d87', CIV: '#f77f00', CUW: '#002395',
  HAI: '#00209f', JOR: '#8a8a8a', PAR: '#d21012', IRQ: '#00853f', ALG: '#007a3d',
  COD: '#fcce00', CPV: '#002395', UZB: '#0099d5'
};

const COUNTRY_NAMES = {
  ARG: 'Argentina', AUS: 'Australia', AUT: 'Austria', BEL: 'Belgium', BRA: 'Brazil',
  CAN: 'Canada', COL: 'Colombia', CRO: 'Croatia', CZE: 'Czechia', ECU: 'Ecuador',
  ENG: 'England', ESP: 'Spain', FRA: 'France', GER: 'Germany', GHA: 'Ghana',
  IRN: 'Iran', JPN: 'Japan', KOR: 'South Korea', KSA: 'Saudi Arabia', MAR: 'Morocco',
  MEX: 'Mexico', NED: 'Netherlands', NOR: 'Norway', NZL: 'New Zealand', PAN: 'Panama',
  POR: 'Portugal', SEN: 'Senegal', SCO: 'Scotland', SUI: 'Switzerland', SWE: 'Sweden',
  TUN: 'Tunisia', TUR: 'Turkey', URU: 'Uruguay', USA: 'United States', FWC: 'World Cup',
  RSA: 'South Africa', COLA: 'Coca-Cola', BIH: 'Bosnia & Herzegovina', CIV: 'Ivory Coast', CUW: 'Curaçao',
  HAI: 'Haiti', JOR: 'Jordan', PAR: 'Paraguay', IRQ: 'Iraq', ALG: 'Algeria',
  COD: 'Congo DR', CPV: 'Cape Verde', UZB: 'Uzbekistan'
};

export default function MissingGrid() {
  const [loading, setLoading] = useState(true);
  const [missingData, setMissingData] = useState([]);
  const [expandedCountries, setExpandedCountries] = useState({});
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    fetch('/api/missing')
      .then(res => res.json())
      .then(data => {
        setMissingData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleCountry = (country) => {
    setExpandedCountries(prev => ({
      ...prev,
      [country]: !prev[country]
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className={`text-sm ${darkMode ? 'text-green-500/70' : 'text-green-600'}`}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-black' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'}`}>
      <div className={`mx-auto min-h-screen shadow-2xl ${darkMode ? 'bg-black/95' : 'bg-white/80'} backdrop-blur-xl`}>
        <header className={`sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center gap-3 border-b backdrop-blur-lg ${
          darkMode ? 'bg-black/80 border-green-800/50' : 'bg-white/70 border-green-200/50'
        }`}>
          <a href="/" className={`p-2 rounded-full transition-all ${
            darkMode ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70' : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}>
            <Home className="w-5 h-5" />
          </a>
          <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Figuras Faltantes
          </h1>
        </header>

        <div className="p-4 space-y-2">
          {missingData.map((country) => (
            <div key={country.country_code} className={`rounded-lg overflow-hidden ${
              darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
            } border`}>
              <button
                onClick={() => toggleCountry(country.country_code)}
                className={`w-full px-4 py-3 flex items-center justify-between ${
                  darkMode ? 'hover:bg-green-900/30' : 'hover:bg-green-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: TEAM_COLORS[country.country_code] || '#6b7280' }}
                  >
                    {country.country_code.slice(0, 2)}
                  </div>
                  <span className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                    {COUNTRY_NAMES[country.country_code] || country.country_code}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-green-600' : 'text-green-500'}`}>
                    ({country.missing_ids.length} faltantes)
                  </span>
                </div>
                {expandedCountries[country.country_code] ? (
                  <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-green-600' : 'text-green-500'}`} />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-green-600' : 'text-green-500'}`} />
                )}
              </button>
              
              {expandedCountries[country.country_code] && (
                <div className={`px-4 pb-3 text-sm ${
                  darkMode ? 'text-green-400/80' : 'text-green-600'
                }`}>
                  <div className="flex flex-wrap gap-1">
                    {country.missing_ids.map((num) => (
                      <span
                        key={num}
                        className={`px-2 py-1 rounded ${
                          darkMode ? 'bg-green-900/40' : 'bg-green-100'
                        }`}
                      >
                        {String(num).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}