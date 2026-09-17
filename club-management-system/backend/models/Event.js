const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // president/VP
    date: { type: Date, required: true },

    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    venueStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    venueDecisionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    venueDecisionNote: { type: String, default: '' },
    venueOverriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed', 'cancelled'],
      default: 'planned'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
