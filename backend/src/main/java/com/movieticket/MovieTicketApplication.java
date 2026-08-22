package com.movieticket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication(exclude = { UserDetailsServiceAutoConfiguration.class })
public class MovieTicketApplication {

    public static void main(String[] args) {
        // Guard against invalid PORT strings (such as "0.0.0.0" or "0.0.0.0:8080") passed by cloud environments
        sanitizePortProperty("PORT");
        sanitizePortProperty("SERVER_PORT");

        SpringApplication.run(MovieTicketApplication.class, args);
    }

    private static void sanitizePortProperty(String envVarName) {
        String val = System.getenv(envVarName);
        if (val != null && !val.trim().isEmpty()) {
            val = val.trim();
            if (val.matches("\\d+")) {
                System.setProperty("server.port", val);
            } else if (val.contains(":")) {
                String candidate = val.substring(val.lastIndexOf(':') + 1).trim();
                if (candidate.matches("\\d+")) {
                    System.setProperty("server.port", candidate);
                } else {
                    System.setProperty("server.port", "8080");
                }
            } else {
                // If it's an IP like "0.0.0.0" or invalid string, fallback safely to default port
                System.setProperty("server.port", "8080");
            }
        }
    }
}
