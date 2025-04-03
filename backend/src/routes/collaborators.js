const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Story = require('../models/Story');
const User = require('../models/User');

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

// Add a collaborator to a story
router.post('/:storyId', auth, async (req, res) => {
  try {
    const { email, role } = req.body;
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is the author
    if (story.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the author can add collaborators' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a collaborator
    const isAlreadyCollaborator = story.collaborators.some(
      c => c.user.toString() === user._id.toString()
    );

    if (isAlreadyCollaborator) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    // Add collaborator
    story.collaborators.push({
      user: user._id,
      role,
      status: 'pending'
    });

    await story.save();
    res.json(story);
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update collaborator role
router.put('/:storyId/:userId', auth, async (req, res) => {
  try {
    const { role } = req.body;
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is the author
    if (story.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the author can update collaborator roles' });
    }

    const collaborator = story.collaborators.find(
      c => c.user.toString() === req.params.userId
    );

    if (!collaborator) {
      return res.status(404).json({ message: 'Collaborator not found' });
    }

    collaborator.role = role;
    await story.save();
    res.json(story);
  } catch (error) {
    console.error('Update collaborator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a collaborator
router.delete('/:storyId/:userId', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user is the author
    if (story.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the author can remove collaborators' });
    }

    story.collaborators = story.collaborators.filter(
      c => c.user.toString() !== req.params.userId
    );

    await story.save();
    res.json(story);
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept collaboration invitation
router.post('/:storyId/accept', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const collaborator = story.collaborators.find(
      c => c.user.toString() === req.userId
    );

    if (!collaborator) {
      return res.status(404).json({ message: 'Collaboration invitation not found' });
    }

    if (collaborator.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation has already been responded to' });
    }

    collaborator.status = 'accepted';
    await story.save();
    res.json(story);
  } catch (error) {
    console.error('Accept collaboration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject collaboration invitation
router.post('/:storyId/reject', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const collaborator = story.collaborators.find(
      c => c.user.toString() === req.userId
    );

    if (!collaborator) {
      return res.status(404).json({ message: 'Collaboration invitation not found' });
    }

    if (collaborator.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation has already been responded to' });
    }

    collaborator.status = 'rejected';
    await story.save();
    res.json(story);
  } catch (error) {
    console.error('Reject collaboration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 