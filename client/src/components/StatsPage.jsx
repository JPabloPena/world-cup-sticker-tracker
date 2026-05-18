import { useState, useEffect } from 'react';
import { Home, TrendingUp, Repeat } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';

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
  COD: '#fcce00', CPV: '#002395', UZB: '#0099d5', RSA: '#007a3d'
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

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
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

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-16 ${darkMode ? 'bg-black' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'}`}>
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className={`text-sm ${darkMode ? 'text-green-500/70' : 'text-green-600'}`}>Cargando estadísticas...</p>
      </div>
    );
  }

  const totalCollected = stats.reduce((sum, s) => sum + (s.collected || 0), 0);
  const totalDuplicates = stats.reduce((sum, s) => sum + (s.duplicates || 0), 0);
  const totalStickers = stats.reduce((sum, s) => sum + (s.total || 0), 0);
  const completionPercentage = totalStickers > 0 ? Math.round((totalCollected / totalStickers) * 100) : 0;

  const completionData = [
    { name: 'Completado', value: totalCollected, fill: '#10b981' },
    { name: 'Faltante', value: totalStickers - totalCollected, fill: darkMode ? '#374151' : '#e5e7eb' }
  ];

  const sectionCompletion = stats
    .map(s => ({
      name: COUNTRY_NAMES[s.country_code] || s.country_code,
      code: s.country_code,
      collected: s.collected,
      missing: s.total - s.collected,
      total: s.total,
      percentage: s.total > 0 ? Math.round((s.collected / s.total) * 100) : 0,
      fill: TEAM_COLORS[s.country_code] || '#6b7280'
    }))
    .filter(s => s.total > 0)
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      if (b.collected !== a.collected) return b.collected - a.collected;
      return a.code.localeCompare(b.code);
    })
    .slice(0, 5);

  const duplicatesData = stats
    .map(s => ({
      name: COUNTRY_NAMES[s.country_code] || s.country_code,
      code: s.country_code,
      duplicates: s.duplicates,
      fill: TEAM_COLORS[s.country_code] || '#6b7280'
    }))
    .filter(s => s.duplicates > 0)
    .sort((a, b) => b.duplicates - a.duplicates)
    .slice(0, 10);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: darkMode ? '#111827' : '#fff',
      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      borderRadius: '8px'
    },
    labelStyle: { color: darkMode ? '#fff' : '#000' }
  };

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
            Estadísticas
          </h1>
        </header>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                {totalCollected}
              </div>
              <div className={`text-xs ${darkMode ? 'text-green-500/70' : 'text-green-600'}`}>Recolectadas</div>
            </div>
            <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
              <Repeat className={`w-6 h-6 mx-auto mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
              <div className={`text-2xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                {totalDuplicates}
              </div>
              <div className={`text-xs ${darkMode ? 'text-amber-500/70' : 'text-amber-600'}`}>Duplicados</div>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
            <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              Progreso del Álbum
            </h2>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="completionGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={index} fill={index === 0 ? 'url(#completionGradient)' : entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                    {completionPercentage}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  {totalCollected} recolectadas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  {totalStickers - totalCollected} faltantes
                </span>
              </div>
            </div>
          </div>

          {sectionCompletion.length > 0 && (
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                Completado por Sección
              </h2>
              <div className="space-y-3">
                {sectionCompletion.map((section, idx) => {
                  const collectedWidth = (section.collected / section.total) * 100;
                  return (
                    <div key={section.code} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: section.fill }}
                          >
                            {section.code.slice(0, 2)}
                          </div>
                          <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                            {section.name}
                          </span>
                        </div>
                        <span className={`text-sm ${darkMode ? 'text-green-500/70' : 'text-green-600'}`}>
                          {section.collected}/{section.total} ({section.percentage}%)
                        </span>
                      </div>
                      <div className={`h-3 rounded-full overflow-hidden flex ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${collectedWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {duplicatesData.length > 0 && (
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                Duplicados por Sección
              </h2>
              <div className="h-48" style={{ pointerEvents: 'none' }}>
                <ResponsiveContainer width="100%" height="100%" style={{ pointerEvents: 'none' }}>
                  <BarChart data={duplicatesData} layout="vertical" margin={{ left: 0, right: 0 }} onClick={() => {}}>
                    <defs>
                      {duplicatesData.map((d, i) => (
                        <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={d.fill} stopOpacity="0.9" />
                          <stop offset="100%" stopColor={d.fill} stopOpacity="0.6" />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={80}
                      tick={{ fontSize: 10, fill: darkMode ? '#6ee7b7' : '#166534' }}
                    />
                    <Bar 
                      dataKey="duplicates" 
                      radius={[0, 4, 4, 0]}
                      isAnimationActive={true}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      <LabelList 
                        dataKey="duplicates" 
                        position="insideLeft"
                        offset={8}
                        style={{ 
                          fill: '#fff', 
                          fontSize: 11,
                          fontWeight: 600,
                          textShadow: '0px 0px 2px rgba(0,0,0,0.5)'
                        }} 
                      />
                      {duplicatesData.map((entry, index) => (
                        <Cell 
                          key={index} 
                          fill={`url(#gradient-${index})`}
                          pointerEvents="none"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {totalCollected === 0 && (
            <div className={`flex flex-col items-center justify-center p-16 ${
              darkMode ? 'text-green-500/70' : 'text-green-600'
            }`}>
              <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-semibold">Sin datos aún</p>
              <p className="text-sm mt-2">Comienza a marcar tus figuras para ver estadísticas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}