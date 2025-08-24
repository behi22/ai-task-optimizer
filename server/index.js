const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: 'http://localhost:3000', // frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Import tasks route
const tasksRoute = require('./routes/tasks');
app.use('/tasks', tasksRoute);

// Test route
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
});

// Optimize endpoint (AI service)
const Task = require('./models/Task');
app.post('/optimize', async (req, res) => {
  try {
    const tasks = await Task.find();
    const response = await axios.post('http://localhost:8000/optimize', tasks);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Optimizer service failed');
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });
