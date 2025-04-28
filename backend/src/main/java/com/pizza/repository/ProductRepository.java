package com.pizza.repository;

import com.pizza.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Retryable(value = { org.springframework.dao.DataAccessResourceFailureException.class }, maxAttempts = 3)
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByIsAvailableTrue();
} 