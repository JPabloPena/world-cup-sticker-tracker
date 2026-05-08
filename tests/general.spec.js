import { test, expect } from '@playwright/test';

test.describe('General App Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sticker/);
  });

  test('search bar renders on homepage', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input');
    await expect(searchInput.first()).toBeVisible();
  });

  test('stats panel displays on homepage', async ({ page }) => {
    await page.goto('/');
    const statsPanel = page.locator('text=/stats|collection|collected/i');
    await expect(statsPanel.first()).toBeVisible();
  });

  test('API /api/stickers endpoint returns 200', async ({ request }) => {
    const response = await request.get('/api/stickers');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('API /api/stats endpoint returns 200', async ({ request }) => {
    const response = await request.get('/api/stats');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('API /api/stickers supports search query', async ({ request }) => {
    const response = await request.get('/api/stickers?search=ARG');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.length).toBeGreaterThan(0);
  });

  test('API returns stickers with required fields', async ({ request }) => {
    const response = await request.get('/api/stickers');
    const data = await response.json();
    expect(data.length).toBeGreaterThan(0);
    const sticker = data[0];
    expect(sticker).toHaveProperty('id');
    expect(sticker).toHaveProperty('country_code');
    expect(sticker).toHaveProperty('name');
    expect(sticker).toHaveProperty('count');
  });
});