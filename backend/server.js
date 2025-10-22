const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./models');
require('dotenv').config({ path: './backend/.env' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/bmi', require('./routes/bmi'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/sleep', require('./routes/sleep'));
app.use('/api/diet', require('./routes/diet'));
app.use('/api/journals', require('./routes/journals'));
app.use('/api/gyms', require('./routes/gyms'));
app.use('/api/trainers', require('./routes/trainers'));
///.use('/api/messages', require('./routes/messages'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/notifications', require('./routes/notifications'));
// Add these routes after existing route imports
app.use('/api/reviews/gym', require('./routes/gymReviews'));
app.use('/api/reviews/trainer', require('./routes/trainerReviews'));
app.use('/api/search', require('./routes/search'));
app.use('/api/admin', require('./routes/admin')); // Renamed from pushNotifications.js for clarity
app.use('/api/ai', require('./routes/aiRecommendations'));

///messages_new
app.use('/api/user-search', require('./routes/userSearch'));
app.use('/api/messages', require('./routes/messages')); // Updated version






// Socket.io for real-time messaging
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user's personal room
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, content } = data;

      // Validate input
      if (!senderId || !receiverId || !content || content.trim() === '') {
        socket.emit('message_error', { error: 'Invalid message data' });
        return;
      }

      // Save message to database
      const message = await db.Message.create({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim()
      });

      // Get message with sender info
      const messageWithSender = await db.Message.findByPk(message.id, {
        include: [
          {
            model: db.User,
            as: 'sender',
            attributes: ['id', 'first_name', 'last_name', 'user_type']
          }
        ]
      });

      // Emit to sender (confirmation)
      socket.emit('message_sent', messageWithSender);

      // Emit to receiver
      io.to(`user_${receiverId}`).emit('new_message', messageWithSender);

      console.log(`Message sent from ${senderId} to ${receiverId}`);

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { senderId, receiverId } = data;
    socket.to(`user_${receiverId}`).emit('user_typing', { senderId, isTyping: true });
  });

  socket.on('typing_stop', (data) => {
    const { senderId, receiverId } = data;
    socket.to(`user_${receiverId}`).emit('user_typing', { senderId, isTyping: false });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});








// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Fitness Connect API is running!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Sync database and start server
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });

module.exports = { app, io };