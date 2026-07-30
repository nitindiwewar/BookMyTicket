import { apiClient } from "./apiClient.js";

export async function searchTmdbMovies(query = "") {
  const endpoint = `/tmdb/search?query=${encodeURIComponent(query)}`;
  return await apiClient(endpoint);
}

export async function getNowPlayingTmdbMovies() {
  return await apiClient("/tmdb/now-playing");
}

export async function getPopularTmdbMovies() {
  return await apiClient("/tmdb/popular");
}

export async function getUpcomingTmdbMovies() {
  return await apiClient("/tmdb/upcoming");
}

export async function getTopRatedTmdbMovies() {
  return await apiClient("/tmdb/top-rated");
}

export async function getBollywoodTmdbMovies() {
  return await apiClient("/tmdb/bollywood");
}

export async function getIndianTmdbMovies() {
  return await apiClient("/tmdb/indian");
}

export async function importTmdbMovie(tmdbId) {
  return await apiClient(`/tmdb/import/${tmdbId}`, {
    method: "POST",
  });
}

export async function syncPopularTmdbMovies() {
  return await apiClient("/tmdb/sync-popular", {
    method: "POST",
  });
}

export async function resetToTmdbCatalog() {
  return await apiClient("/tmdb/reset-to-tmdb", {
    method: "POST",
  });
}
