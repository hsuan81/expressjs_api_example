// tests/goods.test.js
require('dotenv').config()
const mongoose = require('mongoose')
const supertest = require('supertest');
const express = require('express');
const Goods = require('../models/goods');  // 请替换为你的实际路径
const goodsRouter = require('../routes/goods-router');  // 请替换为你的实际路径

const app = express();
app.use(express.json());
app.use('/goods', goodsRouter);
const request = supertest(app)

beforeAll(async () => {
    // Connect to DB before testing
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    // Cut off the connection to the DB after testing finished
    mongoose.connection.close()
})

describe('Goods API', () => {
  let goods;
  
  beforeEach(async () => {
    goods = new Goods({
        name: "Test Goods",
        oldPrice: 100,
        newPrice: 88,
        desc: "cba",
        status: 1,
        imgUrl: "www.itsiyuan.com/abc.png",
        inventoryCount: 100,
        saleCount: 100,
        favorCount: 199,
        address: "北京"
    });
    await goods.save();
  });
 

  test('Get Goods List', async () => {
    const res = await request.get('/goods/list');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
  
  test('Get Single Goods', async () => {
    const res = await request.get(`/goods/${goods.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Test Goods');
    expect(res.body.oldPrice).toEqual(100);
    // 检查其它字段
  });
  
  test('Create Goods', async () => {
    const res = await request
      .post('/goods')
      .send({
        name: 'Test Goods 2',
        oldPrice: 100,
        newPrice: 88,
        desc: "cba",
        status: 1,
        imgUrl: "www.itsiyuan.com/efg.png",
        inventoryCount: 100,
        saleCount: 100,
        favorCount: 199,
        address: "New York"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Goods created successfully');
    expect(res.body.goods.name).toEqual('Test Goods 2');
    expect(res.body.goods.address).toEqual('New York');
    // 检查其它字段
  });
  
  test('Update Goods', async () => {
    const res = await request
      .patch(`/goods/${goods.id}`)
      .send({
        name: 'Test Goods Updated',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Goods updated');
    expect(res.body.goods.name).toEqual('Test Goods Updated');
  });
  
  test('Delete Goods', async () => {
    const res = await request.delete(`/goods/${goods.idd}`);
  })
   
}); 