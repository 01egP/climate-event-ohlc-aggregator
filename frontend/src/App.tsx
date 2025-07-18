import React, { useEffect, useState, ChangeEvent } from 'react';
import Plot from 'react-plotly.js';
import { Layout, Data } from 'plotly.js';
import { generateMockOHLCData } from './utils/mock';

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

type OHLCData = Record<string, Candle>;

function App() {
  const [city, setCity] = useState('Berlin');
  const [data, setData] = useState<OHLCData | null>(null);
  const [error, setError] = useState('');
  const [useMock, setUseMock] = useState(false);

  const fetchOHLC = async (selectedCity: string) => {
    try {
      /**
       * This is where the client would send the Authorization header with the access token
       * Example:
       * const res = await fetch(`/ohlc/${selectedCity}`, {
       *   headers: {
       *     Authorization: `Bearer ${token}` // ← if auth is required in the future
       *   }
       * });
       */
      const res = await fetch(`/ohlc/${selectedCity}`);
      if (!res.ok) throw new Error(`City "${selectedCity}" not found`);
      const json: OHLCData = await res.json();
      setData(json);
      setError('');
    } catch (err) {
      setData(null);
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    if (useMock) {
      setData(generateMockOHLCData());
      setError('');
    } else {
      fetchOHLC(city);
    }
  }, [city, useMock]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
  };

  const ohlcEntries = data
    ? Object.entries(data).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    : [];

  const times = ohlcEntries.map(([time]) => time);
  const open = ohlcEntries.map(([, v]) => v.open);
  const high = ohlcEntries.map(([, v]) => v.high);
  const low = ohlcEntries.map(([, v]) => v.low);
  const close = ohlcEntries.map(([, v]) => v.close);

  const plotData: Data[] = [
    {
      x: times,
      open,
      high,
      low,
      close,
      type: 'candlestick',
      increasing: { line: { color: 'green' } },
      decreasing: { line: { color: 'red' } },
    },
  ];

  const layout: Partial<Layout> = {
    width: 800,
    height: 400,
    showlegend: false,
    margin: { t: 30, r: 10, b: 40, l: 50 },
    xaxis: {
      title: { text: 'Time' },
      rangeslider: { visible: false },
      type: 'date',
    },
    yaxis: { 
      title: { text: '°C' }, 
      fixedrange: true 
    },
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>🌡 OHLC Weather Aggregator</h1>

      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <label>
          Select city:{' '}
          <select value={city} onChange={handleChange} disabled={useMock}>
            <option value="Berlin">Berlin</option>
            <option value="NewYork">NewYork</option>
            <option value="CapeTown">CapeTown</option>
            <option value="SaoPaulo">SaoPaulo</option>
            <option value="Tokyo">Tokyo</option>
          </select>
        </label>
        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={() => setUseMock(false)} disabled={!useMock}>
            🔄 Back to Live
          </button>{' '}
          <button onClick={() => setUseMock(true)} disabled={useMock}>
            🧪 Use Mock OHLC
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>❌ {error}</p>}

      {data && (
        <>
          <h3 style={{ textAlign: 'center' }}>{city} OHLC Temperature</h3>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
              <Plot
                data={plotData}
                layout={layout}
                useResizeHandler
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Raw OHLC Data</h3>
              <table border={1} cellPadding={8} style={{ margin: '0 auto' }}>
                <thead>
                  <tr>
                    <th>Hour</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                  </tr>
                </thead>
                <tbody>
                  {ohlcEntries.map(([hour, candle]) => (
                    <tr key={hour}>
                      <td>{hour}</td>
                      <td>{candle.open.toFixed(2)}</td>
                      <td>{candle.high.toFixed(2)}</td>
                      <td>{candle.low.toFixed(2)}</td>
                      <td>{candle.close.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
