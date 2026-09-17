const User = require('../models/User');
const Attendance = require('../models/Attendance');

// @route GET /api/mentors/mentees
// Faculty mentor sees each mentee's club, position, and participation (events attended / OD count)
exports.getMentees = async (req, res) => {
  try {
    const mentor = await User.findById(req.user._id).populate({
      path: 'mentees',
      select: 'name email club position',
      populate: { path: 'club', select: 'name' }
    });

    if (!mentor || mentor.role !== 'faculty_mentor') {
      return res.status(403).json({ message: 'Only faculty mentors can view mentees' });
    }

    const menteeDetails = await Promise.all(
      mentor.mentees.map(async (student) => {
        const attendanceDocs = await Attendance.find({ 'records.student': student._id }).populate(
          'event',
          'title date'
        );

        const participation = attendanceDocs.map((doc) => {
          const record = doc.records.find((r) => r.student.toString() === student._id.toString());
          return {
            event: doc.event.title,
            date: doc.event.date,
            present: record?.present || false,
            odEligible: record?.odEligible || false
          };
        });

        return {
          studentId: student._id,
          name: student.name,
          email: student.email,
          club: student.club ? student.club.name : null,
          position: student.position,
          eventsAttended: participation.filter((p) => p.present).length,
          odEligibleEvents: participation.filter((p) => p.odEligible).length,
          participation
        };
      })
    );

    return res.json(menteeDetails);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
