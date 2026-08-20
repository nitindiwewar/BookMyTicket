package com.movieticket.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/movieticket?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true}")
    private String rawUrl;

    @Value("${spring.datasource.username:root}")
    private String username;

    @Value("${spring.datasource.password:Nitin@2004}")
    private String password;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        String jdbcUrl = rawUrl != null ? rawUrl.trim() : "";
        String finalUsername = username != null ? username.trim() : "";
        String finalPassword = password != null ? password.trim() : "";

        // Auto-normalize cloud URL format (e.g. mysql://user:pass@host:port/dbname?ssl-mode=REQUIRED)
        if (jdbcUrl.startsWith("mysql://")) {
            try {
                URI uri = new URI(jdbcUrl);
                String host = uri.getHost();
                int port = uri.getPort() != -1 ? uri.getPort() : 3306;
                String path = uri.getPath() != null ? uri.getPath() : "/defaultdb";
                if (path.startsWith("/")) path = path.substring(1);
                if (path.isEmpty()) path = "defaultdb";

                StringBuilder sb = new StringBuilder();
                sb.append("jdbc:mysql://").append(host).append(":").append(port).append("/").append(path);
                sb.append("?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=true&sslMode=REQUIRED");

                jdbcUrl = sb.toString();

                if (uri.getUserInfo() != null) {
                    String[] parts = uri.getUserInfo().split(":", 2);
                    if (parts.length >= 1 && (finalUsername.isEmpty() || "root".equalsIgnoreCase(finalUsername))) {
                        finalUsername = parts[0];
                    }
                    if (parts.length >= 2 && (finalPassword.isEmpty() || "Nitin@2004".equals(finalPassword))) {
                        finalPassword = parts[1];
                    }
                }
                log.info("Normalized database URL to: {}", jdbcUrl);
            } catch (Exception e) {
                log.warn("Could not parse database URI ({}), falling back to direct prefix", e.getMessage());
                if (!jdbcUrl.startsWith("jdbc:")) {
                    jdbcUrl = "jdbc:" + jdbcUrl;
                }
            }
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(finalUsername);
        config.setPassword(finalPassword);
        config.setDriverClassName(driverClassName);
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        return new HikariDataSource(config);
    }
}
