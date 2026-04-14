const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes'); // Add this
const childRoutes = require('./routes/childRoutes');
const storyRoutes = require('./routes/storyRoutes'); // 1. Import it

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Register the auth routes

app.get('/', (req, res) => {
  res.json({ message: "Welcome to Yuyu Ai API" });
});

app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes); // Add this
app.use('/api/stories', storyRoutes); // 2. Use it

module.exports = app;