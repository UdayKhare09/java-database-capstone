// config.js — central API configuration
export const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  adminLogin:    `${API_BASE_URL}/admin/login`,
  doctorLogin:   `${API_BASE_URL}/doctor/login`,
  patientLogin:  `${API_BASE_URL}/patient/login`,
  patientSignup: `${API_BASE_URL}/patient`,
};
