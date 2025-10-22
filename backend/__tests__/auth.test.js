// __tests__/auth.test.js
const request = require('supertest');
const { app, io } = require('../server'); // Import your Express app and socket.io
const db = require('../models');

// Clean up the database before and after tests
beforeAll(async () => {
  await db.sequelize.sync({ force: true }); // Resets the database
});

afterAll(async () => {
  io.close(); // Close socket.io server to allow Jest to exit gracefully
  await db.sequelize.close(); // Close connection after all tests
});

describe('Auth API', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        user_type: 'user',
        first_name: 'Test',
        last_name: 'User',
        location_lat: 40.7128,
        location_long: -74.0060,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not allow registration with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com', // Same email as above
        password: 'password123',
        user_type: 'user',
        first_name: 'Another',
        last_name: 'Test',
        location_lat: 40.7128,
        location_long: -74.0060,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should log in an existing user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fetch the current user with a valid token', async () => {
    // First, log in to get a token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    const token = loginRes.body.token;

    // Now, use the token to access a protected route
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  it('should log in an admin successfully using the dedicated admin route', async () => {
    const res = await request(app)
      .post('/api/auth/admin/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin2025',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.user_type).toBe('admin');
  });
});
