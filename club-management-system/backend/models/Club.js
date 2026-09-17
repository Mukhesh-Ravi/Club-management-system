const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    president: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    vicePresident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    facultyCoordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    accountBalance: { type: Number, default: 0 } // money released after approved bills lands here
  },
  { timestamps: true }
);

module.exports = mongoose.model('Club', clubSchema);
