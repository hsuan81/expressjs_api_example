const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // 你的app.js或server.js路径

const request = supertest(app);

const User = require('../model/user'); // 你的User model路径

describe('User Model Test', () => {
  // 在测试开始前清空测试数据库
   beforeEach(async () => {
    await User.deleteMany({});
   });

   afterAll(async () => {
    await mongoose.connection.close();
   });

   it('POST /users/ should create a new user', async () => {
    const user = {
      "name": "james",
      "realname": "詹姆斯",
      "password": "123456",
      "cellphone": 13322223338,
      "departmentId": 1,
      "roleId": 1
    };

    // 创建用户
    const response = await request.post('/users').send(user);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');

    // 获取用户确保其已被创建
    const createdUserResponse = await request.get(`/users/${response.body.id}`);
    expect(createdUserResponse.status).toBe(200);
    expect(createdUserResponse.body.name).toBe(user.name);

   });

   it('PATCH /users/:id should update user and return success message', async () => {
        // 先创建一个用户，以便我们可以更新它
        const newUser = await request.post('/users').send({
          "name": "tony",
          "realname": "東尼",
          "password": "123456",
          "cellphone": 13322223338,
          "departmentId": 1,
          "roleId": 2
        });
    
        const response = await request.patch(`/users/${newUser.body.id}`).send({
          "name": "james",
        });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
        // 这里还可以添加更多的断言，比如检查返回的用户对象是否包含正确的更新
    });
    
    it('Delete /users/:id should delete user and return success message', async () => {
        // 先创建一个用户，以便我们可以更新它
        const newUser = await request.post('/users').send({
          "name": "tony",
          "realname": "東尼",
          "password": "123456",
          "cellphone": 13322223338,
          "departmentId": 1,
          "roleId": 2
        });
        // console.log(newUser.body.id)
    
        const response = await request.delete(`/users/${newUser.body.id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Deleted user');
        // 这里还可以添加更多的断言，比如检查返回的用户对象是否包含正确的更新
        
        const createdUserResponse = await request.get(`/users/${response.body.id}`);
        expect(createdUserResponse.status).toBe(500);

    });


})


