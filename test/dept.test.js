const request = require('supertest');
const app = require('../app'); // 你的app路径
const Dept = require('../models/dept'); // 你的Dept model路径
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Department Router', () => {
  it('should create a new department', async () => {
    const res = await request(app)
      .post('/departments')
      .send({
        name: 'New Department',
        parentId: 123,
        leader: 'John Doe'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Department created successfully');
  });

  it('should delete a department', async () => {
    const dept = new Dept({ name: 'Old Department', parentId: '123', leader: 'John Doe' });
    await dept.save();

    const res = await request(app).delete(`/departments/${dept._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Deleted department');
  });

  it('should update a department', async () => {
    const dept = new Dept({ name: 'Old Department', parentId: '123', leader: 'John Doe' });
    await dept.save();

    const res = await request(app)
      .patch(`/departments/${dept._id}`)
      .send({
        name: 'Updated Department'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Department updated successfully');
  });

  it('should get a department', async () => {
    const dept = new Dept({ name: 'Old Department', parentId: '123', leader: 'John Doe' });
    await dept.save();

    const res = await request(app).get(`/departments/${dept._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', dept.name);
  });
});
