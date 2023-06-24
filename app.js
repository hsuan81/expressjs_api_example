// 引入需要的模組
require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose')

// 創建 Express 應用
const app = express();
const userRouters = require('./routes/user-router')
const deptRouters = require('./routes/dept-router')
const menuRouters = require('./routes/menu-router')
const roleRouters = require('./routes/role-router')
const categoryRouters = require('./routes/category-router')
const goodsRouters = require('./routes/goods-router')
const storyRouters = require('./routes/story-router')
const authRouters = require('./routes/auth-router')
const Auth = require('./middlewares/auth')



// Connect to database via mongoose
mongoose.connect('mongodb://127.0.0.1:27017/api', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))
// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('Connected to database'))

// 使用 express.json 中間件解析請求體
app.use(express.json());
app.use('/auth', authRouters)
app.use('/users', userRouters)
app.use('/department', deptRouters)
app.use('/menu', menuRouters)
app.use('/role', roleRouters)
app.use('/category', categoryRouters)
app.use('/goods', goodsRouters)
app.use('/story', storyRouters)





  


/*
// 建立新用戶
app.post('/users', (req, res) => {
  // 假設新用戶的 ID 是目前數據庫中的用戶數量加一
  const newUserId = Object.keys(usersDB).length + 1;
  const newUser = {
    id: newUserId,
    ...req.body,
  };

  // 將新用戶儲存到 "數據庫"
  usersDB[newUserId] = newUser;

  res.json({id: newUserId, message: 'User created successfully'});
});

// 刪除用戶
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  if (usersDB[userId]) {
    delete usersDB[userId];
    res.json({message: 'User deleted successfully'});
  } else {
    res.status(404).json({message: 'User not found'});
  }
});

// 修改用戶
app.patch('/users/:id', (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  if (usersDB[userId]) {
    usersDB[userId] = {
      ...usersDB[userId],
      ...userData,
    };

    res.json({id: userId, message: 'User updated successfully'});
  } else {
    res.status(404).json({message: 'User not found'});
  }
});

// 查詢某個用戶
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  if (usersDB[userId]) {
    const { password, ...userWithoutPassword } = usersDB[userId];  // 去除 password 資訊
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({message: 'User not found'});
  }
});*/


module.exports = app;
  
