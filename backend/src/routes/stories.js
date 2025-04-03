const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Story = require('../models/Story');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get all stories for the current user
router.get('/', auth, async (req, res) => {
  try {
    const stories = await Story.find({
      $or: [
        { author: req.userId },
        { 'collaborators.user': req.userId }
      ]
    }).populate('author', 'name avatar')
      .populate('collaborators.user', 'name avatar');
    
    res.json(stories);
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new story
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, image, template } = req.body;
    
    const story = new Story({
      title,
      description,
      image,
      template,
      author: req.userId,
      collaborators: []
    });

    await story.save();
    res.status(201).json(story);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single story
router.get('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('collaborators.user', 'name avatar');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user has access to the story
    const hasAccess = story.author._id.toString() === req.userId ||
      story.collaborators.some(c => c.user._id.toString() === req.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(story);
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a story
router.put('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is the author or has editor role
    const isAuthor = story.author.toString() === req.userId;
    const isEditor = story.collaborators.some(
      c => c.user.toString() === req.userId && c.role === 'editor'
    );

    if (!isAuthor && !isEditor) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, content, image } = req.body;
    story.title = title || story.title;
    story.description = description || story.description;
    story.content = content || story.content;
    story.image = image || story.image;

    await story.save();
    res.json(story);
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a story
router.delete('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Only the author can delete the story
    if (story.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await story.remove();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 