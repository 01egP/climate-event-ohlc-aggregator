import request from 'supertest';
import app from '../app';

describe('GET /ohlc', () => {
  it('should return OHLC data', async () => {
    const res = await request(app).get('/ohlc');
    expect(res.status).toBe(200);
  });
});
