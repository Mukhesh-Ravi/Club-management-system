const express = require('express');
const router = express.Router();
const { createEvent, listEvents, getEvent, updateEventStatus } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');

router.get('/', protect, listEvents);
router.get('/:id', protect, getEvent);
router.post('/', protect, allowRoles('president', 'vice_president'), createEvent);
router.patch('/:id/status', protect, allowRoles('president', 'vice_president', 'faculty_coordinator'), updateEventStatus);

module.exports = router;
