const express = require('express');
const router = express.Router();
const Dept = require('../models/dept')
const Auth = require('../middlewares/auth')


// router.get('/:id', Auth.authenticateToken, getUser, (req, res) => {
router.get('/:id', getDept, (req, res) => {
  try {
    res.json(res.user)
  } catch (error) {
    res.status(500).json({message: err.message})
  }
    
});

// router.post('/', Auth.authenticateToken, async (req, res) => {
router.post('/', async (req, res) => {
  
  // 假設新用戶的 ID 是目前數據庫中的用戶數量加一
  const dept = new Dept({name: req.body.name, 
                         parentId: req.body.parentId,
                         leader: req.body.leader})
  try {
    const savedDept = await dept.save()
    res.status(201).json({id: savedDept._id, message: 'Department created successfully'})
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
});

// router.delete('/:id', Auth.authenticateToken, getUser, async(req, res) => {
router.delete('/:id', getDept, async(req, res) => {

  try {
      await res.dept.deleteOne({id: req.body.id})
      res.json({ message: 'Deleted department' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
});

// router.patch('/:id', Auth.authenticateToken, getUser, async (req, res) => {
router.patch('/:id', getDept, async (req, res) => {

  try {
    // Create a new object that only includes non-null properties from req.body
    const updates = Object.entries(req.body).reduce((a, [k, v]) => (v == null ? a : { ...a, [k]: v }), {});

    // Update the user object
    Object.assign(res.dept, updates);
    const updatedDept = await res.dept.save();
    res.json({ id: req.params.id, message: 'Department updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getDept(req, res, next) {
  let dept 
  try {
    dept = await Dept.findById(req.params.id)
    if (dept == null) {
      return res.status(404).json({message: 'Cannot find department'})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})
  }

  res.dept = dept
  next()
}

module.exports = router;
