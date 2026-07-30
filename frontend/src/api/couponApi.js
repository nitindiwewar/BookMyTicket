import { apiClient } from "./apiClient.js";

export async function validateCouponApi(code, orderAmount) {
  return await apiClient("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, orderAmount }),
  });
}
