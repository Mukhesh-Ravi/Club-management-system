const user = JSON.parse(localStorage.getItem('cms_user') || 'null');
if (!user) window.location.href = 'login.html';

document.getElementById('welcome').textContent = `${user.name} — ${user.role.replace('_', ' ')}`;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

const content = document.getElementById('content');

function section(title, html) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `<h2>${title}</h2>${html}`;
  content.appendChild(div);
}

async function renderStudent() {
  section('My Profile', `<p>Club: ${user.club || 'N/A'}</p><p>Position: ${user.position || 'Member'}</p>`);
}

async function renderClubLeader() {
  // President / Vice President
  try {
    const events = await apiRequest(`/events?club=${user.club}`);
    const rows = events
      .map(
        (e) =>
          `<tr><td>${e.title}</td><td>${new Date(e.date).toLocaleDateString()}</td>
           <td>${e.venue?.name || ''}</td><td>${e.venueStatus}</td><td>${e.status}</td></tr>`
      )
      .join('');
    section(
      'My Club Events',
      `<table><tr><th>Title</th><th>Date</th><th>Venue</th><th>Venue Status</th><th>Status</th></tr>${rows}</table>
       <p class="hint">Use the API to create events, request venues, take attendance, and propose budgets.</p>`
    );
  } catch (err) {
    section('My Club Events', `<p class="error">${err.message}</p>`);
  }
}

async function renderVenueAdmin() {
  try {
    const pending = await apiRequest('/venues/requests/pending');
    const rows = pending
      .map(
        (e) =>
          `<tr><td>${e.title}</td><td>${e.club?.name}</td><td>${e.venue?.name}</td>
           <td>${e.createdBy?.name}</td></tr>`
      )
      .join('');
    section(
      'Pending Venue Requests',
      `<table><tr><th>Event</th><th>Club</th><th>Venue</th><th>Requested By</th></tr>${rows}</table>`
    );
  } catch (err) {
    section('Pending Venue Requests', `<p class="error">${err.message}</p>`);
  }
}

async function renderDirector() {
  try {
    const budgets = await apiRequest('/budgets?status=pending');
    const rows = budgets
      .map(
        (b) =>
          `<tr><td>${b.club?.name}</td><td>${b.event?.title}</td><td>${b.proposedAmount}</td>
           <td>${b.proposedBy?.name}</td></tr>`
      )
      .join('');
    section(
      'Pending Budget Approvals',
      `<table><tr><th>Club</th><th>Event</th><th>Amount</th><th>Proposed By</th></tr>${rows}</table>`
    );
  } catch (err) {
    section('Pending Budget Approvals', `<p class="error">${err.message}</p>`);
  }
}

async function renderFacultyCoordinator() {
  section(
    'Coordinator Overview',
    `<p>You oversee your assigned club(s) and can override venue, budget, or bill decisions
     made by the Venue Administrator or Director for those clubs via the API's
     <code>decision</code> endpoints.</p>`
  );
}

async function renderMentor() {
  try {
    const mentees = await apiRequest('/mentors/mentees');
    const rows = mentees
      .map(
        (m) =>
          `<tr><td>${m.name}</td><td>${m.club || '—'}</td><td>${m.position || '—'}</td>
           <td>${m.eventsAttended}</td><td>${m.odEligibleEvents}</td></tr>`
      )
      .join('');
    section(
      'My Mentees',
      `<table><tr><th>Name</th><th>Club</th><th>Position</th><th>Events Attended</th><th>OD Eligible</th></tr>${rows}</table>`
    );
  } catch (err) {
    section('My Mentees', `<p class="error">${err.message}</p>`);
  }
}

(async function init() {
  switch (user.role) {
    case 'student':
      await renderStudent();
      break;
    case 'president':
    case 'vice_president':
      await renderClubLeader();
      break;
    case 'venue_admin':
      await renderVenueAdmin();
      break;
    case 'director':
      await renderDirector();
      break;
    case 'faculty_coordinator':
      await renderFacultyCoordinator();
      break;
    case 'faculty_mentor':
      await renderMentor();
      break;
    default:
      section('Dashboard', '<p>No view configured for this role.</p>');
  }
})();
