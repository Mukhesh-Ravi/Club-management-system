const express = require('express');
const router = express.Router();
const { createClub, listClubs, getClub } = require('../controllers/clubController');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');

router.get('/', protect, listClubs);
router.get('/:id', protect, getClub);
router.post('/', protect, allowRoles('director'), createClub);

module.exports = router;
