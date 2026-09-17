const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @route POST /api/auth/register
// In production, restrict who can create which roles (e.g. only an admin/director
// creates faculty_coordinator or director accounts). Kept open here for demo/setup.
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, club, position, coordinatedClubs, mentees } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      role,
      club: club || null,
      position: position || '',
      coordinatedClubs: coordinatedClubs || [],
      mentees: mentees || []
    });

    return res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id)
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id)
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @route GET /api/auth/me
exports.me = async (req, res) => {
  return res.json({ user: req.user.toSafeObject() });
};
