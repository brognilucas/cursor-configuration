import request from 'supertest';
import express from 'express';
import { AuthMiddleware, AuthenticatedRequest } from '../../api/AuthMiddleware';
import { FakeJwtGenerator } from '../fakes/FakeJwtGenerator';

function createTestApp(authMiddleware: AuthMiddleware): express.Express {
  const app = express();
  app.use(express.json());
  
  // Protected route for testing
  app.get('/protected', authMiddleware.authenticate.bind(authMiddleware), (req: AuthenticatedRequest, res) => {
    res.json({ message: 'Protected resource', user: req.user });
  });

  return app;
}

describe('AuthMiddleware', () => {
  let app: express.Express;
  let jwtGenerator: FakeJwtGenerator;
  let authMiddleware: AuthMiddleware;

  beforeEach(() => {
    jwtGenerator = new FakeJwtGenerator();

    authMiddleware = new AuthMiddleware(jwtGenerator);

    app = createTestApp(authMiddleware);
  });

  it('rejects requests without authorization header', async () => {
    const response = await request(app)
      .get('/protected')
      .expect(401);

    expect(response.body).toEqual({ error: 'Authorization header required' });
  });

  it('rejects requests with invalid authorization format', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'InvalidToken')
      .expect(401);

    expect(response.body).toEqual({ error: 'Invalid authorization format' });
  });

  it('rejects requests with invalid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body).toEqual({ error: 'Invalid token' });
  });

  it('allows requests with valid token and adds user context', async () => {
    const userPayload = { userId: 'user-123', email: 'test@example.com' };
    const validToken = jwtGenerator.generate(userPayload);

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body).toEqual({
      message: 'Protected resource',
      user: userPayload
    });
  });
}); 