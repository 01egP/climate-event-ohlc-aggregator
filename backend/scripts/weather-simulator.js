const WebSocket = require('ws');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const PORT = 8765;
/**
 * Event emission interval in milliseconds:
 * - 100 ms (~10 events/sec) for mock mode (fast for demo/testing)
 * - 1000 ms (1 event/sec) for real mode (to avoid API rate limits)
 */
const INTERVAL_MS = process.env.DATA_MODE === 'mock' ? 100 : 1000;
const MODE = process.env.DATA_MODE || 'mock';
const API_KEY = process.env.WEATHER_API_KEY;

const cities = {
  Berlin: 'Berlin',
  NewYork: 'New York',
  Tokyo: 'Tokyo',
  SaoPaulo: 'Sao Paulo',
  CapeTown: 'Cape Town'
};

const cityKeys = Object.keys(cities);
let cityIndex = 0;

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`🌍 WebSocket server running at ws://localhost:${PORT}`);
  console.log(`Running in ${MODE.toUpperCase()} mode`);
});

wss.on('connection', (ws) => {
  console.log('✅ Client connected');

  const interval = setInterval(async () => {
    const cityKey = cityKeys[cityIndex];
    const cityName = cities[cityKey];
    const now = new Date();

    let weather;

    if (MODE === 'real') {
      if (!API_KEY) {
        console.error('WEATHER_API_KEY is missing for real mode');
        process.exit(1);
      }

      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}`
        );
        const data = await response.json();

        if (!data?.current?.temp_c || !data?.location?.localtime) {
          throw new Error('Invalid WeatherAPI response');
        }

        weather = {
          time: new Date(data.location.localtime).toISOString(),
          temperature: data.current.temp_c,
          windspeed: data.current.wind_kph / 3.6,
          winddirection: data.current.wind_degree
        };
      } catch (err) {
        console.warn(`⚠️ [${cityKey}] Real API failed:`, err.message);
        weather = generateMockWeather(now);
      }
    } else {
      // Fast mock data
      weather = generateMockWeather(now);
    }

    const event = {
      city: cityKey,
      timestamp: weather.time,
      temperature: weather.temperature,
      windspeed: weather.windspeed,
      winddirection: weather.winddirection
    };
    ws.send(JSON.stringify(event));

    cityIndex = (cityIndex + 1) % cityKeys.length;
  }, INTERVAL_MS);

  ws.on('close', () => {
    console.log('🔌 Client disconnected');
    clearInterval(interval);
  });
});

function generateMockWeather(time) {
  return {
    time: time.toISOString(),
    temperature:
      18 + Math.sin((time.getSeconds() / 60) * 2 * Math.PI) * 5 + Math.random(),
    windspeed: 2 + Math.random() * 3,
    winddirection: Math.floor(Math.random() * 360)
  };
}
