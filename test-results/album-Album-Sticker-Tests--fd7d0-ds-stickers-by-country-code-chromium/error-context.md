# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: album.spec.js >> Album Sticker Tests >> search finds stickers by country code
- Location: tests\album.spec.js:79:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const EXPECTED_TEAMS = [
  4   |   'MEX', 'RSA', 'KOR', 'CZE', 'CAN', 'BIH', 'QAT', 'SUI', 'BRA', 'MAR',
  5   |   'HAI', 'SCO', 'USA', 'PAR', 'AUS', 'TUR', 'GER', 'CUW', 'CIV', 'ECU',
  6   |   'NED', 'JPN', 'SWE', 'TUN', 'BEL', 'EGY', 'IRN', 'NZL', 'ESP', 'CPV',
  7   |   'KSA', 'URU', 'FRA', 'SEN', 'IRQ', 'NOR', 'ARG', 'ALG', 'AUT', 'JOR',
  8   |   'POR', 'COD', 'UZB', 'COL', 'ENG', 'CRO', 'GHA', 'PAN'
  9   | ];
  10  | 
  11  | const HIGH_PROFILE_PLAYERS = {
  12  |   ARG17: 'Lionel Messi',
  13  |   BRA14: 'Vinicius Júnior',
  14  |   FRA20: 'Kylian Mbappe',
  15  |   ENG18: 'Harry Kane',
  16  |   USA16: 'Christian Pulisic',
  17  |   MEX15: 'Hirving Lozano',
  18  | };
  19  | 
  20  | test.describe('Album Sticker Tests', () => {
  21  |   test('API returns 992 stickers total', async ({ request }) => {
  22  |     const response = await request.get('/api/stickers');
  23  |     const data = await response.json();
  24  |     expect(data.length).toBe(992);
  25  |   });
  26  | 
  27  |   test('all 48 teams have 20 stickers each', async ({ request }) => {
  28  |     const response = await request.get('/api/stickers');
  29  |     const data = await response.json();
  30  |     
  31  |     for (const team of EXPECTED_TEAMS) {
  32  |       const teamStickers = data.filter(s => s.country_code === team);
  33  |       expect(teamStickers.length).toBe(20);
  34  |     }
  35  |   });
  36  | 
  37  |   test('FWC intro stickers exist (FWC0-FWC19)', async ({ request }) => {
  38  |     const response = await request.get('/api/stickers');
  39  |     const data = await response.json();
  40  |     
  41  |     const introStickers = data.filter(s => s.country_code === 'FWC');
  42  |     expect(introStickers.length).toBe(20);
  43  |     
  44  |     const ids = introStickers.map(s => s.id).sort();
  45  |     expect(ids).toContain('FWC0');
  46  |     expect(ids).toContain('FWC19');
  47  |   });
  48  | 
  49  |   test('Coca-Cola stickers exist (1-12)', async ({ request }) => {
  50  |     const response = await request.get('/api/stickers');
  51  |     const data = await response.json();
  52  |     
  53  |     const colaStickers = data.filter(s => s.country_code === 'COLA');
  54  |     expect(colaStickers.length).toBe(12);
  55  |     
  56  |     const ids = colaStickers.map(s => s.id).sort();
  57  |     expect(ids).toContain('1');
  58  |     expect(ids).toContain('12');
  59  |   });
  60  | 
  61  |   test('high-profile players have correct names', async ({ request }) => {
  62  |     const response = await request.get('/api/stickers');
  63  |     const data = await response.json();
  64  |     
  65  |     for (const [id, expectedName] of Object.entries(HIGH_PROFILE_PLAYERS)) {
  66  |       const sticker = data.find(s => s.id === id);
  67  |       expect(sticker).toBeDefined();
  68  |       expect(sticker.name).toBe(expectedName);
  69  |     }
  70  |   });
  71  | 
  72  |   test('Messi sticker exists (ARG17)', async ({ request }) => {
  73  |     const response = await request.get('/api/stickers?search=ARG17');
  74  |     const data = await response.json();
  75  |     expect(data.length).toBeGreaterThan(0);
  76  |     expect(data[0].name).toContain('Messi');
  77  |   });
  78  | 
  79  |   test('search finds stickers by country code', async ({ request }) => {
  80  |     const response = await request.get('/api/stickers?search=ARG');
  81  |     const data = await response.json();
  82  |     expect(data.length).toBeGreaterThan(0);
> 83  |     expect(data.every(s => s.id.includes('ARG') || s.name.includes('ARG') || s.country_code === 'ARG')).toBe(true);
      |                                                                                                         ^ Error: expect(received).toBe(expected) // Object.is equality
  84  |   });
  85  | 
  86  |   test('PUT /api/stickers/:id updates count', async ({ request }) => {
  87  |     const testId = 'ARG1';
  88  |     
  89  |     const getResponse = await request.get(`/api/stickers/${testId}`);
  90  |     const sticker = await getResponse.json();
  91  |     const originalCount = sticker.count;
  92  |     
  93  |     const updateResponse = await request.put(`/api/stickers/${testId}`, { count: originalCount + 1 });
  94  |     expect(updateResponse.status()).toBe(200);
  95  |     
  96  |     const updatedSticker = await updateResponse.json();
  97  |     expect(updatedSticker.count).toBe(originalCount + 1);
  98  |     
  99  |     await request.put(`/api/stickers/${testId}`, { count: originalCount });
  100 |   });
  101 | 
  102 |   test('sticker count defaults to 0', async ({ request }) => {
  103 |     const response = await request.get('/api/stickers');
  104 |     const data = await response.json();
  105 |     
  106 |     for (const sticker of data.slice(0, 20)) {
  107 |       expect(sticker.count).toBe(0);
  108 |     }
  109 |   });
  110 | 
  111 |   test('stickers are ordered by country_code then position', async ({ request }) => {
  112 |     const response = await request.get('/api/stickers');
  113 |     const data = await response.json();
  114 |     
  115 |     for (let i = 1; i < data.length; i++) {
  116 |       const prev = data[i - 1];
  117 |       const curr = data[i];
  118 |       
  119 |       if (prev.country_code !== curr.country_code) {
  120 |         expect(curr.country_code > prev.country_code).toBe(true);
  121 |       } else {
  122 |         expect(curr.position >= prev.position).toBe(true);
  123 |       }
  124 |     }
  125 |   });
  126 | });
```