import { formatExtension } from '../../../../api/openbabel.ts';

export type PreviewRenderer = 'svg' | 'smiles2d' | 'molfile2d' | 'molstar3d';

/** A trajectory format understood by mol* (`parseTrajectory`). */
export type MolstarFormat =
  'mmcif' | 'pdb' | 'pdbqt' | 'pqr' | 'gro' | 'xyz' | 'mol' | 'sdf' | 'mol2';

interface PreviewCapability {
  /** Renderers that can display this output format, best first. */
  renderers: PreviewRenderer[];
  /** mol* trajectory format when a 3D renderer is available. */
  molstarFormat?: MolstarFormat;
}

const CAPABILITIES: Record<string, PreviewCapability> = {
  svg: { renderers: ['svg'] },
  smi: { renderers: ['smiles2d'] },
  can: { renderers: ['smiles2d'] },
  smiles: { renderers: ['smiles2d'] },
  mol: { renderers: ['molfile2d', 'molstar3d'], molstarFormat: 'mol' },
  mdl: { renderers: ['molfile2d', 'molstar3d'], molstarFormat: 'mol' },
  sdf: { renderers: ['molfile2d', 'molstar3d'], molstarFormat: 'sdf' },
  sd: { renderers: ['molfile2d', 'molstar3d'], molstarFormat: 'sdf' },
  mol2: { renderers: ['molstar3d'], molstarFormat: 'mol2' },
  ml2: { renderers: ['molstar3d'], molstarFormat: 'mol2' },
  sy2: { renderers: ['molstar3d'], molstarFormat: 'mol2' },
  pdb: { renderers: ['molstar3d'], molstarFormat: 'pdb' },
  ent: { renderers: ['molstar3d'], molstarFormat: 'pdb' },
  pdbqt: { renderers: ['molstar3d'], molstarFormat: 'pdbqt' },
  pqr: { renderers: ['molstar3d'], molstarFormat: 'pqr' },
  gro: { renderers: ['molstar3d'], molstarFormat: 'gro' },
  xyz: { renderers: ['molstar3d'], molstarFormat: 'xyz' },
  cif: { renderers: ['molstar3d'], molstarFormat: 'mmcif' },
  mmcif: { renderers: ['molstar3d'], molstarFormat: 'mmcif' },
};

const MOLFILE_CAPABILITY: PreviewCapability = {
  renderers: ['molfile2d', 'molstar3d'],
  molstarFormat: 'mol',
};

/**
 * Resolve how a converted output can be previewed from its format label.
 *
 * OpenBabel exposes each format under several aliases sharing one description
 * (e.g. `mol`, `mdl`, `sd`, `sdf` are all `MDL MOL format`), so the alias is
 * matched first and the description is used as a fallback.
 * @param outputFormat - Full format label, e.g. `mol -- MDL MOL format`.
 * @returns The preview capability, or `null` when the format is not previewable.
 */
export function getPreviewCapability(
  outputFormat: string,
): PreviewCapability | null {
  const extension = formatExtension(outputFormat).toLowerCase();
  const direct = CAPABILITIES[extension];
  if (direct) return direct;

  const description = outputFormat.toLowerCase();
  if (description.includes('mdl mol')) return MOLFILE_CAPABILITY;
  if (description.includes('sybyl mol2')) {
    return { renderers: ['molstar3d'], molstarFormat: 'mol2' };
  }
  if (description.includes('svg')) return CAPABILITIES.svg ?? null;
  if (
    description.includes('smiles') &&
    !description.includes('reaction') &&
    !description.includes('fix')
  ) {
    return { renderers: ['smiles2d'] };
  }
  return null;
}

/**
 * Choose which renderer to show first for a given output. A molfile that
 * carries real 3D coordinates defaults to the mol* 3D viewer; everything else
 * uses the capability's first (best) renderer.
 * @param capability - Preview capability of the output format.
 * @param output - Raw conversion output.
 * @returns The renderer to activate by default.
 */
export function getDefaultRenderer(
  capability: PreviewCapability,
  output: string,
): PreviewRenderer {
  const { renderers } = capability;
  if (
    renderers.includes('molfile2d') &&
    renderers.includes('molstar3d') &&
    molfileHasZCoordinate(output)
  ) {
    return 'molstar3d';
  }
  return renderers[0] ?? 'molstar3d';
}

/**
 * Extract the bare SMILES token from an OpenBabel SMILES output, dropping any
 * trailing title and surrounding whitespace.
 * @param output - Raw `smi`/`can` conversion output.
 * @returns The SMILES string.
 */
export function extractSmiles(output: string): string {
  const firstLine = output.trim().split('\n', 1)[0] ?? '';
  return firstLine.split(/\s/, 1)[0] ?? '';
}

/**
 * Detect whether a V2000 molfile has a non-zero Z coordinate on any atom.
 * @param molfile - MDL MOL / SDF text.
 * @returns `true` when at least one atom is out of the z = 0 plane.
 */
function molfileHasZCoordinate(molfile: string): boolean {
  const lines = molfile.split(/\r?\n/);
  // V2000 layout: title, program, comment, counts, then one line per atom.
  const countsLine = lines[3];
  if (!countsLine) return false;
  const atomCount = Number.parseInt(countsLine.slice(0, 3), 10);
  if (!Number.isFinite(atomCount) || atomCount <= 0) return false;
  for (let index = 0; index < atomCount; index++) {
    const line = lines[4 + index];
    if (!line) break;
    // The z coordinate occupies columns 21-30 of a V2000 atom line.
    const z = Number.parseFloat(line.slice(20, 30));
    if (Number.isFinite(z) && Math.abs(z) > 1e-4) return true;
  }
  return false;
}
