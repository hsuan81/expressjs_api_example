// 引入需要的模組
const express = require('express');

// 創建 Express 應用
const app = express();

// 使用 express.json 中間件解析請求體
app.use(express.json());

// 用來儲存用戶的 "數據庫"
let usersDB = {};

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
});


// 啟動服務器
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
