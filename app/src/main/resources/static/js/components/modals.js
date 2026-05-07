// modals.js — modal rendering and control

function getAdminLoginForm() {
  return `
    <h3>Admin Login</h3>
    <div class="form-group">
      <label>Username</label>
      <input type="text" id="adminUsername" placeholder="Enter username" autocomplete="username" />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" id="adminPassword" placeholder="Enter password" autocomplete="current-password" />
    </div>
    <p id="adminError" class="form-error" style="display:none;"></p>
    <button id="adminLoginBtn" onclick="adminLoginHandler()">Login</button>
  `;
}

function getAddDoctorForm() {
  return `
    <h3>Add Doctor</h3>
    <div class="form-group">
      <label>Full Name</label>
      <input type="text" id="doctorName" placeholder="Dr. Full Name" />
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="newDoctorEmail" placeholder="doctor@example.com" />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" id="newDoctorPassword" placeholder="Min 6 characters" />
    </div>
    <div class="form-group">
      <label>Phone (10 digits)</label>
      <input type="tel" id="doctorPhone" placeholder="10-digit phone number" />
    </div>
    <div class="form-group">
      <label>Specialty</label>
      <input type="text" id="doctorSpecialty" placeholder="e.g. Cardiology" />
    </div>
    <div class="form-group">
      <label>Available Times</label>
      <div class="availability-grid">
        <label><input type="checkbox" name="availability" value="09:00 AM" /> 09:00 AM</label>
        <label><input type="checkbox" name="availability" value="10:00 AM" /> 10:00 AM</label>
        <label><input type="checkbox" name="availability" value="11:00 AM" /> 11:00 AM</label>
        <label><input type="checkbox" name="availability" value="12:00 PM" /> 12:00 PM</label>
        <label><input type="checkbox" name="availability" value="01:00 PM" /> 01:00 PM</label>
        <label><input type="checkbox" name="availability" value="02:00 PM" /> 02:00 PM</label>
        <label><input type="checkbox" name="availability" value="03:00 PM" /> 03:00 PM</label>
        <label><input type="checkbox" name="availability" value="04:00 PM" /> 04:00 PM</label>
        <label><input type="checkbox" name="availability" value="05:00 PM" /> 05:00 PM</label>
      </div>
    </div>
    <button id="addDoctorSubmitBtn" onclick="adminAddDoctor()">Add Doctor</button>
  `;
}

function getDoctorLoginForm() {
  return `
    <h3>Doctor Login</h3>
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="doctorEmail" placeholder="Enter email" autocomplete="email" />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" id="doctorPassword" placeholder="Enter password" autocomplete="current-password" />
    </div>
    <p id="doctorError" class="form-error" style="display:none;"></p>
    <button id="doctorLoginBtn" onclick="doctorLoginHandler()">Login</button>
  `;
}

function getPatientForm() {
  return `
    <h3>Patient Portal</h3>
    <div class="tab-buttons">
      <button id="tabLogin" class="tab-btn active" onclick="switchPatientTab('login')">Login</button>
      <button id="tabSignup" class="tab-btn" onclick="switchPatientTab('signup')">Sign Up</button>
    </div>

    <!-- Login Tab -->
    <div id="patientLoginTab">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="patientEmail" placeholder="Enter email" autocomplete="email" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="patientPassword" placeholder="Enter password" autocomplete="current-password" />
      </div>
      <p id="patientLoginError" class="form-error" style="display:none;"></p>
      <button id="patientLoginBtn" onclick="patientLoginHandler()">Login</button>
    </div>

    <!-- Signup Tab -->
    <div id="patientSignupTab" style="display:none;">
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" id="signupName" placeholder="Your full name" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="signupEmail" placeholder="Your email" autocomplete="email" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="signupPassword" placeholder="Min 6 characters" autocomplete="new-password" />
      </div>
      <div class="form-group">
        <label>Phone (10 digits)</label>
        <input type="tel" id="signupPhone" placeholder="10-digit phone number" />
      </div>
      <div class="form-group">
        <label>Address</label>
        <input type="text" id="signupAddress" placeholder="Your address" />
      </div>
      <p id="patientSignupError" class="form-error" style="display:none;"></p>
      <button id="patientSignupBtn" onclick="patientSignupHandler()">Sign Up</button>
    </div>
  `;
}

// ─── Public API ───────────────────────────────────────────────

