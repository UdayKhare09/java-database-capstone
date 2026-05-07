/**
 * doctorCard.js
 * Creates a reusable doctor card for Admin & Patient dashboards.
 */

import { deleteDoctor }    from "../services/doctorServices.js";
import { getPatientData }  from "../services/patientServices.js";
import { showBookingOverlay } from "./modals.js";

export function createDoctorCard(doctor) {
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  const role = localStorage.getItem("userRole");

  // ── Info section ────────────────────────────────────────────
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  // Name
  const nameEl = document.createElement("h3");
  nameEl.textContent = doctor.name;

  // Specialty — model field is `specialty`, not `specialization`
  const specEl = document.createElement("p");
  specEl.innerHTML = `<span>Specialty:</span> ${doctor.specialty || "—"}`;

  // Email
  const emailEl = document.createElement("p");
  emailEl.innerHTML = `<span>Email:</span> ${doctor.email}`;

  // Available times — model field is `availableTimes`, not `availability`
  const times = doctor.availableTimes || [];
  const timesEl = document.createElement("p");
  timesEl.innerHTML = `<span>Available:</span> ${times.length ? times.join(", ") : "Not set"}`;

  infoDiv.append(nameEl, specEl, emailEl, timesEl);

  // ── Action buttons ───────────────────────────────────────────
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.classList.add("btn-delete");
    removeBtn.addEventListener("click", async () => {
      if (!confirm(`Delete Dr. ${doctor.name}?`)) return;
      const token = localStorage.getItem("token");
      const result = await deleteDoctor(doctor.id, token);  // returns {success, message}
      if (result.success) {
        card.remove();
      } else {
        alert("Failed to delete: " + (result.message || "Unknown error"));
      }
    });
    actionsDiv.appendChild(removeBtn);

  } else if (role === "patient") {
    // Not logged in — prompt to log in
    const bookBtn = document.createElement("button");
    bookBtn.textContent = "Book Now";
    bookBtn.classList.add("btn-book");
    bookBtn.addEventListener("click", () => {
      alert("Please log in as a patient to book an appointment.");
    });
    actionsDiv.appendChild(bookBtn);

  } else if (role === "loggedPatient") {
    // Logged-in patient — show booking modal
    const bookBtn = document.createElement("button");
    bookBtn.textContent = "Book Now";
    bookBtn.classList.add("btn-book");
    bookBtn.addEventListener("click", async (e) => {
      const token = localStorage.getItem("token");
      const patientData = await getPatientData(token);
      showBookingOverlay(e, doctor, patientData);
    });
    actionsDiv.appendChild(bookBtn);
  }

  card.append(infoDiv, actionsDiv);
  return card;
}
