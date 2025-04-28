package com.pizza.repository;

import com.pizza.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Retryable(value = { org.springframework.dao.DataAccessResourceFailureException.class }, maxAttempts = 3)
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByStatus(Order.OrderStatus status);
} 