const jwt = require('jsonwebtoken');

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

module.exports = { authenticateToken, validateRefreshToken };
