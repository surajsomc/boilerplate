const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { runQuery, getRow } = require('../database/database');
const { validate, authSchemas } = require('../middleware/validation');

const router = express.Router();

// Register new user
router.post('/register', validate(authSchemas.register), async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await getRow(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this username or email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    await runQuery(
      'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
      [userId, username, email, passwordHash]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId, username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        username,
        email
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', validate(authSchemas.login), async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await getRow(
      'SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username/email or password is incorrect'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username/email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Please provide an authentication token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getRow(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'User not found'
      });
    }

    res.json({
      user
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Invalid authentication token'
      });
    }
    next(error);
  }
});

module.exports = router; 