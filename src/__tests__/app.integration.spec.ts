import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../app';

describe('app (integration)', () => {
  it('GET /heartbeat returns ok', async () => {
    const res = await request(app).get('/heartbeat');

    expect(res.status).toBe(200);
    expect(res.text).toBe('ok');
  });

  it('returns 404 for an unmatched route', async () => {
    const res = await request(app).get('/this-route-does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('rejects a disallowed CORS origin', async () => {
    const res = await request(app).get('/heartbeat').set('Origin', 'https://not-allowed.example');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('allows a whitelisted CORS origin', async () => {
    const res = await request(app).get('/heartbeat').set('Origin', 'https://example.com');

    expect(res.headers['access-control-allow-origin']).toBe('https://example.com');
  });

  it('POST /v1/users/register rejects invalid input before touching the database', async () => {
    const res = await request(app).post('/v1/users/register').send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /v1/users/login rejects invalid input before touching the database', async () => {
    const res = await request(app).post('/v1/users/login').send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /v1/users/profile without a token returns 401', async () => {
    const res = await request(app).get('/v1/users/profile');

    expect(res.status).toBe(401);
  });
});
