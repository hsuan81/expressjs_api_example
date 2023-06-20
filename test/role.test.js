require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const supertest = require('supertest')
const Role = require('../models/role')
const Menu = require('../models/menu')
const roleRouter = require('../routes/role-router')

const app = express()
app.use(express.json())
app.use(roleRouter)
const request = supertest(app)

beforeAll(async () => {
    // Connect to DB before testing
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    // Cut off the connection to the DB after testing finished
    mongoose.connection.close()
})

describe('POST /', () => {
    const newRole = new Role({
        name: 'New Role',
        intro: 'Post a new role'
    })
    const response = request.post('/').send(newRole)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Role created successfully")
    expect(response.body.role._id).toEqual(newRole._id)
})

describe('Role Menu Routes', () => {
    let testRoleId;
    let testMenuId;
  
    // 在测试开始前，创建一个角色和菜单
    beforeAll(async () => {
      const role = new Role({
        name: 'Test Role',
        intro: 'For testing',
        menuList: []
      });
      const savedRole = await role.save();
      testRoleId = savedRole._id;
  
      const menu = new Menu({
        name: 'Test Menu',
        type: 2,
        url: '/test/menu',
        sort: 1,
        parentId: null
      });
      const savedMenu = await menu.save();
      testMenuId = savedMenu._id;
    });
  
    // 在所有测试结束后，删除创建的角色和菜单
    afterAll(async () => {
      await Role.findByIdAndDelete(testRoleId);
      await Menu.findByIdAndDelete(testMenuId);
    });

    test('POST /role/assign', async () => {
        const response = await request.post(`/role/assign`)
          .send({ roleId: testRoleId, menuList: [testMenuId] });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Menu assigned successfully');
        const savedMenuList = await Role.findById(testRoleId).select('menuList')
        expect(savedMenuList.menuList.map(id => id.toString())).toContain(testMenuId.toString())
      });
  
    test('GET /role/:id/menu', async () => {
        // Create some menus
        const menu1 = new Menu({ name: 'Menu1', type: 1, url: '/url1', sort: 1 });
        const menu2 = new Menu({ name: 'Menu2', type: 2, url: '/url2', sort: 2 });

        await menu1.save();
        await menu2.save();

        // Create a role and assign menus to it
        const role = new Role({ name: 'Test Role2', intro: 'Testing' });
        console.log('role2', role._id)
        console.log('menu1', menu1._id)
        console.log('menu2', menu2._id)
        role.menuList.push(menu1._id, menu2._id);
        // role.menuList.push(menu2._id);
        await role.save();

        // For debugging
        const savedMenus = await Role.findById(role._id).select('menuList')
        console.log('saved menus ', savedMenus)

        // Make a GET request to the /role/:id/menu route
        const response = await request
            .get(`/role/${role._id}/menu`)
        console.log('get role ', response.body);  // Print the response body if the server sends error details

        // Verify that the response includes the menus
        // expect(response.body.length).toEqual(2);
        expect(response.body).toEqual(
            expect.arrayContaining([
            expect.objectContaining({ _id: menu1._id.toString(), name: 'Menu1', url: '/url1' }),
            expect.objectContaining({ _id: menu2._id.toString(), name: 'Menu2', url: '/url2' })
            ])
        );
    });
  

  
    
  });
  