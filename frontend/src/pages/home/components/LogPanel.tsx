import { Card, H5 } from '@blueprintjs/core';
import { useSignals } from '@preact/signals-react/runtime';

import { data } from '../../../state/data.ts';

/**
 * OpenBabel log output of the last conversion.
 * @returns The log panel component.
 */
export default function LogPanel() {
  useSignals();
  return (
    <Card>
      <H5>Log</H5>
      <pre
        style={{
          margin: 0,
          minHeight: 60,
          maxHeight: 200,
          overflow: 'auto',
          fontSize: 12,
          whiteSpace: 'pre-wrap',
        }}
      >
        {data.log.value}
      </pre>
    </Card>
  );
}
