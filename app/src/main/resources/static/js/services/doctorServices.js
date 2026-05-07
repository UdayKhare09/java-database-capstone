// ✅ doctorServices.js
// Location: app/src/main/resources/static/js/services/doctorServices.js

import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + '/doctor';

// ✅ Get all doctors — response: { doctors: [...] }
export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);
    if (response.ok) {
      const data = await response.json();
      return data.doctors || data; // unwrap {doctors:[]} wrapper
    } else {
      console.error('Failed to fetch doctors:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

// ✅ Delete a doctor by ID — DELETE /doctor/{id}/{token}
export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message || "Doctor deleted successfully"
      };
    } else {
      return {
        success: false,
        message: `Failed to delete doctor. Status: ${response.status}`
      };
    }
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return {
      success: false,
      message: "Error deleting doctor"
    };
  }
}

// ✅ Save (Add) a new doctor — POST /doctor/{token}
export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doctor)
    });
    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message || "Doctor saved successfully"
      };
    } else {
      return {
        success: false,
        message: `Failed to save doctor. Status: ${response.status}`
      };
    }
  } catch (error) {
    console.error("Error saving doctor:", error);
    return {
      success: false,
      message: "Error saving doctor"
    };
  }
}

// ✅ Filter doctors — GET /doctor/filter/{name}/{time}/{speciality}
export async function filterDoctors(name, time, specialty) {
  const n = encodeURIComponent(name      || 'null');
  const t = encodeURIComponent(time      || 'null');
  const s = encodeURIComponent(specialty || 'null');
  try {
    const response = await fetch(`${DOCTOR_API}/filter/${n}/${t}/${s}`);
    if (response.ok) {
      return await response.json();
    }
    console.error('Failed to filter doctors:', response.status);
    return [];
  } catch (error) {
    console.error('Error filtering doctors:', error);
    return [];
  }
}
