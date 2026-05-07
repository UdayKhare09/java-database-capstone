// patientDashboard.js — Patient dashboard entry point
import { openModal, closeModal } from "./components/modals.js";
import { renderHeader }          from "./components/header.js";
import { renderFooter }          from "./components/footer.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { createDoctorCard }      from "./components/doctorCard.js";

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  loadDoctorCards();

  document.getElementById('searchBar')
    .addEventListener('input', filterDoctorsOnChange);
  document.getElementById('filterTime')
    .addEventListener('change', filterDoctorsOnChange);
  document.getElementById('filterSpecialty')
    .addEventListener('change', filterDoctorsOnChange);
});

// ─── Load all doctors ──────────────────────────────────────────
async function loadDoctorCards() {
  const grid = document.getElementById('content');
  grid.innerHTML = '<p class="loading-text">Loading doctors…</p>';
  try {
    const doctors = await getDoctors();
    renderCards(doctors);
  } catch (e) {
    grid.innerHTML = '<p class="error-text">Failed to load doctors.</p>';
  }
}

function renderCards(doctors) {
  const grid = document.getElementById('content');
  grid.innerHTML = '';
  if (!doctors || doctors.length === 0) {
    grid.innerHTML = '<p class="empty-text">No doctors found.</p>';
    return;
  }
  doctors.forEach(doc => grid.appendChild(createDoctorCard(doc)));
}

// ─── Filter ───────────────────────────────────────────────────
async function filterDoctorsOnChange() {
  const name      = document.getElementById('searchBar').value.trim() || 'null';
  const time      = document.getElementById('filterTime').value       || 'null';
  const specialty = document.getElementById('filterSpecialty').value  || 'null';
  try {
    const doctors = await filterDoctors(name, time, specialty);
    renderCards(doctors);
  } catch (e) {
    console.error('Filter error:', e);
  }
}
