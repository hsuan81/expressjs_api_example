const request = require('supertest');
const mongoose = require('mongoose')
const app = require('../app'); // 你的app路径
const Dept = require('../models/dept'); // 你的Dept model路径

let mongoServer;

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  
});

afterAll(async () => {
  await Dept.deleteMany({})
  mongoose.connection.close()
});

describe('Department Router', () => {
  it('should create a new department', async () => {
    const res = await request(app)
      .post('/department')
      .send({
        name: 'New Department',
        parentId: 123,
        leader: 'John Doe'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Department created successfully');
  });

  it('should get a department', async () => {
    // const dept = new Dept({ name: 'Old Department', parentId: '123', leader: 'John Doe' });
    // await dept.save();

    const dept = await Dept.findOne({name: 'New Department'})

    const res = await request(app).get(`/department/${dept._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('parentId', dept.parentId);
  });

  it('should respond with status code of 404 if the department is not found', async () => {
    // Object Id in mongoose is set to be 24 characters long and a combination of 0-9 and a-z
    const res = await request(app).get(`/department/123456123456123456123456`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Cannot find department');
  });

  it('should respond with status code of 500 if the pass-in id is invalid', async () => {
    const res = await request(app).get(`/department/123456`);
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message');
  });

  it('should update a department', async () => {
    const dept = new Dept({ name: 'Old Department', parentId: '123', leader: 'John Doe' });
    await dept.save();

    const res = await request(app)
      .patch(`/department/${dept._id}`)
      .send({
        name: 'Updated Department'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Department updated successfully');
  });

  it('should respond with 400 status code if the pass-in data is invalid for update', async () => {
    const dept = await Dept.findOneAndUpdate({name: 'Old Department'}, 
    {$setOnInsert: { name: 'Old Department', parentId: '123', leader: 'John Doe' }}, {upsert: true, new: true})

    const res = await request(app)
      .patch(`/department/${dept._id}`)
      .send({
        new_leader: 'Invalid property'
      });
    const updated = await Dept.findById(dept._id)
    console.log(updated)
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should delete a department', async () => {
    const dept = new Dept({ name: 'To be deleted Department', parentId: '123', leader: 'Jo Jo' });
    await dept.save();

    const res = await request(app).delete(`/department/${dept._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Deleted department');
  });

  it('should respond with 404 status code if the department-to-delete is inexistent', async () => {
    const res = await request(app).delete(`/department/123456123456123456123456`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Cannot find department');
  });
});
