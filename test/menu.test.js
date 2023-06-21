require('dotenv').config()
const mongoose = require('mongoose')
const supertest = require('supertest');
const express = require('express');
const Menu = require('../models/menu');  // 请替换为你的实际路径
const menuRouter = require('../routes/menu-router');  // 请替换为你的实际路径

const app = express();
app.use(express.json());
app.use('/menu', menuRouter);
const request = supertest(app)

beforeAll(async () => {
    // Connect to DB before testing
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    // Cut off the connection to the DB after testing finished
    mongoose.connection.close()
})

describe('Menu API', () => {
    let menu;
    
    beforeAll(async () => {
      menu = new Menu({
        name: 'Test Menu',
        type: 2,
        url: '/test-url',
        sort: 1,
        parentId: null
      });
      await menu.save();
    });

    afterAll(async () => {
        // await Menu.deleteOne({name: menu.name})
        await Menu.deleteMany()
    })
    
    test('Get Menu List', async () => {
      const res = await request.get('/menu');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
    
    test('Get Single Menu', async () => {
      const res = await request.get(`/menu/${menu.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual('Test Menu');
    });
    
    test('Create Menu', async () => {
      const res = await request
        .post('/menu')
        .send({
          name: 'Test Menu 2',
          type: 3,
          url: '/test-url-2',
          sort: 2,
          parentId: menu.id
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Menu created successfully');
      expect(res.body.menu.name).toEqual('Test Menu 2');
      expect(res.body.menu.parentId).toEqual(menu.id);

    });
    
    test('Update Menu', async () => {
      const res = await request
        .patch(`/menu/${menu.id}`)
        .send({
          name: 'Test Menu Updated',
          url: '/test-url-updated'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Menu updated');
      expect(res.body.menu.name).toEqual('Test Menu Updated');
      expect(res.body.menu.url).toEqual('/test-url-updated');
    });

    test('Get Menu Tree', async () => {
      const res = await request.get('/menu/tree');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchInlineSnapshot(`
[
  {
    "_id": "6491d23a2a0dbc71b1d3ff14",
    "parentId": null,
    "parents": [],
  },
  {
    "_id": "6491d23b2a0dbc71b1d3ff18",
    "parentId": "6491d23a2a0dbc71b1d3ff14",
    "parents": [
      {
        "_id": "6491d23a2a0dbc71b1d3ff14",
        "parentId": null,
      },
    ],
  },
]
`)
      // Add more specific expectations based on your menu tree structure
    });
    
    test('Delete Menu', async () => {
      const res = await request.delete(`/menu/${menu.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Deleted menu');
    });
  
    
  });