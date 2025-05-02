package com.pizza.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtRequestFilter.class);
    
    private final List<String> EXCLUDED_PATHS = Arrays.asList(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/status",
            "/api/products/**",
            "/api/health",
            "/api/status",
            "/error/**"
    );
    
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        LOGGER.debug("Checking path: {}", path);
        
        // Skip JWT check for paths that don't need authentication
        return EXCLUDED_PATHS.stream()
                .anyMatch(p -> pathMatcher.match(p, path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        LOGGER.debug("Processing request to {}", request.getServletPath());
        
        final String authorizationHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                LOGGER.debug("Extracted username: {}", username);
            } catch (Exception e) {
                LOGGER.error("JWT Token validation error", e);
            }
        } else {
            LOGGER.debug("No Authorization header or not Bearer token");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                LOGGER.debug("Authentication set for user: {}", username);
            } else {
                LOGGER.debug("Token validation failed for user: {}", username);
            }
        }
        
        chain.doFilter(request, response);
    }
} 