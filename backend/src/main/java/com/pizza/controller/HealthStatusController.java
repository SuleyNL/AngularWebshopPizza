package com.pizza.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.info.BuildProperties;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthStatusController {

    @Autowired
    private Environment environment;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${spring.application.name:Pizza Webshop API}")
    private String applicationName;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @Autowired(required = false)
    private BuildProperties buildProperties;

    /**
     * Simple health check endpoint to verify the application and database are running.
     * @return OK status with basic health information, or SERVICE_UNAVAILABLE if the database is down.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));

        boolean dbStatus = isDatabaseHealthy();
        response.put("database", dbStatus ? "UP" : "DOWN");

        if (!dbStatus) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Detailed status endpoint providing application, environment, build, database, and memory information.
     * @return Detailed application status and configuration information.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> applicationStatus() {
        Map<String, Object> response = new HashMap<>();

        // Basic application status
        response.put("status", "online");
        response.put("application", applicationName);
        response.put("profile", activeProfile);
        response.put("serverTime", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("timezone", ZoneId.systemDefault().toString());
        response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));

        // Environment information
        Map<String, Object> envInfo = new HashMap<>();
        envInfo.put("activeProfiles", Arrays.asList(environment.getActiveProfiles()));
        envInfo.put("serverPort", environment.getProperty("server.port"));
        response.put("environment", envInfo);

        // Build information if available
        if (buildProperties != null) {
            Map<String, Object> buildInfo = new HashMap<>();
            buildInfo.put("version", buildProperties.getVersion());
            buildInfo.put("artifact", buildProperties.getArtifact());
            buildInfo.put("name", buildProperties.getName());
            buildInfo.put("time", buildProperties.getTime() != null ? buildProperties.getTime().toString() : null);
            buildInfo.put("group", buildProperties.getGroup());
            response.put("build", buildInfo);
        }

        // Database status
        Map<String, Object> dbInfo = new HashMap<>();
        boolean dbStatus = isDatabaseHealthy();
        dbInfo.put("status", dbStatus ? "UP" : "DOWN");
        if (dbStatus) {
            try {
                String dbVersion = jdbcTemplate.queryForObject("SELECT version()", String.class);
                dbInfo.put("version", dbVersion);
            } catch (Exception e) {
                dbInfo.put("error", "Could not retrieve database version");
            }
        }
        response.put("database", dbInfo);

        // System details
        Map<String, Object> systemInfo = new HashMap<>();
        systemInfo.put("javaVersion", System.getProperty("java.version"));
        systemInfo.put("javaVendor", System.getProperty("java.vendor"));
        systemInfo.put("osName", System.getProperty("os.name"));
        systemInfo.put("osVersion", System.getProperty("os.version"));
        response.put("system", systemInfo);

        // Memory information
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> memoryInfo = new HashMap<>();
        memoryInfo.put("total", runtime.totalMemory());
        memoryInfo.put("free", runtime.freeMemory());
        memoryInfo.put("max", runtime.maxMemory());
        response.put("memory", memoryInfo);

        return ResponseEntity.ok(response);
    }

    /**
     * Test endpoint for checking authentication.
     * This endpoint requires authentication to access.
     * @return Simple authenticated response.
     */
    @GetMapping("/test-auth")
    public ResponseEntity<Map<String, Object>> testAuth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "AUTHENTICATED");
        response.put("message", "If you can see this, you are authenticated!");
        response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return ResponseEntity.ok(response);
    }

    /**
     * Checks if the database connection is healthy.
     * @return true if the database is accessible, false otherwise.
     */
    private boolean isDatabaseHealthy() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result != null && result == 1;
        } catch (Exception e) {
            return false;
        }
    }
}