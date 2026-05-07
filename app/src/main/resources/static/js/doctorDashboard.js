// doctorDashboard.js — Doctor dashboard entry point
import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { API_BASE_URL } from "./config/config.js";

const APPT_API = `${API_BASE_URL}/appointments`;

let selectedDate = new Date().toISOString().split('T')[0];
let patientName  = 'null';
let token        = localStorage.getItem('token');

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Guard: doctor only
  const role = localStorage.getItem('userRole');
  if (!token || role !== 'doctor') {
    window.location.href = '/';
    return;
  }

  renderHeader();
  renderFooter();

  const datePicker = document.getElementById('datePicker');
  datePicker.value = selectedDate;

  datePicker.addEventListener('change', e => {
    selectedDate = e.target.value;
    loadAppointments();
  });

  document.getElementById('todayButton').addEventListener('click', () => {
    selectedDate = new Date().toISOString().split('T')[0];
    datePicker.value = selectedDate;
    loadAppointments();
  });

  document.getElementById('searchBar').addEventListener('input', () => {
    const val = document.getElementById('searchBar').value.trim();
    patientName = val || 'null';
    loadAppointments();
  });

  loadAppointments();
});

// ─── Load appointments ─────────────────────────────────────────
async function loadAppointments() {
  const tbody = document.getElementById('patientTableBody');
  tbody.innerHTML = '<tr><td colspan="5" class="loading-text">Loading…</td></tr>';

  try {
    const res = await fetch(`${APPT_API}/${selectedDate}/${patientName}/${token}`);
    const data = await res.json();
    const appointments = data.appointments || data || [];

    if (!appointments.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-text">No appointments for this date.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    appointments.forEach(appt => tbody.appendChild(createAppointmentRow(appt)));
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="5" class="error-text">Error loading appointments.</td></tr>';
    console.error(e);
  }
}

// ─── Row builder ───────────────────────────────────────────────
function createAppointmentRow(appt) {
  const tr = document.createElement('tr');
  const time = appt.appointmentTime
    ? new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  tr.innerHTML = `
    <td>${appt.patient?.name || appt.patientName || '—'}</td>
    <td>${time}</td>
    <td><span class="status-badge status-${(appt.status || 'pending').toLowerCase()}">${appt.status || 'Pending'}</span></td>
    <td>${appt.condition || '—'}</td>
    <td>
      <button class="btn-sm btn-primary" onclick="viewPrescription(${appt.id})">Prescribe</button>
    </td>
  `;
  return tr;
}

window.viewPrescription = function(id) {
  alert(`Prescription for appointment #${id} — coming soon.`);
};
