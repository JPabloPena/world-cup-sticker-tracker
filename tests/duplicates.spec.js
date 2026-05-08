import { test, expect } from '@playwright/test';

test.describe('Duplicates API Tests', () => {
  test('GET /api/duplicates returns 200', async ({ request }) => {
    const response = await request.get('/api/duplicates');
    expect(response.status()).toBe(200);
  });

  test('GET /api/duplicates returns array', async ({ request }) => {
    const response = await request.get('/api/duplicates');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('GET /api/duplicates returns correct structure', async ({ request }) => {
    const response = await request.get('/api/duplicates');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      const first = data[0];
      expect(first).toHaveProperty('country_code');
      expect(first).toHaveProperty('duplicates');
    }
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