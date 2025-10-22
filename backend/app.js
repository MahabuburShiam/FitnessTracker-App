// backend/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { syncDatabase } = require('./models');
const { auth } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route (no auth required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Fitness App Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

console.log('🔧 Loading routes...');

// Public routes (no authentication required)
try {
  console.log('🔄 Loading auth routes...');
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/admin/auth', require('./routes/adminAuthRoutes'));
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
  process.exit(1);
}

// Test routes (for development)
try {
  console.log('🔄 Loading test routes...');
  app.use('/api/test', require('./routes/testAuthRoutes'));
  console.log('✅ Test routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading test routes:', error.message);
  process.exit(1);
}

// Protected routes (authentication required)
try {
  console.log('🔄 Loading workout routes...');
  app.use('/api/workouts', auth, require('./routes/workoutsessionRoutes'));
  console.log('✅ Workout routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading workout routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading daily log routes...');
  app.use('/api/daily-logs', auth, require('./routes/dailylogRoutes'));
  console.log('✅ Daily log routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading daily log routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading sleep routes...');
  app.use('/api/sleep', auth, require('./routes/sleepAnalysisRoutes'));
  console.log('✅ Sleep routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading sleep routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading notification routes...');
  app.use('/api/notifications', auth, require('./routes/notificationRoutes'));
  console.log('✅ Notification routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading notification routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading gym routes...');
  app.use('/api/gyms', auth, require('./routes/gymRoutes'));
  console.log('✅ Gym routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading gym routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading journal routes...');
  app.use('/api/journals', auth, require('./routes/journalRoutes'));
  console.log('✅ Journal routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading journal routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading trainer routes...');
  app.use('/api/trainers', auth, require('./routes/trainerRoutes'));
  console.log('✅ Trainer routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading trainer routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading AI suggestion routes...');
  app.use('/api/ai-suggestions', auth, require('./routes/aiSuggestionRoutes'));
  console.log('✅ AI suggestion routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading AI suggestion routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading messaging routes...');
  app.use('/api/messaging', auth, require('./routes/messagingRoutes'));
  console.log('✅ Messaging routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading messaging routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading admin routes...');
  app.use('/api/admin', auth, require('./routes/adminRoutes'));
  console.log('✅ Admin routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading admin routes:', error.message);
  process.exit(1);
}

try {
  console.log('🔄 Loading goal routes...');
  app.use('/api/goals', auth, require('./routes/workoutgoalRoutes'));
  console.log('✅ Goal routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading goal routes:', error.message);
  process.exit(1);
}

console.log('🎉 All routes loaded successfully!');

// Demo route to show all available endpoints
app.get('/api', (req, res) => {
  const endpoints = {
    message: 'Fitness App API Endpoints',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'User login',
        'GET /api/auth/profile': 'Get user profile (protected)',
        'PUT /api/auth/profile': 'Update user profile (protected)',
        'PUT /api/auth/change-password': 'Change password (protected)'
      },
      test: {
        'GET /api/test/test-auth': 'Test authentication (protected)',
        'GET /api/test/test-admin': 'Test admin access (protected)',
        'GET /api/test/test-business': 'Test business access (protected)'
      },
      workouts: {
        'POST /api/workouts/sessions': 'Create workout session',
        'GET /api/workouts/sessions': 'Get workout sessions',
        'GET /api/workouts/sessions/:sessionId': 'Get specific session',
        'PUT /api/workouts/sessions/:sessionId': 'Update session',
        'DELETE /api/workouts/sessions/:sessionId': 'Delete session'
      },
      dailyLogs: {
        'POST /api/daily-logs': 'Create/update daily log',
        'GET /api/daily-logs': 'Get daily logs',
        'GET /api/daily-logs/:date': 'Get log by date',
        'GET /api/daily-logs/progress': 'Get progress data'
      },
      sleep: {
        'POST /api/sleep': 'Create sleep log',
        'GET /api/sleep': 'Get sleep logs',
        'GET /api/sleep/analysis': 'Get sleep analysis',
        'PUT /api/sleep/:logId': 'Update sleep log'
      },
      goals: {
        'POST /api/goals/goals': 'Create workout goal',
        'GET /api/goals/goals': 'Get workout goals',
        'PUT /api/goals/goals/:goalId': 'Update goal',
        'DELETE /api/goals/goals/:goalId': 'Delete goal'
      },
      gyms: {
        'POST /api/gyms/gyms': 'Create gym (gym_owner only)',
        'GET /api/gyms/gyms/nearby': 'Find nearby gyms',
        'POST /api/gyms/gyms/:gymId/rate': 'Rate gym'
      },
      journals: {
        'POST /api/journals/journals': 'Create journal article',
        'GET /api/journals/journals': 'Get published articles',
        'GET /api/journals/my-journals': 'Get user articles',
        'POST /api/journals/journals/:journalId/comments': 'Add comment',
        'POST /api/journals/journals/:journalId/rate': 'Rate article'
      },
      trainers: {
        'POST /api/trainers/trainer/profile': 'Create trainer profile',
        'GET /api/trainers/trainers': 'Find trainers',
        'POST /api/trainers/trainers/:trainerId/rate': 'Rate trainer'
      },
      ai: {
        'GET /api/ai-suggestions/ai-suggestions': 'Get AI suggestions'
      },
      messaging: {
        'POST /api/messaging/conversations': 'Create conversation',
        'GET /api/messaging/conversations': 'Get conversations',
        'GET /api/messaging/conversations/direct/:userId': 'Get/create direct chat',
        'GET /api/messaging/conversations/:conversationId/messages': 'Get messages',
        'POST /api/messaging/conversations/:conversationId/messages': 'Send message'
      },
      notifications: {
        'GET /api/notifications/notifications': 'Get goal reminders'
      },
      admin: {
        'DELETE /api/admin/users/:userId': 'Delete user',
        'GET /api/admin/statistics': 'Get statistics',
        'GET /api/admin/users': 'Get all users'
      }
    },
    note: 'All endpoints except /health and /api/auth/* require Authorization header with Bearer token'
  };
  res.json(endpoints);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.errors.map(e => e.message) 
    });
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ 
      error: 'Duplicate entry', 
      details: 'A record with this information already exists' 
    });
  }
  
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// 404 handler for all other routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'Please check the API documentation at /api'
  });
});

// Database synchronization and server startup
const startServer = async () => {
  try {
    // Sync database
    await syncDatabase();
    
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log('🚀 Fitness App Backend Server Started!');
      console.log(`📍 Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log('');
      console.log('📋 Available User Types:');
      console.log('   - user (Regular user)');
      console.log('   - trainer (Personal trainer)');
      console.log('   - gym_owner (Gym business owner)');
      console.log('   - admin (System administrator)');
      console.log('');
      console.log('🔒 All endpoints except /health and auth require JWT token in Authorization header');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;