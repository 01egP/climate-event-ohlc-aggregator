const WebSocket = require('ws');
const fetch = require('node-fetch');
const PORT = 8765;
const INTERVAL_MS = 100; // ~10 events/second

const cities = {
  Berlin: [52.52, 13.41],
  NewYork: [40.71, -74.01],
  Tokyo: [35.68, 139.69],
  SaoPaulo: [-23.55, -46.63],
  CapeTown: [-33.92, 18.42]
};

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`🌤 Weather WebSocket server running at ws://localhost:${PORT}`);
});

wss.on('connection', (ws) => {
  console.log('✅ Client connected');

  const interval = setInterval(async () => {
    const cityNames = Object.keys(cities);
    const city = cityNames[Math.floor(Math.random() * cityNames.length)];
    const [lat, lon] = cities[city];

    let weather;

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await response.json();
      weather = data.current_weather;

      // Fallback to mock data if API response is empty or invalid
      if (!weather || !weather.time) {
        throw new Error('Empty or invalid weather data');
      }
    } catch (err) {
      console.warn(
        '⚠️ Using mock weather data due to error or limit:',
        err.message
      );
      weather = {
        time: new Date().toISOString(),
        temperature: 20 + Math.random() * 10,
        windspeed: 5 + Math.random() * 3,
        winddirection: 90 + Math.random() * 45
      };
    }

    const event = {
      city,
      timestamp: weather.time,
      temperature: weather.temperature,
      windspeed: weather.windspeed,
      winddirection: weather.winddirection
    };

    console.log('📤 Sending event:', event);
    ws.send(JSON.stringify(event));
  }, INTERVAL_MS);

  ws.on('close', () => {
    console.log('🔌 Client disconnected');
    clearInterval(interval);
  });
});
