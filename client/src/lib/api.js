const API_BASE = '/api';

export async function fetchStickers(search = '') {
  const url = search ? `${API_BASE}/stickers?search=${encodeURIComponent(search)}` : `${API_BASE}/stickers`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch stickers');
  return res.json();
}

export async function updateSticker(id, count) {
  const res = await fetch(`${API_BASE}/stickers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count })
  });
  if (!res.ok) throw new Error('Failed to update sticker');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}