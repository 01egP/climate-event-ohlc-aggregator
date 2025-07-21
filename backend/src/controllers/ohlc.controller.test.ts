import request from 'supertest';
import express from 'express';
import ohlcRoutes from '../routes/ohlc.routes';

const app = express();
app.use('/ohlc', ohlcRoutes);

describe('GET /ohlc', () => {
  it('should return aggregated OHLC data', async () => {
    const res = await request(app).get('/ohlc');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(typeof res.body).toBe('object');
  });
});

describe('GET /ohlc/:city', () => {
  it('should return 404 for unknown city', async () => {
    const res = await request(app).get('/ohlc/NonexistentCity');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
