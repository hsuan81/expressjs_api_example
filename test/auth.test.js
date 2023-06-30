const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  authenticateToken,
  validateRefreshToken,
  encryptPwd,
  validateUser
} = require('../middlewares/auth');

// Mocking bcrypt and jsonwebtoken modules
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('Authentication middleware', () => {
  let req, res, next, user;

  beforeEach(() => {
    user = { name: 'John Doe' };

    req = {
      headers: {
        Authorization: 'Bearer token'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clears call history of mocked functions after each test
  });

  it('should hash password successfully', async () => {
    const password = 'mysecretpassword';
    const hashedPassword = 'hashedpassword';

    bcrypt.hash.mockResolvedValueOnce(hashedPassword);

    const result = await encryptPwd(password);

    expect(result).toEqual(hashedPassword);
  });

  it('should validate password successfully', async () => {
    const password = 'mysecretpassword';
    const hashedPassword = 'hashedpassword';

    bcrypt.compare.mockResolvedValueOnce(true);

    const result = await validateUser(password, hashedPassword);

    expect(result).toBeTruthy();
  });

  it('should authenticate token successfully', () => {
    jwt.verify.mockImplementationOnce((token, secret, callback) => callback(null, user));

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(user);
  });

  it('authenticateToken, should respond with status 403 and error message for invalid token', () => {
    jwt.verify.mockImplementationOnce((token, secret, callback) => callback(new Error()));

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('authenticateToken, should respond with status 401 if no token is provided', () => {
    delete req.headers.Authorization;

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it('authenticateToken, should respond with status 403 and "Access token expired" message for an expired token', () => {
    jwt.verify.mockImplementationOnce((token, secret, callback) => callback({ name: 'TokenExpiredError' }));

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access token expired' });
  });

  it('should validate refresh token successfully', () => {
    const refreshToken = 'refreshtoken';

    jwt.verify.mockImplementationOnce(() => true);

    const result = validateRefreshToken(refreshToken);

    expect(result).toBeTruthy();
  });

});
