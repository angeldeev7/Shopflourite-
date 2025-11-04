const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalUsers: count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get single user (admin only)
router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update user (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, phone, address, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, role, isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Upload avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'No file uploaded' } });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: `/uploads/${req.file.filename}` },
      { new: true }
    );

    res.json({ message: 'Avatar uploaded successfully', user });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Delete user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
