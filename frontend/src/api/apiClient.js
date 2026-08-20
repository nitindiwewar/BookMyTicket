const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim();

function getApiUrl(endpoint) {
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (!RAW_BASE) {
    return cleanEndpoint.startsWith("/api") ? cleanEndpoint : `/api${cleanEndpoint}`;
  }

  let base = RAW_BASE;
  if (!base.startsWith("http://") && !base.startsWith("https://")) {
    base = `https://${base}`;
  }
  base = base.replace(/\/+$/, "");

  if (base.endsWith("/api")) {
    base = base.substring(0, base.length - 4);
  }

  if (!cleanEndpoint.startsWith("/api")) {
    cleanEndpoint = `/api${cleanEndpoint}`;
  }

  return `${base}${cleanEndpoint}`;
}

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem("movieticket-auth-token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, config);
    const text = await response.text();
    let result = {};
    if (text) {
      try {
        result = JSON.parse(text);
      } catch {
        if (response.status === 404) {
          result = { message: "Backend API endpoint not found (404). Please ensure VITE_API_BASE_URL is configured." };
        } else if (response.status === 502 || response.status === 503 || response.status === 504) {
          result = { message: "Backend server is waking up or temporarily unavailable. Please retry in a few moments." };
        } else {
          result = { message: text.length > 150 ? `Request failed with status ${response.status}` : text };
        }
      }
    }

    if (!response.ok) {
      throw new Error(result.message || `Request failed with status ${response.status}`);
    }

    return result.data !== undefined ? result.data : result;
  } catch (error) {
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      console.warn(`API Network Error [${endpoint}]:`, error.message);
      throw new Error("Unable to connect to backend server. Please verify backend is live or check CORS.");
    }
    console.warn(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}
