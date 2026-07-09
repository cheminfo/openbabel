import { expect, test } from '@playwright/test';

// mol* needs WebGL, which the headless test browser only provides through
// SwiftShader when these flags are set.
test.use({
  launchOptions: {
    args: [
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
      '--use-angle=swiftshader',
    ],
  },
});

test('renders a molfile in the mol* 3D viewer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.locator('textarea[readonly]')).toHaveValue(/V2000/);

  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await page.getByRole('button', { name: '3D', exact: true }).click();

  const canvas = page.locator('.molstar-canvas');
  await expect(canvas).toBeVisible();
  await expect(page.locator('.molstar-error')).toHaveCount(0);
  await expect
    .poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.width))
    .toBeGreaterThan(0);
});
