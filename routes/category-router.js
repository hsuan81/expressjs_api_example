const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const { authenticateToken } = require('../middlewares/auth')


async function getCategory(req, res, next) {
    let category
    try {
        category = await Category.findById(req.params.id)
        if (category == null) {
            return res.status(404).json({ message: "Cannot find category"})
        }
        res.category = category
        next()
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
}

router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name
    })
    try {
        const newCategory = await category.save()
        res.status(200).json({ message: "Category created successfully", category: newCategory})
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:id', getCategory, async (req, res) => {
    try {
        await res.category.deleteOne()
        res.status(200).json({ message: "Deleted category"})
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.patch('/:id', getCategory, async (req, res) => {
    if (req.body.name != null) {
        res.category.name = req.body.name;
    }
    try {
        await res.category.save()
        res.status(200).json({ message: "Updated category"})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getCategory, (req, res) => {
    res.json(res.category)
})

router.post('/list', async (req, res) => {
    try {
        const query = req.body.name ? { name: new RegExp(req.body.name, 'i') } : {}
        const categoryList = await Category.find(query, null, {skip: req.body.offset, limit: req.body.size})
        res.status(200).json(categoryList)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router