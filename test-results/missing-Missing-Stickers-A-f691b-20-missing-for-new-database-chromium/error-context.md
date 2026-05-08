# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: missing.spec.js >> Missing Stickers API Tests >> GET /api/missing returns all 20 missing for new database
- Location: tests\missing.spec.js:32:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 20
Received: 18
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Missing Stickers API Tests', () => {
  4  |   test('GET /api/missing returns 200', async ({ request }) => {
  5  |     const response = await request.get('/api/missing');
  6  |     expect(response.status()).toBe(200);
  7  |   });
  8  | 
  9  |   test('GET /api/missing returns array of countries', async ({ request }) => {
  10 |     const response = await request.get('/api/missing');
  11 |     const data = await response.json();
  12 |     expect(Array.isArray(data)).toBe(true);
  13 |   });
  14 | 
  15 |   test('GET /api/missing returns all 48 countries', async ({ request }) => {
  16 |     const response = await request.get('/api/missing');
  17 |     const data = await response.json();
  18 |     expect(data.length).toBe(48);
  19 |   });
  20 | 
  21 |   test('GET /api/missing returns correct structure', async ({ request }) => {
  22 |     const response = await request.get('/api/missing');
  23 |     const data = await response.json();
  24 |     
  25 |     expect(data.length).toBeGreaterThan(0);
  26 |     const first = data[0];
  27 |     expect(first).toHaveProperty('country_code');
  28 |     expect(first).toHaveProperty('missing_ids');
  29 |     expect(Array.isArray(first.missing_ids)).toBe(true);
  30 |   });
  31 | 
  32 |   test('GET /api/missing returns all 20 missing for new database', async ({ request }) => {
  33 |     const response = await request.get('/api/missing');
  34 |     const data = await response.json();
  35 |     
  36 |     for (const country of data) {
> 37 |       expect(country.missing_ids.length).toBe(20);
     |                                          ^ Error: expect(received).toBe(expected) // Object.is equality
  38 |     }
  39 |   });
  40 | 
  41 |   test('GET /api/missing filters by country_code query', async ({ request }) => {
  42 |     const response = await request.get('/api/missing?country=ARG');
  43 |     const data = await response.json();
  44 |     
  45 |     expect(data.length).toBe(1);
  46 |     expect(data[0].country_code).toBe('ARG');
  47 |   });
  48 | });
  49 | 
  50 | test.describe('Missing Stickers UI Tests', () => {
  51 |   test('/missing page loads', async ({ page }) => {
  52 |     await page.goto('/missing');
  53 |     await expect(page).toHaveTitle(/Sticker/);
  54 |   });
  55 | 
  56 |   test('/missing page displays missing stickers by country', async ({ page }) => {
  57 |     await page.goto('/missing');
  58 |     await page.waitForTimeout(1000);
  59 |     
  60 |     const content = await page.content();
  61 |     expect(content).toMatch(/ARG|ARGENTINA/i);
  62 |   });
  63 | });
```