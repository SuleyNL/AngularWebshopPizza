package com.pizza.security;

import com.pizza.model.User;
import com.pizza.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LOGGER.debug("Loading user by username: {}", username);
        
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        LOGGER.error("User not found with username: {}", username);
                        return new UsernameNotFoundException("User not found with username: " + username);
                    });
            
            LOGGER.debug("User found: {}, with role: {}", username, user.getRole());
            
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().name());
            LOGGER.debug("Granted authority: {}", authority.getAuthority());
            
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    Collections.singletonList(authority)
            );
        } catch (Exception e) {
            LOGGER.error("Error loading user: {}", username, e);
            throw e;
        }
    }
} 