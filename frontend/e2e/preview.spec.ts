import { expect, test } from '@playwright/test';

test('previews the default molfile output as a 2D depiction', async ({
  page,
}) => {
  await page.goto('/');

  // The default input is a SMILES converted to a molfile.
  await page.getByRole('button', { name: 'Convert' }).click();
  const output = page.locator('textarea[readonly]');
  await expect(output).toHaveValue(/V2000/);

  // Switch the output panel to the preview and expect a rendered depiction.
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  const preview = page.locator('.output-preview-body');
  await expect(preview.locator('svg')).toBeVisible();

  // A molfile offers both a 2D and a 3D renderer.
  await expect(
    page.getByRole('button', { name: '2D', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: '3D', exact: true }),
  ).toBeVisible();
});

test('previews an SVG output inline', async ({ page }) => {
  await page.goto('/');

  // Select the SVG output format.
  await page
    .getByRole('button', { name: 'mol -- MDL MOL format', exact: true })
    .click();
  await page.locator('.bp6-popover input').fill('svg -- SVG');
  await page.getByRole('option').first().click();

  await page.getByRole('button', { name: 'Convert' }).click();
  const output = page.locator('textarea[readonly]');
  await expect(output).toHaveValue(/<svg/);

  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.locator('.output-preview-svg svg').first()).toBeVisible();
});

test('previews the mdl alias of the MDL MOL format', async ({ page }) => {
  await page.goto('/');

  // `mdl` is a different alias of the same MDL MOL format as `mol`.
  await page
    .getByRole('button', { name: 'mol -- MDL MOL format', exact: true })
    .click();
  await page.locator('.bp6-popover input').fill('mdl -- MDL MOL');
  await page.getByRole('option').first().click();

  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.locator('textarea[readonly]')).toHaveValue(/V2000/);

  const preview = page.getByRole('button', { name: 'Preview', exact: true });
  await expect(preview).toBeEnabled();
  await preview.click();
  await expect(page.locator('.output-preview-body svg')).toBeVisible();
});

test('defaults to the 3D viewer when the molfile has 3D coordinates', async ({
  page,
}) => {
  await page.goto('/');

  // Generate 3D coordinates so the molfile has non-zero z values.
  await page.getByRole('radio', { name: '3D', exact: true }).click();
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(page.locator('textarea[readonly]')).toHaveValue(/V2000/);

  await page.getByRole('button', { name: 'Preview', exact: true }).click();

  // The renderer button group inside the output panel defaults to 3D.
  const rendererGroup = page.locator('.output-preview');
  await expect(
    rendererGroup.getByRole('button', { name: '3D', exact: true }),
  ).toHaveClass(/bp6-active/);
  await expect(
    rendererGroup.getByRole('button', { name: '2D', exact: true }),
  ).not.toHaveClass(/bp6-active/);
});
