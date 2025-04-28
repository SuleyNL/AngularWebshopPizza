package com.pizza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.retry.annotation.EnableRetry;


@SpringBootApplication
@EnableJpaAuditing
@EnableRetry
public class PizzaWebshopApplication {

    public static void main(String[] args) {
        SpringApplication.run(PizzaWebshopApplication.class, args);
    }
} 