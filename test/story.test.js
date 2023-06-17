require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const request = require('supertest')
const Story = require('../models/story')
const storyRouter = require('../routes/story-router')

const app = express()
app.use(express.json())
app.use('/story', storyRouter)


beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
})
afterAll(async () => {
    await mongoose.connection.close()
})
afterEach(async () => {
    await Story.deleteMany({})
})

describe('POST /', () => {
    it('should create a new story', async () => {
        const res = await request(app).post('/story').send({
            title: "我與地壇",
            content: "宇宙以其不息的欲望將一个歌舞煉為永恆。這欲望有怎樣一個人間的姓名，大可忽略不計。"
        })
        expect(res.statusCode).toEqual(200)
        expect(res.body.story.title).toEqual("我與地壇")
    })
})

describe('GET /', () => {
    it('should get all stories', async () => {
        const story1 = new Story({
            title: "Story title1",
            content: "Story content1"
        })
        const story2 = new Story({
            title: "Story title2",
            content: "Story content2"
        })
        await story1.save()
        await story2.save()
        const res = await request(app).get('/story')
        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(2)
    })
})