# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: duplicates.spec.js >> Duplicates API Tests >> GET /api/duplicates filters by country_code query
- Location: tests\duplicates.spec.js:61:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Duplicates API Tests', () => {
  4  |   test('GET /api/duplicates returns 200', async ({ request }) => {
  5  |     const response = await request.get('/api/duplicates');
  6  |     expect(response.status()).toBe(200);
  7  |   });
  8  | 
  9  |   test('GET /api/duplicates returns array of countries', async ({ request }) => {
  10 |     const response = await request.get('/api/duplicates');
  11 |     const data = await response.json();
  12 |     expect(Array.isArray(data)).toBe(true);
  13 |   });
  14 | 
  15 |   test('GET /api/duplicates returns correct structure', async ({ request }) => {
  16 |     const response = await request.get('/api/duplicates');
  17 |     const data = await response.json();
  18 |     
  19 |     expect(data.length).toBe(0);
  20 |   });
  21 | 
  22 |   test('GET /api/duplicates returns duplicates after marking stickers', async ({ request }) => {
  23 |     await request.put('/api/stickers/ARG1', { count: 3 });
  24 |     await request.put('/api/stickers/ARG2', { count: 2 });
  25 |     await request.put('/api/stickers/BRA1', { count: 5 });
  26 |     
  27 |     const response = await request.get('/api/duplicates');
  28 |     const data = await response.json();
  29 |     
  30 |     expect(data.length).toBeGreaterThan(0);
  31 |     
  32 |     const argEntry = data.find(d => d.country_code === 'ARG');
  33 |     expect(argEntry).toBeDefined();
  34 |     expect(argEntry.duplicates.length).toBe(2);
  35 |     
  36 |     const braEntry = data.find(d => d.country_code === 'BRA');
  37 |     expect(braEntry).toBeDefined();
  38 |     expect(braEntry.duplicates.length).toBe(1);
  39 |     
  40 |     await request.put('/api/stickers/ARG1', { count: 0 });
  41 |     await request.put('/api/stickers/ARG2', { count: 0 });
  42 |     await request.put('/api/stickers/BRA1', { count: 0 });
  43 |   });
  44 | 
  45 |   test('GET /api/duplicates returns correct duplicate counts', async ({ request }) => {
  46 |     await request.put('/api/stickers/ARG10', { count: 5 });
  47 |     
  48 |     const response = await request.get('/api/duplicates');
  49 |     const data = await response.json();
  50 |     
  51 |     const argEntry = data.find(d => d.country_code === 'ARG');
  52 |     expect(argEntry).toBeDefined();
  53 |     
  54 |     const sticker = argEntry.duplicates.find(d => d.id === 'ARG10');
  55 |     expect(sticker).toBeDefined();
  56 |     expect(sticker.count).toBe(4);
  57 |     
  58 |     await request.put('/api/stickers/ARG10', { count: 0 });
  59 |   });
  60 | 
  61 |   test('GET /api/duplicates filters by country_code query', async ({ request }) => {
  62 |     await request.put('/api/stickers/MEX1', { count: 2 });
  63 |     
  64 |     const response = await request.get('/api/duplicates?country=MEX');
  65 |     const data = await response.json();
  66 |     
> 67 |     expect(data.length).toBe(1);
     |                         ^ Error: expect(received).toBe(expected) // Object.is equality
  68 |     expect(data[0].country_code).toBe('MEX');
  69 |     
  70 |     await request.put('/api/stickers/MEX1', { count: 0 });
  71 |   });
  72 | });
  73 | 
  74 | test.describe('Duplicates UI Tests', () => {
  75 |   test('/duplicates page loads', async ({ page }) => {
  76 |     await page.goto('/duplicates');
  77 |     await expect(page).toHaveTitle(/Sticker/);
  78 |   });
  79 | 
  80 |   test('/duplicates page shows empty state for new database', async ({ page }) => {
  81 |     await page.goto('/duplicates');
  82 |     await page.waitForTimeout(1000);
  83 |     
  84 |     const content = await page.content();
  85 |     expect(content).toMatch(/no duplicates|empty|0/i);
  86 |   });
  87 | });
```