package com.movieticket.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${sms.fast2sms.api-key:}")
    private String fast2SmsApiKey;

    @Value("${sms.twilio.account-sid:}")
    private String twilioAccountSid;

    @Value("${sms.twilio.auth-token:}")
    private String twilioAuthToken;

    @Value("${sms.twilio.from-number:}")
    private String twilioFromNumber;

    /**
     * Dispatch Real Mobile SMS OTP to recipient number
     */
    public boolean sendSmsOtp(String mobileNumber, String countryCode, String otpCode) {
        if (mobileNumber == null || mobileNumber.trim().isEmpty()) {
            return false;
        }

        String cleanMobile = mobileNumber.trim().replaceAll("[^0-9]", "");
        String fullPhone = (countryCode != null ? countryCode.trim() : "+91") + cleanMobile;

        log.info("==========================================================");
        log.info(">>> [REAL MOBILE SMS OTP DISPATCH] Target: {} {}", countryCode, cleanMobile);
        log.info(">>> [REAL 6-DIGIT OTP CODE]: {}", otpCode);
        log.info("==========================================================");

        System.out.println("==========================================================");
        System.out.println(">>> REAL MOBILE OTP FOR " + fullPhone + " : [" + otpCode + "]");
        System.out.println("==========================================================");

        boolean sent = false;

        // Stage 1: Fast2SMS API (Indian Mobile Numbers)
        if (fast2SmsApiKey != null && !fast2SmsApiKey.trim().isEmpty() && cleanMobile.length() == 10) {
            String apiKey = fast2SmsApiKey.trim();
            // Try Fast2SMS Route 1: OTP Route
            try {
                String fast2SmsUrl = "https://www.fast2sms.com/dev/bulkV2?authorization=" 
                        + URLEncoder.encode(apiKey, StandardCharsets.UTF_8) 
                        + "&route=otp&variables_values=" + otpCode 
                        + "&flash=0&numbers=" + cleanMobile;

                HttpHeaders headers = new HttpHeaders();
                headers.set("cache-control", "no-cache");
                headers.set("authorization", apiKey);
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange(URI.create(fast2SmsUrl), HttpMethod.GET, entity, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info(">>> [SUCCESS] REAL SMS DISPATCHED VIA FAST2SMS OTP ROUTE TO: {} [RESP: {}]", cleanMobile, response.getBody());
                    sent = true;
                }
            } catch (Exception e) {
                log.warn(">>> [FAST2SMS OTP ROUTE ATTEMPT FAILED]: {}", e.getMessage());
            }

            // Try Fast2SMS Route 2: Quick SMS Route
            if (!sent) {
                try {
                    String msgText = URLEncoder.encode("Your BookMySeat verification OTP code is " + otpCode + ". Valid for 10 minutes.", StandardCharsets.UTF_8);
                    String qUrl = "https://www.fast2sms.com/dev/bulkV2?authorization=" + apiKey + "&route=q&message=" + msgText + "&language=english&flash=0&numbers=" + cleanMobile;

                    HttpHeaders headers = new HttpHeaders();
                    headers.set("authorization", apiKey);
                    HttpEntity<String> entity = new HttpEntity<>(headers);

                    ResponseEntity<String> response = restTemplate.exchange(URI.create(qUrl), HttpMethod.GET, entity, String.class);
                    if (response.getStatusCode().is2xxSuccessful()) {
                        log.info(">>> [SUCCESS] REAL SMS DISPATCHED VIA FAST2SMS QUICK ROUTE TO: {} [RESP: {}]", cleanMobile, response.getBody());
                        sent = true;
                    }
                } catch (Exception e2) {
                    log.warn(">>> [FAST2SMS QUICK ROUTE ATTEMPT FAILED]: {}", e2.getMessage());
                }
            }
        }

        // Stage 2: Twilio International SMS API
        if (!sent && twilioAccountSid != null && !twilioAccountSid.trim().isEmpty() && twilioAuthToken != null && !twilioAuthToken.trim().isEmpty()) {
            try {
                String twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/" + twilioAccountSid.trim() + "/Messages.json";
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                headers.setBasicAuth(twilioAccountSid.trim(), twilioAuthToken.trim());

                String body = "From=" + URLEncoder.encode(twilioFromNumber.trim(), StandardCharsets.UTF_8)
                        + "&To=" + URLEncoder.encode(fullPhone, StandardCharsets.UTF_8)
                        + "&Body=" + URLEncoder.encode("Your BookMySeat Verification OTP is: " + otpCode + ". Valid for 10 minutes.", StandardCharsets.UTF_8);

                HttpEntity<String> entity = new HttpEntity<>(body, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(twilioUrl, entity, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info(">>> [SUCCESS] REAL SMS DISPATCHED VIA TWILIO TO: {}", fullPhone);
                    sent = true;
                }
            } catch (Exception e) {
                log.warn(">>> [TWILIO GATEWAY ATTEMPT EXCEPTION]: {}", e.getMessage());
            }
        }

        return sent;
    }
}
