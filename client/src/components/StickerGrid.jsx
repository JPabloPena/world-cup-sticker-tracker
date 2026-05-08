import StickerCard from './StickerCard';
import { Sparkles } from 'lucide-react';

export default function StickerGrid({ stickers, onIncrement, onDecrement, darkMode }) {
  if (stickers.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-16 ${darkMode ? 'text-white/50' : 'text-purple-400'}`}>
        <Sparkles className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No se encontraron figuras</p>
        <p className="text-sm opacity-70">Intenta con otro término</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 p-3 sm:p-4">
      {stickers.map((sticker, index) => (
        <div 
          key={sticker.id} 
          className="animate-bounce-in"
          style={{ animationDelay: `${Math.min(index * 15, 300)}ms` }}
        >
          <StickerCard
            sticker={sticker}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            darkMode={darkMode}
          />
        </div>
      ))}
    </div>
  );
}