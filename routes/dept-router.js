const express = require('express');
const router = express.Router();
const Dept = require('../model/dept')
const Auth = require('../middlewares/auth')


router.get('/:id', Auth.authenticateToken, getUser, (req, res) => {
  try {
    res.json(res.user)
  } catch (error) {
    res.status(500).json({message: err.message})
  }
    
});

router.post('/', Auth.authenticateToken, async (req, res) => {
  
  // 假設新用戶的 ID 是目前數據庫中的用戶數量加一
  const user = new User(req.body)
  try {
    const savedUser = await user.save()
    res.status(201).json({id: savedUser._id, message: 'User created successfully'})
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
});

router.delete('/:id', Auth.authenticateToken, getUser, async(req, res) => {
    try {
      await res.user.deleteOne({id: req.body.id})
      res.json({ message: 'Deleted user' })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
});

router.patch('/:id', Auth.authenticateToken, getUser, async (req, res) => {
  try {
    // Create a new object that only includes non-null properties from req.body
    const updates = Object.entries(req.body).reduce((a, [k, v]) => (v == null ? a : { ...a, [k]: v }), {});

    // Update the user object
    Object.assign(res.user, updates);
    const updatedUser = await res.user.save();
    res.json({ id: req.params.id, message: 'User updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user 
  try {
    user = await User.findById(req.params.id).select('-password')
    if (user == null) {
      return res.status(404).json({message: 'Cannot find user'})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})
  }

  res.user = user
  next()
}

module.exports = router;