export function openModal(type) {
  const modal    = document.getElementById('modal');
  const body     = document.getElementById('modal-body');
  if (!modal || !body) return;

  const forms = {
    adminLogin:  getAdminLoginForm,
    doctorLogin: getDoctorLoginForm,
    patient:     getPatientForm,
    addDoctor:   getAddDoctorForm,
  };


  const builder = forms[type];
  body.innerHTML = builder ? builder() : `<p>Unknown section: ${type}</p>`;
  modal.style.display = 'flex';
}

export function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
}

// Tab switcher for patient modal (globally accessible)
window.switchPatientTab = function(tab) {
  const loginTab   = document.getElementById('patientLoginTab');
  const signupTab  = document.getElementById('patientSignupTab');
  const tabLogin   = document.getElementById('tabLogin');
  const tabSignup  = document.getElementById('tabSignup');

  if (tab === 'login') {
    loginTab.style.display  = 'block';
    signupTab.style.display = 'none';
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
  } else {
    loginTab.style.display  = 'none';
    signupTab.style.display = 'block';
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
  }
};

// ─── Booking Overlay (for logged-in patients) ─────────────────

export function showBookingOverlay(event, doctor, patientData) {
  const modal  = document.getElementById('modal');
  const body   = document.getElementById('modal-body');
  if (!modal || !body) return;

  // Guard: patient must be logged in and have a valid id
  if (!patientData || !patientData.id) {
    body.innerHTML = `
      <h3>Session Error</h3>
      <p style="color:#ff4d6d;margin:16px 0;">
        Could not load your patient profile. Please log out and log in again.
      </p>
      <button onclick="closeModal()">Close</button>
    `;
    modal.style.display = 'flex';
    return;
  }

  const times = (doctor.availableTimes || []);
  const timeOptions = times.length
    ? times.map(t => `<option value="${t}">${t}</option>`).join('')
    : '<option value="">No times available</option>';

  body.innerHTML = `
    <h3>Book Appointment</h3>
    <p style="color:#94a3b8;font-size:0.88rem;margin-bottom:20px;">
      with <strong style="color:#00b4b5">${doctor.name}</strong>
      &mdash; ${doctor.specialty || doctor.specialization || ''}
    </p>

    <div class="form-group">
      <label>Date</label>
      <input type="date" id="bookingDate"
        min="${new Date().toISOString().split('T')[0]}"
        value="${new Date().toISOString().split('T')[0]}" />
    </div>

    <div class="form-group">
      <label>Time Slot</label>
      <select id="bookingTime">
        ${timeOptions}
      </select>
    </div>

    <div class="form-group">
      <label>Condition / Reason</label>
      <input type="text" id="bookingCondition" placeholder="e.g. Chest pain, routine checkup…" />
    </div>

    <p id="bookingError" class="form-error" style="display:none;"></p>
    <button id="bookingSubmitBtn" onclick="submitBooking(${doctor.id}, ${JSON.stringify(patientData?.id ?? null)})">
      Confirm Booking
    </button>
  `;

  modal.style.display = 'flex';
}

// Called from inline onclick in the booking modal
window.submitBooking = async function(doctorId, patientId) {
  const date      = document.getElementById('bookingDate')?.value;
  const time      = document.getElementById('bookingTime')?.value;
  const token     = localStorage.getItem('token');

  const errEl = document.getElementById('bookingError');
  const btn   = document.getElementById('bookingSubmitBtn');

  if (!date || !time) {
    errEl.textContent = 'Please select a date and time.';
    errEl.style.display = 'block';
    return;
  }

  // Build LocalDateTime string: no timezone (backend expects LocalDateTime)
  // e.g. "09:00 AM" on "2026-05-08" → "2026-05-08T09:00:00"
  const [timePart, meridiem] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  const localDT = `${date}T${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:00`;

  // Appointment model: doctor/{patient are @ManyToOne — send as nested {id} objects
  // status: int  (0 = Scheduled)
  const appointment = {
    doctor:  { id: doctorId },
    patient: { id: patientId },
    appointmentTime: localDT,
    status: 0
  };

  btn.disabled = true;
  errEl.style.display = 'none';

  try {
    const res = await fetch(`http://localhost:8080/appointments/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment)
    });

    if (res.ok) {
      closeModal();
      alert('Appointment booked successfully!');
    } else {
      const data = await res.json().catch(() => ({}));
      errEl.textContent = data.error || `Error ${res.status}: Failed to book appointment.`;
      errEl.style.display = 'block';
    }
  } catch (e) {
    errEl.textContent = 'Network error. Please try again.';
    errEl.style.display = 'block';
  } finally {
    btn.disabled = false;
  }
};


// Wire close button & backdrop click after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeModal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) closeModal();
  });
});

// Expose globally
window.openModal  = openModal;
window.closeModal = closeModal;
