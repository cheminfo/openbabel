import HomePage from './pages/home/HomePage.tsx';

/**
 * Application shell with the page header and the converter page.
 * @returns The application component.
 */
export default function App() {
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 24px' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <h1 style={{ fontSize: 20, margin: 0 }}>
          OpenBabel — Chemical file format converter
        </h1>
        <nav style={{ display: 'flex', gap: 16 }}>
          <a href="/documentation">API documentation</a>
          <a href="https://openbabel.org/" target="_blank" rel="noreferrer">
            Open Babel
          </a>
        </nav>
      </header>
      <HomePage />
    </div>
  );
}
