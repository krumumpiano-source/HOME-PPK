import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Mock data
let users = [];

/**
 * GET /api/users
 * Get all users
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/users
 * Create new user
 */
router.post('/', (req, res) => {
  try {
    const { name, email, phone, role, unit, status = 'active' } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    const now = new Date();
    const newUser = {
      id: uuidv4(),
      name,
      email,
      phone,
      role: role || 'resident',
      unit,
      status,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    Object.assign(user, req.body, { updatedAt: new Date().toISOString() });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/users/:id
 * Delete user
 */
router.delete('/:id', (req, res) => {
  try {
    const index = users.findIndex(u => u.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const deletedUser = users.splice(index, 1);

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
