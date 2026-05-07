// adminDashboard.js — Admin dashboard entry point
import { openModal, closeModal } from "./components/modals.js";
import { renderHeader }          from "./components/header.js";
import { renderFooter }          from "./components/footer.js";
import { getDoctors, filterDoctors, saveDoctor, deleteDoctor } from "./services/doctorServices.js";
import { createDoctorCard }      from "./components/doctorCard.js";

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Guard: admin only
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('userRole');
  if (!token || role !== 'admin') {
    window.location.href = '/';
    return;
  }

  renderHeader();
  renderFooter();
  loadDoctorCards();

  // Controls
  document.getElementById('addDocBtn')
    .addEventListener('click', () => openModal('addDoctor'));
  document.getElementById('searchBar')
    .addEventListener('input', filterDoctorsOnChange);
  document.getElementById('filterTime')
    .addEventListener('change', filterDoctorsOnChange);
  document.getElementById('filterSpecialty')
    .addEventListener('change', filterDoctorsOnChange);
});

// ─── Load doctors ──────────────────────────────────────────────
async function loadDoctorCards() {
  const grid = document.getElementById('content');
  grid.innerHTML = '<p class="loading-text">Loading doctors…</p>';
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (e) {
    grid.innerHTML = '<p class="error-text">Failed to load doctors.</p>';
  }
}

function renderDoctorCards(doctors) {
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
    renderDoctorCards(doctors);
  } catch (e) {
    console.error('Filter error:', e);
  }
}

// ─── Add Doctor (called from modal button onclick) ────────────
window.adminAddDoctor = async function () {
  const name      = document.getElementById('doctorName')?.value.trim();
  const email     = document.getElementById('newDoctorEmail')?.value.trim();
  const password  = document.getElementById('newDoctorPassword')?.value.trim();
  const phone     = document.getElementById('doctorPhone')?.value.trim();
  const specialty = document.getElementById('doctorSpecialty')?.value.trim();
  const checkboxes = document.querySelectorAll("input[name='availability']:checked");
  const availableTimes = Array.from(checkboxes).map(cb => cb.value);

  const token = localStorage.getItem('token');

  // Client-side validation
  const errors = [];
  if (!name || name.length < 3)         errors.push('Name must be at least 3 characters.');
  if (!email || !email.includes('@'))   errors.push('Valid email is required.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
  if (!phone || !/^\d{10}$/.test(phone)) errors.push('Phone must be exactly 10 digits (no spaces or dashes).');
  if (!specialty || specialty.length < 3) errors.push('Specialty must be at least 3 characters.');

  if (errors.length) {
    alert(errors.join('\n'));
    return;
  }

  const result = await saveDoctor({ name, email, password, phone, specialty, availableTimes }, token);
  if (result.success) {
    closeModal();
    loadDoctorCards();
  } else {
    alert('Failed to add doctor: ' + (result.message || 'Unknown error'));
  }
};
