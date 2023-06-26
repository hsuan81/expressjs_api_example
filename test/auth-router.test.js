require('dotenv').config()
const request = require('supertest');
const app = require('../app'); // 你的app.js或者server.js路径
const User = require('../models/user'); // 你的User model路径
const bcrypt = require('bcrypt')

// beforeAll(async () => {
//     // Connect to DB before testing
//     await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
// })

// afterAll(async () => {
//     // Cut off the connection to the DB after testing finished
//     mongoose.connection.close()
// })

// create a user with password 123456a
// test for login
// test for logout

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

//   // 你可能需要保存刷新令牌并在测试刷新API时使用它
//   let refreshToken;

//   test('POST /auth/refresh - success', async () => {
//     const loginResponse = await request(app)
//       .post('/auth/login')
//       .send({ username: 'testuser', password: 'testpassword' });

//     refreshToken = loginResponse.body.refreshToken;

//     const response = await request(app)
//       .post('/auth/refresh')
//       .send({ token: refreshToken });

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('accessToken');
//   });

//   test('POST /auth/refresh - fail', async () => {
//     const response = await request(app)
//       .post('/auth/refresh')
//       .send({ token: 'wrongtoken' });

//     expect(response.statusCode).toBe(403);
//   });

//   test('POST /auth/logout - success', async () => {
//     const response = await request(app)
//       .post('/auth/logout')
//       .send({ refreshToken: refreshToken });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toBe('Logged out');
//   });

//   test('POST /auth/logout - fail', async () => {
//     const response = await request(app)
//       .post('/auth/logout')
//       .send({ refreshToken: 'wrongtoken' });

//     expect(response.statusCode).toBe(400);
//   });
});
