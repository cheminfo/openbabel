import { spawn } from 'node:child_process';

import getBabel from './getBabel.js';

const BABEL = getBabel();

let running = 0;
const waiting = [];

/**
 * Run an obabel conversion, limiting how many child processes run in parallel.
 * At most `MAX_PARALLEL_CONVERSIONS` (default 4) conversions run at the same
 * time; further calls wait in a queue of at most `MAX_QUEUED_CONVERSIONS`
 * (default 32) entries, after which the promise rejects with a 503 error.
 * A conversion running longer than `CONVERSION_TIMEOUT_MS` (default 2000)
 * is killed with SIGKILL and its log explains the timeout.
 * @param {string[]} flags - Command line flags passed to obabel.
 * @param {string} [input] - Data piped to stdin.
 * @returns {Promise<{ stdout: string, stderr: string }>} Captured output.
 */
export default async function runBabel(flags, input) {
  await acquire();
  try {
    return await execute(flags, input);
  } finally {
    release();
  }
}

function getLimit(name, defaultValue, minimum = 1) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value >= minimum ? value : defaultValue;
}

function acquire() {
  if (running < getLimit('MAX_PARALLEL_CONVERSIONS', 4)) {
    running++;
    return Promise.resolve();
  }
  if (waiting.length >= getLimit('MAX_QUEUED_CONVERSIONS', 32, 0)) {
    const error = new Error(
      'Too many conversions in progress, please retry later',
    );
    error.statusCode = 503;
    return Promise.reject(error);
  }
  return new Promise((resolve) => {
    waiting.push(resolve);
  });
}

function release() {
  const next = waiting.shift();
  if (next) {
    next();
  } else {
    running--;
  }
}

function execute(flags, input) {
  const timeout = getLimit('CONVERSION_TIMEOUT_MS', 2000);
  return new Promise((resolve) => {
    const child = spawn(BABEL, flags, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout,
      killSignal: 'SIGKILL',
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', (error) => {
      resolve({ stdout, stderr: `${stderr}${error}` });
    });
    child.on('close', (code, signal) => {
      if (signal) {
        stderr += `Conversion killed after exceeding the ${timeout} ms timeout (${signal})`;
      }
      resolve({ stdout, stderr });
    });
    // the child can exit before stdin is fully written (e.g. on invalid flags)
    child.stdin.on('error', (error) => {
      stderr += `stdin: ${error.message}\n`;
    });
    child.stdin.end(input ?? '');
  });
}
