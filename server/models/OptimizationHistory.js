const mongoose = require('mongoose');

const OptimizationHistorySchema = new mongoose.Schema(
  {
    tasks: { type: Array, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OptimizationHistory', OptimizationHistorySchema);
