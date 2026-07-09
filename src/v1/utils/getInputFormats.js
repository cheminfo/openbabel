import { spawnSync } from 'node:child_process';

import getBabel from './getBabel.js';

const BABEL = getBabel();

let formats;

export default function getInputFormats() {
  if (!formats) {
    const result = spawnSync(BABEL, ['-L', 'formats', 'read'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8',
    });
    formats = result.stdout.split(/\r?\n/);
  }
  return formats;
}
