package com.movieticket.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class RazorpayService {

    @Value("${razorpay.key-id:rzp_test_TJJY5Q4lsHDjQL}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret:wcoypHqN2jd0V23A5y3dweV8}")
    private String razorpayKeySecret;

    public Map<String, Object> createOrder(BigDecimal amountInRupees, String receiptId) throws Exception {
        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        // Razorpay expects amount in paise (1 INR = 100 paise)
        int amountInPaise = amountInRupees.multiply(BigDecimal.valueOf(100)).intValue();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receiptId != null ? receiptId : "txn_" + System.currentTimeMillis());
        orderRequest.put("payment_capture", 1); // Auto capture

        Order order = client.orders.create(orderRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("keyId", razorpayKeyId);
        response.put("status", order.get("status"));
        return response;
    }

    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(options, razorpayKeySecret);
        } catch (Exception e) {
            System.err.println("Razorpay signature verification failed: " + e.getMessage());
            return false;
        }
    }
}
