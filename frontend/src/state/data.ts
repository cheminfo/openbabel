import { signal } from '@preact/signals-react';

import type { Formats } from '../api/openbabel.ts';
import { convert, fetchFormats } from '../api/openbabel.ts';

import { MOLFILE_FORMAT, preferences } from './preferences.ts';
import { view } from './view.ts';

export const data = {
  formats: signal<Formats | null>(null),
  input: signal('CCCCOc1ccccc1'),
  inputFileName: signal<string | null>(null),
  output: signal(''),
  log: signal(''),
};

/**
 * Load the list of supported formats from the API.
 */
export async function loadFormats(): Promise<void> {
  try {
    data.formats.value = await fetchFormats();
  } catch (error) {
    data.log.value = String(error);
  }
}

/**
 * Update the input text.
 * @param value - New input text.
 */
export function setInput(value: string): void {
  data.input.value = value;
  data.inputFileName.value = null;
}

/**
 * Use a drawn structure as input and switch the input format to molfile.
 * @param molfile - Molfile of the drawn structure.
 */
export function setInputFromMolfile(molfile: string): void {
  data.input.value = molfile;
  data.inputFileName.value = null;
  preferences.inputFormat.value = MOLFILE_FORMAT;
}

/**
 * Use a dropped file as input and select the input format matching its
 * extension (e.g. `.cdxml` from ChemDraw selects the cdxml format).
 * @param file - Dropped or selected file.
 */
export async function loadInputFile(file: File): Promise<void> {
  data.input.value = await file.text();
  data.inputFileName.value = file.name;
  const extension = file.name.split('.').pop()?.toLowerCase();
  const format = data.formats.value?.input.find(
    (candidate) => candidate.name === extension,
  );
  if (format) {
    preferences.inputFormat.value = format.text;
  }
}

/**
 * Convert the current input using the current options.
 */
export async function runConversion(): Promise<void> {
  view.isConverting.value = true;
  try {
    const result = await convert({
      input: data.input.value,
      inputFormat: preferences.inputFormat.value,
      outputFormat: preferences.outputFormat.value,
      coordinates: preferences.coordinates.value,
      hydrogens: preferences.hydrogens.value,
      ph: preferences.ph.value,
    });
    data.output.value = result.result;
    data.log.value = result.log;
  } catch (error) {
    data.output.value = '';
    data.log.value = String(error);
  } finally {
    view.isConverting.value = false;
  }
}
