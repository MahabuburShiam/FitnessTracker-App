/**
 * Middleware to check if a user has one of the required roles.
 * @param {string[]} allowedRoles - An array of roles that are allowed to access the route.
 * @returns {function} Express middleware function.
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Assumes the `auth` middleware has already run and attached the user object
    if (!req.user || !req.user.userType) {
      return res.status(403).json({ message: 'Forbidden: No user role found.' });
    }

    if (!allowedRoles.includes(req.user.userType)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }

    next();
  };
};

module.exports = authorize;