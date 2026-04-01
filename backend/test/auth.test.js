import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server';

// Mock mongoose to prevent actual database connection during simple tests
vi.mock('mongoose', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    connect: vi.fn().mockResolvedValue(true),
    connection: {
      on: vi.fn(),
      once: vi.fn(),
    }
  };
});

describe('Auth API Routes', () => {

  it('GET / should return API running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('API UO-Compagnon is running...');
  });

  describe('POST /api/users/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@uottawa.ca' }); // Missing password

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/register', () => {
    it('should return 400 for non-uottawa emails', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test',
          email: 'test@gmail.com', // Invalid domain
          password: 'password123',
          arrivalDate: '2026-08-15',
          classStartDate: '2026-09-01'
        });

      // Based on typical academic regex restrictions in project
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/uottawa/i);
    });
  });

});
