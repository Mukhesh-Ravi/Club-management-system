const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getStudentOD
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');

router.post('/:eventId/mark', protect, allowRoles('president', 'vice_president'), markAttendance);
router.get('/:eventId', protect, getAttendance);
router.get('/student/:studentId/od', protect, getStudentOD);

module.exports = router;
