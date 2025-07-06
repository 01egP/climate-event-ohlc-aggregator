import React, { useEffect, useState } from 'react';
import { generateMockOHLCData } from './utils/mock';
import Plot from 'react-plotly.js';

function App() {
  const [city, setCity] = useState('Berlin');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [useMock, setUseMock] = useState(false);

  const fetchOHLC = async (selectedCity) => {
    try {
      const res = await fetch(`/ohlc/${selectedCity}`);
      if (!res.ok) throw new Error(`City "${selectedCity}" not found`);
      const json = await res.json();
      setData(json);
      setError('');
    } catch (err) {
      setData(null);
      setError(err.message);
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

  const handleChange = (e) => setCity(e.target.value);

  const ohlcEntries = data
    ? Object.entries(data).sort(([a], [b]) => new Date(a) - new Date(b))
    : [];
  const times = ohlcEntries.map(([time]) => time);
  const open = ohlcEntries.map(([, v]) => v.open);
  const high = ohlcEntries.map(([, v]) => v.high);
  const low = ohlcEntries.map(([, v]) => v.low);
  const close = ohlcEntries.map(([, v]) => v.close);

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
                data={[
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
                ]}
                layout={{
                  width: '100%',
                  height: 400,
                  showlegend: false,
                  margin: { t: 30, r: 10, b: 40, l: 50 },
                  xaxis: {
                    title: 'Time',
                    rangeslider: { visible: false },
                    type: 'date',
                  },
                  yaxis: { title: '°C', fixedrange: true },
                }}
                useResizeHandler
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Raw OHLC Data</h3>
              <table border="1" cellPadding="8" style={{ margin: '0 auto' }}>
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
