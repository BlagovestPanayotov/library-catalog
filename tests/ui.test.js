const { test, expect } = require('@playwright/test');

const url = 'http://localhost:3000';


test('Verify "All books" link is visible', async ({ page }) => {
  await page.goto(url);
  await page.waitForSelector('nav.navbar');

  const allBookLink = await page.$('a[href="/catalog"]');
  const isLinkVisible = await allBookLink.isVisible();

  expect(isLinkVisible).toBe(true);

});