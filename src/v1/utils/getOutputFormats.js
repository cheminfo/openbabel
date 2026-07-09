import { spawnSync } from 'node:child_process';

import getBabel from './getBabel.js';

const BABEL = getBabel();

let formats;

export default function getOutputFormats() {
  if (!formats) {
    const result = spawnSync(BABEL, ['-L', 'formats', 'write'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8',
    });
    formats = result.stdout.split(/\r?\n/);
  }
  return formats;
}
