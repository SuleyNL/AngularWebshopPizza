package com.pizza.repository;

import com.pizza.model.Role;
import com.pizza.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Retryable(value = { org.springframework.dao.DataAccessResourceFailureException.class }, maxAttempts = 3)
public interface UserRepository extends JpaRepository<User, Long> {
    User findById(long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRole(Role customer);
} 