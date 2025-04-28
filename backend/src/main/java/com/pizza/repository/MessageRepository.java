package com.pizza.repository;

import com.pizza.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Retryable(value = { org.springframework.dao.DataAccessResourceFailureException.class }, maxAttempts = 3)
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByUserId(Long userId);
    List<Message> findByIsReadFalse();
} 