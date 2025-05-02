package com.pizza.controller;

import com.pizza.dto.AuthRequestDto;
import com.pizza.dto.AuthResponseDto;
import com.pizza.dto.RegisterRequestDto;
import com.pizza.model.Role;
import com.pizza.model.User;
import com.pizza.repository.UserRepository;
import com.pizza.security.JwtUtil;
import com.pizza.security.UserDetailsServiceImpl;

import java.util.Arrays;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("Auth service is running");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDto authRequest) {
        LOGGER.info("Login attempt for user: {}", authRequest.getUsername());
        
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(), 
                            authRequest.getPassword()
                    )
            );
            
            LOGGER.info("Authentication successful for user: {}", authRequest.getUsername());
            
            // Get user details
            final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);
            
            User user = userRepository.findByUsername(authRequest.getUsername())
                    .orElseThrow(() -> new IllegalStateException("User not found after authentication"));
            
            LOGGER.info("JWT token generated for user: {}", authRequest.getUsername());
            
            // Build and return response
            return ResponseEntity.ok(AuthResponseDto.builder()
                    .token(jwt)
                    .id(user.getId())
                    .username(user.getUsername())
                    .role(user.getRole().name())
                    .build());
            
        } catch (BadCredentialsException e) {
            LOGGER.warn("Bad credentials for user: {}", authRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            LOGGER.error("Login error for user: {}, Exception: {}, Stack trace: {}", 
                         authRequest.getUsername(), 
                         e.getMessage(),
                         e.getStackTrace());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }
    
    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth() {
        final String testUsername = "admin";
        LOGGER.info("Starting authentication test for user: {}", testUsername);
        
        try {
            LOGGER.debug("Attempting to authenticate user: {}", testUsername);
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(testUsername, "admin123")
            );

            // Detailed authentication logging
            LOGGER.info("Authentication successful for user: {}", testUsername);
            LOGGER.debug("Authentication details - " +
                        "Authenticated: {}, " +
                        "Principal: {}, " +
                        "Authorities: {}, " +
                        "Credentials: [PROTECTED], " +
                        "Details: {}",
                    authentication.isAuthenticated(),
                    authentication.getPrincipal(),
                    authentication.getAuthorities(),
                    authentication.getDetails());

            // Build comprehensive response
            String responseMessage = String.format(
                    "Authentication successful for user: %s%n" +
                    "Authenticated: %b%n" +
                    "Authorities: %s",
                    authentication.getName(),
                    authentication.isAuthenticated(),
                    authentication.getAuthorities());

            return ResponseEntity.ok(responseMessage);
        } catch (BadCredentialsException e) {
            LOGGER.warn("Authentication failed - bad credentials for user: {}", testUsername);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication failed: Invalid credentials");
        } catch (DisabledException e) {
            LOGGER.warn("Authentication failed - account disabled for user: {}", testUsername);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication failed: Account disabled");
        } catch (LockedException e) {
            LOGGER.warn("Authentication failed - account locked for user: {}", testUsername);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication failed: Account locked");
        } catch (Exception e) {
            LOGGER.error("Authentication test failed for user: {}. Error: {} - Stack trace: {}", 
                    testUsername, 
                    e.getMessage(), 
                    Arrays.toString(e.getStackTrace()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(String.format("Authentication test failed: %s%n%s", 
                        e.getMessage(), 
                        Arrays.toString(e.getStackTrace())));
        }
    }

    @GetMapping("/test-db")
    public ResponseEntity<String> testDb() {
        try {
            long userCount = userRepository.count();
            Optional<User> anyUser = userRepository.findAll().stream().findFirst();
            return ResponseEntity.ok("DB connection ok. User count: " + userCount + 
                ", Sample user: " + (anyUser.isPresent() ? anyUser.get().getUsername() : "none"));
        } catch (Exception e) {
            LOGGER.error("DB test error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("DB error: " + e.getMessage());
        }
    }

    @GetMapping("/test-auth-deep")
    public ResponseEntity<?> testAuthDeep() {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken("admin", "admin123")
            );
            
            final UserDetails userDetails = userDetailsService.loadUserByUsername("admin");
            final String jwt = jwtUtil.generateToken(userDetails);
            
            User user = userRepository.findByUsername("admin")
                    .orElseThrow(() -> new IllegalStateException("User not found after authentication"));
            
            return ResponseEntity.ok(AuthResponseDto.builder()
                    .token(jwt)
                    .id(user.getId())
                    .username(user.getUsername())
                    .role(user.getRole().name())
                    .build());
        } catch (Exception e) {
            LOGGER.error("Test auth error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Auth error: " + e.getMessage());
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerRequest) {
        LOGGER.info("Registration attempt for username: {}, email: {}", 
                registerRequest.getUsername(), registerRequest.getEmail());
        
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                LOGGER.warn("Registration failed - username already exists: {}", registerRequest.getUsername());
                return ResponseEntity.badRequest().body("Username already exists");
            }
            
            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                LOGGER.warn("Registration failed - email already exists: {}", registerRequest.getEmail());
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create new user
            User user = User.builder()
                    .username(registerRequest.getUsername())
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .firstName(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName())
                    .address(registerRequest.getAddress())
                    .phone(registerRequest.getPhone())
                    .role(Role.CUSTOMER)
                    .build();
            
            userRepository.save(user);
            
            LOGGER.info("User registered successfully: {}", registerRequest.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            LOGGER.error("Registration error for username: {}", registerRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during registration");
        }
    }
} 