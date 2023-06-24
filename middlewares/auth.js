const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const saltRounds = 10

function encryptPwd(pwd) {
  bcrypt
  .hash(password, saltRounds)
  .then(hash => {
    console.log('Hash ', hash)
    return hash
  })
  .catch(err => console.error(err.message))
}

function validateUser(pwd, hashedPwd) {
  bcrypt
      .compare(pwd, hashedPwd)
      .then(res => {
        console.log(res) // return true
        return res
      })
      .catch(err => console.error(err.message))    
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Access token expired' });
        }
        return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

function validateRefreshToken(refreshToken) {
    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      return true;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        console.log('Refresh token expired');
      } else if (err instanceof jwt.JsonWebTokenError) {
        console.log('Invalid token');
      }
      return false;
    }
  }

module.exports = { authenticateToken, validateRefreshToken, encryptPwd, validateUser };
