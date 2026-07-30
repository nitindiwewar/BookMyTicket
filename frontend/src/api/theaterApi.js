import { apiClient } from "./apiClient.js";

export async function getTheaters(city) {
  const query = new URLSearchParams();
  if (city) query.append("city", city);
  const queryString = query.toString();
  return await apiClient(`/theaters${queryString ? `?${queryString}` : ""}`);
}

export async function getNearestTheatersApi(lat, lng, city) {
  const query = new URLSearchParams();
  if (lat != null) query.append("lat", lat);
  if (lng != null) query.append("lng", lng);
  if (city) query.append("city", city);
  return await apiClient(`/theaters/nearest?${query.toString()}`);
}

export async function getShows(movieId, date) {
  const query = new URLSearchParams();
  if (movieId) query.append("movieId", movieId);
  if (date) query.append("date", date);
  return await apiClient(`/shows?${query.toString()}`);
}

export async function getShowSeats(showId) {
  return await apiClient(`/shows/${showId}/seats`);
}
