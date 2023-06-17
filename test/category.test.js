require('dotenv').config()
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const Category = require('../models/category');
const categoryRouter = require('../routes/category-router'); 

const app = express();
app.use(express.json());
app.use('/category', categoryRouter);

// Connect to your MongoDB instance
beforeAll(async () => {
  const url = process.env.DATABASE_URL;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Disconnect after all tests have run
afterAll(async () => {
  await mongoose.connection.close();
});

// After each test, delete all documents in the categories collection
afterEach(async () => {
  await Category.deleteMany({});
});

describe('POST /', () => {
  it('should create a new category', async () => {
    const res = await request(app)
      .post('/category')
      .send({
        name: 'Test Category',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.category.name).toEqual('Test Category');
  });
});

describe('DELETE /:id', () => {
  it('should delete specified category', async () => {
    const category = new Category({
      name: 'Test Category'
    });

    await category.save();

    const res = await request(app).delete(`/category/${category.id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Deleted category');
  });
});

describe('PATCH /:id', () => {
  it('should update the specified category', async () => {
    const category = new Category({
      name: 'Test Category'
    });

    await category.save();

    const res = await request(app).patch(`/category/${category.id}`).send({
      name: 'Updated Category'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Updated category');
  });
});

describe('GET /:id', () => {
  it('should return the specified category', async () => {
    const category = new Category({
      name: 'Test Category'
    });

    await category.save();

    const res = await request(app).get(`/category/${category.id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Test Category');
  });
});

describe('POST /list', () => {
  it('should return list of categories', async () => {
    const category1 = new Category({
      name: 'Test Category 1'
    });

    const category2 = new Category({
      name: 'Test Category 2'
    });

    await category1.save();
    await category2.save();

    const res = await request(app)
      .post('/category/list')
      .send({
        offset: 0,
        size: 10
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });
});
