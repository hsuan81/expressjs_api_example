const express = require('express');
const router = express.Router();
const Role = require('../models/role');  // 请将这行替换为你的Role模型的实际路径

// 这是一个用于获取角色的中间件
async function getRole(req, res, next) {
  let role;
  try {
    role = await Role.findById(req.params.id);
    if (role == null) {
      return res.status(404).json({ message: 'Cannot find role' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.role = role;
  next();
}

// 创建一个新角色
router.post('/', async (req, res) => {
  const role = new Role({
    name: req.body.name,
    intro: req.body.intro
  });

  try {
    const newRole = await role.save();
    res.status(200).json({message: "Role created successfully", role: newRole});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 删除一个角色
router.delete('/:id', getRole, async (req, res) => {
  try {
    await res.role.deleteOne({id: req.body.id});
    res.json({message: 'Deleted role'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 更新一个角色
router.patch('/:id', getRole, async (req, res) => {
  if (req.body.intro != null) {
    res.role.intro = req.body.intro;
  }

  try {
    const updatedRole = await res.role.save();
    res.json({message: 'Role updated', role: updatedRole});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取一个角色
router.get('/:id', getRole, (req, res) => {
  res.json(res.role);
});

// 获取角色列表
router.get('/list', async (req, res) => {
  const offset = Number(req.body.offset);
  const size = Number(req.body.size);
  try {
    const roles = await Role.find().skip(offset).limit(size);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
