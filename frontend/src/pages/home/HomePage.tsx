import { useEffect } from 'react';

import { loadFormats } from '../../state/data.ts';

import HelpPanel from './components/HelpPanel.tsx';
import InputPanel from './components/InputPanel.tsx';
import LogPanel from './components/LogPanel.tsx';
import OptionsPanel from './components/OptionsPanel.tsx';
import OutputPanel from './components/OutputPanel.tsx';

/**
 * Chemical file format converter page.
 * @returns The converter page component.
 */
export default function HomePage() {
  useEffect(() => {
    void loadFormats();
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16,
      }}
    >
      <InputPanel />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OptionsPanel />
        <HelpPanel />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <OutputPanel />
        <LogPanel />
      </div>
    </div>
  );
}
