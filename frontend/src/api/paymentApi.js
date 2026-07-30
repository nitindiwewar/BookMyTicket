import { apiClient } from "./apiClient.js";

export async function createRazorpayOrderApi(amount, receipt) {
  try {
    const data = await apiClient("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ amount, receipt }),
    });
    return data;
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    throw error;
  }
}

export async function verifyPaymentApi(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  try {
    const data = await apiClient("/payments/verify", {
      method: "POST",
      body: JSON.stringify({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      }),
    });
    return data;
  } catch (error) {
    console.error("Verify Razorpay Payment Error:", error);
    throw error;
  }
}
