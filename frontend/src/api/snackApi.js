import { apiClient } from "./apiClient.js";

export async function getSnacks() {
  return await apiClient("/snacks");
}
