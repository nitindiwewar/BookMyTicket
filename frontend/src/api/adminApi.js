import { apiClient } from "./apiClient.js";

// Stats Overview
export async function getAdminStatsApi() {
  const res = await apiClient("/admin/stats");
  return res || {};
}

// Movies CRUD
export async function getAdminMoviesApi() {
  const res = await apiClient("/admin/movies");
  return res || [];
}

export async function createAdminMovieApi(movieData) {
  return await apiClient("/admin/movies", {
    method: "POST",
    body: JSON.stringify(movieData),
  });
}

export async function updateAdminMovieApi(id, movieData) {
  return await apiClient(`/admin/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(movieData),
  });
}

export async function deleteAdminMovieApi(id) {
  return await apiClient(`/admin/movies/${id}`, {
    method: "DELETE",
  });
}

// Theaters CRUD
export async function getAdminTheatersApi() {
  const res = await apiClient("/admin/theaters");
  return res || [];
}

export async function createAdminTheaterApi(theaterData) {
  return await apiClient("/admin/theaters", {
    method: "POST",
    body: JSON.stringify(theaterData),
  });
}

export async function updateAdminTheaterApi(id, theaterData) {
  return await apiClient(`/admin/theaters/${id}`, {
    method: "PUT",
    body: JSON.stringify(theaterData),
  });
}

export async function deleteAdminTheaterApi(id) {
  return await apiClient(`/admin/theaters/${id}`, {
    method: "DELETE",
  });
}

// Showtimes CRUD
export async function getAdminShowsApi() {
  const res = await apiClient("/admin/shows");
  return res || [];
}

export async function createAdminShowApi(showData) {
  return await apiClient("/admin/shows", {
    method: "POST",
    body: JSON.stringify(showData),
  });
}

export async function updateAdminShowApi(id, showData) {
  return await apiClient(`/admin/shows/${id}`, {
    method: "PUT",
    body: JSON.stringify(showData),
  });
}

export async function deleteAdminShowApi(id) {
  return await apiClient(`/admin/shows/${id}`, {
    method: "DELETE",
  });
}

// Users Management
export async function getAdminUsersApi() {
  const res = await apiClient("/admin/users");
  return res || [];
}

export async function createAdminUserApi(userData) {
  return await apiClient("/admin/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function updateAdminUserRoleApi(id, role) {
  return await apiClient(`/admin/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

export async function updateAdminUserVerificationApi(id, verificationData) {
  return await apiClient(`/admin/users/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(verificationData),
  });
}

export async function deleteAdminUserApi(id) {
  return await apiClient(`/admin/users/${id}`, {
    method: "DELETE",
  });
}

// Bookings Management
export async function getAdminBookingsApi() {
  const res = await apiClient("/admin/bookings");
  return res || [];
}

export async function createAdminSampleBookingApi() {
  return await apiClient("/admin/bookings/sample", {
    method: "POST",
  });
}

export async function updateAdminBookingStatusApi(id, status) {
  return await apiClient(`/admin/bookings/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteAdminBookingApi(id) {
  return await apiClient(`/admin/bookings/${id}`, {
    method: "DELETE",
  });
}

// Analytics
export async function getAdminAnalyticsApi() {
  const res = await apiClient("/admin/analytics");
  return res || {};
}

// Live Notifications Stream
export async function getAdminNotificationsApi() {
  const res = await apiClient("/admin/notifications", { skipCache: true });
  return res || [];
}
