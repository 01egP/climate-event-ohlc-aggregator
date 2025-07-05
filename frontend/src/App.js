import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

function App() {
  const [city, setCity] = useState('Berlin');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fakeData = {
    '2025-07-05T12:00:00.000Z': {
      open: 20.5,
      high: 23.1,
      low: 19.8,
      close: 22.0
    },
    '2025-07-05T13:00:00.000Z': {
      open: 22.0,
      high: 24.3,
      low: 21.4,
      close: 23.8
    },
    '2025-07-05T14:00:00.000Z': {
      open: 23.8,
      high: 26.2,
      low: 23.1,
      close: 25.0
    },
    '2025-07-05T15:00:00.000Z': {
      open: 25.0,
      high: 27.5,
      low: 24.2,
      close: 26.4
    },
    '2025-07-05T16:00:00.000Z': {
      open: 26.4,
      high: 28.7,
      low: 25.5,
      close: 27.2
    }
  };

  const fetchOHLC = async (selectedCity) => {
    try {
      const res = await fetch(`/ohlc/${selectedCity}`);
      if (!res.ok) throw new Error(`City "${selectedCity}" not found`);
      const json = await res.json();
      // setData(json);
      setData(fakeData);
      setError('');
    } catch (err) {
      setData(null);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOHLC(city);
  }, [city]);

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
          <select value={city} onChange={handleChange}>
            <option value="Berlin">Berlin</option>
            <option value="NewYork">NewYork</option>
            <option value="CapeTown">CapeTown</option>
            <option value="SaoPaulo">SaoPaulo</option>
            <option value="Tokyo">Tokyo</option>
          </select>
        </label>
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
                    decreasing: { line: { color: 'red' } }
                  }
                ]}
                layout={{
                  width: '100%',
                  height: 400,
                  showlegend: false,
                  margin: { t: 30, r: 10, b: 40, l: 50 },
                  xaxis: {
                    title: 'Time',
                    rangeslider: { visible: false },
                    type: 'date'
                  },
                  yaxis: { title: '°C', fixedrange: true }
                }}
                useResizeHandler
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                Raw OHLC Data
              </h3>
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
