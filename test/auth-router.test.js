require('dotenv').config()
const express = require('express')
const supertest = require('supertest')
const mongoose = require('mongoose')
const authRouters = require('../routes/auth-router')
const User = require('../models/user')

const app = express()
app.use(express.json())
app.use('/auth', authRouters)
const request = supertest(app)

beforeAll(async () => {
    // Connect to DB before testing
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    // Cut off the connection to the DB after testing finished
    mongoose.connection.close()
})

// create a user with password 123456a
// test for login
// test for logout

describe('Auth API', async () => {
    let user
    beforeAll(async () => {
        user = {
            "name": "testman",
            "realname": "詹姆斯",
            "password": "123456a",
            "cellphone": 13322223338,
            "departmentId": 1,
            "roleId": 1
          };
    })
})