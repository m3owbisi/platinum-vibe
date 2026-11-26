import { test, expect } from "@playwright/test";

const LANDSCAPE = [[1920, 1080], [1280, 800], [1024, 768], [932, 430], [844, 390]] as const;

for (const [w, h] of LANDSCAPE) {
  test(`landscape ${w}x${h}: no scroll, no horizontal overflow, rotate overlay hidden`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    await page.waitForTimeout(2500); // splash done
    const m = await page.evaluate(() => ({ sh: document.documentElement.scrollHeight, ih: innerHeight, sw: document.documentElement.scrollWidth, iw: innerWidth }));
    expect(m.sh).toBeLessThanOrEqual(m.ih);
    expect(m.sw).toBeLessThanOrEqual(m.iw);
    await expect(page.getByText(/rotate your device/i)).toBeHidden();
  });
}

test("portrait 375x812 shows the rotate overlay", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByText(/rotate your device to landscape/i)).toBeVisible();
});

test("orientation change re-lays out cleanly (cards stay inside the viewport)", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  await page.waitForTimeout(2500);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.setViewportSize({ width: 844, height: 390 });
  for (const c of await page.getByRole("link", { name: /walkthrough|view from/i }).all()) {
    const b = (await c.boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(0); expect(b.x + b.width).toBeLessThanOrEqual(845);
    expect(b.y).toBeGreaterThanOrEqual(0); expect(b.y + b.height).toBeLessThanOrEqual(391);
  }
});

test("clicking a card does not reload the document", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => ((window as unknown as { __mark: number }).__mark = 1));
  await page.waitForTimeout(2500);
  await page.getByRole("link", { name: /show flat/i }).click();
  expect(await page.evaluate(() => (window as unknown as { __mark?: number }).__mark)).toBe(1);
});

test("menu geometry is stable (compared across chromium and webkit via snapshot)", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  await page.waitForTimeout(2500);
  const boxes = await page.getByRole("navigation", { name: /tour sections/i }).getByRole("link").evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }));
  expect(boxes[0]).toEqual([62, 210, 431, 551]); // Show Flat, Figma px
});
