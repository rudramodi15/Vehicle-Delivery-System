const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

/**
 * Handle new user registration
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingAccount = await User.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const userPayload = newUser.toObject();
    delete userPayload.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userPayload,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Handle user authentication & JWT sign
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userAccount = await User.findOne({ email }).select('+password');
    if (!userAccount) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, userAccount.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { id: userAccount._id, email: userAccount.email, role: userAccount.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userPayload = userAccount.toObject();
    delete userPayload.password;

    res.status(200).json({
      token: accessToken,
      user: userPayload,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
