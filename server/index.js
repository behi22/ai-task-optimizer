const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Import routes and models
const tasksRoute = require('./routes/tasks');
const Task = require('./models/Task');
const OptimizationHistory = require('./models/OptimizationHistory');

app.use('/tasks', tasksRoute);

app.get('/', (req, res) => res.send('Server running and connected to MongoDB!'));

// Optimize endpoint
app.post('/optimize', async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: 'completed' } });

    // Call AI optimizer service
    const response = await axios.post('http://localhost:8000/optimize', tasks);

    const optimizedData = response.data.optimized || [];

    // Save result to DB
    await OptimizationHistory.create({ tasks: optimizedData });

    res.json({ optimized: optimizedData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Optimizer service failed');
  }
});

// Fetch last optimizer result
app.get('/optimize/last', async (req, res) => {
  try {
    const lastOpt = await OptimizationHistory.findOne().sort({ createdAt: -1 });
    if (!lastOpt) return res.json({ optimized: [] });
    res.json({ optimized: lastOpt.tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch last optimization');
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection failed:', err.message));
