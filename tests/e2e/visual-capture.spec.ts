import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

// Evidence only: do not assert visual parity until a licensed reference baseline exists.
test('capture own site at reference viewport sizes', async ({ page }) => {
  const dir = path.resolve('test-results/visual-reference');
  await mkdir(dir,{ recursive:true });
  for (const viewport of [{width:1440,height:900},{width:1024,height:768},{width:768,height:1024},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await page.screenshot({
      path:path.join(dir,`dvizh-${viewport.width}.png`),
      fullPage:true,
      animations:'disabled'
    });
  }
});
