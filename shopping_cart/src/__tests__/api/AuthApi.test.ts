import request from 'supertest';
import express from 'express';
import { assembleApp } from '../../api/AppAssembler';
import { createAuthRoutes, AuthDependencies } from '../../api/factories/AuthRouteFactory';
import { FakeUserRepository } from '../repositories/FakeUserRepository';
import { FakePasswordHasher } from '../fakes/FakePasswordHasher';
import { FakeJwtGenerator } from '../fakes/FakeJwtGenerator';

function createTestApp(authDeps: AuthDependencies): express.Express {
  const authRouter = createAuthRoutes(authDeps);
  
  const routes = [
    { path: '/auth', router: authRouter }
  ];

  return assembleApp(routes);
}

describe('AuthApi', () => {
  let app: express.Express;

  beforeEach(() => {
    const authDeps: AuthDependencies = {
      userRepository: new FakeUserRepository(),
      passwordHasher: new FakePasswordHasher(),
      jwtGenerator: new FakeJwtGenerator()
    };

    app = createTestApp(authDeps);
  });

  describe('POST /signup', () => {
    it('creates a new user and returns AuthOutput', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          name: 'Alice',
          email: 'alice@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body.name).toBe('Alice');
      expect(response.body.email).toBe('alice@example.com');
      expect(response.body.token).toBe('fake-jwt-token');
    });

    it('returns 400 when email is already in use', async () => {
      // First signup
      await request(app)
        .post('/auth/signup')
        .send({
          name: 'Alice',
          email: 'alice@example.com',
          password: 'password123'
        });

      // Second signup with same email
      await request(app)
        .post('/auth/signup')
        .send({
          name: 'Bob',
          email: 'alice@example.com',
          password: 'password456'
        })
        .expect(400);
    });
  });

  describe('POST /signin', () => {
    it('authenticates user and returns AuthOutput', async () => {
      // First create a user
      await request(app)
        .post('/auth/signup')
        .send({
          name: 'Alice',
          email: 'alice@example.com',
          password: 'password123'
        });

      // Then signin
      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: 'alice@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('userId');
      expect(response.body.name).toBe('Alice');
      expect(response.body.email).toBe('alice@example.com');
      expect(response.body.token).toBe('fake-jwt-token');
    });

    it('returns 401 when credentials are invalid', async () => {
      await request(app)
        .post('/auth/signin')
        .send({
          email: 'alice@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });
}); 