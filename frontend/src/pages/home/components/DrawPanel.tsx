import { Molecule } from 'openchemlib';
import { useState } from 'react';
import { CanvasMoleculeEditor } from 'react-ocl';

import { data, setInputFromMolfile } from '../../../state/data.ts';
import { preferences } from '../../../state/preferences.ts';

/**
 * Structure editor to draw a molecule instead of typing it. When opened, it
 * is initialized from the current input if it is a valid SMILES or molfile.
 * @returns The draw panel component.
 */
export default function DrawPanel() {
  const [initial] = useState(readInitialStructure);
  // The canvas editor sizes itself in pixels to fill its container. Absolute
  // positioning keeps that pixel size out of the card's height computation,
  // otherwise the card and the canvas grow each other indefinitely.
  return (
    <div className="draw-editor-wrapper">
      <div className="draw-editor-canvas">
        <CanvasMoleculeEditor
          width="100%"
          height="100%"
          inputValue={initial.value}
          inputFormat={initial.format}
          onChange={(event) => setInputFromMolfile(event.getMolfile())}
        />
      </div>
    </div>
  );
}

interface InitialStructure {
  value: string;
  format: 'molfile' | 'smiles';
}

function readInitialStructure(): InitialStructure {
  const value = data.input.peek();
  const format = preferences.inputFormat.peek();
  try {
    if (format.startsWith('smi')) {
      Molecule.fromSmiles(value);
      return { value, format: 'smiles' };
    }
    if (format.startsWith('mol -- ')) {
      Molecule.fromMolfile(value);
      return { value, format: 'molfile' };
    }
  } catch {
    // not parseable: start with an empty editor
  }
  return { value: '', format: 'smiles' };
}
