import { signal } from '@preact/signals-react';

import { persistBucket } from './persist.ts';

export type Coordinates = '' | '2D' | '3D';
export type Hydrogens = '' | 'Add' | 'Delete';

export const MOLFILE_FORMAT = 'mol -- MDL MOL format';

export const preferences = persistBucket('openbabel:preferences:v1', {
  inputFormat: signal('smi -- SMILES format'),
  outputFormat: signal(MOLFILE_FORMAT),
  coordinates: signal<Coordinates>(''),
  hydrogens: signal<Hydrogens>(''),
  ph: signal(''),
});
