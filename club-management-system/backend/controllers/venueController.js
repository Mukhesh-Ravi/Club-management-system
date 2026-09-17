const Event = require('../models/Event');
const Venue = require('../models/Venue');

// @route GET /api/venues
exports.listVenues = async (req, res) => {
  const venues = await Venue.find();
  return res.json(venues);
};

// @route POST /api/venues  (venue_admin/director sets up available venues)
exports.createVenue = async (req, res) => {
  const venue = await Venue.create(req.body);
  return res.status(201).json(venue);
};

// @route GET /api/venues/requests/pending
// Venue administrator's queue of pending booking requests
exports.pendingRequests = async (req, res) => {
  const events = await Event.find({ venueStatus: 'pending' })
    .populate('club', 'name')
    .populate('venue', 'name location')
    .populate('createdBy', 'name role');
  return res.json(events);
};

// @route PATCH /api/venues/:eventId/decision
// body: { decision: 'approved' | 'rejected', note }
// Allowed for: venue_admin (the designated approver) OR the club's faculty_coordinator
// (override — coordinator sits above the president and can overturn any decision).
exports.decideVenueRequest = async (req, res) => {
  try {
    const { decision, note } = req.body;
    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ message: 'decision must be approved or rejected' });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isVenueAdmin = req.user.role === 'venue_admin';
    const isOverridingCoordinator =
      req.user.role === 'faculty_coordinator' &&
      req.user.coordinatedClubs.some((c) => c.toString() === event.club.toString());

    if (!isVenueAdmin && !isOverridingCoordinator) {
      return res.status(403).json({ message: 'Not authorized to decide on this venue request' });
    }

    event.venueStatus = decision;
    event.venueDecisionNote = note || '';
    event.venueDecisionBy = req.user._id;
    if (isOverridingCoordinator) {
      event.venueOverriddenBy = req.user._id;
    }

    await event.save();
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
