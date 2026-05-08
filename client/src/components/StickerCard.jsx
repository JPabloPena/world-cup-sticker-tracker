import { Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function StickerCard({ sticker, onIncrement, onDecrement, darkMode }) {
  const { id, name, country_code, position, count } = sticker;
  const [isPressed, setIsPressed] = useState(false);
  const timer = useRef(null);
  const pressId = useRef(0);
  const countRef = useRef(count);
  const longPressFired = useRef(false);
  const activePointerId = useRef(null);
  const lastPointerType = useRef('mouse');
  const startPoint = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);

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
    if (lastPointerType.current !== 'mouse') return;
    if (countRef.current > 0) {
      onDecrement(id);
    }
  };

  const startPress = (e) => {
    if (e.pointerType === 'mouse' && e.button === 2) return;
    if (e.isPrimary === false) return;
    
    if (timer.current) {
      clearTimeout(timer.current);
    }
    
    lastPointerType.current = e.pointerType || 'mouse';
    longPressFired.current = false;
    movedRef.current = false;
    activePointerId.current = e.pointerId ?? null;
    startPoint.current = { x: e.clientX ?? 0, y: e.clientY ?? 0 };
    const currentPressId = pressId.current + 1;
    pressId.current = currentPressId;
    setIsPressed(true);
    
    timer.current = setTimeout(() => {
      if (pressId.current === currentPressId && !movedRef.current) {
        longPressFired.current = true;
        if (countRef.current > 0) {
          onDecrement(id);
        }
      }
      setIsPressed(false);
      timer.current = null;
    }, 250);
  };

  const endPress = (e) => {
    if (e.pointerType === 'mouse' && e.button === 2) return;
    if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
    
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    if (!longPressFired.current && !movedRef.current) {
      onIncrement(id);
    }
    
    setIsPressed(false);
    activePointerId.current = null;
  };

  const handlePointerDown = startPress;
  const handlePointerUp = endPress;

  const cancelPress = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    movedRef.current = true;
    setIsPressed(false);
    activePointerId.current = null;
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === 'mouse') {
      cancelPress();
    }
  };

  const handlePointerMove = (e) => {
    if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;
    const dx = Math.abs((e.clientX ?? 0) - startPoint.current.x);
    const dy = Math.abs((e.clientY ?? 0) - startPoint.current.y);
    if (dx + dy > 10) {
      movedRef.current = true;
      cancelPress();
    }
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
    onPointerLeave={handlePointerLeave}
    onPointerMove={handlePointerMove}
    onPointerCancel={cancelPress}
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