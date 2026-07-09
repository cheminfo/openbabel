import { signal } from '@preact/signals-react';

export type InputMode = 'text' | 'draw' | 'file';

export const view = {
  inputMode: signal<InputMode>(readInputModeFromHash()),
  isConverting: signal(false),
};

/**
 * Switch between typing and drawing the input, keeping the mode in the URL
 * hash so it survives a reload and supports back/forward navigation.
 * @param mode - Input mode to activate.
 */
export function setInputMode(mode: InputMode): void {
  globalThis.location.hash = mode;
  view.inputMode.value = mode;
}

function readInputModeFromHash(): InputMode {
  const hash = globalThis.location.hash;
  if (hash === '#draw') return 'draw';
  if (hash === '#file') return 'file';
  return 'text';
}

globalThis.addEventListener('hashchange', () => {
  view.inputMode.value = readInputModeFromHash();
});
