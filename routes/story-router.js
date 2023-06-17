const express = require('express')
const router = express.Router()
const Story = require('../models/story')

router.post('/', async (req, res) => {
    try {
        const story = new Story({
            title: req.body.title,
            content: req.body.content
        })
        const newStory = await story.save()
        res.status(200).json({ message: "Story created successfully", story: newStory})
    } catch (err) {
        res.status(500).json({ message: err.message })        
    }
})

router.get('/', async (req, res) => {
    try {
        const storyList = await Story.find()
        res.status(200).json(storyList)    
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router