const express = require('express');
const router = express.Router();
const Role = require('../models/role');  // 请将这行替换为你的Role模型的实际路径
const Menu = require('../models/menu')

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

router.get('/role/:id/menu', async (req, res) => {
  try {
      const role = await Role.findById(req.params.id)
      if (!role) return res.status(404).json({ message: "Role not found" })
      
      // Assuming menuList in role stores ids of menus
      const menus = await Menu.find({ _id: { $in: role.menuList } })
      return res.status(200).json(menus)
  } catch(err) {
      console.log(`Error: ${err.message}`);
      return res.status(500).json({ message: err.message })
  }
})

// Get menuIds by role id
router.get('/role/:id/menuIds', async (req, res) => {
  try {   
      const role = await Role.findById(req.params.id)
      if (!role) return res.status(404).json({ message: "Role not found" })
      
      // Directly return menuList as it stores ids of menus
      return res.status(200).json(role.menuList)
  } catch(err) {
      return res.status(500).json({ message: err.message })
  }
})


// Assign menus to role
router.post('/role/assign', async (req, res) => {
  const { roleId, menuList } = req.body;
  try {
      const role = await Role.findById(roleId)
      if (!role) return res.status(404).json({ message: "Role not found" })

      // update menuList
      role.menuList.push(...menuList);
      await role.save();

      return res.status(200).json({ message: "Menu assigned successfully" })
  } catch(err) {
      return res.status(500).json({ message: err.message })
  }
})

module.exports = router;
