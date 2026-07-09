import { Callout } from '@blueprintjs/core';

/**
 * Short usage instructions for the converter.
 * @returns The help panel component.
 */
export default function HelpPanel() {
  return (
    <Callout title="How to use" icon="info-sign">
      <ol style={{ margin: '4px 0', paddingLeft: 20 }}>
        <li>
          Enter data in <strong>Text input</strong>, draw a molecule in the{' '}
          <strong>Draw</strong> tab, or drop a file (e.g. .cdxml from ChemDraw)
          on the input card
        </li>
        <li>
          Select the <strong>input format</strong> (set automatically when
          drawing or dropping a file)
        </li>
        <li>
          Select the desired <strong>output format</strong>
        </li>
        <li>
          Click <strong>Convert</strong>
        </li>
      </ol>
      <p style={{ margin: '4px 0 0' }}>
        <em>
          Tip: you can also add or remove hydrogens and generate 2D or 3D
          coordinates before converting.
        </em>
      </p>
    </Callout>
  );
}
