const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.',
      });
    }

    const [rows] = await pool.query(
      `SELECT id, name, email, password_hash, role, is_active
       FROM users
       WHERE email = ?`,
      [email]
    );

    const user = rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: 'Invalid credentials.',
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        error: 'Invalid credentials.',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
      }
    );

    await pool.query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    return res.status(500).json({
      error: 'Login failed.',
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/register
// Only an operator can create user/operator accounts.
router.post(
  '/register',
  authenticate,
  requireRole('operator'),
  async (req, res) => {
    try {
      const name = req.body.name?.trim();
      const email = req.body.email?.trim().toLowerCase();
      const { password, role } = req.body;

      if (
        !name ||
        !email ||
        !password ||
        !['user', 'operator'].includes(role)
      ) {
        return res.status(400).json({
          error:
            'name, email, password, and a valid role are required.',
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          error: 'Password must contain at least 8 characters.',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        `INSERT INTO users
          (name, email, password_hash, role)
         VALUES (?, ?, ?, ?)
         RETURNING id, name, email, role`,
        [name, email, passwordHash, role]
      );

      const createdUser = result.rows[0];

      return res.status(201).json(createdUser);
    } catch (err) {
      // PostgreSQL unique-constraint violation
      if (err.code === '23505') {
        return res.status(409).json({
          error: 'A user with this email already exists.',
        });
      }

      console.error('[Auth] Registration error:', err);

      return res.status(500).json({
        error: 'Registration failed.',
      });
    }
  }
);
module.exports = router;