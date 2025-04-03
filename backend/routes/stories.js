const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const auth = require('../middleware/auth');

// Create a new story
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const story = new Story({
      title,
      content,
      author: req.user.id,
      collaborators: [req.user.id]
    });
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a story
router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is author or collaborator
    if (!story.author.equals(req.user.id) && !story.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to edit this story' });
    }

    story.content = content;
    story.lastModified = Date.now();
    await story.save();
    
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all stories for a user
router.get('/', auth, async (req, res) => {
  try {
    const stories = await Story.find({
      $or: [
        { author: req.user.id },
        { collaborators: req.user.id }
      ]
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single story
router.get('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 