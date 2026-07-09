import { Button, ButtonGroup, Spinner } from '@blueprintjs/core';
import { Suspense, lazy, useState } from 'react';
import { MolfileSvgRenderer, SmilesSvgRenderer } from 'react-ocl';

import type { MolstarFormat, PreviewRenderer } from './previewFormats.ts';
import {
  extractSmiles,
  getDefaultRenderer,
  getPreviewCapability,
} from './previewFormats.ts';

const Molstar3D = lazy(() => import('./Molstar3D.tsx'));

const RENDERER_LABELS: Record<PreviewRenderer, string> = {
  svg: 'SVG',
  smiles2d: '2D',
  molfile2d: '2D',
  molstar3d: '3D',
};

export interface OutputPreviewProps {
  /** Raw conversion output. */
  output: string;
  /** Full output format label, e.g. `mol -- MDL MOL format`. */
  outputFormat: string;
}

/**
 * Visual preview of a converted structure, choosing a 2D depiction, a 3D mol*
 * viewer or a raw SVG based on the output format.
 * @returns The preview component.
 */
export default function OutputPreview(props: OutputPreviewProps) {
  const { output, outputFormat } = props;
  const capability = getPreviewCapability(outputFormat);
  const [renderer, setRenderer] = useState<PreviewRenderer | null>(null);
  const activeRenderer =
    renderer ?? (capability ? getDefaultRenderer(capability, output) : null);

  if (!capability || !activeRenderer) {
    return (
      <div className="output-preview output-preview-empty">
        No preview available for this format.
      </div>
    );
  }

  return (
    <div className="output-preview">
      {capability.renderers.length > 1 && (
        <ButtonGroup style={{ marginBottom: 8 }}>
          {capability.renderers.map((candidate) => (
            <Button
              key={candidate}
              active={candidate === activeRenderer}
              text={RENDERER_LABELS[candidate]}
              onClick={() => setRenderer(candidate)}
            />
          ))}
        </ButtonGroup>
      )}
      <div className="output-preview-body">
        {renderStructure(activeRenderer, output, capability.molstarFormat)}
      </div>
    </div>
  );
}

function renderStructure(
  renderer: PreviewRenderer,
  output: string,
  molstarFormat: MolstarFormat | undefined,
) {
  switch (renderer) {
    case 'svg':
      return (
        <div
          className="output-preview-svg"
          // eslint-disable-next-line react/no-danger -- trusted SVG produced by our own OpenBabel service
          dangerouslySetInnerHTML={{ __html: output }}
        />
      );
    case 'smiles2d':
      return (
        <SmilesSvgRenderer
          smiles={extractSmiles(output)}
          autoCrop
          width={400}
        />
      );
    case 'molfile2d':
      return <MolfileSvgRenderer molfile={output} autoCrop width={400} />;
    case 'molstar3d':
      return (
        <Suspense fallback={<Spinner />}>
          <Molstar3D data={output} format={molstarFormat ?? 'mol'} />
        </Suspense>
      );
    default:
      return null;
  }
}
