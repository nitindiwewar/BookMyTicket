package com.movieticket.controller;

import com.movieticket.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    private static final Logger log = LoggerFactory.getLogger(LocationController.class);
    private final RestTemplate restTemplate = new RestTemplate();

    public static class LocationRequest {
        private Double latitude;
        private Double longitude;

        public LocationRequest() {}

        public LocationRequest(Double latitude, Double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }

        public Double getLatitude() {
            return latitude;
        }

        public void setLatitude(Double latitude) {
            this.latitude = latitude;
        }

        public Double getLongitude() {
            return longitude;
        }

        public void setLongitude(Double longitude) {
            this.longitude = longitude;
        }
    }

    public static class LocationResponse {
        private String city;
        private String fullLocation;
        private Double latitude;
        private Double longitude;

        public LocationResponse() {}

        public LocationResponse(String city, String fullLocation, Double latitude, Double longitude) {
            this.city = city;
            this.fullLocation = fullLocation;
            this.latitude = latitude;
            this.longitude = longitude;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getFullLocation() {
            return fullLocation;
        }

        public void setFullLocation(String fullLocation) {
            this.fullLocation = fullLocation;
        }

        public Double getLatitude() {
            return latitude;
        }

        public void setLatitude(Double latitude) {
            this.latitude = latitude;
        }

        public Double getLongitude() {
            return longitude;
        }

        public void setLongitude(Double longitude) {
            this.longitude = longitude;
        }
    }

    @PostMapping("/detect")
    public ApiResponse<LocationResponse> detectLocation(@RequestBody LocationRequest request) {
        if (request == null || request.getLatitude() == null || request.getLongitude() == null) {
            return ApiResponse.ok(new LocationResponse("Mumbai", "Mumbai, Maharashtra", 19.0760, 72.8777));
        }

        double lat = request.getLatitude();
        double lng = request.getLongitude();

        String city = "Mumbai";
        String fullLocation = "Mumbai";

        try {
            String url = String.format(
                    "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=%f&longitude=%f&localityLanguage=en",
                    lat, lng
            );
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null) {
                String sub = (String) response.get("locality");
                String mainCity = (String) response.get("city");
                String state = (String) response.get("principalSubdivision");

                if (mainCity != null && !mainCity.isEmpty()) {
                    city = mainCity;
                } else if (sub != null && !sub.isEmpty()) {
                    city = sub;
                } else if (state != null && !state.isEmpty()) {
                    city = state;
                }

                if (sub != null && mainCity != null && !sub.equalsIgnoreCase(mainCity)) {
                    fullLocation = sub + ", " + mainCity;
                } else {
                    fullLocation = city;
                }
            }
        } catch (Exception e) {
            log.warn("Failed to reverse geocode location ({}, {}): {}", lat, lng, e.getMessage());
        }

        return ApiResponse.ok(new LocationResponse(city, fullLocation, lat, lng));
    }

    @GetMapping("/cities")
    public ApiResponse<List<String>> getSupportedCities() {
        return ApiResponse.ok(List.of(
                "Gondia",
                "Mumbai",
                "Nagpur",
                "Pune",
                "Delhi-NCR",
                "Bengaluru",
                "Hyderabad",
                "Kolkata",
                "Chennai",
                "Ahmedabad"
        ));
    }
}
