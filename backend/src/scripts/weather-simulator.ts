import { WebSocketServer, WebSocket } from 'ws';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { WeatherEvent } from '../types/types';

dotenv.config();

const PORT = 8765;

const INTERVAL_MS = process.env.DATA_MODE === 'mock' ? 100 : 1000;
const MODE = process.env.DATA_MODE || 'mock';
const API_KEY = process.env.WEATHER_API_KEY;

const cities: Record<string, string> = {
  Berlin: 'Berlin',
  NewYork: 'New York',
  Tokyo: 'Tokyo',
  SaoPaulo: 'Sao Paulo',
  CapeTown: 'Cape Town'
};

const cityKeys = Object.keys(cities);
let cityIndex = 0;

const wss = new WebSocketServer({ port: PORT }, () => {
  console.log(`🌍 WebSocket server running at ws://localhost:${PORT}`);
  console.log(`Running in ${MODE.toUpperCase()} mode`);
});

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  const interval = setInterval(async () => {
    const cityKey = cityKeys[cityIndex % cityKeys.length];
    const cityName = cities[cityKey];
    cityIndex++;

    let temperature: number;

    if (MODE === 'real') {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        if (!data.main || typeof data.main.temp !== 'number') {
          throw new Error('Unexpected API response structure');
        }
        temperature = data.main.temp;
      } catch (err) {
        console.error('Failed to fetch weather data:', (err as Error).message);
        return;
      }
    } else {
      temperature = +(Math.random() * 30).toFixed(2);
    }

    const event: WeatherEvent = {
      city: cityKey,
      timestamp: new Date().toISOString(),
      temperature
    };

    ws.send(JSON.stringify(event));
  }, INTERVAL_MS);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});
