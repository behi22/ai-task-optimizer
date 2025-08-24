const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET last 5 tasks (sorted by createdAt)
router.get('/latest', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }).limit(5);
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET search tasks (by title or description)
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const tasks = await Task.find({
      $or: [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
      ],
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// PUT - update task (status, etc.)
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
