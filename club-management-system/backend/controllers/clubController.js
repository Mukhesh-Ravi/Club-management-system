const Club = require('../models/Club');

// @route POST /api/clubs  (director/admin sets up a new club)
exports.createClub = async (req, res) => {
  try {
    const { name, description, president, vicePresident, facultyCoordinator } = req.body;
    const club = await Club.create({ name, description, president, vicePresident, facultyCoordinator });
    return res.status(201).json(club);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @route GET /api/clubs
exports.listClubs = async (req, res) => {
  const clubs = await Club.find()
    .populate('president vicePresident facultyCoordinator', 'name email role')
    .populate('members', 'name email position');
  return res.json(clubs);
};

// @route GET /api/clubs/:id
exports.getClub = async (req, res) => {
  const club = await Club.findById(req.params.id)
    .populate('president vicePresident facultyCoordinator', 'name email role')
    .populate('members', 'name email position');
  if (!club) return res.status(404).json({ message: 'Club not found' });
  return res.json(club);
};
