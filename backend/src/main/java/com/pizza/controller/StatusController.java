package com.pizza.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
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
public class StatusController {
    
    @Autowired
    private Environment environment;
    
    @Value("${spring.application.name:Pizza Webshop API}")
    private String applicationName;
    
    @Value("${spring.profiles.active:default}")
    private String activeProfile;
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "online");
        response.put("application", applicationName);
        response.put("profile", activeProfile);
        response.put("serverTime", LocalDateTime.now()
                .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("timezone", ZoneId.systemDefault().toString());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Pizza Webshop API is healthy");
        response.put("timestamp", LocalDateTime.now().toString());
        
        // Add details about the runtime environment
        Map<String, Object> details = new HashMap<>();
        details.put("javaVersion", System.getProperty("java.version"));
        details.put("javaVendor", System.getProperty("java.vendor"));
        details.put("osName", System.getProperty("os.name"));
        details.put("osVersion", System.getProperty("os.version"));
        details.put("activeProfiles", Arrays.toString(environment.getActiveProfiles()));
        
        response.put("details", details);
        
        return ResponseEntity.ok(response);
    }
} 