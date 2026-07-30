import { apiClient } from "./apiClient.js";

export async function sendOtpApi(mobile, countryCode = "+91") {
  return await apiClient("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ mobile, countryCode }),
  });
}

export async function verifyOtpApi(mobile, countryCode = "+91", otp) {
  const data = await apiClient("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ mobile, countryCode, otp }),
  });
  if (data.token) {
    localStorage.setItem("movieticket-auth-token", data.token);
  }
  return data;
}

export async function completeProfileApi(profileData) {
  const data = await apiClient("/auth/complete-profile", {
    method: "POST",
    body: JSON.stringify(profileData),
  });
  if (data.token) {
    localStorage.setItem("movieticket-auth-token", data.token);
  }
  return data;
}


export async function loginApi(email, password) {
  const data = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    localStorage.setItem("movieticket-auth-token", data.token);
  }
  return data;
}

export async function registerApi(userData) {
  const data = await apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  if (data.token) {
    localStorage.setItem("movieticket-auth-token", data.token);
  }
  return data;
}

export async function getCurrentUserApi() {
  return await apiClient("/auth/me");
}
