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
app.get('/function/:id', getRole, (req, res) => {
  res.status(200).json(res.role);
});
const request = supertest(app)

beforeAll(async () => {
    // Connect to DB before testing
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    // Cut off the connection to the DB after testing finished
    mongoose.connection.close()
})

describe('getRole function', () => {
  it('should return role when exists', async () => {
    const fakeRole = new Role({ name: 'Admin', intro: 'Admin function' });
    await fakeRole.save();

    const response = await request(app).get(`/function/${fakeRole.id}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakeRole.toObject());

    await Role.findByIdAndDelete(fakeRole.id);
  });

  it('should return 404 when role does not exist', async () => {
    const response = await request(app).get('/123');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Cannot find role' });
  });
});

describe('Role CRUD', () => {
  let role;

  beforeEach(async () => {
    role = new Role({ name: 'Admin', intro: 'Admin role' });
    await role.save();
  });

  afterEach(async () => {
    await Role.deleteMany();  // Clears the database after each test
  });
    
    it('POST /', () => {
    const response = request.post('/role').send({
        name: 'New Role',
        intro: 'Post a new role'
    })
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Role created successfully")
    expect(response.body.role._id).toEqual(newRole._id);
    expect(response.body.role.name).toEqual(newRole.name);
    expect(response.body.role.intro).toEqual(newRole.intro);
    });
        
    it('GET /:id', () => {
     //const newRole = new Role({ name: 'Admin', intro: 'Get Admin' });
     //await newRole.save();

     const response = await request(app).get('/role/${role._id}');
    
     expect(response.status).toBe(200);
     expect(response.body.name).toEqual(role.name);
     expect(response.body.intro).toEqual(role.intro);
    });

    it('should update a role by ID', () => {
     // const newRole = new Role({ name: 'Admin', intro: 'Patch Admin' });
     // await newRole.save();
     const updatedIntro = 'Updated admin role';   
     const response = request.patch('/role/${role.id}').send({intro: updatedIntro});

     expect(response.status).toBe(200);
     expect(response.body.message).toBe('Role updated');
     expect(response.body.role.intro).toEqual(updatedIntro);
    });

    it('should delete a role by ID', async () => {
    // const newRole = new Role({ name: 'Admin', intro: 'Admin role' });
    // await newRole.save();

    const response = await request(app).delete(`/${role.id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Deleted role");

    // Verify the role was deleted by trying to get it
    const getResponse = await request(app).get(`/${newRole.id}`);
    expect(getResponse.status).toBe(404);
  });

    it('should get a list of roles', async () => {
    const roles = [
      { name: 'Admin2', intro: 'Admin role2' },
      { name: 'User', intro: 'User role' },
      // Add more roles here if needed
    ];
    // Save all roles to the database
    // await Promise.all(roles.map(role => new Role(role).save()));
    await Role.create(roles);

    const response = await request(app).get('/list').send({ offset: 0, size: 10 });
    
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(roles.length);
  });
        
});

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
  
