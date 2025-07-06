export function generateMockOHLCData() {
  const ohlc = {};
  const now = new Date();
  const startHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 24);

  for (let i = 0; i < 24; i++) {
    const hour = new Date(startHour.getTime() + i * 60 * 60 * 1000);
    const key = hour.toISOString();

    const open = 15 + Math.random() * 10;
    const close = open + (Math.random() - 0.5) * 5;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;

    ohlc[key] = { open, high, low, close };
  }
  return ohlc;
}
