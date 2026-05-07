// index.js — single module entry point
// All imports flow from here; window.selectRole and login handlers are set below.

import { openModal, closeModal } from "../components/modals.js";
import { ENDPOINTS }             from "../config/config.js";
import { selectRole }            from "../render.js";          // also sets window.selectRole
import { renderHeader }          from "../components/header.js";
import { renderFooter }          from "../components/footer.js";

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});


// ─── Helper ───────────────────────────────────────────────────

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) { el.textContent = message; el.style.display = 'block'; }
}

function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = loading;
}

// ─── Admin Login ──────────────────────────────────────────────

window.adminLoginHandler = async function () {
  const username = document.getElementById('adminUsername')?.value?.trim();
  const password = document.getElementById('adminPassword')?.value;

  hideError('adminError');

  if (!username || !password) {
    showError('adminError', 'Please enter both username and password.');
    return;
  }

  setLoading('adminLoginBtn', true);

  try {
    const res = await fetch(ENDPOINTS.adminLogin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', 'admin');
      closeModal();
      window.location.href = '/pages/adminDashboard.html';
    } else {
      showError('adminError', data.message || 'Invalid credentials.');
    }
  } catch (err) {
    console.error('Admin login error:', err);
    showError('adminError', 'Server error. Please try again.');
  } finally {
    setLoading('adminLoginBtn', false);
  }
};

// ─── Doctor Login ─────────────────────────────────────────────

window.doctorLoginHandler = async function () {
  const email    = document.getElementById('doctorEmail')?.value?.trim();
  const password = document.getElementById('doctorPassword')?.value;

  hideError('doctorError');

  if (!email || !password) {
    showError('doctorError', 'Please enter both email and password.');
    return;
  }

  setLoading('doctorLoginBtn', true);

  try {
    const res = await fetch(ENDPOINTS.doctorLogin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', 'doctor');
      closeModal();
      window.location.href = '/pages/doctorDashboard.html';
    } else {
      showError('doctorError', data.message || 'Invalid credentials.');
    }
  } catch (err) {
    console.error('Doctor login error:', err);
    showError('doctorError', 'Server error. Please try again.');
  } finally {
    setLoading('doctorLoginBtn', false);
  }
};

// ─── Patient Login ────────────────────────────────────────────

window.patientLoginHandler = async function () {
  const email    = document.getElementById('patientEmail')?.value?.trim();
  const password = document.getElementById('patientPassword')?.value;

  hideError('patientLoginError');

  if (!email || !password) {
    showError('patientLoginError', 'Please enter both email and password.');
    return;
  }

  setLoading('patientLoginBtn', true);

  try {
    const res = await fetch(ENDPOINTS.patientLogin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', 'loggedPatient');
      closeModal();
      window.location.href = '/pages/patientDashboard.html';
    } else {
      showError('patientLoginError', data.message || 'Invalid credentials.');
    }
  } catch (err) {
    console.error('Patient login error:', err);
    showError('patientLoginError', 'Server error. Please try again.');
  } finally {
    setLoading('patientLoginBtn', false);
  }
};

// ─── Patient Signup ───────────────────────────────────────────

window.patientSignupHandler = async function () {
  const name     = document.getElementById('signupName')?.value?.trim();
  const email    = document.getElementById('signupEmail')?.value?.trim();
  const password = document.getElementById('signupPassword')?.value;
  const phone    = document.getElementById('signupPhone')?.value?.trim();
  const address  = document.getElementById('signupAddress')?.value?.trim();

  hideError('patientSignupError');

  if (!name || !email || !password || !phone || !address) {
    showError('patientSignupError', 'All fields are required.');
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    showError('patientSignupError', 'Phone must be exactly 10 digits.');
    return;
  }
  if (password.length < 6) {
    showError('patientSignupError', 'Password must be at least 6 characters.');
    return;
  }

  setLoading('patientSignupBtn', true);

  try {
    const res = await fetch(ENDPOINTS.patientSignup, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, address }),
    });

    const data = await res.json();

    if (res.ok) {
      // Switch to login tab after successful signup
      if (typeof window.switchPatientTab === 'function') {
        window.switchPatientTab('login');
      }
      showError('patientLoginError', '✅ Account created! Please log in.');
    } else if (res.status === 409) {
      showError('patientSignupError', 'Email or phone already registered.');
    } else {
      showError('patientSignupError', data.error || 'Signup failed. Try again.');
    }
  } catch (err) {
    console.error('Patient signup error:', err);
    showError('patientSignupError', 'Server error. Please try again.');
  } finally {
    setLoading('patientSignupBtn', false);
  }
};
