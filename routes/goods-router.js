const express = require('express');
const router = express.Router();
const Goods = require('../models/goods');  // 请将这行替换为你的Goods模型的实际路径

// 这是一个用于获取商品的中间件
async function getGoods(req, res, next) {
  let goods;
  try {
    goods = await Goods.findById(req.params.id);
    if (goods == null) {
      return res.status(404).json({ message: 'Cannot find goods' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.goods = goods;
  next();
}

// 创建一个新商品
router.post('/', async (req, res) => {
  const goods = new Goods({
    name: req.body.name,
    oldPrice: req.body.oldPrice,
    newPrice: req.body.newPrice,
    desc: req.body.desc,
    status: req.body.status,
    imgUrl: req.body.imgUrl,
    inventoryCount: req.body.inventoryCount,
    saleCount: req.body.saleCount,
    favorCount: req.body.favorCount,
    address: req.body.address
  });

  try {
    const newGoods = await goods.save();
    res.status(200).json({message: "Goods created successfully", goods: newGoods});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 删除一个商品
router.delete('/:id', getGoods, async (req, res) => {
  try {
    await res.goods.deleteOne({id: res.goods.id});
    res.json({message: 'Deleted goods'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 更新一个商品
router.patch('/:id', getGoods, async (req, res) => {
  if (req.body.name != null) {
    res.goods.name = req.body.name;
  }
  if (req.body.newPrice != null) {
    res.goods.newPrice = req.body.newPrice;
  }

  try {
    const updatedGoods = await res.goods.save();
    res.json({message: 'Goods updated', goods: updatedGoods});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取商品列表
router.get('/list', async (req, res) => {
  try {
    const goodsList = await Goods.find();
    res.json(goodsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取一个商品
router.get('/:id', getGoods, (req, res) => {
  res.json(res.goods);
});



module.exports = router;
