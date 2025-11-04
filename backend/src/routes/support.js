const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get user's support tickets
router.get('/my-tickets', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.userId };
    if (status) query.status = status;

    const tickets = await SupportTicket.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await SupportTicket.countDocuments(query);

    res.json({
      tickets,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalTickets: count
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get all support tickets (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, category } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const tickets = await SupportTicket.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await SupportTicket.countDocuments(query);

    res.json({
      tickets,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalTickets: count
    });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get single ticket
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('user', 'name email')
      .populate('messages.sender', 'name')
      .populate('relatedOrder');

    if (!ticket) {
      return res.status(404).json({ error: { message: 'Ticket not found' } });
    }

    // Check if user owns this ticket or is admin
    if (ticket.user._id.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Create support ticket
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subject, category, priority, message, relatedOrder } = req.body;

    if (!subject || !category || !message) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }

    const ticket = new SupportTicket({
      user: req.userId,
      subject,
      category,
      priority: priority || 'medium',
      relatedOrder,
      messages: [{
        sender: req.userId,
        message,
        isAdminResponse: false
      }]
    });

    await ticket.save();
    await ticket.populate('user', 'name email');

    res.status(201).json({ 
      message: 'Support ticket created successfully', 
      ticket 
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Add message to ticket
router.post('/:id/message', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: { message: 'Message is required' } });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: { message: 'Ticket not found' } });
    }

    // Check if user owns this ticket or is admin
    if (ticket.user.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    ticket.messages.push({
      sender: req.userId,
      message,
      isAdminResponse: req.user.role === 'admin'
    });

    if (ticket.status === 'closed' || ticket.status === 'resolved') {
      ticket.status = 'in_progress';
    }

    await ticket.save();
    await ticket.populate('messages.sender', 'name');

    res.json({ message: 'Message added successfully', ticket });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update ticket status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, priority } = req.body;

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status, priority },
      { new: true }
    ).populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ error: { message: 'Ticket not found' } });
    }

    res.json({ message: 'Ticket status updated', ticket });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Close ticket
router.put('/:id/close', authMiddleware, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: { message: 'Ticket not found' } });
    }

    // Check if user owns this ticket or is admin
    if (ticket.user.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    ticket.status = 'closed';
    await ticket.save();

    res.json({ message: 'Ticket closed successfully', ticket });
  } catch (error) {
    console.error('Close ticket error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
