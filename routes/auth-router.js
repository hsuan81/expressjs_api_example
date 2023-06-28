require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Auth = require('../middlewares/auth')
const jwt = require('jsonwebtoken')


router.post('/login', async (req, res) => {
    // Assume you've received username and password from the request body,
    // validate them against the database.
    const username = req.body.username;
    console.log(req.body.username)
    // const user = { name: username };  // Mocked user object
    try {
        const user = await User.findOne({ name: username }).exec()
        const hashed = user ? user.password : null;
        const validated = hashed ? await Auth.validateUser(req.body.password, hashed) : false;
        console.log('validated', validated)
        const payload = {}

        // const hashed = await User.findOne({ name: username }, 'password').exec()
        // const validated = Auth.validateUser(req.body.password, hashed)
        if (validated) {
            const payload = { username: username }; // Create a payload with the username
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "300s"});
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "3d"});
            // Store refresh token into db
            const updatedUser = await User.findByIdAndUpdate(user.id, { refreshToken: refreshToken }, { new: true })
            console.log('login refresh', updatedUser)
            console.log('refresh', refreshToken)
            res.status(200).json({ accessToken, refreshToken });
        } else {
            res.status(400).json({ message: "Invalid username or password" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
    
});

router.post('/refresh', async (req, res) => {
    // 从请求中获取refreshToken
    const refreshToken = req.body.token;
    
    // 检查refreshToken是否存在
    if (!refreshToken) return res.status(403).send('Refresh token is required');
  
    // 验证refreshToken
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send('Invalid refresh token');
      console.log(user.username)
      // 如果refreshToken有效，创建并发送新的accessToken
      const newAccessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "300s"
      });
    //   const newRefreshToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "30m"
    //   });
      res.json({ accessToken: newAccessToken });
    });
});
  
router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;
    try {
        // Find user by refresh token
        const user = await User.findOne({ refreshToken }).exec();
        if (!user) {
        console.log('logout', user)
        return res.status(400).json({ message: 'Invalid refresh token' });
        }

        // Clear the refresh token
        user.refreshToken = null;
        await user.save();

        res.status(200).json({ message: 'Logged out' });
    } catch (err) {
        res.status(500).json({ message: err.message });}
});

module.exports = router