import { existsSync } from 'node:fs';

const paths = ['/opt/homebrew/bin/obabel', '/usr/bin/obabel'];

export default function getBabel() {
  if (process.env.BABEL) return process.env.BABEL;

  for (const path of paths) {
    if (existsSync(path)) return path;
  }
  throw new Error('BABEL not found');
}
