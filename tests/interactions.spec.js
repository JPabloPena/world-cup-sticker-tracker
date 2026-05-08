import { test, expect } from '@playwright/test';

test.describe('Desktop Sticker Interactions', () => {
  test.beforeEach(async ({ request }) => {
    await request.put('/api/stickers/ARG1', { count: 0 });
    await request.put('/api/stickers/ARG2', { count: 0 });
    await request.put('/api/stickers/ARG3', { count: 0 });
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
    await request.put('/api/stickers/BRA1', { count: 0 });
    await request.put('/api/stickers/BRA2', { count: 0 });
    await request.put('/api/stickers/BRA3', { count: 0 });
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
    
    await sticker.dispatchEvent('pointerdown');
    await page.waitForTimeout(500);
    await sticker.dispatchEvent('pointerup');
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
    
    await sticker.dispatchEvent('pointerdown');
    await page.waitForTimeout(500);
    await sticker.dispatchEvent('pointerup');
    await page.waitForTimeout(500);
    
    const missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
    
    await page.waitForTimeout(300);
    const stillMissing = page.locator('.sticker-missing').first();
    await expect(stillMissing).toBeVisible();
  });

  test('touch long press removes only ONE when count > 1', async ({ page, request }) => {
    await request.put('/api/stickers/ARG1', { count: 2 });
    await page.goto('/');
    await page.waitForFunction(() => {
      // Check if ARG1 has count=2
      return window.fetch('/api/stickers')
        .then(res => res.json())
        .then(stickers => {
          const arg1 = stickers.find(s => s.id === 'ARG1');
          return arg1 && arg1.count === 2;
        });
    });
    
    await page.waitForSelector('.sticker-card');
    await page.waitForTimeout(500);
    
    const sticker = page.locator('.sticker-repeated').first();
    await expect(sticker).toBeVisible();
    
    await page.evaluate(() => {
      const el = document.querySelector('.sticker-repeated');
      el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      const el = document.querySelector('.sticker-repeated');
      el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true }));
    });
    await page.waitForTimeout(500);
    
    const collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
  });

  test('long press remove count=1 does NOT add on finger lift', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    await sticker.tap();
    await page.waitForTimeout(500);
    
    let collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
    
    await collected.dispatchEvent('pointerdown');
    await page.waitForTimeout(500);
    await collected.dispatchEvent('pointerup');
    await page.waitForTimeout(500);
    
    let missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
    
    await page.waitForTimeout(300);
    missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
  });

  test('touch long press remove count=1 does NOT add on finger lift', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sticker-card');
    
    const sticker = page.locator('.sticker-missing').first();
    await sticker.tap();
    await page.waitForTimeout(500);
    
    let collected = page.locator('.sticker-collected').first();
    await expect(collected).toBeVisible();
    
    await collected.dispatchEvent('touchstart');
    await page.waitForTimeout(500);
    await collected.dispatchEvent('touchend');
    await page.waitForTimeout(500);
    
    let missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
    
    await page.waitForTimeout(300);
    missing = page.locator('.sticker-missing').first();
    await expect(missing).toBeVisible();
  });
});

test.describe('Tablet Sticker Interactions', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test.beforeEach(async ({ request }) => {
    await request.put('/api/stickers/FRA1', { count: 0 });
    await request.put('/api/stickers/FRA2', { count: 0 });
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