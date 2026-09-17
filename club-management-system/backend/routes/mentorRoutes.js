const express = require('express');
const router = express.Router();
const { getMentees } = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');

router.get('/mentees', protect, allowRoles('faculty_mentor'), getMentees);

module.exports = router;
