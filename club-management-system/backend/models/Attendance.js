const mongoose = require('mongoose');

// One document per event; records list holds each student's presence
const attendanceSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, unique: true },
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // president/VP
    records: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        present: { type: Boolean, default: false },
        odEligible: { type: Boolean, default: false } // auto-set true when present
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
