import { test, expect } from '@playwright/test';

test.describe('Missing Stickers API Tests', () => {
  test('GET /api/missing returns 200', async ({ request }) => {
    const response = await request.get('/api/missing');
    expect(response.status()).toBe(200);
  });

  test('GET /api/missing returns array of countries', async ({ request }) => {
    const response = await request.get('/api/missing');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /api/missing returns sections with missing stickers', async ({ request }) => {
    const response = await request.get('/api/missing');
    const data = await response.json();
    expect(data.length).toBeGreaterThan(40);
    for (const country of data) {
      if (country.missing_ids.length > 0) {
        expect(country.missing_ids.length).toBeLessThanOrEqual(20);
      }
    }
  });

  test('GET /api/missing returns correct structure', async ({ request }) => {
    const response = await request.get('/api/missing');
    const data = await response.json();
    
    expect(data.length).toBeGreaterThan(0);
    const first = data[0];
    expect(first).toHaveProperty('country_code');
    expect(first).toHaveProperty('missing_ids');
    expect(Array.isArray(first.missing_ids)).toBe(true);
  });

  test('GET /api/missing returns counts per section', async ({ request }) => {
    const response = await request.get('/api/missing');
    const data = await response.json();
    
    for (const country of data) {
      expect(country.missing_ids.length).toBeLessThanOrEqual(20);
    }
  });

  test('GET /api/missing can filter by country', async ({ request }) => {
    const response = await request.get('/api/missing?country=MEX');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

test.describe('Missing Stickers UI Tests', () => {
  test('/missing page loads', async ({ page }) => {
    await page.goto('/missing');
    await expect(page).toHaveTitle(/Sticker/);
  });

  test('/missing page displays missing stickers by country', async ({ page }) => {
    await page.goto('/missing');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    expect(content).toMatch(/ARG|ARGENTINA/i);
  });
});