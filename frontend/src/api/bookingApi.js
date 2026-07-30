import { apiClient } from "./apiClient.js";

export async function createBookingApi(bookingPayload) {
  try {
    const data = await apiClient("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingPayload),
    });
    return data;
  } catch (error) {
    console.error("Booking API Error:", error);
    throw error;
  }
}

export async function getBookingApi(id) {
  try {
    const data = await apiClient(`/bookings/${id}`);
    return data;
  } catch (error) {
    console.warn("Fetch Booking Error:", error);
    return null;
  }
}

export async function getMyBookingsApi() {
  try {
    const data = await apiClient("/bookings/my-bookings");
    return Array.isArray(data) ? data : (data?.data || []);
  } catch (error) {
    console.warn("My Bookings Fetch Error:", error);
    return [];
  }
}

export async function getUserBookingsApi(email, phone) {
  try {
    const params = new URLSearchParams();
    if (email) params.append("email", email);
    if (phone) params.append("phone", phone);
    const data = await apiClient(`/bookings/user?${params.toString()}`);
    return Array.isArray(data) ? data : (data?.data || []);
  } catch (error) {
    console.warn("User Bookings API Error:", error);
    return [];
  }
}

