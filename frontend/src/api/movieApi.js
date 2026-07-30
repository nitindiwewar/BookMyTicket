import { apiClient } from "./apiClient.js";

export async function getMovies(params = {}) {
  const query = new URLSearchParams();
  if (params.language) query.append("language", params.language);
  if (params.genre) query.append("genre", params.genre);
  if (params.format) query.append("format", params.format);
  if (params.search) query.append("search", params.search);

  const queryString = query.toString();
  const endpoint = `/movies${queryString ? `?${queryString}` : ""}`;
  return await apiClient(endpoint);
}

export async function getMovieById(id) {
  return await apiClient(`/movies/${id}`);
}
