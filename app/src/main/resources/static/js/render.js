// render.js — role selection, navigation helpers

import { openModal } from "./components/modals.js";

/**
 * Called by the Admin / Doctor / Patient buttons on the home page.
 * Opens the appropriate login modal or navigates to the patient portal.
 */
export function selectRole(role) {
  localStorage.setItem('userRole', role);

  switch (role) {
    case 'admin':
      openModal('adminLogin');
      break;
    case 'doctor':
      openModal('doctorLogin');
      break;
    case 'patient':
      openModal('patient');
      break;
    default:
      console.warn('Unknown role:', role);
  }
}

// ✅ Expose on window so inline onclick="selectRole(...)" works
window.selectRole = selectRole;
