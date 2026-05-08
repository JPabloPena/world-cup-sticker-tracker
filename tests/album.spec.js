import { test, expect } from '@playwright/test';

const EXPECTED_TEAMS = [
  'MEX', 'RSA', 'KOR', 'CZE', 'CAN', 'BIH', 'QAT', 'SUI', 'BRA', 'MAR',
  'HAI', 'SCO', 'USA', 'PAR', 'AUS', 'TUR', 'GER', 'CUW', 'CIV', 'ECU',
  'NED', 'JPN', 'SWE', 'TUN', 'BEL', 'EGY', 'IRN', 'NZL', 'ESP', 'CPV',
  'KSA', 'URU', 'FRA', 'SEN', 'IRQ', 'NOR', 'ARG', 'ALG', 'AUT', 'JOR',
  'POR', 'COD', 'UZB', 'COL', 'ENG', 'CRO', 'GHA', 'PAN'
];

const HIGH_PROFILE_PLAYERS = {
  ARG17: 'Lionel Messi',
  BRA14: 'Vinicius Júnior',
  FRA20: 'Kylian Mbappe',
  ENG18: 'Harry Kane',
  USA16: 'Christian Pulisic',
  MEX15: 'Hirving Lozano',
};

test.describe('Album Sticker Tests', () => {
  test('API returns 992 stickers total', async ({ request }) => {
    const response = await request.get('/api/stickers');
    const data = await response.json();
    expect(data.length).toBe(992);
  });

  test('all 48 teams have 20 stickers each', async ({ request }) => {
    const response = await request.get('/api/stickers');
    const data = await response.json();
    
    for (const team of EXPECTED_TEAMS) {
      const teamStickers = data.filter(s => s.country_code === team);
      expect(teamStickers.length).toBe(20);
    }
  });

  test('FWC intro stickers exist (FWC0-FWC19)', async ({ request }) => {
    const response = await request.get('/api/stickers');
    const data = await response.json();
    
    const introStickers = data.filter(s => s.country_code === 'FWC');
    expect(introStickers.length).toBe(20);
    
    const ids = introStickers.map(s => s.id).sort();
    expect(ids).toContain('FWC0');
    expect(ids).toContain('FWC19');
  });

  test('Coca-Cola stickers exist (1-12)', async ({ request }) => {
    const response = await request.get('/api/stickers');
    const data = await response.json();
    
    const colaStickers = data.filter(s => s.country_code === 'COLA');
    expect(colaStickers.length).toBe(12);
    
    const ids = colaStickers.map(s => s.id).sort();
    expect(ids).toContain('1');
    expect(ids).toContain('12');
  });

  test('high-profile players have correct names', async ({ request }) => {
    const response = await request.get('/api/stickers');
    const data = await response.json();
    
    for (const [id, expectedName] of Object.entries(HIGH_PROFILE_PLAYERS)) {
      const sticker = data.find(s => s.id === id);
      expect(sticker).toBeDefined();
      expect(sticker.name).toBe(expectedName);
    }
  });

  test('Messi sticker exists (ARG17)', async ({ request }) => {
    const response = await request.get('/api/stickers?search=ARG17');
    const data = await response.json();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].name).toContain('Messi');
  });

  test('search finds stickers by country code', async ({ request }) => {
    const response = await request.get('/api/stickers?search=ARG');
    const data = await response.json();
    expect(data.length).toBeGreaterThan(0);
    expect(data.every(s => s.id.includes('ARG') || s.name.includes('ARG') || s.country_code === 'ARG')).toBe(true);
  });

  test('PUT /api/stickers/:id updates count', async ({ request }) => {
    const testId = 'ARG1';
    
    const getResponse = await request.get(`/api/stickers/${testId}`);
    const sticker = await getResponse.json();
    const originalCount = sticker.count;
    
    const updateResponse = await request.put(`/api/stickers/${testId}`, { count: originalCount + 1 });
    expect(updateResponse.status()).toBe(200);
    
    const updatedSticker = await updateResponse.json();
    expect(updatedSticker.count).toBe(originalCount + 1);
    
    await request.put(`/api/stickers/${testId}`, { count: originalCount });
  });

  test('sticker count defaults to 0', async ({ request }) => {
    const response = await request.get('/api/stickers');
    const data = await response.json();
    
    for (const sticker of data.slice(0, 20)) {
      expect(sticker.count).toBe(0);
    }
  });

  test('stickers are ordered by country_code then position', async ({ request }) => {
    const response = await request.get('/api/stickers');
    const data = await response.json();
    
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      
      if (prev.country_code !== curr.country_code) {
        expect(curr.country_code > prev.country_code).toBe(true);
      } else {
        expect(curr.position >= prev.position).toBe(true);
      }
    }
  });
});