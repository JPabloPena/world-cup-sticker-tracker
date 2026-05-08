export default function StatsPanel({ stats, darkMode, t }) {
  const totalCollected = stats.reduce((sum, s) => sum + s.collected, 0);
  const totalDuplicates = stats.reduce((sum, s) => sum + s.duplicates, 0);
  const totalStickers = stats.reduce((sum, s) => sum + s.total, 0);
  const progressPercent = totalStickers > 0 ? Math.round((totalCollected / totalStickers) * 100) : 0;

  return (
    <div className={`p-4 sm:p-6 border-b backdrop-blur-lg transition-colors duration-300 ${
      darkMode 
        ? 'bg-green-950/30 border-green-900/30' 
        : 'bg-green-50/50 border-green-200/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-display bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            {totalCollected}
          </span>
          <span className={`text-xl ${darkMode ? 'text-green-500/70' : 'text-green-600/70'}`}>/ {totalStickers}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-display text-yellow-500">+{totalDuplicates}</div>
          <div className={`text-xs ${darkMode ? 'text-green-500/70' : 'text-green-600/70'}`}>{t?.duplicates || 'Duplicados'}</div>
        </div>
      </div>
      <div className={`w-full h-4 rounded-full overflow-hidden ${darkMode ? 'bg-green-900/50' : 'bg-green-200'}`}>
        <div
          className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className={`mt-2 text-sm text-center font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
        <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{progressPercent}%</span> {t?.complete || 'Completo'}
      </div>
    </div>
  );
}