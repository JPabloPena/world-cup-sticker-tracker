import { test, expect } from '@playwright/test';

test.describe('Duplicates API Tests', () => {
  test('GET /api/duplicates returns 200', async ({ request }) => {
    const response = await request.get('/api/duplicates');
    expect(response.status()).toBe(200);
  });

  test('GET /api/duplicates returns array of countries', async ({ request }) => {
    const response = await request.get('/api/duplicates');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /api/duplicates returns correct structure', async ({ request }) => {
    const response = await request.get('/api/duplicates');
    const data = await response.json();
    
    expect(data.length).toBe(0);
  });

  test('GET /api/duplicates returns duplicates after marking stickers', async ({ request }) => {
    await request.put('/api/stickers/ARG1', { count: 3 });
    await request.put('/api/stickers/ARG2', { count: 2 });
    await request.put('/api/stickers/BRA1', { count: 5 });
    
    const response = await request.get('/api/duplicates');
    const data = await response.json();
    
    expect(data.length).toBeGreaterThan(0);
    
    const argEntry = data.find(d => d.country_code === 'ARG');
    expect(argEntry).toBeDefined();
    expect(argEntry.duplicates.length).toBe(2);
    
    const braEntry = data.find(d => d.country_code === 'BRA');
    expect(braEntry).toBeDefined();
    expect(braEntry.duplicates.length).toBe(1);
    
    await request.put('/api/stickers/ARG1', { count: 0 });
    await request.put('/api/stickers/ARG2', { count: 0 });
    await request.put('/api/stickers/BRA1', { count: 0 });
  });

  test('GET /api/duplicates returns correct duplicate counts', async ({ request }) => {
    await request.put('/api/stickers/ARG10', { count: 5 });
    
    const response = await request.get('/api/duplicates');
    const data = await response.json();
    
    const argEntry = data.find(d => d.country_code === 'ARG');
    expect(argEntry).toBeDefined();
    
    const sticker = argEntry.duplicates.find(d => d.id === 'ARG10');
    expect(sticker).toBeDefined();
    expect(sticker.count).toBe(4);
    
    await request.put('/api/stickers/ARG10', { count: 0 });
  });

  test('GET /api/duplicates filters by country_code query', async ({ request }) => {
    await request.put('/api/stickers/MEX1', { count: 2 });
    
    const response = await request.get('/api/duplicates?country=MEX');
    const data = await response.json();
    
    expect(data.length).toBe(1);
    expect(data[0].country_code).toBe('MEX');
    
    await request.put('/api/stickers/MEX1', { count: 0 });
  });
});

test.describe('Duplicates UI Tests', () => {
  test('/duplicates page loads', async ({ page }) => {
    await page.goto('/duplicates');
    await expect(page).toHaveTitle(/Sticker/);
  });

  test('/duplicates page shows empty state for new database', async ({ page }) => {
    await page.goto('/duplicates');
    await page.waitForTimeout(1000);
    
    const content = await page.content();
    expect(content).toMatch(/no duplicates|empty|0/i);
  });
});