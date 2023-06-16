const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');  // 请将这行替换为你的Menu模型的实际路径

// 这是一个用于获取菜单的中间件
async function getMenu(req, res, next) {
  let menu;
  try {
    menu = await Menu.findById(req.params.id);
    if (menu == null) {
      return res.status(404).json({ message: 'Cannot find menu' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.menu = menu;
  next();
}

// 创建一个新菜单
router.post('/', async (req, res) => {
  const menu = new Menu({
    name: req.body.name,
    type: req.body.type,
    url: req.body.url,
    sort: req.body.sort,
    parentId: req.body.parentId
  });

  try {
    const newMenu = await menu.save();
    res.status(200).json({message: "Menu created successfully", menu: newMenu});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 删除一个菜单
router.delete('/:id', getMenu, async (req, res) => {
  try {
    await res.menu.deleteOne({id: req.body.id});
    res.json({message: 'Deleted menu'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 更新一个菜单
router.patch('/:id', getMenu, async (req, res) => {
  if (req.body.name != null) {
    res.menu.name = req.body.name;
  }
  if (req.body.url != null) {
    res.menu.url = req.body.url;
  }

  try {
    const updatedMenu = await res.menu.save();
    res.json({message: 'Menu updated', menu: updatedMenu});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取一个菜单
router.get('/:id', getMenu, (req, res) => {
  res.json(res.menu);
});

// 获取菜单列表 (fetch fixed amount of menus for a time)
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
