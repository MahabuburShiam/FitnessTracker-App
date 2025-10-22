const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if no token
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Check if it's a Bearer token
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Malformed token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fitness_connect_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};