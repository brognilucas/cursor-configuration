import request from 'supertest';
import express from 'express';
import { assembleApp, RouteConfig } from '../../api/AppAssembler';
import { HealthController } from '../../api/HealthController';

function createTestApp(): express.Express {
  const routes: RouteConfig[] = [
    { path: '/health', router: HealthController() }
  ];

  return assembleApp(routes);
}

describe('Health API', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
  });

  it('returns health status when health endpoint is called', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
      service: 'shopping-cart-api'
    });
  });
}); 