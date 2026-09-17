const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const { isClubLeader } = require('../middleware/roles');

// @route POST /api/attendance/:eventId/mark
// body: { records: [{ student, present }] }
// Only President/VP of the event's club can take attendance, and only once the
// venue has been approved (event is actually happening).
exports.markAttendance = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (!isClubLeader(req.user, event.club)) {
      return res.status(403).json({ message: 'Only the President/VP can take attendance' });
    }
    if (event.venueStatus !== 'approved') {
      return res.status(400).json({ message: 'Venue not approved yet; cannot take attendance' });
    }

    const { records } = req.body; // [{ student, present }]
    const formatted = records.map((r) => ({
      student: r.student,
      present: !!r.present,
      odEligible: !!r.present // presence during the event grants OD eligibility
    }));

    const attendance = await Attendance.findOneAndUpdate(
      { event: event._id },
      { event: event._id, takenBy: req.user._id, records: formatted },
      { upsert: true, new: true }
    );

    return res.json(attendance);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @route GET /api/attendance/:eventId
exports.getAttendance = async (req, res) => {
  const attendance = await Attendance.findOne({ event: req.params.eventId })
    .populate('records.student', 'name email position')
    .populate('takenBy', 'name role');
  if (!attendance) return res.status(404).json({ message: 'No attendance recorded yet' });
  return res.json(attendance);
};

// @route GET /api/attendance/student/:studentId/od
// A student (or their mentor) can check accumulated OD-eligible events
exports.getStudentOD = async (req, res) => {
  const records = await Attendance.find({ 'records.student': req.params.studentId })
    .populate('event', 'title date')
    .select('event records.$');
  return res.json(records);
};
