import React, { useEffect, useState } from 'react';

function App() {
  const [city, setCity] = useState('Berlin');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchOHLC = async (selectedCity) => {
    try {
      const res = await fetch(`/ohlc/${selectedCity}`);
      if (!res.ok) {
        throw new Error(`City "${selectedCity}" not found`);
      }
      const json = await res.json();
      setData(json);
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

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🌡 OHLC Weather Aggregator</h1>

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

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {data && (
        <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
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
            {Object.entries(data)
              .sort(([a], [b]) => new Date(a) - new Date(b))
              .map(([hour, candle]) => (
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
      )}
    </div>
  );
}

export default App;
