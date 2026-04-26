const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes'); 
const childRoutes = require('./routes/childRoutes');
const storyRoutes = require('./routes/storyRoutes'); 

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => {
  res.json({ message: "Welcome to Yuyu Ai API" });
});

app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes); 
app.use('/api/stories', storyRoutes); 

module.exports = app;