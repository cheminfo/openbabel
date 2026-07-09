export interface Format {
  /** Short format identifier, e.g. `smi`. */
  name: string;
  /** Human-readable description, e.g. `SMILES format`. */
  description: string;
  /** Full label used by the convert endpoint, e.g. `smi -- SMILES format`. */
  text: string;
}

export interface Formats {
  input: Format[];
  output: Format[];
}

export interface ConvertOptions {
  input: string;
  inputFormat: string;
  outputFormat: string;
  /**
   * Generate coordinates before converting.
   * @default ''
   */
  coordinates?: '' | '2D' | '3D';
  /**
   * Add or delete hydrogens before converting.
   * @default ''
   */
  hydrogens?: '' | 'Add' | 'Delete';
  /**
   * pH at which the molecule should be protonated.
   * @default ''
   */
  ph?: string;
}

export interface ConvertResult {
  result: string;
  log: string;
}

/**
 * Fetch the list of supported input and output formats.
 * @returns The input and output formats.
 */
export async function fetchFormats(): Promise<Formats> {
  const response = await fetch('/v1/formats');
  if (!response.ok) {
    throw new Error(`Failed to fetch formats: ${response.status}`);
  }
  const data = (await response.json()) as { result: Formats };
  return data.result;
}

/**
 * Convert a chemical structure between file formats.
 * @param options - Input data, formats and conversion flags.
 * @returns The converted structure and the OpenBabel log.
 */
export async function convert(options: ConvertOptions): Promise<ConvertResult> {
  const formData = new FormData();
  formData.append('input', options.input);
  formData.append('inputFormat', options.inputFormat);
  formData.append('outputFormat', options.outputFormat);
  if (options.coordinates) formData.append('coordinates', options.coordinates);
  if (options.hydrogens) formData.append('hydrogens', options.hydrogens);
  if (options.ph) formData.append('ph', options.ph);

  const response = await fetch('/v1/convert', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Conversion failed: ${response.status}`);
  }
  return (await response.json()) as ConvertResult;
}

/**
 * Extract the file extension from a format label.
 * @param format - Full format label, e.g. `mol -- MDL MOL format`.
 * @returns The extension, e.g. `mol`.
 */
export function formatExtension(format: string): string {
  return format.replace(/ --.*/, '');
}
