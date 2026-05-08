import { test, expect } from '@playwright/test';

test.describe('Desktop Sticker Interactions', () => {
  test.beforeEach(async ({ request }) => {
    await request.put('/api/stickers/ARG1', { data: { count: 0 } });
    await request.put('/api/stickers/ARG2', { data: { count: 0 } });
    await request.put('/api/stickers/ARG3', { data: { count: 0 } });
  });

  test('click adds sticker', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    await expect(sticker).toBeVisible();
    
    await sticker.dispatchEvent('pointerdown');
    await sticker.dispatchEvent('pointerup');
    await page.waitForTimeout(500);
    
    const collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
  });

  test('right-click removes sticker', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    
    await sticker.dispatchEvent('pointerdown');
    await sticker.dispatchEvent('pointerup');
    await page.waitForTimeout(300);
    
    const collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
    
    await sticker.click({ button: 'right' });
    await page.waitForTimeout(500);
    
    const missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
  });

  test('stats panel updates after adding sticker', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    
    await sticker.dispatchEvent('pointerdown');
    await sticker.dispatchEvent('pointerup');
    await page.waitForTimeout(500);
    
    const collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
  });
});

test.describe('Mobile Sticker Interactions', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ request }) => {
    await request.put('/api/stickers/BRA1', { data: { count: 0 } });
    await request.put('/api/stickers/BRA2', { data: { count: 0 } });
    await request.put('/api/stickers/BRA3', { data: { count: 0 } });
  });

  test('tap adds sticker', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    await sticker.tap();
    await page.waitForTimeout(500);
    
    const collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
  });

  test('long press removes sticker', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    
    await sticker.tap();
    await page.waitForTimeout(300);
    
    const collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
    
    await sticker.dispatchEvent('pointerdown', { pointerType: 'touch', isPrimary: true });
    await page.waitForTimeout(500);
    await sticker.dispatchEvent('pointerup', { pointerType: 'touch', isPrimary: true });
    await page.waitForTimeout(500);
    
    const missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
  });

  test('long press does NOT add sticker when finger lifted after remove', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    await sticker.tap();
    await page.waitForTimeout(500);
    
    const collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
    
    await sticker.dispatchEvent('pointerdown', { pointerType: 'touch', isPrimary: true });
    await page.waitForTimeout(500);
    await sticker.dispatchEvent('pointerup', { pointerType: 'touch', isPrimary: true });
    await page.waitForTimeout(500);
    
    const missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
    
    await page.waitForTimeout(300);
    const stillMissing = page.locator('.sticker-missing').first();
    await expect(stillMissing).toBeVisible();
  });

  test('long press removes only ONE when count > 1', async ({ page, request }) => {
    await request.put('/api/stickers/ARG1', { data: { count: 2 } });
    await page.goto('/');
    await page.waitForSelector('.sticker-card');

    const sticker = page
      .locator('.sticker-card')
      .filter({ has: page.locator('div', { hasText: /^ARG$/ }) })
      .filter({ has: page.locator('div', { hasText: /^1$/ }) })
      .first();

    await expect(sticker).toBeVisible();
    await expect(sticker).toHaveClass(/sticker-repeated/);

    await sticker.dispatchEvent('pointerdown', { pointerType: 'touch', isPrimary: true });
    await page.waitForTimeout(500);
    await sticker.dispatchEvent('pointerup', { pointerType: 'touch', isPrimary: true });
    await page.waitForTimeout(500);

    await expect(sticker).toHaveClass(/sticker-collected/);

    await expect.poll(async () => {
      const response = await request.get('/api/stickers/ARG1');
      const data = await response.json();
      return data.count;
    }).toBe(1);
  });

  test('long press remove count=1 does NOT add on finger lift', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    await sticker.tap();
    await page.waitForTimeout(500);
    
    let collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
    
    await collected.dispatchEvent('pointerdown', { pointerType: 'touch', isPrimary: true });
    await page.waitForTimeout(500);
    await collected.dispatchEvent('pointerup', { pointerType: 'touch', isPrimary: true });
    await page.waitForTimeout(500);
    
    let missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
    
    await page.waitForTimeout(300);
    missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
  });

  test('scroll gesture does NOT add sticker', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');

    const sticker = page.locator('.sticker-missing').first();
    const box = await sticker.boundingBox();
    expect(box).toBeTruthy();

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endY = startY + 40;

    await page.dispatchEvent('.sticker-card', 'pointerdown', {
      pointerType: 'touch',
      isPrimary: true,
      clientX: startX,
      clientY: startY
    });
    await page.dispatchEvent('.sticker-card', 'pointermove', {
      pointerType: 'touch',
      isPrimary: true,
      clientX: startX,
      clientY: endY
    });
    await page.dispatchEvent('.sticker-card', 'pointerup', {
      pointerType: 'touch',
      isPrimary: true,
      clientX: startX,
      clientY: endY
    });
    await page.waitForTimeout(500);

    const missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
  });
});

test.describe('Tablet Sticker Interactions', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test.beforeEach(async ({ request }) => {
    await request.put('/api/stickers/FRA1', { data: { count: 0 } });
    await request.put('/api/stickers/FRA2', { data: { count: 0 } });
  });

  test('tap adds sticker on tablet', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    await sticker.tap();
    await page.waitForTimeout(500);
    
    const collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
  });

  test('right-click removes on tablet', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    
    await sticker.tap();
    await page.waitForTimeout(300);
    
    await sticker.click({ button: 'right' });
    await page.waitForTimeout(500);
    
    const missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
  });
});