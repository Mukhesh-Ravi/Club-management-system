const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = [
  'student',              // regular club member
  'vice_president',
  'president',
  'venue_admin',          // faculty who approves venue bookings
  'director',             // Director of Clubs & Chapters - approves budgets/bills
  'faculty_coordinator',  // per-club, above president, can override decisions
  'faculty_mentor'        // faculty who mentors specific students, read-only view
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ROLES, required: true },

    // For student/president/VP: which club they belong to & their position/title
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', default: null },
    position: { type: String, default: '' }, // e.g. "President", "Treasurer", "Member"

    // For faculty_coordinator: club(s) they oversee
    coordinatedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],

    // For faculty_mentor: students assigned to them
    mentees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
