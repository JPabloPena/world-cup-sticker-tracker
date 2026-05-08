import { Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function StickerCard({ sticker, onIncrement, onDecrement, darkMode }) {
  const { id, name, country_code, position, count } = sticker;
  const [isPressed, setIsPressed] = useState(false);
  const timer = useRef(null);
  const didLongPress = useRef(false);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const getCardClass = () => {
    if (countRef.current === 0) return 'sticker-missing';
    if (countRef.current === 1) return 'sticker-collected';
    return 'sticker-repeated';
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (countRef.current > 0) {
      onDecrement(id, countRef.current);
    }
  };

  const handlePointerDown = (e) => {
    if (e.button === 2) return;
    didLongPress.current = false;
    setIsPressed(true);
    timer.current = setTimeout(() => {
      if (countRef.current > 0) {
        didLongPress.current = true;
        onDecrement(id, countRef.current);
      }
      setIsPressed(false);
    }, 400);
  };

  const handlePointerUp = (e) => {
    if (e.button === 2) return;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (!didLongPress.current) {
      onIncrement(id, countRef.current);
    }
    setIsPressed(false);
  };

  const handlePointerMove = (e) => {
    if (e.button === 2) return;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    didLongPress.current = false;
    setIsPressed(false);
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <div
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerMove}
      onMouseDown={(e) => {
        if (e.button === 2) {
          e.preventDefault();
        }
      }}
      onClick={(e) => {
        e.preventDefault();
      }}
      className={`sticker-card h-24 ${getCardClass()} ${isPressed ? 'scale-95' : 'scale-100'} animate-bounce-in`}
    >
      {countRef.current === 1 && (
        <div className="absolute top-1 right-1 bg-white/30 backdrop-blur-sm rounded-full p-0.5">
          <Check className="w-3 h-3" />
        </div>
      )}
      {countRef.current > 1 && (
        <div className="absolute -top-2 -right-2 bg-white text-amber-600 font-display text-xs w-7 h-7 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
          x{countRef.current}
        </div>
      )}
      <div className="text-xs font-bold opacity-80 tracking-wider">{country_code}</div>
      <div className="text-xl font-display">{position}</div>
      <div className="text-[9px] text-center truncate w-full px-1 mt-0.5 opacity-90 font-medium">
        {name.length > 12 ? name.slice(0, 12) + '...' : name}
      </div>
    </div>
  );
}