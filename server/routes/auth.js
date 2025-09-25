const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Registration attempt:', { username, email }); // Log registration attempt

    // Validation
    if (!username || !email || !password) {
      console.log('Registration failed: Missing fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Registration failed: Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      console.log('Registration failed: Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Validate username
    if (username.length < 3 || username.length > 30) {
      console.log('Registration failed: Invalid username length');
      return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
    }

    // Normalize email and username
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername }
      ]
    });

    if (existingUser) {
      const error = existingUser.email === normalizedEmail ? 
        'Email already registered' : 
        'Username already taken';
      console.log('Registration failed:', error);
      return res.status(400).json({ error });
    }

    // Create user
    const user = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      isOnline: true,
      lastSeen: new Date()
    });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email); // Debug log

    // Basic validation
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('Login failed: No user found with email:', normalizedEmail);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('Login failed: Invalid password for email:', normalizedEmail);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Password comparison error:', error);
      return res.status(500).json({ error: 'An error occurred during login' });
    }

    // Update online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        isOnline: req.user.isOnline,
        lastSeen: req.user.lastSeen
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Update user offline status
    await User.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date(),
      socketId: null
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
});

module.exports = router;
