const express = require('express');
const mongoose = require('mongoose');

// Load env variables from root .env
require('dotenv').config({ path: '../.env' });

const app = express();

// Middleware
app.use(express.json());

// Routes (for now, just a test)
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
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
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });
