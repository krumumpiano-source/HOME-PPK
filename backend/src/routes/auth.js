import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Mock data storage (replace with database)
let users = [
  {
    id: '1',
    email: 'pongsatorn.b@ppk.ac.th',
    password: 'ppk2569',
    name: 'พงศธร',
    surname: 'โพธิแก้ว',
    Title: 'ครู',
    Name: 'พงศธร',
    Surname: 'โพธิแก้ว',
    role: 'admin',
    status: 'active',
    createdAt: new Date()
  },
  {
    id: '2',
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Admin',
    Title: '',
    Name: 'Admin',
    Surname: 'User',
    role: 'admin',
    status: 'active',
    createdAt: new Date()
  },
  {
    id: '3',
    email: 'resident@test.com',
    password: 'resident123',
    name: 'Resident User',
    Title: '',
    Name: 'Resident',
    Surname: 'User',
    role: 'resident',
    status: 'active',
    createdAt: new Date()
  }
];
let sessions = {};

/**
 * POST /api/auth/login
 * Authenticate user
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Mock authentication (replace with database lookup)
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Create session
    const token = uuidv4();
    sessions[token] = {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          Title: user.Title || '',
          Name: user.Name || user.name,
          Surname: user.Surname || '',
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout and invalidate token
 */
router.post('/logout', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token && sessions[token]) {
      delete sessions[token];
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', (req, res) => {
  try {
    const { email, password, name, role = 'resident' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Create user
    const newUser = {
      id: uuidv4(),
      email,
      password, // In production, hash the password
      name,
      role,
      createdAt: new Date(),
      status: 'active'
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify token
 */
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || !sessions[token]) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    const session = sessions[token];
    const user = users.find(u => u.id === session.userId);

    res.json({
      success: true,
      data: {
        isValid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
