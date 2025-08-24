const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: { type: Date, required: true },
  importance: { type: Number, min: 1, max: 10, required: true },
  status: { type: String, enum: ['pending', 'done'], default: 'pending' },
});

module.exports = mongoose.model('Task', TaskSchema);
