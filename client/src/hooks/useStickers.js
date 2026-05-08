import { useState, useEffect, useCallback } from 'react';
import { fetchStickers, updateSticker, fetchStats } from '../lib/api';

export function useStickers() {
  const [stickers, setStickers] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pendingUpdates, setPendingUpdates] = useState({});

  const loadStickers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStickers(search);
      setStickers(data);
    } catch (err) {
      console.error('Failed to load stickers:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  useEffect(() => {
    loadStickers();
    loadStats();
  }, [loadStickers, loadStats]);

  const increment = useCallback(async (id, currentCount) => {
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;
    const newCount = (currentCount ?? sticker.count) + 1;
    
    setStickers(prev => prev.map(s => 
      s.id === id ? { ...s, count: newCount } : s
    ));
    setPendingUpdates(prev => ({ ...prev, [id]: true }));
    
    try {
      await updateSticker(id, newCount);
      await loadStats();
    } catch (err) {
      console.error('Failed to increment:', err);
      setStickers(prev => prev.map(s => 
        s.id === id ? { ...s, count: newCount - 1 } : s
      ));
    } finally {
      setPendingUpdates(prev => ({ ...prev, [id]: false }));
    }
  }, [stickers, loadStats]);

  const decrement = useCallback(async (id, currentCount) => {
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;
    const existingCount = currentCount ?? sticker.count;
    if (existingCount <= 0) return;
    
    const newCount = existingCount - 1;
    
    setStickers(prev => prev.map(s => 
      s.id === id ? { ...s, count: newCount } : s
    ));
    setPendingUpdates(prev => ({ ...prev, [id]: true }));
    
    try {
      await updateSticker(id, newCount);
      await loadStats();
    } catch (err) {
      console.error('Failed to decrement:', err);
      setStickers(prev => prev.map(s => 
        s.id === id ? { ...s, count: existingCount } : s
      ));
    } finally {
      setPendingUpdates(prev => ({ ...prev, [id]: false }));
    }
  }, [stickers, loadStats]);

  return {
    stickers,
    stats,
    loading,
    search,
    setSearch,
    increment,
    decrement,
    pendingUpdates,
    reload: loadStickers
  };
}