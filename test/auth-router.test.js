require('dotenv').config()
const request = require('supertest');
const app = require('../app'); // 你的app.js或者server.js路径
const User = require('../models/user'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


describe('Authentication API Test', () => {
  let testUser;

  beforeAll(async () => {
    const hashed = await bcrypt.hash('testpassword', 10)
    testUser = new User({
      name: 'testuser',
      password: hashed,
      realname: "詹姆斯",
      cellphone: 13322223338,
      departmentId: 1,
      roleId: 1
    });

    await testUser.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  test('POST /auth/login - success', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  test('POST /auth/login - fail', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'wronguser', password: 'wrongpassword' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid username or password');
  });

  // 你可能需要保存刷新令牌并在测试刷新API时使用它
  let refreshToken;

  test('POST /auth/refresh - success', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });

    refreshToken = loginResponse.body.refreshToken;

    const response = await request(app)
      .post('/auth/refresh')
      .send({ token: refreshToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  test('POST /auth/refresh - fail', async () => {
    const response = await request(app)
      .post('/auth/refresh')
      .send({ token: 'wrongtoken' });

    expect(response.statusCode).toBe(403);
  });

  test('POST /auth/refresh - expires', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });
    const updatedRefreshToken = jwt.sign({ username: 'testuser' }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '-10s' })
    // Set the user's refresh token to be the new one
    const updatedUser = await User.findOne({ name: 'testuser' })
    updatedUser.refreshToken = updatedRefreshToken
    updatedUser.save()
    const response = await request(app)
      .post('/auth/refresh')
      .send({ token: updatedUser.refreshToken });

    expect(response.statusCode).toBe(403);
  });

  test('POST /auth/logout - success', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });
    refreshToken = loginResponse.body.refreshToken;
    const response = await request(app)
      .post('/auth/logout')
      .send({ refreshToken });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Logged out');
    // Check that refresh token has been removed after logout
    const logoutUser = await User.findOne({ name: 'testuser' })
    expect(logoutUser.refreshToken).toBeNull()
  });

  test('POST /auth/logout - fail', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .send({ refreshToken: 'wrongtoken' });

    expect(response.statusCode).toBe(400);
  });
});
