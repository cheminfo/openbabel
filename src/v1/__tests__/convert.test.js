import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterAll, beforeAll, expect, test } from 'vitest';

import buildApp from '../../app.js';

const aspirin = readFileSync(
  join(import.meta.dirname, 'data/aspirin.cdxml'),
).toString();

let app;
let baseUrl;

beforeAll(async () => {
  app = await buildApp();
  baseUrl = await app.listen({ port: 0, host: '127.0.0.1' });
});

afterAll(async () => {
  await app.close();
});

async function convert(outputFormat) {
  const formData = new FormData();
  formData.append('input', aspirin);
  formData.append('inputFormat', 'cdxml -- ChemDraw CDXML format');
  formData.append('outputFormat', outputFormat);
  const response = await fetch(`${baseUrl}/v1/convert`, {
    method: 'POST',
    body: formData,
  });
  expect(response.status).toBe(200);
  return response.json();
}

test('converts aspirin.cdxml to canonical SMILES', async () => {
  const body = await convert('can -- Canonical SMILES format');
  expect(body.result).toBe('CC(=O)Oc1ccccc1C(=O)O\t11\n');
  expect(body.log).toContain('1 molecule converted');
});

test('converts aspirin.cdxml to molfile', async () => {
  const body = await convert('mol -- MDL MOL format');
  expect(body.result).toContain(' 13 13  0  0  0  0  0  0  0  0999 V2000');
  expect(body.result).toContain('M  END');
  expect(body.log).toContain('1 molecule converted');
});
