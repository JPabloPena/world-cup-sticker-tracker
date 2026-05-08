import StickerCard from './StickerCard';

export default function CountrySection({ country, stickers, onIncrement, onDecrement, darkMode, isIntro, t, teamColor }) {
  const collected = stickers.filter(s => s.count > 0).length;
  const progress = stickers.length > 0 ? Math.round((collected / stickers.length) * 100) : 0;
  const displayName = isIntro ? (t?.intro || 'Intro') : country;
  const color = teamColor || (isIntro ? '#f7d717' : '#6b7280');

  return (
    <div className="mt-4 mb-4 sm:mb-6 mx-3 sm:mx-4">
      <div 
        className={`flex items-center justify-between px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 ${
          darkMode 
            ? 'bg-green-950/40 border-green-800/50' 
            : 'bg-white/60 border-green-200/50'
        }`}
        style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm"
            style={{ backgroundColor: color }}
          >
            {country}
          </div>
          <div>
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-green-900'}`}>
              {displayName}
            </span>
            <span className={`text-sm ml-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              ({collected}/{stickers.length})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {progress}%
          </div>
          <div className={`w-16 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-green-900/50' : 'bg-green-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 p-2 sm:p-3">
        {stickers.map((sticker) => (
          <StickerCard
            key={sticker.id}
            sticker={sticker}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
}