import { spawnSync } from 'node:child_process';

import getBabel from './getBabel.js';

const BABEL = getBabel();

export default function getInputFormats() {
  const result = spawnSync(BABEL, ['-L', 'formats', 'read'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    encoding: 'utf-8',
  });
  return result.stdout.split(/\r?\n/);
}
