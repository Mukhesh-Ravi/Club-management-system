const Event = require('../models/Event');
const { isClubLeader } = require('../middleware/roles');

// @route POST /api/events
// Only the President/VP of a club can create an event for that club, and it
// immediately creates a pending venue booking request.
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, club } = req.body;

    if (!isClubLeader(req.user, club)) {
      return res.status(403).json({ message: 'Only the President/VP of this club can create events' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      club,
      createdBy: req.user._id,
      venueStatus: 'pending'
    });

    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// @route GET /api/events
exports.listEvents = async (req, res) => {
  const filter = req.query.club ? { club: req.query.club } : {};
  const events = await Event.find(filter)
    .populate('club', 'name')
    .populate('venue', 'name location')
    .populate('createdBy', 'name role')
    .sort('-date');
  return res.json(events);
};

// @route GET /api/events/:id
exports.getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('club', 'name')
    .populate('venue', 'name location')
    .populate('createdBy', 'name role');
  if (!event) return res.status(404).json({ message: 'Event not found' });
  return res.json(event);
};

// @route PATCH /api/events/:id/status
// President/VP of the club (or the coordinator) updates event lifecycle status
exports.updateEventStatus = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const allowed =
    isClubLeader(req.user, event.club) ||
    (req.user.role === 'faculty_coordinator' &&
      req.user.coordinatedClubs.some((c) => c.toString() === event.club.toString()));

  if (!allowed) return res.status(403).json({ message: 'Not authorized to update this event' });

  event.status = req.body.status;
  await event.save();
  return res.json(event);
};
