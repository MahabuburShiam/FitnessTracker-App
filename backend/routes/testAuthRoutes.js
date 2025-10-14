// backend/routes/testAuthRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Test route to verify authentication is working
router.get('/test-auth', auth, (req, res) => {
  res.json({
    message: 'Authentication successful!',
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      userType: req.user.userType
    },
    timestamp: new Date().toISOString()
  });
});

// Test route for admin only
router.get('/test-admin', auth, (req, res) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required',
      currentUserType: req.user.userType
    });
  }

  res.json({
    message: 'Admin access granted!',
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      userType: req.user.userType
    }
  });
});

// Test route for gym owners and trainers
router.get('/test-business', auth, (req, res) => {
  if (!['gym_owner', 'trainer'].includes(req.user.userType)) {
    return res.status(403).json({ 
      error: 'Business account required',
      currentUserType: req.user.userType,
      requiredTypes: ['gym_owner', 'trainer']
    });
  }

  res.json({
    message: 'Business access granted!',
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      userType: req.user.userType
    },
    businessType: req.user.userType
  });
});

// Test route to check user permissions
router.get('/test-permissions', auth, (req, res) => {
  const permissions = {
    canCreateGym: req.user.userType === 'gym_owner',
    canCreateTrainerProfile: req.user.userType === 'trainer',
    canManageUsers: req.user.userType === 'admin',
    canRateGyms: ['user', 'trainer'].includes(req.user.userType),
    canWriteArticles: true, // All users can write articles
    canAccessAdminPanel: req.user.userType === 'admin'
  };

  res.json({
    message: 'User permissions retrieved successfully',
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      userType: req.user.userType
    },
    permissions
  });
});

module.exports = router;