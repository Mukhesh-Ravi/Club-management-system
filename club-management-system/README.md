# Club Management System

A role-based club management platform where access and actions depend on a user's
position in the club hierarchy.

## Roles & Hierarchy

```
Director of Clubs & Chapters   (approves budgets across all clubs)
        |
Faculty Coordinator            (per-club, ABOVE president, can override any decision)
        |
Venue Administrator (Faculty)  (approves/rejects venue bookings, independent branch)
        |
President  --->  Vice President   (create events, book venues, propose budgets, take attendance)
        |
     Members / Students

Other Faculty (Mentors) — sit outside the club chain, each linked to student "mentees",
                          can view mentee's club, participation and position (read-only).
```

## Core Workflows

1. **Event Creation** — President/VP create an event and request a venue.
2. **Venue Booking Approval** — Venue Administrator (faculty) approves/rejects the request.
   Faculty Coordinator can override the decision either way.
3. **Attendance / OD** — President/VP take attendance during the event. Present students
   automatically become eligible for "On Duty" (OD) certificates for that event.
4. **Budget Proposal & Approval** — President/VP propose a budget for an event. The
   Director of Clubs & Chapters approves/rejects it. Faculty Coordinator can override.
5. **Bills & Reimbursement** — After the event, bills are submitted against an approved
   budget. Once the Director (or overriding Faculty Coordinator) approves the bills,
   the amount is marked as released to the club account.
6. **Mentor View** — Faculty mentors log in and see only their assigned mentees: which
   club each is in, their position, and participation/attendance history.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt
- **Frontend:** Plain HTML/CSS/JS (easy to swap for React later) — talks to the REST API

## Project Structure

```
club-management-system/
├── backend/
│   ├── config/db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Club.js
│   │   ├── Venue.js
│   │   ├── Event.js
│   │   ├── Attendance.js
│   │   ├── Budget.js
│   │   └── Bill.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roles.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clubController.js
│   │   ├── eventController.js
│   │   ├── venueController.js
│   │   ├── attendanceController.js
│   │   ├── budgetController.js
│   │   └── mentorController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── clubRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── venueRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── mentorRoutes.js
│   ├── utils/generateToken.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── pages/ (login.html, dashboard.html)
│   ├── css/style.css
│   └── js/ (api.js, login.js, dashboard.js)
├── .gitignore
└── README.md
```

## Setup

```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # starts on http://localhost:5000
```

Open `frontend/pages/login.html` in a browser (or serve it with any static server)
and point it at the backend URL in `frontend/js/api.js`.

## Roles (enum values used in the User model)

| Role                        | Key Permissions                                                   |
|-----------------------------|---------------------------------------------------------------------|
| `student`                   | View own club, participation, attendance/OD status                  |
| `vice_president`            | Create events, request venue, take attendance, propose budget       |
| `president`                 | Same as VP + manage club members                                    |
| `venue_admin`               | Approve/reject venue booking requests                                |
| `director`                  | Approve/reject budgets, approve bills for payout                    |
| `faculty_coordinator`       | Override any decision for their assigned club(s)                    |
| `faculty_mentor`            | Read-only view of assigned mentees' club/participation/position     |

## API Overview

- `POST /api/auth/register` / `POST /api/auth/login`
- `GET/POST /api/clubs`
- `POST /api/events` , `PATCH /api/events/:id/status`
- `POST /api/venues/request` , `PATCH /api/venues/:id/decision`
- `POST /api/attendance/:eventId/mark` , `GET /api/attendance/:eventId`
- `POST /api/budgets` , `PATCH /api/budgets/:id/decision`
- `POST /api/budgets/:id/bills` , `PATCH /api/budgets/:id/bills/:billId/decision`
- `GET /api/mentors/mentees`

See controller files for full request/response shapes.
